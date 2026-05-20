import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardUser } from "@/components/auth/dashboard-user";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell userSlot={<DashboardUser />}>{children}</DashboardShell>
  );
}
