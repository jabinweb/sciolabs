import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/crm/ui/card";
import { Input } from "@/components/crm/ui/input";
import { Button } from "@/components/crm/ui/button";
import { listPublishedArticles } from "@/lib/crm/portal";

export const dynamic = "force-dynamic";

export default async function HelpArticlesPage({
  searchParams,
}: PageProps<"/support/articles">) {
  const q = String((await searchParams).q ?? "").trim();
  const articles = await listPublishedArticles(q);
  const grouped = new Map<string, typeof articles>();
  for (const article of articles) {
    const list = grouped.get(article.category) ?? [];
    list.push(article);
    grouped.set(article.category, list);
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Knowledge base</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Guides for programs, events, and getting help.
          </p>
        </div>
        <form className="flex flex-wrap gap-2" action="/support/articles" method="get">
          <Input
            name="q"
            defaultValue={q}
            placeholder="Search articles…"
            className="max-w-md"
            aria-label="Search knowledge base"
          />
          <Button type="submit" variant="outline">
            Search
          </Button>
          {q ? (
            <Button nativeButton={false} variant="ghost" render={<Link href="/support/articles" />}>
              Clear
            </Button>
          ) : null}
        </form>
      </div>
      {[...grouped.entries()].map(([category, items]) => (
        <section key={category} className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {category}
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {items.map((article) => (
              <Link key={article.id} href={`/support/articles/${article.slug}`}>
                <Card className="h-full hover:bg-card/80">
                  <CardHeader>
                    <CardTitle>{article.title}</CardTitle>
                    <CardDescription>{article.slug}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-3 text-sm text-muted-foreground">{article.body}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      ))}
      {grouped.size === 0 ? (
        <p className="text-sm text-muted-foreground">
          {q ? `No articles match “${q}”.` : "No published articles yet."}
        </p>
      ) : null}
    </div>
  );
}
