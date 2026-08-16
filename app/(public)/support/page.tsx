import Link from "next/link";
import { Button } from "@/components/crm/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/crm/ui/card";
import { getPortalEmail, listPublishedArticles } from "@/lib/crm/portal";

export const dynamic = "force-dynamic";

export default async function HelpHomePage() {
  const [email, articles] = await Promise.all([getPortalEmail(), listPublishedArticles()]);
  const featured = articles.slice(0, 4);

  return (
    <div className="space-y-10">
      <section className="space-y-5 py-6 md:py-10">
        <p className="text-sm font-medium tracking-wide text-primary">ScioLabs Support</p>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
          How can we help?
        </h1>
        <p className="max-w-xl text-base leading-7 text-muted-foreground">
          Browse answers or open a support ticket. Signed-in customers can track every
          conversation in one place.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button nativeButton={false} render={<Link href="/support/tickets/new" />}>
            Submit a ticket
          </Button>
          <Button nativeButton={false} variant="outline" render={<Link href="/support/articles" />}>
            Browse knowledge
          </Button>
          {email ? (
            <Button nativeButton={false} variant="ghost" render={<Link href="/support/tickets" />}>
              View my tickets
            </Button>
          ) : (
            <Button nativeButton={false} variant="ghost" render={<Link href="/support/signin" />}>
              Check ticket status
            </Button>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Popular articles</h2>
          <p className="text-sm text-muted-foreground">Start here before opening a ticket.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {featured.map((article) => (
            <Link key={article.id} href={`/support/articles/${article.slug}`}>
              <Card className="h-full transition-colors hover:bg-card/80">
                <CardHeader>
                  <CardDescription>{article.category}</CardDescription>
                  <CardTitle>{article.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-sm text-muted-foreground">{article.body}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
          {featured.length === 0 ? (
            <p className="text-sm text-muted-foreground">Knowledge articles will appear here.</p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
