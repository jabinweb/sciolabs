import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedArticle } from "@/lib/crm/portal";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/crm/ui/breadcrumb";

export const dynamic = "force-dynamic";

export default async function HelpArticlePage({
  params,
}: PageProps<"/support/articles/[slug]">) {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);
  if (!article) notFound();

  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/support/articles" />}>Knowledge</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{article.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {article.category}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{article.title}</h1>
      </div>
      <div className="whitespace-pre-wrap text-base leading-8 text-foreground/90">{article.body}</div>
      <p className="text-sm text-muted-foreground">
        Still stuck?{" "}
        <Link href="/support/tickets/new" className="font-medium text-[#921a1d] hover:underline">
          Submit a ticket
        </Link>
      </p>
    </article>
  );
}
