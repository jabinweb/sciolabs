import Link from "next/link";
import { BrandMark } from "@/components/crm/brand-mark";
import { Button } from "@/components/crm/ui/button";
import { portalLogoutAction } from "@/actions/portal";
import { getPortalEmail } from "@/lib/crm/portal";

export async function PortalShell({ children }: { children: React.ReactNode }) {
  const email = await getPortalEmail();

  return (
    <div className="min-h-dvh bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4">
          <Link href="/" className="min-w-0">
            <BrandMark tone="page" />
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            <Button nativeButton={false} variant="ghost" size="sm" render={<Link href="/support" />}>
              Help
            </Button>
            <Button
              nativeButton={false}
              variant="ghost"
              size="sm"
              render={<Link href="/support/articles" />}
            >
              Knowledge
            </Button>
            <Button
              nativeButton={false}
              variant="ghost"
              size="sm"
              render={<Link href="/support/roadmap" />}
            >
              Roadmap
            </Button>
            <Button
              nativeButton={false}
              variant="ghost"
              size="sm"
              render={<Link href="/support/tickets/new" />}
            >
              Contact us
            </Button>
            {email ? (
              <>
                <Button
                  nativeButton={false}
                  variant="ghost"
                  size="sm"
                  render={<Link href="/support/tickets" />}
                >
                  My tickets
                </Button>
                <form action={portalLogoutAction}>
                  <Button type="submit" variant="outline" size="sm">
                    Sign out
                  </Button>
                </form>
              </>
            ) : (
              <Button
                nativeButton={false}
                variant="outline"
                size="sm"
                render={<Link href="/support/signin" />}
              >
                Sign in
              </Button>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 md:py-12">{children}</main>
      <footer className="border-t py-8 text-center text-xs text-muted-foreground">
        ScioLabs Support ·{" "}
        <Link href="/auth/signin" className="underline-offset-2 hover:underline">
          Staff sign in
        </Link>
      </footer>
    </div>
  );
}
