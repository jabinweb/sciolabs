import Link from "next/link";
import { BrandMark } from "@/components/crm/brand-mark";
import { Button } from "@/components/crm/ui/button";

export function StatusScreen({
  code,
  title,
  description,
  primaryHref,
  primaryLabel,
  onRetry,
  digest,
  embedded = false,
}: {
  code: string;
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
  onRetry?: () => void;
  digest?: string;
  embedded?: boolean;
}) {
  const body = (
    <div className="w-full max-w-md space-y-4">
      <p className="font-mono text-xs text-muted-foreground">{code}</p>
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="text-sm text-muted-foreground">{description}</p>
      <div className="flex flex-wrap gap-2">
        {onRetry ? (
          <Button type="button" onClick={onRetry}>
            Try again
          </Button>
        ) : null}
        {primaryHref && primaryLabel ? (
          <Button
            nativeButton={false}
            render={<Link href={primaryHref} />}
            variant={onRetry ? "outline" : "default"}
          >
            {primaryLabel}
          </Button>
        ) : null}
      </div>
      {digest ? (
        <p className="font-mono text-xs text-muted-foreground">Error ID {digest}</p>
      ) : null}
    </div>
  );

  if (embedded) {
    return <div className="flex flex-1 items-center justify-center p-6">{body}</div>;
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
        <BrandMark tone="page" />
      </header>
      <main className="flex flex-1 items-center justify-center p-6">{body}</main>
    </div>
  );
}
