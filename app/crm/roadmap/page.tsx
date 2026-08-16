import Link from "next/link";
import {
  archiveRoadmapItemAction,
  createRoadmapItemAction,
  updateRoadmapItemAction,
} from "@/actions/roadmap";
import { Badge } from "@/components/crm/ui/badge";
import { Button } from "@/components/crm/ui/button";
import { Input } from "@/components/crm/ui/input";
import { Label } from "@/components/crm/ui/label";
import { Textarea } from "@/components/crm/ui/textarea";
import { FormSelect } from "@/components/crm/form-select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/crm/ui/card";
import { listAllRoadmapItems, ROADMAP_STATUSES } from "@/lib/crm/roadmap";

export const dynamic = "force-dynamic";

const STATUS_OPTIONS = ROADMAP_STATUSES.map((s) => ({
  value: s.value,
  label: s.label,
}));

function statusLabel(status: string) {
  return ROADMAP_STATUSES.find((s) => s.value === status)?.label ?? status;
}

export default async function DeskRoadmapPage({
  searchParams,
}: PageProps<"/crm/roadmap">) {
  const params = await searchParams;
  const items = await listAllRoadmapItems();
  const flash =
    params.ok === "created"
      ? "Roadmap item created."
      : params.ok === "updated"
        ? "Roadmap item updated."
        : params.ok === "archived"
          ? "Item unpublished (hidden from the public board)."
          : params.error
            ? "Title is required."
            : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Roadmap</h1>
          <p className="text-sm text-muted-foreground">
            Publish features on the public board at{" "}
            <Link href="/roadmap" className="underline-offset-2 hover:underline">
              /roadmap
            </Link>
            . Visitors can upvote each item once.
          </p>
        </div>
        <Button nativeButton={false} variant="outline" render={<Link href="/roadmap" />}>
          View public board
        </Button>
      </div>

      {flash ? (
        <p
          className={
            params.error
              ? "text-sm text-destructive"
              : "text-sm text-muted-foreground"
          }
        >
          {flash}
        </p>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Add item</CardTitle>
          <CardDescription>New cards appear on the public board when published.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createRoadmapItemAction} className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required placeholder="Offline chapter download" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="body">Short description</Label>
              <Textarea
                id="body"
                name="body"
                rows={3}
                placeholder="What readers will get when this ships."
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="status">Status</Label>
              <FormSelect
                id="status"
                name="status"
                defaultValue="considering"
                options={STATUS_OPTIONS}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="published">Visibility</Label>
              <FormSelect
                id="published"
                name="published"
                defaultValue="1"
                options={[
                  { value: "1", label: "Published" },
                  { value: "0", label: "Draft (hidden)" },
                ]}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sortOrder">Sort order</Label>
              <Input id="sortOrder" name="sortOrder" type="number" defaultValue={0} />
            </div>
            <div className="flex items-end">
              <Button type="submit">Create item</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.id}>
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle className="text-base">{item.title}</CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{statusLabel(item.status)}</Badge>
                  <Badge variant="secondary">{item.voteCount} votes</Badge>
                  {item.published ? (
                    <Badge variant="outline">Published</Badge>
                  ) : (
                    <Badge>Draft</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form action={updateRoadmapItemAction} className="grid gap-3 sm:grid-cols-2">
                <input type="hidden" name="id" value={item.id} />
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor={`title-${item.id}`}>Title</Label>
                  <Input
                    id={`title-${item.id}`}
                    name="title"
                    required
                    defaultValue={item.title}
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor={`body-${item.id}`}>Description</Label>
                  <Textarea
                    id={`body-${item.id}`}
                    name="body"
                    rows={3}
                    defaultValue={item.body}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`status-${item.id}`}>Status</Label>
                  <FormSelect
                    id={`status-${item.id}`}
                    name="status"
                    defaultValue={item.status}
                    options={STATUS_OPTIONS}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`published-${item.id}`}>Visibility</Label>
                  <FormSelect
                    id={`published-${item.id}`}
                    name="published"
                    defaultValue={item.published ? "1" : "0"}
                    options={[
                      { value: "1", label: "Published" },
                      { value: "0", label: "Draft (hidden)" },
                    ]}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`sort-${item.id}`}>Sort order</Label>
                  <Input
                    id={`sort-${item.id}`}
                    name="sortOrder"
                    type="number"
                    defaultValue={item.sortOrder}
                  />
                </div>
                <div className="flex flex-wrap items-end gap-2">
                  <Button type="submit" variant="outline">
                    Save
                  </Button>
                </div>
              </form>
              {item.published ? (
                <form action={archiveRoadmapItemAction} className="mt-3">
                  <input type="hidden" name="id" value={item.id} />
                  <Button type="submit" variant="ghost" size="sm">
                    Unpublish
                  </Button>
                </form>
              ) : null}
            </CardContent>
          </Card>
        ))}
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No roadmap items yet. Add one above.</p>
        ) : null}
      </div>
    </div>
  );
}
