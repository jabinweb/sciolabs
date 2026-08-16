import { StatusScreen } from "@/components/crm/status-screen";

export default function DeskNotFound() {
  return (
    <StatusScreen
      embedded
      code="404"
      title="Page not found"
      description="That desk page does not exist. Open tickets, or check the sidebar for the right section."
      primaryHref="/crm/tickets"
      primaryLabel="Go to tickets"
    />
  );
}
