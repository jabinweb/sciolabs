/** Clean imported email/Freshdesk text and split quoted/forwarded replies for display. */

export function htmlToText(value: string) {
  return cleanMessageText(
    value
      .replace(/<a\s[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_full, href, inner) => {
        const label = inner.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() || href;
        return `[${label}](${href})`;
      })
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|h[1-6]|li|tr|table|blockquote)>/gi, "\n")
      .replace(/<(p|div|h[1-6]|tr|blockquote)[^>]*>/gi, "\n")
      .replace(/<li[^>]*>/gi, "\n• ")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"'),
  );
}

export function cleanMessageText(raw: string) {
  return raw
    .replace(/\r\n/g, "\n")
    .replace(/\u00a0/g, " ")
    .split("\n")
    .map((line) => unwrapEmphasis(line.replace(/[ \t]+$/g, "").replace(/[^\S\n]{2,}/g, " ")))
    .join("\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\s+(Serial key:)/gi, "\n$1")
    .replace(/\s+(User identification:)/gi, "\n$1")
    .replace(/\s+(Blessings,)/g, "\n\n$1")
    .trim();
}

function unwrapEmphasis(line: string) {
  const trimmed = line.trim();
  const italic = /^\*([^*]+)\*$/.exec(trimmed);
  if (italic) return `${line.match(/^\s*/)?.[0] ?? ""}${italic[1]}`;
  const bold = /^\*\*([^*]+)\*\*$/.exec(trimmed);
  if (bold) return `${line.match(/^\s*/)?.[0] ?? ""}${bold[1]}`;
  return line;
}

const QUOTE_PATTERNS = [
  /\nOn [A-Z][a-z]{2}, .+\bwrote:\s*/m,
  /(?:^|\n)On (Mon|Tue|Wed|Thu|Fri|Sat|Sun), .+ at \d{1,2}:\d{2}\s*(AM|PM)\b/m,
  /\n-{3,} ?Original Message ?-{3,}/i,
  /\nFrom:\s.+\nSent:\s/i,
  /\n_{5,}\s*\n/,
];

const FORWARD_RE = /-{5,}\s*Forwarded message\s*-{5,}/i;
const HEADER_RE = /^(From|Date|Sent|Subject|To|Cc):\s*(.*)$/i;

export type ForwardBlock = {
  headers: { label: string; value: string }[];
  body: string;
};

export type ParsedMessage = {
  intro: string;
  forward: ForwardBlock | null;
  quote: string | null;
};

export function parseMessageBody(raw: string): ParsedMessage {
  const text = cleanMessageText(raw);
  if (!text) return { intro: "", forward: null, quote: null };

  const { beforeQuote, quote } = splitQuote(text);
  const forward = parseForward(beforeQuote);
  if (forward) {
    return {
      intro: forward.before,
      forward: { headers: forward.headers, body: forward.body },
      quote,
    };
  }
  return { intro: beforeQuote, forward: null, quote };
}

function splitQuote(text: string) {
  let quoteAt = -1;
  for (const pattern of QUOTE_PATTERNS) {
    const match = pattern.exec(text);
    if (!match || match.index < 0) continue;
    if (quoteAt < 0 || match.index < quoteAt) quoteAt = match.index;
  }
  const firstQuoted = text.split("\n").findIndex((line) => line.trimStart().startsWith(">"));
  if (firstQuoted > 0) {
    const index = text.split("\n").slice(0, firstQuoted).join("\n").length;
    if (quoteAt < 0 || index < quoteAt) quoteAt = index;
  }
  if (quoteAt <= 0) return { beforeQuote: text, quote: null as string | null };
  const beforeQuote = text.slice(0, quoteAt).trim();
  const quote = text.slice(quoteAt).trim();
  if (!beforeQuote) return { beforeQuote: text, quote: null };
  return { beforeQuote, quote };
}

function parseForward(text: string) {
  const match = FORWARD_RE.exec(text);
  if (!match) return null;
  const before = text.slice(0, match.index).trim();
  const rest = text.slice(match.index + match[0].length).replace(/^\s*\n/, "");
  const lines = rest.split("\n");
  const headers: { label: string; value: string }[] = [];
  let i = 0;
  while (i < lines.length) {
    const parsed = HEADER_RE.exec(lines[i].trim());
    if (!parsed) break;
    headers.push({ label: parsed[1], value: parsed[2].trim() });
    i += 1;
  }
  while (i < lines.length && !lines[i].trim()) i += 1;
  if (!headers.length) return null;
  return {
    before,
    headers,
    body: lines.slice(i).join("\n").trim(),
  };
}
