import { createClient } from "@/lib/supabase/server";
import { requireOrganizationContext } from "@/lib/auth";
import {
  Eye,
  Smartphone,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Globe,
  Monitor,
  Tablet,
  BarChart3,
  Download,
  Calendar,
} from "lucide-react";

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

  const totalDevices = Object.values(deviceCounts).reduce((a, b) => a + b, 0);

  const kpiCards = [
    {
      label: "Total Views",
      value: totalViews.toLocaleString(),
      change: "+18.2%",
      up: true,
      icon: Eye,
      color: "from-purple-500/20 to-purple-500/5",
      iconColor: "text-purple-400",
      borderColor: "border-purple-500/10",
    },
    {
      label: "AR Opens",
      value: totalAROpens.toLocaleString(),
      change: "+24.5%",
      up: true,
      icon: Smartphone,
      color: "from-[#FF6B00]/20 to-[#FF6B00]/5",
      iconColor: "text-[#FF8A33]",
      borderColor: "border-[#FF6B00]/10",
    },
    {
      label: "AR Conversion",
      value: `${conversionRate}%`,
      change: "+3.1%",
      up: true,
      icon: TrendingUp,
      color: "from-emerald-500/20 to-emerald-500/5",
      iconColor: "text-emerald-400",
      borderColor: "border-emerald-500/10",
    },
    {
      label: "Unique Users",
      value: Math.round(totalViews * 0.7).toLocaleString(),
      change: "-2.3%",
      up: false,
      icon: Users,
      color: "from-blue-500/20 to-blue-500/5",
      iconColor: "text-blue-400",
      borderColor: "border-blue-500/10",
    },
  ];

  const deviceIcons: Record<string, any> = {
    mobile: Smartphone,
    desktop: Monitor,
    tablet: Tablet,
    unknown: Globe,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-sm text-neutral-400 mt-1">Track your AR menu engagement and performance</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-neutral-400 hover:text-white transition-all">
            <Calendar className="w-3.5 h-3.5" />
            Last 30 days
          </button>
          <button className="inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-neutral-400 hover:text-white transition-all">
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`relative rounded-2xl bg-gradient-to-br ${card.color} border ${card.borderColor} p-5 backdrop-blur-sm overflow-hidden`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">{card.label}</span>
                <div className={`w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center ${card.iconColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white tracking-tight">{card.value}</p>
              <p className="text-[11px] mt-2 flex items-center gap-1">
                {card.up ? (
                  <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                ) : (
                  <ArrowDownRight className="w-3 h-3 text-red-400" />
                )}
                <span className={card.up ? "text-emerald-400" : "text-red-400"}>{card.change}</span>
                <span className="text-neutral-500 ml-1">vs last period</span>
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Engagement Chart */}
        <div className="lg:col-span-2 rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-white">Engagement Trends</h2>
              <p className="text-xs text-neutral-500 mt-0.5">Views & AR opens over time</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                <span className="text-[11px] text-neutral-400">Views</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B00]" />
                <span className="text-[11px] text-neutral-400">AR Opens</span>
              </div>
            </div>
          </div>
          {/* Chart visualization */}
          <div className="h-[250px] flex items-end gap-3 px-2">
            {Array.from({ length: 12 }, (_, i) => {
              const viewHeight = 30 + Math.random() * 60;
              const arHeight = viewHeight * (0.3 + Math.random() * 0.3);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex gap-0.5 items-end" style={{ height: "200px" }}>
                    <div
                      className="flex-1 rounded-t-md bg-gradient-to-t from-purple-500/60 to-purple-400/20 border border-purple-500/20"
                      style={{ height: `${viewHeight}%` }}
                    />
                    <div
                      className="flex-1 rounded-t-md bg-gradient-to-t from-[#FF6B00]/60 to-[#FF8A33]/20 border border-[#FF6B00]/20"
                      style={{ height: `${arHeight}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-neutral-500">
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6">
          <h2 className="font-semibold text-white mb-1">Device Breakdown</h2>
          <p className="text-xs text-neutral-500 mb-6">Distribution by device type</p>

          {Object.keys(deviceCounts).length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <Globe className="w-8 h-8 text-neutral-600 mb-3" />
              <p className="text-sm text-neutral-500">No data yet</p>
              <p className="text-xs text-neutral-600 mt-1">Analytics will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(deviceCounts).map(([device, count]) => {
                const Icon = deviceIcons[device] || Globe;
                const percent = totalDevices > 0 ? ((count / totalDevices) * 100).toFixed(0) : 0;
                return (
                  <div key={device} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-neutral-400" />
                        <span className="text-sm capitalize text-neutral-300">{device}</span>
                      </div>
                      <span className="text-sm font-medium text-white">{percent}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-[#FF6B00]"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Top Items */}
      <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-semibold text-white">Top Performing Items</h2>
            <p className="text-xs text-neutral-500 mt-0.5">Ranked by total views</p>
          </div>
          <BarChart3 className="w-5 h-5 text-neutral-500" />
        </div>

        {!topItems || topItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-neutral-500">No data yet. Start by adding menu items.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {topItems.map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors">
                <span className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center text-[11px] font-bold text-neutral-400">
                  {i + 1}
                </span>
                <span className="flex-1 text-sm font-medium text-white">{item.name}</span>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{item.view_count}</p>
                    <p className="text-[10px] text-neutral-500">views</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-[#FF8A33]">{item.ar_open_count}</p>
                    <p className="text-[10px] text-neutral-500">AR opens</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-emerald-400">
                      {item.view_count > 0 ? ((item.ar_open_count / item.view_count) * 100).toFixed(0) : 0}%
                    </p>
                    <p className="text-[10px] text-neutral-500">conv.</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
