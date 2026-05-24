import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getOrganizationContext } from "@/lib/auth";
import {
  UtensilsCrossed,
  Eye,
  Smartphone,
  QrCode,
  TrendingUp,
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  BarChart3,
  Zap,
} from "lucide-react";

export default async function DashboardPage() {
  const ctx = await getOrganizationContext();

  if (!ctx) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <div className="rounded-2xl bg-gradient-to-br from-[#FF6B00]/10 to-transparent border border-[#FF6B00]/20 p-8 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#FF6B00]/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#FF8A33]" />
            </div>
            <h1 className="text-xl font-bold text-white">Welcome to AR Menu</h1>
          </div>
          <p className="text-sm text-neutral-400 leading-relaxed mb-6">
            Your restaurant profile is not set up yet. Complete the setup to start creating
            your AR menu experience.
          </p>
          <Link
            href="/dashboard/setup"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF8A33] text-white font-semibold text-sm shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:scale-[1.01] transition-all"
          >
            Complete Setup
            <ArrowRight className="w-4 h-4" />
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

  const kpiCards = [
    {
      label: "Menu Items",
      value: menuItems || 0,
      icon: UtensilsCrossed,
      change: "+2 this week",
      color: "from-[#FF6B00]/20 to-[#FF6B00]/5",
      iconColor: "text-[#FF8A33]",
      borderColor: "border-[#FF6B00]/10",
    },
    {
      label: "Total Scans",
      value: totalScans,
      icon: Eye,
      change: "+12% vs last week",
      color: "from-purple-500/20 to-purple-500/5",
      iconColor: "text-purple-400",
      borderColor: "border-purple-500/10",
    },
    {
      label: "Today's Activity",
      value: todayScans,
      icon: Zap,
      change: "Live tracking",
      color: "from-emerald-500/20 to-emerald-500/5",
      iconColor: "text-emerald-400",
      borderColor: "border-emerald-500/10",
    },
    {
      label: "QR Codes",
      value: qrCodes,
      icon: QrCode,
      change: "Active codes",
      color: "from-blue-500/20 to-blue-500/5",
      iconColor: "text-blue-400",
      borderColor: "border-blue-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-sm text-neutral-400 mt-1">
            {ctx.organizationName} — Real-time performance metrics
          </p>
        </div>
        <Link
          href="/dashboard/menu/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF8A33] text-white font-semibold text-sm shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:scale-[1.01] transition-all"
        >
          <span>Add New Item</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`relative rounded-2xl bg-gradient-to-br ${card.color} border ${card.borderColor} p-5 backdrop-blur-sm overflow-hidden group hover:scale-[1.02] transition-transform duration-200`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/[0.04] transition-colors" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[12px] font-medium text-neutral-400 uppercase tracking-wider">{card.label}</span>
                  <div className={`w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center ${card.iconColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white tracking-tight">{card.value}</p>
                <p className="text-[11px] text-neutral-500 mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                  {card.change}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart Placeholder */}
        <div className="lg:col-span-2 rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-white">AR Engagement</h2>
              <p className="text-xs text-neutral-500 mt-0.5">Last 7 days performance</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-[#FF6B00]/10 border border-[#FF6B00]/20 text-[11px] font-medium text-[#FF8A33]">
                7D
              </button>
              <button className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[11px] font-medium text-neutral-400 hover:text-white transition-colors">
                30D
              </button>
              <button className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[11px] font-medium text-neutral-400 hover:text-white transition-colors">
                90D
              </button>
            </div>
          </div>
          {/* Chart visualization */}
          <div className="h-[220px] flex items-end justify-between gap-2 px-2">
            {[65, 40, 80, 55, 90, 70, 85].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full rounded-lg bg-gradient-to-t from-[#FF6B00]/60 to-[#FF8A33]/30 border border-[#FF6B00]/20 transition-all duration-500"
                  style={{ height: `${height}%` }}
                />
                <span className="text-[10px] text-neutral-500">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6">
          <h2 className="font-semibold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { label: "Add menu item", href: "/dashboard/menu/new", icon: UtensilsCrossed, desc: "Upload food + 3D model" },
              { label: "View analytics", href: "/dashboard/analytics", icon: BarChart3, desc: "Track engagement" },
              { label: "Generate QR code", href: "/dashboard/qr-codes", icon: QrCode, desc: "Print for tables" },
              { label: "Manage items", href: "/dashboard/menu", icon: Smartphone, desc: "Edit existing menu" },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] hover:border-white/[0.08] transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-white/[0.06] flex items-center justify-center text-neutral-400 group-hover:text-[#FF8A33] transition-colors">
                  <action.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{action.label}</p>
                  <p className="text-[11px] text-neutral-500">{action.desc}</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-neutral-600 group-hover:text-[#FF8A33] transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Getting Started */}
      {(menuItems || 0) === 0 && (
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#FF6B00]/15 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#FF8A33]" />
            </div>
            <h2 className="font-semibold text-white">Getting Started</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { step: "1", title: "Add a menu item", desc: "Upload photo + GLB model", done: false },
              { step: "2", title: "Generate QR codes", desc: "Create printable codes", done: false },
              { step: "3", title: "Print & place", desc: "Put QR codes on tables", done: false },
              { step: "4", title: "Track analytics", desc: "Monitor engagement", done: false },
            ].map((item) => (
              <div key={item.step} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="w-7 h-7 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/20 flex items-center justify-center text-[11px] font-bold text-[#FF8A33] mb-3">
                  {item.step}
                </div>
                <p className="text-sm font-medium text-white">{item.title}</p>
                <p className="text-[11px] text-neutral-500 mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
