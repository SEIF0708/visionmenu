import { getUser, getOrganizationContext } from "@/lib/auth";

export async function DashboardUser() {
  const [user, ctx] = await Promise.all([getUser(), getOrganizationContext()]);

  if (!user) return null;

  return (
    <div className="text-right hidden sm:block">
      <p className="text-sm font-medium truncate max-w-[200px]">
        {ctx?.organizationName ?? "My Restaurant"}
      </p>
      <p className="text-xs text-muted-foreground truncate max-w-[200px]">
        {user.email}
      </p>
    </div>
  );
}
