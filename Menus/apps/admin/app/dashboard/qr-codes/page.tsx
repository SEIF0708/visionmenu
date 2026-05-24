import { createClient } from "@/lib/supabase/server";
import { requireOrganizationContext } from "@/lib/auth";
import { QRCodeList } from "./qr-code-list";
import { QrCode, Plus, Download, BarChart3 } from "lucide-react";

export default async function QRCodesPage() {
  const ctx = await requireOrganizationContext();
  const supabase = await createClient();

  const { data: menuItems } = await supabase
    .from("menu_items")
    .select("id, name, slug")
    .eq("location_id", ctx.locationId)
    .eq("is_available", true);

  const itemIds = menuItems?.map((m) => m.id) ?? [];

  const { data: qrCodes } =
    itemIds.length > 0
      ? await supabase
          .from("qr_codes")
          .select("*, menu_items(name, slug)")
          .in("menu_item_id", itemIds)
          .order("generated_at", { ascending: false })
      : { data: [] };

  const webAppUrl =
    process.env.NEXT_PUBLIC_WEB_APP_URL ||
    process.env.NEXT_PUBLIC_APP_URL?.replace(":3001", ":3000") ||
    "http://localhost:3000";

  const totalQR = qrCodes?.length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">QR Codes</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Generate and manage QR codes for your menu items
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-neutral-400 hover:text-white transition-all">
            <Download className="w-3.5 h-3.5" />
            Export All
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#FF6B00]/10 flex items-center justify-center">
            <QrCode className="w-5 h-5 text-[#FF8A33]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{totalQR}</p>
            <p className="text-[11px] text-neutral-500">Total QR Codes</p>
          </div>
        </div>
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">—</p>
            <p className="text-[11px] text-neutral-500">Total Scans</p>
          </div>
        </div>
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">—</p>
            <p className="text-[11px] text-neutral-500">AR Activations</p>
          </div>
        </div>
      </div>

      {!menuItems || menuItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.02] p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#FF6B00]/10 border border-[#FF6B00]/20 flex items-center justify-center mx-auto mb-5">
            <QrCode className="w-7 h-7 text-[#FF8A33]" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No menu items yet</h3>
          <p className="text-sm text-neutral-400 max-w-md mx-auto">
            Add menu items first to generate QR codes for your tables.
          </p>
        </div>
      ) : (
        <QRCodeList
          qrCodes={qrCodes || []}
          menuItems={menuItems}
          locationSlug={ctx.locationSlug}
          webAppUrl={webAppUrl}
        />
      )}
    </div>
  );
}
