import { ChevronUp } from "lucide-react";
import { toggleRoadmapVoteAction } from "@/actions/roadmap";
import { Button } from "@/components/crm/ui/button";
import { cn } from "@/lib/utils";

export function RoadmapVoteButton({
  itemId,
  voteCount,
  votedByMe,
}: {
  itemId: string;
  voteCount: number;
  votedByMe: boolean;
}) {
  return (
    <form action={toggleRoadmapVoteAction}>
      <input type="hidden" name="itemId" value={itemId} />
      <Button
        type="submit"
        variant={votedByMe ? "default" : "outline"}
        size="sm"
        className={cn(
          "h-auto min-w-12 flex-col gap-0.5 px-2 py-1.5",
          votedByMe && "bg-[#921a1d] text-white hover:bg-[#7a1518]",
        )}
        aria-pressed={votedByMe}
        aria-label={votedByMe ? "Remove vote" : "Upvote"}
      >
        <ChevronUp className="size-4" />
        <span className="text-xs font-semibold tabular-nums">{voteCount}</span>
      </Button>
    </form>
  );
}
