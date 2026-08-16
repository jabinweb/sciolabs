import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "sciolabs_crm_session";

function secret() {
  const value = process.env.CRM_SESSION_SECRET;
  if (!value) throw new Error("CRM_SESSION_SECRET is not set");
  return value;
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function encodeSession(agentId: string) {
  const payload = Buffer.from(
    JSON.stringify({ sub: agentId, iat: Date.now() }),
    "utf8",
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function decodeSession(token: string | undefined): string | null {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      sub?: string;
    };
    return data.sub ?? null;
  } catch {
    return null;
  }
}
