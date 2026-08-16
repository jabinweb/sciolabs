"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Button } from "@/components/crm/ui/button";
import { Input } from "@/components/crm/ui/input";
import { Label } from "@/components/crm/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/crm/ui/card";

type MigrateLog = {
  id: string;
  at: string;
  level: "info" | "warn" | "error" | "success";
  message: string;
};

type MigrateJob = {
  id: string;
  phase: string;
  contactPage: number;
  ticketPage: number;
  stats: {
    contactsImported: number;
    ticketsImported: number;
    messagesImported: number;
    ticketsCleared: number;
    agentsImported?: number;
    errors: number;
    apiCalls: number;
  };
  logs: MigrateLog[];
  done: boolean;
};

function logClass(level: MigrateLog["level"]) {
  if (level === "error") return "text-destructive";
  if (level === "warn") return "text-amber-700 dark:text-amber-400";
  if (level === "success") return "text-emerald-700 dark:text-emerald-400";
  return "text-muted-foreground";
}

export function FreshdeskMigrateForm({
  defaultUrl = "",
  hasEnvApiKey = false,
}: {
  defaultUrl?: string;
  hasEnvApiKey?: boolean;
}) {
  const [url, setUrl] = useState(defaultUrl);
  const [apiKey, setApiKey] = useState("");
  const [job, setJob] = useState<MigrateJob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [pending, startTransition] = useTransition();
  const stopRef = useRef(false);
  const logEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [job?.logs.length]);

  async function post(body: Record<string, unknown>) {
    const response = await fetch("/api/migrate/freshdesk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await response.json().catch(() => null)) as
      | { ok?: boolean; job?: MigrateJob; error?: string }
      | null;
    if (!response.ok || !data?.ok || !data.job) {
      throw new Error(data?.error || `Request failed (${response.status})`);
    }
    return data.job;
  }

  async function runImport() {
    setError(null);
    setRunning(true);
    stopRef.current = false;
    try {
      let current = await post({ action: "start", url, apiKey });
      setJob(current);

      while (!current.done && !stopRef.current) {
        // Small pause between batches to stay under Freshdesk list rate caps.
        await new Promise((resolve) => setTimeout(resolve, 400));
        current = await post({ action: "next", jobId: current.id });
        setJob(current);
      }

      if (stopRef.current && !current.done) {
        setError("Import stopped. Already imported rows remain; start again to clear tickets and re-import.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Freshdesk connection</CardTitle>
          <CardDescription>
            Starting import clears all tickets and messages in this CRM, then pulls contacts and
            tickets from Freshdesk in rate-limited batches.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="fd-url">Freshdesk URL</Label>
            <Input
              id="fd-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://yourcompany.freshdesk.com"
              disabled={running}
              autoComplete="off"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="fd-key">API key</Label>
            <Input
              id="fd-key"
              name="freshdesk-api-key"
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={
                hasEnvApiKey
                  ? "Using the saved Freshdesk key (leave blank)"
                  : "Paste from Profile Settings → Your API Key"
              }
              disabled={running}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              data-1p-ignore
              data-lpignore="true"
              data-form-type="other"
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">
              {hasEnvApiKey
                ? "API key is already saved in Settings → Freshdesk (or .env). Leave this blank unless you want to override it."
                : "Use the agent API key from Freshdesk → Profile Settings → Your API Key, or save it under Settings → Freshdesk."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              disabled={running || pending || !url.trim() || (!apiKey.trim() && !hasEnvApiKey)}
              onClick={() => startTransition(() => void runImport())}
            >
              {running ? "Importing…" : "Start import"}
            </Button>
            {running ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  stopRef.current = true;
                }}
              >
                Stop after this batch
              </Button>
            ) : null}
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <p className="text-xs text-muted-foreground">
            Auth is <code className="font-mono">API key:X</code> (Freshdesk Basic). Batches pause
            between pages and honor Freshdesk{" "}
            <code className="font-mono">429 Retry-After</code> responses.
          </p>
        </CardContent>
      </Card>

      {job ? (
        <Card>
          <CardHeader>
            <CardTitle>Import status</CardTitle>
            <CardDescription>
              Phase: <span className="font-medium text-foreground">{job.phase}</span>
              {job.done ? " · finished" : " · running"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Stat label="Tickets cleared" value={job.stats.ticketsCleared} />
              <Stat label="Contacts imported" value={job.stats.contactsImported} />
              <Stat label="Tickets imported" value={job.stats.ticketsImported} />
              <Stat label="Messages imported" value={job.stats.messagesImported} />
              <Stat label="Agents imported" value={job.stats.agentsImported ?? 0} />
              <Stat label="API calls" value={job.stats.apiCalls} />
              <Stat label="Errors" value={job.stats.errors} />
            </div>
            <div className="h-[360px] overflow-y-auto rounded-lg bg-muted/40 p-3 font-mono text-xs leading-5 ring-1 ring-foreground/10">
              {job.logs.map((entry) => (
                <div key={entry.id} className={logClass(entry.level)}>
                  <span className="opacity-60">{entry.at.slice(11, 19)}</span> [{entry.level}]{" "}
                  {entry.message}
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg px-3 py-2 ring-1 ring-foreground/10">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}
