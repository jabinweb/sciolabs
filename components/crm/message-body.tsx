"use client";

import { useState, type ReactNode } from "react";
import { parseMessageBody } from "@/lib/crm/message-body";

const LINK_RE = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)|(https?:\/\/[^\s)]+)/g;

function LinkedText({ text }: { text: string }) {
  const nodes: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  const pattern = new RegExp(LINK_RE.source, "g");
  while ((match = pattern.exec(text))) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const label = match[1] || match[3];
    const href = match[2] || match[3];
    nodes.push(
      <a
        key={`${href}-${match.index}`}
        href={href}
        target="_blank"
        rel="noreferrer"
        className="text-primary underline underline-offset-2"
      >
        {label}
      </a>,
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return <span className="whitespace-pre-wrap wrap-break-word">{nodes}</span>;
}

export function MessageBody({ body }: { body: string }) {
  const { intro, forward, quote } = parseMessageBody(body);
  const [showQuote, setShowQuote] = useState(false);

  return (
    <div className="mt-1.5 space-y-3 text-sm leading-6">
      {intro ? <LinkedText text={intro} /> : null}
      {forward ? (
        <div className="rounded-lg bg-muted/50 px-3 py-2.5">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Forwarded message
          </p>
          <dl className="mt-2 space-y-0.5 text-xs text-muted-foreground">
            {forward.headers.map((header) => (
              <div key={header.label} className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-2">
                <dt className="font-medium">{header.label}</dt>
                <dd className="wrap-break-word text-foreground/80">{header.value}</dd>
              </div>
            ))}
          </dl>
          {forward.body ? (
            <div className="mt-3 border-t border-border/60 pt-3 text-foreground">
              <LinkedText text={forward.body} />
            </div>
          ) : null}
        </div>
      ) : null}
      {quote ? (
        <div>
          <button
            type="button"
            className="text-xs font-medium text-muted-foreground hover:text-foreground hover:underline"
            onClick={() => setShowQuote((open) => !open)}
          >
            {showQuote ? "Hide quoted text" : "Show quoted text"}
          </button>
          {showQuote ? (
            <blockquote className="mt-2 border-l-2 border-border pl-3 text-muted-foreground">
              <LinkedText text={quote.replace(/^> ?/gm, "")} />
            </blockquote>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
