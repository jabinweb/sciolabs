import { createHmac, timingSafeEqual } from "node:crypto";

export const PORTAL_COOKIE = "dbcrm_portal";

function secret() {
  const value = process.env.CRM_SESSION_SECRET;
  if (!value) throw new Error("CRM_SESSION_SECRET is not set");
  return `portal:${value}`;
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function encodePortalSession(email: string) {
  const payload = Buffer.from(
    JSON.stringify({ email: email.trim().toLowerCase(), iat: Date.now() }),
    "utf8",
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function decodePortalSession(token: string | undefined): string | null {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      email?: string;
      iat?: number;
    };
    if (!data.email) return null;
    // 30-day portal sessions
    if (data.iat && Date.now() - data.iat > 1000 * 60 * 60 * 24 * 30) return null;
    return data.email.toLowerCase();
  } catch {
    return null;
  }
}
