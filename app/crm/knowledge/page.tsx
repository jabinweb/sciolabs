import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/crm/ui/card";
import { Badge } from "@/components/crm/ui/badge";
import { listKbArticles } from "@/lib/crm/queries";

export const dynamic = "force-dynamic";

export default async function KnowledgePage() {
  const articles = await listKbArticles();
  const grouped = new Map<string, typeof articles>();
  for (const article of articles) {
    const list = grouped.get(article.category) ?? [];
    list.push(article);
    grouped.set(article.category, list);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Knowledge</h1>
        <p className="text-sm text-muted-foreground">
          Internal articles agents can reuse in replies. Published ones also appear on /support.
        </p>
      </div>
      {[...grouped.entries()].map(([category, items]) => (
        <section key={category} className="space-y-3">
          <h2 className="text-sm font-semibold">{category}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((article) => (
              <Card key={article.id}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle>{article.title}</CardTitle>
                    {article.published ? <Badge variant="outline">Published</Badge> : <Badge>Draft</Badge>}
                  </div>
                  <CardDescription>{article.slug}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-muted-foreground">{article.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ))}
      {grouped.size === 0 ? (
        <p className="text-sm text-muted-foreground">No knowledge articles yet.</p>
      ) : null}
    </div>
  );
}
