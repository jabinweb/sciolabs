"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  BookOpen,
  Inbox,
  Kanban,
  LayoutDashboard,
  LogOut,
  Map,
  Plus,
  Settings,
  Users,
  Workflow,
} from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { updateMyStatusAction } from "@/actions/settings";
import type { Agent } from "@/lib/crm/types";
import { initials } from "@/lib/crm/format";
import { BrandMark } from "@/components/crm/brand-mark";
import { Avatar, AvatarFallback } from "@/components/crm/ui/avatar";
import { Button } from "@/components/crm/ui/button";
import { FormSelect } from "@/components/crm/form-select";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/crm/ui/sidebar";

type NavChild = {
  href: string;
  label: string;
  exact?: boolean;
  adminOnly?: boolean;
};

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  children?: NavChild[];
};

function hrefPath(href: string) {
  return href.split("?")[0] ?? href;
}

const SETTINGS_CHILDREN: NavChild[] = [
  { href: "/crm/settings?tab=general", label: "General", adminOnly: true },
  { href: "/crm/settings?tab=email", label: "Email", adminOnly: true },
  { href: "/crm/settings?tab=ai", label: "AI", adminOnly: true },
  { href: "/crm/settings?tab=ingest", label: "Ingest", adminOnly: true },
  { href: "/crm/settings?tab=freshdesk", label: "Freshdesk", adminOnly: true },
  { href: "/crm/settings?tab=team", label: "Team" },
  { href: "/crm/settings?tab=content", label: "Content" },
  { href: "/crm/settings/workflows", label: "Workflows", adminOnly: true },
  { href: "/crm/settings/migrate", label: "Freshdesk import", adminOnly: true },
];

function navItems(role: Agent["role"]): NavItem[] {
  const settingsHome =
    role === "admin" ? "/crm/settings?tab=general" : "/crm/settings?tab=team";
  return [
    { href: "/crm/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
    {
      href: "/crm/tickets",
      label: "Tickets",
      icon: Inbox,
      children: [
        { href: "/crm/tickets", label: "All tickets", exact: true },
        { href: "/crm/tickets/board", label: "Pipeline" },
        { href: "/crm/tickets?view=open", label: "Open" },
        { href: "/crm/tickets?view=mine", label: "My open" },
        { href: "/crm/tickets?view=unassigned", label: "Unassigned" },
        { href: "/crm/tickets?view=urgent", label: "Urgent" },
        { href: "/crm/tickets/new", label: "New ticket" },
      ],
    },
    { href: "/crm/contacts", label: "Contacts", icon: Users },
    { href: "/crm/knowledge", label: "Knowledge", icon: BookOpen },
    { href: "/crm/roadmap", label: "Roadmap", icon: Map },
    {
      href: settingsHome,
      label: "Settings",
      icon: Settings,
      children: SETTINGS_CHILDREN,
    },
  ];
}

function parentActive(pathname: string, item: NavItem) {
  const path = hrefPath(item.href);
  if (item.exact) return pathname === path;
  return pathname === path || pathname.startsWith(`${path}/`);
}

function isSubActive(
  pathname: string,
  searchParams: URLSearchParams,
  child: NavChild,
  settingsDefaultTab: string,
) {
  const path = hrefPath(child.href);
  if (child.href.includes("?")) {
    if (pathname !== path) return false;
    const wanted = new URLSearchParams(child.href.split("?")[1]);
    for (const [key, value] of wanted.entries()) {
      const actual =
        key === "tab"
          ? (searchParams.get("tab") ?? (pathname === "/crm/settings" ? settingsDefaultTab : null))
          : searchParams.get(key);
      if (actual !== value) return false;
    }
    return true;
  }
  if (child.exact) {
    return pathname === path && !searchParams.toString();
  }
  return pathname === path || pathname.startsWith(`${path}/`);
}

export function AppSidebar({ agent }: { agent: Agent }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const settingsDefaultTab = agent.role === "admin" ? "general" : "team";
  const items = navItems(agent.role);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <BrandMark className="px-2 py-1.5 group-data-[collapsible=icon]:justify-center [&_div:last-child]:group-data-[collapsible=icon]:hidden" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const children = (item.children ?? []).filter(
                  (child) => !child.adminOnly || agent.role === "admin",
                );
                const active = parentActive(pathname, item);
                return (
                  <SidebarMenuItem key={hrefPath(item.href)}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={active && children.length === 0}
                      tooltip={item.label}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                    {children.length > 0 ? (
                      <SidebarMenuSub>
                        {children.map((child) => (
                          <SidebarMenuSubItem key={child.href}>
                            <SidebarMenuSubButton
                              render={<Link href={child.href} />}
                              isActive={isSubActive(
                                pathname,
                                searchParams,
                                child,
                                settingsDefaultTab,
                              )}
                              size="sm"
                            >
                              {child.href === "/crm/tickets/new" ? <Plus /> : null}
                              {child.href === "/crm/tickets/board" ? <Kanban /> : null}
                              {child.href === "/crm/settings/workflows" ? <Workflow /> : null}
                              <span>{child.label}</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    ) : null}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-1 group-data-[collapsible=icon]:justify-center">
          <Avatar className="size-8">
            <AvatarFallback>{initials(agent.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-medium">{agent.name}</p>
            <p className="truncate text-xs text-muted-foreground capitalize">
              {agent.role} · {agent.status}
            </p>
          </div>
        </div>
        <form
          id="agent-status-form"
          action={updateMyStatusAction}
          className="px-1 group-data-[collapsible=icon]:hidden"
        >
          <FormSelect
            name="status"
            defaultValue={agent.status}
            className="mb-1"
            onValueChange={() => {
              queueMicrotask(() => {
                const form = document.getElementById(
                  "agent-status-form",
                ) as HTMLFormElement | null;
                form?.requestSubmit();
              });
            }}
            options={[
              { value: "online", label: "Online" },
              { value: "away", label: "Away" },
              { value: "offline", label: "Offline" },
            ]}
          />
        </form>
        <form
          action={logoutAction}
          className="px-1 pb-1 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center"
        >
          <Button type="submit" variant="ghost" size="sm" className="w-full justify-start">
            <LogOut />
            <span className="group-data-[collapsible=icon]:hidden">Sign out</span>
          </Button>
        </form>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
