import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getOrganizationContext } from "@/lib/auth";

export default async function DashboardPage() {
  const ctx = await getOrganizationContext();

  if (!ctx) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-6 space-y-4">
          <p className="text-sm">
            Your restaurant profile is not set up yet. Complete setup to access
            Menu, uploads, and QR codes.
          </p>
          <Link
            href="/dashboard/setup"
            className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90"
          >
            Complete setup
          </Link>
        </div>
      </div>
    );
  }

  const supabase = await createClient();

  const { count: menuItems } = await supabase
    .from("menu_items")
    .select("*", { count: "exact", head: true })
    .eq("location_id", ctx.locationId);

  const { data: itemIds } = await supabase
    .from("menu_items")
    .select("id")
    .eq("location_id", ctx.locationId);

  const ids = itemIds?.map((i) => i.id) ?? [];

  let totalScans = 0;
  let todayScans = 0;

  if (ids.length > 0) {
    const { count: views } = await supabase
      .from("analytics_events")
      .select("*", { count: "exact", head: true })
      .in("menu_item_id", ids);

    totalScans = views ?? 0;

    const { count: today } = await supabase
      .from("analytics_events")
      .select("*", { count: "exact", head: true })
      .in("menu_item_id", ids)
      .gte(
        "created_at",
        new Date(new Date().setHours(0, 0, 0, 0)).toISOString()
      );

    todayScans = today ?? 0;
  }

  let qrCodes = 0;
  if (ids.length > 0) {
    const { count } = await supabase
      .from("qr_codes")
      .select("*", { count: "exact", head: true })
      .in("menu_item_id", ids);
    qrCodes = count ?? 0;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {ctx.organizationName}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Menu Items</p>
          <p className="text-3xl font-bold mt-1">{menuItems || 0}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Total Events</p>
          <p className="text-3xl font-bold mt-1">{totalScans}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Today&apos;s Events</p>
          <p className="text-3xl font-bold mt-1">{todayScans}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">QR Codes</p>
          <p className="text-3xl font-bold mt-1">{qrCodes}</p>
        </div>
      </div>

      <div className="rounded-lg border p-6 space-y-4">
        <h2 className="font-semibold">Getting Started</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
          <li>
            <Link href="/dashboard/menu/new" className="text-primary hover:underline">
              Add a menu item
            </Link>{" "}
            — upload photo + GLB on that page
          </li>
          <li>Generate QR codes for each item</li>
          <li>Print and place QR codes on tables</li>
          <li>Track analytics here</li>
        </ol>
        <Link
          href="/dashboard/menu/new"
          className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90"
        >
          Add menu item (uploads)
        </Link>
      </div>
    </div>
  );
}
