import type { ReactNode } from "react";
import { Badge } from "@/components/crm/ui/badge";
import { isFreshdeskImported, visibleTags } from "@/lib/crm/format";
import type { TicketPriority, TicketStatus } from "@/lib/crm/types";

const STATUS: Record<TicketStatus, "default" | "secondary" | "outline" | "destructive"> = {
  open: "default",
  pending: "secondary",
  resolved: "outline",
  closed: "outline",
};

const PRIORITY: Record<TicketPriority, "default" | "secondary" | "outline" | "destructive"> = {
  low: "outline",
  medium: "secondary",
  high: "default",
  urgent: "destructive",
};

export function StatusBadge({ status }: { status: TicketStatus }) {
  return (
    <Badge variant={STATUS[status]} className="capitalize">
      {status}
    </Badge>
  );
}

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  return (
    <Badge variant={PRIORITY[priority]} className="capitalize">
      {priority}
    </Badge>
  );
}

export function TagChips({
  tags,
  showFreshdesk = false,
  empty = null,
}: {
  tags: string[];
  showFreshdesk?: boolean;
  empty?: ReactNode;
}) {
  const visible = visibleTags(tags);
  const imported = showFreshdesk && isFreshdeskImported(tags);
  if (!imported && visible.length === 0) return empty;
  return (
    <div className="flex flex-wrap gap-1">
      {imported ? <Badge variant="outline">Freshdesk</Badge> : null}
      {visible.map((tag) => (
        <Badge key={tag} variant="secondary" className="max-w-[10rem] truncate">
          {tag}
        </Badge>
      ))}
    </div>
  );
}
