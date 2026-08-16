"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/crm/ui/tabs";
import {
  parseSettingsTab,
  SETTINGS_TABS,
  type SettingsTabId,
} from "@/lib/crm/settings-tabs";

export function SettingsShell({
  tab,
  isAdmin,
  panels,
}: {
  tab: SettingsTabId;
  isAdmin: boolean;
  panels: Partial<Record<SettingsTabId, React.ReactNode>>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabs = SETTINGS_TABS.filter((item) => isAdmin || !item.adminOnly);
  const current = parseSettingsTab(searchParams.get("tab") ?? tab, isAdmin);

  return (
    <Tabs
      value={current}
      className="w-full"
      onValueChange={(next) => {
        const id = String(next);
        router.replace(`/crm/settings?tab=${id}`, { scroll: false });
      }}
    >
      <TabsList
        variant="line"
        className="h-auto w-full shrink-0 flex-wrap justify-start border-b border-border pb-px"
      >
        {tabs.map((item) => (
          <TabsTrigger key={item.id} value={item.id}>
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((item) => (
        <TabsContent key={item.id} value={item.id} className="mt-4 flex flex-col gap-6">
          {panels[item.id]}
        </TabsContent>
      ))}
    </Tabs>
  );
}
