"use client";

import { StatusScreen } from "@/components/crm/status-screen";

export default function DeskErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <StatusScreen
      embedded
      code="500"
      title="This page couldn’t load"
      description="A server error occurred in the desk. Try again, or go back to tickets."
      primaryHref="/crm/tickets"
      primaryLabel="Go to tickets"
      onRetry={reset}
      digest={error.digest}
    />
  );
}
