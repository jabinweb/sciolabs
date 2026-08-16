import { Suspense } from "react"
import { AppSidebar } from "@/components/crm/app-sidebar"
import { requireAgent } from "@/lib/crm/auth"
import { Separator } from "@/components/crm/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/crm/ui/sidebar"

export const dynamic = "force-dynamic"

export default async function CrmDeskLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const agent = await requireAgent()

  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <Suspense fallback={<div className="hidden w-64 shrink-0 md:block" />}>
        <AppSidebar agent={agent} />
      </Suspense>
      <SidebarInset className="min-h-0 overflow-hidden">
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <p className="text-sm text-muted-foreground">ScioLabs CRM</p>
        </header>
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
