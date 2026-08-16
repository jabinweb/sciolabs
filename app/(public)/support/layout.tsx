import { PortalShell } from "@/components/crm/portal-shell"

export const dynamic = "force-dynamic"

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <PortalShell>{children}</PortalShell>
}
