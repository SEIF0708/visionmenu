import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabaseServer } from "@/lib/supabase/server";
import { ARViewer } from "@/components/ar/ar-viewer";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Flame,
  Heart,
  ShoppingBag,
  Star,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";

interface MenuItemPageProps {
  params: Promise<{ restaurantSlug: string; itemSlug: string }>;
}

export async function generateMetadata({
  params,
}: MenuItemPageProps): Promise<Metadata> {
  const { restaurantSlug, itemSlug } = await params;

  const { data: location } = await supabaseServer
    .from("locations")
    .select("id, name")
    .eq("slug", restaurantSlug)
    .single();

  const { data: item } = await supabaseServer
    .from("menu_items")
    .select("name, description, image_url")
    .eq("slug", itemSlug)
    .single();

  if (!item || !location) return {};

  return {
    title: `${item.name} - ${location.name}`,
    description: item.description || `View ${item.name} in AR at ${location.name}`,
    openGraph: {
      title: `${item.name} - ${location.name}`,
      description: item.description || undefined,
      images: item.image_url ? [{ url: item.image_url }] : [],
    },
  };
}

export default async function MenuItemPage({ params }: MenuItemPageProps) {
  const { restaurantSlug, itemSlug } = await params;

  const { data: location } = await supabaseServer
    .from("locations")
    .select("id, name")
    .eq("slug", restaurantSlug)
    .single();

  if (!location) notFound();

  const { data: item } = await supabaseServer
    .from("menu_items")
    .select("*")
    .eq("slug", itemSlug)
    .eq("location_id", location.id)
    .eq("is_available", true)
    .single();

  if (!item) notFound();

  // Get related items
  const { data: relatedItems } = await supabaseServer
    .from("menu_items")
    .select("id, name, slug, price, currency, image_url")
    .eq("location_id", location.id)
    .eq("is_available", true)
    .eq("category", item.category)
    .neq("id", item.id)
    .limit(4);

  return (
    <div className="min-h-screen bg-[#050505] relative">
      {/* AR Viewer / Hero */}
      <div className="relative h-[45vh] sm:h-[55vh] bg-black">
        <ARViewer
          modelUrl={item.model_url}
          itemName={item.name}
          menuItemId={item.id}
          fallbackImageUrl={item.image_url || undefined}
        />
        
        {/* Top Navigation Overlay */}
        <div className="absolute top-0 inset-x-0 z-20 p-4 flex items-center justify-between">
          <Link
            href={`/${restaurantSlug}`}
            className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/70 transition-colors">
              <Heart className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Content */}
      <div className="relative -mt-6 rounded-t-3xl bg-[#050505] border-t border-white/[0.06] z-10">
        <div className="container mx-auto px-5 py-8 max-w-2xl">
          {/* Title & Price */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">{item.name}</h1>
              {item.category && (
                <p className="text-sm text-neutral-400 capitalize mt-1">{item.category}</p>
              )}
            </div>
            {item.price && (
              <p className="text-2xl font-bold text-[#FF8A33]">
                {formatPrice(Number(item.price), item.currency)}
              </p>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < 4 ? "text-[#FF8A33] fill-[#FF8A33]" : "text-neutral-600"}`} />
              ))}
              <span className="text-sm text-neutral-400 ml-1.5">4.8</span>
            </div>
            <span className="text-xs text-neutral-500">(128 reviews)</span>
          </div>

          {/* Description */}
          {item.description && (
            <p className="text-sm text-neutral-400 leading-relaxed mb-6">{item.description}</p>
          )}

          {/* Nutrition & Details Cards */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {item.calories && (
              <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 text-center">
                <Flame className="w-4 h-4 text-[#FF8A33] mx-auto mb-1.5" />
                <p className="text-sm font-bold text-white">{item.calories}</p>
                <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Calories</p>
              </div>
            )}
            <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 text-center">
              <Clock className="w-4 h-4 text-purple-400 mx-auto mb-1.5" />
              <p className="text-sm font-bold text-white">15-20</p>
              <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Minutes</p>
            </div>
            <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 text-center">
              <Star className="w-4 h-4 text-emerald-400 mx-auto mb-1.5" />
              <p className="text-sm font-bold text-white">4.8</p>
              <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Rating</p>
            </div>
          </div>

          {/* Allergens */}
          {item.allergens && item.allergens.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-white">Allergens</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.allergens.map((allergen: string) => (
                  <span
                    key={allergen}
                    className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400"
                  >
                    {allergen}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Dietary Tags */}
          {item.dietary_tags && item.dietary_tags.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {item.dietary_tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Related Items */}
          {relatedItems && relatedItems.length > 0 && (
            <div className="mt-8 pt-6 border-t border-white/[0.06]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">You might also like</h3>
                <ChevronRight className="w-4 h-4 text-neutral-500" />
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                {relatedItems.map((related) => (
                  <Link
                    key={related.id}
                    href={`/${restaurantSlug}/menu/${related.slug}`}
                    className="flex-shrink-0 w-36 rounded-xl bg-white/[0.03] border border-white/[0.06] overflow-hidden hover:border-white/[0.12] transition-all"
                  >
                    <div className="h-24 bg-white/[0.04]">
                      {related.image_url && (
                        <img src={related.image_url} alt={related.name} className="w-full h-full object-cover" loading="lazy" />
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-medium text-white truncate">{related.name}</p>
                      <p className="text-xs font-bold text-[#FF8A33] mt-1">
                        ${Number(related.price).toFixed(2)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-[#050505]/90 backdrop-blur-xl border-t border-white/[0.06] p-4">
        <div className="container mx-auto max-w-2xl flex items-center gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-[#FF6B00] to-[#FF8A33] text-white font-bold text-sm shadow-xl shadow-orange-500/25 hover:scale-[1.01] transition-transform">
            <ShoppingBag className="w-4 h-4" />
            Add to Cart &mdash; {item.price ? formatPrice(Number(item.price), item.currency) : ""}
          </button>
        </div>
      </div>
    </div>
  );
}
