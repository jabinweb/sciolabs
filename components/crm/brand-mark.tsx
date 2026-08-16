import Image from "next/image";
import { cn } from "@/lib/utils";

export function BrandMark({
  tone = "sidebar",
  className,
}: {
  tone?: "sidebar" | "page";
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Image
        src="/sciolabs_logo.png"
        alt="ScioLabs"
        width={32}
        height={32}
        className="size-8 shrink-0 rounded-full object-contain"
        priority
      />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">ScioLabs</p>
        <p
          className={cn(
            "truncate text-xs",
            tone === "sidebar" ? "text-sidebar-foreground/55" : "text-muted-foreground",
          )}
        >
          Support desk
        </p>
      </div>
    </div>
  );
}
