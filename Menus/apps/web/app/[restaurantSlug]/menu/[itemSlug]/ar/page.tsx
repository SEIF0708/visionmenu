import { notFound } from "next/navigation";
import Link from "next/link";
import { X } from "lucide-react";
import { supabaseServer } from "@/lib/supabase/server";
import { ARViewer } from "@/components/ar/ar-viewer";

interface ARExperiencePageProps {
  params: Promise<{ restaurantSlug: string; itemSlug: string }>;
}

export default async function ARExperiencePage({
  params,
}: ARExperiencePageProps) {
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

  return (
    <main className="fixed inset-0 z-50 overflow-hidden bg-black">
      <ARViewer
        modelUrl={item.model_url}
        itemName={item.name}
        menuItemId={item.id}
        fallbackImageUrl={item.image_url || undefined}
        ctaLabel="View in AR"
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between p-4">
        <Link
          href={`/${restaurantSlug}/menu/${itemSlug}`}
          aria-label="Close AR viewer"
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/55 text-white shadow-xl backdrop-blur-xl transition-colors hover:bg-black/75"
        >
          <X className="h-4 w-4" />
        </Link>

        <div className="rounded-full border border-white/10 bg-black/55 px-4 py-2 text-xs font-semibold text-white shadow-xl backdrop-blur-xl">
          {item.name}
        </div>
      </div>
    </main>
  );
}
