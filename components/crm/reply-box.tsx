"use client";

import { useState, useTransition } from "react";
import { draftTicketReplyAction } from "@/actions/ai";
import { replyToTicketAction } from "@/actions/tickets";
import type { CannedResponse } from "@/lib/crm/types";
import { Button } from "@/components/crm/ui/button";
import { Textarea } from "@/components/crm/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/crm/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/crm/ui/select";

export function ReplyBox({
  ticketId,
  macros,
  assignedToMe,
  className,
}: {
  ticketId: string;
  macros: CannedResponse[];
  assignedToMe: boolean;
  className?: string;
}) {
  const [mode, setMode] = useState<"public" | "internal">("public");
  const [body, setBody] = useState("");
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiModel, setAiModel] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function submit(afterStatus: string) {
    const formData = new FormData();
    formData.set("ticketId", ticketId);
    formData.set("mode", mode);
    formData.set("body", body);
    formData.set("afterStatus", afterStatus);
    if (!assignedToMe) formData.set("assignToMe", "1");
    await replyToTicketAction(formData);
    setBody("");
    setAiModel(null);
  }

  function draftWithAi() {
    setAiError(null);
    startTransition(async () => {
      const result = await draftTicketReplyAction(ticketId);
      if (!result.ok) {
        setAiError(result.error);
        return;
      }
      setBody(result.draft);
      setAiModel(result.model);
      setMode("public");
    });
  }

  return (
    <div className={cn("space-y-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={mode} onValueChange={(value) => setMode(value as "public" | "internal")}>
          <TabsList>
            <TabsTrigger value="public">Public reply</TabsTrigger>
            <TabsTrigger value="internal">Internal note</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" size="sm" disabled={pending} onClick={draftWithAi}>
            {pending ? "Drafting…" : "Draft with AI"}
          </Button>
          <Select
            onValueChange={(value) => {
              const macro = macros.find((m) => m.id === value);
              if (macro) setBody(macro.body);
            }}
          >
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Insert canned response" />
            </SelectTrigger>
            <SelectContent>
              {macros.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.shortcut ? `${m.shortcut} · ${m.title}` : m.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {aiError ? <p className="text-sm text-destructive">{aiError}</p> : null}
      {aiModel ? (
        <p className="text-xs text-muted-foreground">AI draft from {aiModel} — edit before sending.</p>
      ) : null}
      <Textarea
        name="body"
        required
        rows={4}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={
          mode === "internal"
            ? "Private note for the support team…"
            : "Write a reply the contact will see…"
        }
      />
      <div className="flex flex-wrap justify-end gap-2">
        {mode === "internal" ? (
          <Button type="button" disabled={!body.trim()} onClick={() => submit("")}>
            Add note
          </Button>
        ) : (
          <>
            <Button
              type="button"
              variant="outline"
              disabled={!body.trim()}
              onClick={() => submit("open")}
            >
              Send & keep open
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={!body.trim()}
              onClick={() => submit("pending")}
            >
              Send & pending
            </Button>
            <Button type="button" disabled={!body.trim()} onClick={() => submit("resolved")}>
              Send & resolve
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
