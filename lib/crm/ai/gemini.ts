import { GoogleGenAI } from "@google/genai";
import { getSetting, SETTING_KEYS } from "@/lib/crm/app-settings";

/** Default Gemini model fallback chain. */
export const DEFAULT_GEMINI_MODELS = [
  "gemini-3.1-flash-lite",
  "gemini-3.5-flash-lite",
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-3.5-flash",
  "gemini-3.6-flash",
  "gemini-3-flash-preview",
  "gemini-flash-latest",
  "gemini-2.5-pro",
] as const;

const MIN_ATTEMPT_MS = 10_000;

export function normalizeGeminiApiKey(raw: string | undefined | null): string | undefined {
  if (!raw) return undefined;
  let value = raw.trim();
  if (!value) return undefined;
  if (
    (value.startsWith("'") && value.endsWith("'")) ||
    (value.startsWith('"') && value.endsWith('"'))
  ) {
    value = value.slice(1, -1).trim();
  }
  return value || undefined;
}

export async function readCrmGeminiApiKey(): Promise<string | undefined> {
  return normalizeGeminiApiKey(await getSetting(SETTING_KEYS.geminiApiKey));
}

export async function resolveCrmGeminiModels(): Promise<string[]> {
  const raw = (await getSetting(SETTING_KEYS.geminiModelFallback)).trim();
  const fromSetting = raw
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);
  return fromSetting.length ? fromSetting : [...DEFAULT_GEMINI_MODELS];
}

function extractText(response: unknown): string {
  if (!response || typeof response !== "object") return "";
  const direct = (response as { text?: unknown }).text;
  if (typeof direct === "string" && direct.trim()) return direct.trim();
  const candidates = (response as { candidates?: unknown }).candidates;
  if (!Array.isArray(candidates) || !candidates[0]) return "";
  const parts = (candidates[0] as { content?: { parts?: { text?: string }[] } }).content?.parts;
  if (!Array.isArray(parts)) return "";
  return parts
    .map((p) => (typeof p?.text === "string" ? p.text : ""))
    .join("")
    .trim();
}

function isRetryable(error: unknown): boolean {
  const msg = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
  const status =
    error && typeof error === "object" && "status" in error
      ? Number((error as { status?: number }).status)
      : NaN;
  if (status === 429 || status === 503 || status === 504) return true;
  return (
    msg.includes("unavailable") ||
    msg.includes("high demand") ||
    msg.includes("not found") ||
    msg.includes("no longer available") ||
    msg.includes("timeout") ||
    msg.includes("429") ||
    msg.includes("503") ||
    msg.includes("504") ||
    msg.includes("404")
  );
}

export async function verifyGeminiConnection() {
  const apiKey = await readCrmGeminiApiKey();
  if (!apiKey) throw new Error("Save a Gemini API key first.");

  const client = new GoogleGenAI({ apiKey });
  const models = await resolveCrmGeminiModels();
  const model = models[0];
  const response = await client.models.generateContent({
    model,
    contents: [{ role: "user", parts: [{ text: "Reply with the single word OK." }] }],
    config: { httpOptions: { timeout: 12_000 } },
  });
  const text = extractText(response);
  if (!text) throw new Error(`Gemini (${model}) returned an empty response.`);
  return `Gemini responded using ${model}`;
}

export async function generateSupportText(opts: {
  systemPrompt: string;
  userMessage: string;
  budgetMs?: number;
}): Promise<{ text: string; model: string }> {
  const apiKey = await readCrmGeminiApiKey();
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

  const client = new GoogleGenAI({ apiKey });
  const models = await resolveCrmGeminiModels();
  const deadlineAt = Date.now() + (opts.budgetMs ?? 30_000);
  let lastError: unknown;

  for (let i = 0; i < models.length; i++) {
    const remaining = deadlineAt - Date.now();
    if (remaining < MIN_ATTEMPT_MS + 400) break;
    if (i > 0) await new Promise((r) => setTimeout(r, Math.min(2200, 400 + i * 400)));

    const model = models[i];
    const timeout = Math.min(12_000, remaining - 400);
    try {
      const response = await client.models.generateContent({
        model,
        contents: [{ role: "user", parts: [{ text: opts.userMessage }] }],
        config: {
          systemInstruction: opts.systemPrompt,
          httpOptions: { timeout },
        },
      });
      const text = extractText(response);
      if (!text) throw new Error("Empty model response");
      return { text, model };
    } catch (error) {
      lastError = error;
      if (!isRetryable(error) && !(error instanceof Error && error.message.includes("Empty"))) {
        throw error;
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("AI request failed across Gemini model fallback chain");
}
