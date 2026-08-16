"use client";

import { useRouter } from "next/navigation";
import { Input } from "@/components/crm/ui/input";
import { Button } from "@/components/crm/ui/button";
import { FormSelect } from "@/components/crm/form-select";
import { Tabs, TabsList, TabsTrigger } from "@/components/crm/ui/tabs";

const VIEWS = [
  { id: "all", label: "All tickets" },
  { id: "open", label: "Open" },
  { id: "mine", label: "My open" },
  { id: "unassigned", label: "Unassigned" },
  { id: "urgent", label: "Urgent" },
] as const;

const STATUSES = ["all", "open", "pending", "resolved", "closed"] as const;
const PRIORITIES = ["all", "urgent", "high", "medium", "low"] as const;

export function TicketFilters({
  view,
  status,
  priority,
  q,
  counts,
}: {
  view: string;
  status: string;
  priority: string;
  q: string;
  counts: {
    all: number;
    open: number;
    mine: number;
    unassigned: number;
    urgent: number;
  };
}) {
  const router = useRouter();

  function push(next: {
    view?: string;
    status?: string;
    priority?: string;
    q?: string;
  }) {
    const params = new URLSearchParams();
    const v = next.view ?? view;
    const s = next.status ?? status;
    const p = next.priority ?? priority;
    const query = next.q ?? q;
    if (v && v !== "all") params.set("view", v);
    if (s && s !== "all") params.set("status", s);
    if (p && p !== "all") params.set("priority", p);
    if (query) params.set("q", query);
    const qs = params.toString();
    router.push(qs ? `/crm/tickets?${qs}` : "/crm/tickets");
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Tabs value={view} onValueChange={(value) => push({ view: String(value), status: "all" })}>
        <TabsList>
          {VIEWS.map((item) => (
            <TabsTrigger key={item.id} value={item.id} className="gap-1.5 px-2.5">
              {item.label}
              <span className="tabular-nums text-muted-foreground">{counts[item.id]}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <FormSelect
        value={status}
        onValueChange={(next) => push({ status: next, view: "all" })}
        triggerClassName="w-[130px]"
        className="w-auto"
        options={STATUSES.map((item) => ({
          value: item,
          label: item === "all" ? "Any status" : item[0].toUpperCase() + item.slice(1),
        }))}
      />
      <FormSelect
        value={priority}
        onValueChange={(next) => push({ priority: next })}
        triggerClassName="w-[130px]"
        className="w-auto"
        options={PRIORITIES.map((item) => ({
          value: item,
          label: item === "all" ? "Any priority" : item[0].toUpperCase() + item.slice(1),
        }))}
      />
      <form
        className="ml-auto flex min-w-0 max-w-sm flex-1 gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          push({ q: String(data.get("q") ?? "") });
        }}
      >
        <Input
          name="q"
          defaultValue={q}
          placeholder="Search #6984, email, tag…"
          className="min-w-0 flex-1"
        />
        <Button type="submit" variant="outline">
          Search
        </Button>
      </form>
    </div>
  );
}
