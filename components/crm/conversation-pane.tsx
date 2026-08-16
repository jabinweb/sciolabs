"use client";

import { useLayoutEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export function ConversationPane({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  return (
    <div
      ref={ref}
      className={cn("min-h-0 flex-1 overflow-y-auto overscroll-contain", className)}
    >
      {children}
    </div>
  );
}
