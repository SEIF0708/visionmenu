import { createClient } from "@/lib/supabase/server";
import { requireOrganizationContext } from "@/lib/auth";

export default async function AnalyticsPage() {
  const ctx = await requireOrganizationContext();
  const supabase = await createClient();

  const { data: topItems } = await supabase
    .from("menu_items")
    .select("name, view_count, ar_open_count")
    .eq("location_id", ctx.locationId)
    .order("view_count", { ascending: false })
    .limit(10);

  const { data: items } = await supabase
    .from("menu_items")
    .select("id")
    .eq("location_id", ctx.locationId);

  const ids = items?.map((i) => i.id) ?? [];

  let totalViews = 0;
  let totalAROpens = 0;
  let deviceBreakdown: { device_type: string | null }[] = [];

  if (ids.length > 0) {
    const { count: views } = await supabase
      .from("analytics_events")
      .select("*", { count: "exact", head: true })
      .in("menu_item_id", ids)
      .eq("event_type", "view");

    const { count: arOpens } = await supabase
      .from("analytics_events")
      .select("*", { count: "exact", head: true })
      .in("menu_item_id", ids)
      .eq("event_type", "ar_open");

    totalViews = views ?? 0;
    totalAROpens = arOpens ?? 0;

    const { data: devices } = await supabase
      .from("analytics_events")
      .select("device_type")
      .in("menu_item_id", ids);

    deviceBreakdown = devices ?? [];
  }

  const conversionRate =
    totalViews > 0 ? ((totalAROpens / totalViews) * 100).toFixed(1) : "0.0";

  const deviceCounts: Record<string, number> = {};
  deviceBreakdown.forEach((e) => {
    const key = e.device_type || "unknown";
    deviceCounts[key] = (deviceCounts[key] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Total Views</p>
          <p className="text-3xl font-bold mt-1">{totalViews}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">AR Opens</p>
          <p className="text-3xl font-bold mt-1">{totalAROpens}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">AR Conversion</p>
          <p className="text-3xl font-bold mt-1">{conversionRate}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-lg border p-4">
          <h2 className="font-semibold mb-4">Most Viewed Items</h2>
          {!topItems || topItems.length === 0 ? (
            <p className="text-sm text-muted-foreground">No data yet</p>
          ) : (
            <div className="space-y-3">
              {topItems.map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-sm">{item.name}</span>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>{item.view_count} views</span>
                    <span>{item.ar_open_count} AR</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-lg border p-4">
          <h2 className="font-semibold mb-4">Device Breakdown</h2>
          {Object.keys(deviceCounts).length === 0 ? (
            <p className="text-sm text-muted-foreground">No data yet</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(deviceCounts).map(([device, count]) => (
                <div key={device} className="flex justify-between items-center">
                  <span className="text-sm capitalize">{device}</span>
                  <span className="text-sm text-muted-foreground">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
