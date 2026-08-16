import Link from "next/link";
import { Button } from "@/components/crm/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/crm/ui/card";
import { RoadmapVoteButton } from "@/components/crm/roadmap-vote-button";
import { listPublishedRoadmapItems, ROADMAP_STATUSES } from "@/lib/crm/roadmap";

export const dynamic = "force-dynamic";

export default async function RoadmapPage() {
  const items = await listPublishedRoadmapItems();

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className="text-sm font-medium tracking-wide text-[#921a1d]">Product roadmap</p>
        <h1 className="max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">
          What we&apos;re building next
        </h1>
        <p className="max-w-xl text-base leading-7 text-muted-foreground">
          Vote for ideas you care about. Status moves from consideration through shipping as we
          prioritize. Have something else in mind?{" "}
          <Link href="/support/tickets/new" className="font-medium text-[#921a1d] hover:underline">
            Send a feature request
          </Link>
          .
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-4">
        {ROADMAP_STATUSES.map((column) => {
          const columnItems = items.filter((item) => item.status === column.value);
          return (
            <section key={column.value} className="space-y-3">
              <div className="flex items-baseline justify-between gap-2 border-b border-black/10 pb-2">
                <h2 className="text-sm font-semibold tracking-tight">{column.label}</h2>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {columnItems.length}
                </span>
              </div>
              <div className="space-y-3">
                {columnItems.map((item) => (
                  <Card key={item.id} className="shadow-none">
                    <CardHeader className="flex-row items-start gap-3 space-y-0 pb-2">
                      <RoadmapVoteButton
                        itemId={item.id}
                        voteCount={item.voteCount}
                        votedByMe={item.votedByMe}
                      />
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-base leading-snug">{item.title}</CardTitle>
                        {item.body ? (
                          <CardDescription className="mt-1.5 text-sm leading-6">
                            {item.body}
                          </CardDescription>
                        ) : null}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0" />
                  </Card>
                ))}
                {columnItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nothing here yet.</p>
                ) : null}
              </div>
            </section>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3 border-t border-black/5 pt-6">
        <Button nativeButton={false} variant="outline" render={<Link href="/support/tickets/new" />}>
          Suggest a feature
        </Button>
        <Button nativeButton={false} variant="ghost" render={<Link href="/" />}>
          Back to help
        </Button>
      </div>
    </div>
  );
}
