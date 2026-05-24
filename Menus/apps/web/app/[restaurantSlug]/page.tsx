import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import { Eye, Search, ShoppingBag, Smartphone } from "lucide-react";

interface RestaurantPageProps {
  params: Promise<{ restaurantSlug: string }>;
}

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const { restaurantSlug } = await params;

  const { data: location } = await supabaseServer
    .from("locations")
    .select("id, name, organization_id")
    .eq("slug", restaurantSlug)
    .single();

  if (!location) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-[#050505]">
        <div className="w-16 h-16 rounded-2xl bg-[#FF6B00]/10 flex items-center justify-center mb-4">
          <Eye className="w-7 h-7 text-[#FF8A33]" />
        </div>
        <h1 className="text-xl font-bold text-white">Restaurant not found</h1>
        <p className="text-sm text-neutral-400 mt-2">
          The restaurant you are looking for does not exist.
        </p>
      </div>
    );
  }

  const { data: menuItems } = await supabaseServer
    .from("menu_items")
    .select("id, name, slug, description, price, currency, image_url, category")
    .eq("location_id", location.id)
    .eq("is_available", true)
    .order("sort_order");

  // Group by category
  const categories = menuItems?.reduce((acc, item) => {
    const cat = item.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, typeof menuItems>) || {};

  const categoryList = Object.keys(categories);

  return (
    <div className="min-h-screen bg-[#050505] relative">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#FF6B00]/[0.03] blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF6B00] to-[#FF8A33] flex items-center justify-center font-black text-white text-xs shadow-lg shadow-orange-500/20">
                AR
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">{location.name}</h1>
                <p className="text-[11px] text-neutral-500">AR Menu Experience</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-neutral-400 hover:text-white transition-colors">
                <Search className="w-4 h-4" />
              </button>
              <button className="relative w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-neutral-400 hover:text-white transition-colors">
                <ShoppingBag className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF6B00] text-[9px] font-bold text-white flex items-center justify-center">
                  0
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        {categoryList.length > 0 && (
          <div className="px-4 pb-3 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 min-w-max">
              {categoryList.map((cat, i) => (
                <a
                  key={cat}
                  href={`#${cat}`}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                    i === 0
                      ? "bg-gradient-to-r from-[#FF6B00] to-[#FF8A33] text-white shadow-md shadow-orange-500/20"
                      : "bg-white/[0.04] border border-white/[0.06] text-neutral-400 hover:text-white hover:bg-white/[0.08]"
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6 pb-24">
        {!menuItems || menuItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-4">
              <Eye className="w-7 h-7 text-neutral-500" />
            </div>
            <p className="text-neutral-400">No menu items available at this time.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(categories).map(([category, items]) => (
              <section key={category} id={category}>
                <h2 className="text-lg font-bold text-white mb-4 capitalize">{category}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {items.map((item) => (
                    <Link
                      key={item.id}
                      href={`/${restaurantSlug}/menu/${item.slug}`}
                      className="group rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden hover:border-white/[0.12] hover:bg-white/[0.05] transition-all duration-300"
                    >
                      <div className="flex gap-4 p-4">
                        {/* Food Image */}
                        <div className="w-24 h-24 rounded-xl bg-white/[0.04] overflow-hidden flex-shrink-0">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Eye className="w-6 h-6 text-neutral-600" />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <h3 className="font-semibold text-white text-[15px] truncate group-hover:text-[#FF8A33] transition-colors">
                              {item.name}
                            </h3>
                            {item.description && (
                              <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                                {item.description}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-base font-bold text-[#FF8A33]">
                              ${Number(item.price).toFixed(2)}
                            </p>
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#FF6B00]/10 border border-[#FF6B00]/20 text-[10px] font-medium text-[#FF8A33]">
                              <Smartphone className="w-3 h-3" />
                              AR
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      {/* Floating Cart */}
      <div className="fixed bottom-6 left-4 right-4 z-50 sm:left-auto sm:right-6 sm:max-w-sm">
        <button className="w-full flex items-center justify-between px-6 py-4 rounded-2xl bg-gradient-to-r from-[#FF6B00] to-[#FF8A33] text-white font-semibold shadow-2xl shadow-orange-500/30 hover:scale-[1.02] transition-transform">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5" />
            <span className="text-sm">View Cart</span>
          </div>
          <span className="text-sm font-bold">$0.00</span>
        </button>
      </div>
    </div>
  );
}
