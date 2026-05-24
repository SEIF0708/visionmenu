import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireOrganizationContext } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import {
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List,
  MoreHorizontal,
  Eye,
  Smartphone,
  Edit3,
  Trash2,
  QrCode,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  Image,
} from "lucide-react";

export default async function MenuManagementPage() {
  const ctx = await requireOrganizationContext();
  const supabase = await createClient();

  const { data: menuItems, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("location_id", ctx.locationId)
    .order("sort_order");

  if (error) {
    throw new Error(error.message);
  }

  const isEmpty = !menuItems || menuItems.length === 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Menu Items</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Manage your restaurant&apos;s AR-enabled food items
          </p>
        </div>
        <Link
          href="/dashboard/menu/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF8A33] text-white font-semibold text-sm shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:scale-[1.01] transition-all"
        >
          <Plus className="w-4 h-4" />
          Add New Item
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search menu items..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#FF6B00]/30 focus:ring-1 focus:ring-[#FF6B00]/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-neutral-400 hover:text-white hover:bg-white/[0.06] transition-all">
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <div className="flex rounded-xl bg-white/[0.03] border border-white/[0.08] overflow-hidden">
            <button className="h-10 w-10 flex items-center justify-center text-[#FF8A33] bg-[#FF6B00]/10">
              <List className="w-4 h-4" />
            </button>
            <button className="h-10 w-10 flex items-center justify-center text-neutral-500 hover:text-white transition-colors">
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {isEmpty ? (
        /* Empty State */
        <div className="rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.02] p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#FF6B00]/10 border border-[#FF6B00]/20 flex items-center justify-center mx-auto mb-5">
            <UtensilsCrossed className="w-7 h-7 text-[#FF8A33]" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No menu items yet</h3>
          <p className="text-sm text-neutral-400 max-w-md mx-auto mb-6">
            Start building your AR menu by adding your first food item. Upload photos and 3D models to create immersive dining experiences.
          </p>
          <Link
            href="/dashboard/menu/new"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF8A33] text-white font-semibold text-sm shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:scale-[1.01] transition-all"
          >
            <Plus className="w-4 h-4" />
            Add your first item
          </Link>
        </div>
      ) : (
        /* Table */
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left p-4 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                    <div className="flex items-center gap-1.5">Item <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th className="text-left p-4 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Category</th>
                  <th className="text-left p-4 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Price</th>
                  <th className="text-left p-4 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Status</th>
                  <th className="text-left p-4 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">AR Model</th>
                  <th className="text-left p-4 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                    <div className="flex items-center gap-1.5">Views <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th className="text-left p-4 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">AR Opens</th>
                  <th className="text-right p-4 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map((item) => (
                  <tr key={item.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.06] overflow-hidden flex items-center justify-center">
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <Image className="w-4 h-4 text-neutral-600" />
                          )}
                        </div>
                        <span className="text-sm font-medium text-white">{item.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-neutral-400 capitalize">
                        {item.category || "—"}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-white font-medium">
                      {item.price ? formatPrice(Number(item.price), item.currency) : "—"}
                    </td>
                    <td className="p-4">
                      {item.is_available ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-400">
                          <XCircle className="w-3.5 h-3.5" />
                          Hidden
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      {item.model_url ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#FF8A33]">
                          <Smartphone className="w-3.5 h-3.5" />
                          Ready
                        </span>
                      ) : (
                        <span className="text-xs text-neutral-500">No model</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-neutral-500" />
                        <span className="text-sm text-neutral-300">{item.view_count}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-neutral-500" />
                        <span className="text-sm text-neutral-300">{item.ar_open_count}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/dashboard/menu/${item.id}/edit`}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/[0.08] transition-all"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-[#FF8A33] hover:bg-[#FF6B00]/10 transition-all"
                          title="Generate QR"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </button>
                        <button
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function UtensilsCrossed(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8"/>
      <path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7"/>
      <path d="m2.1 21.8 6.4-6.3"/>
      <path d="m19 5-7 7"/>
    </svg>
  );
}
