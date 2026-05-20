import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabaseServer } from "@/lib/supabase/server";
import { ARViewer } from "@/components/ar/ar-viewer";
import { formatPrice } from "@/lib/utils";

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

  return (
    <div className="min-h-screen bg-background">
      <div className="h-[50vh] sm:h-[60vh]">
        <ARViewer
          modelUrl={item.model_url}
          itemName={item.name}
          menuItemId={item.id}
          fallbackImageUrl={item.image_url || undefined}
        />
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{item.name}</h1>
            {item.category && (
              <p className="text-sm text-muted-foreground capitalize mt-1">
                {item.category}
              </p>
            )}
          </div>
          {item.price && (
            <p className="text-2xl font-bold">
              {formatPrice(Number(item.price), item.currency)}
            </p>
          )}
        </div>

        {item.description && (
          <p className="text-muted-foreground mb-6">{item.description}</p>
        )}

        {item.calories && (
          <div className="flex items-center gap-2 mb-4 text-sm">
            <span className="font-medium">{item.calories}</span>
            <span className="text-muted-foreground">calories</span>
          </div>
        )}

        {item.allergens && item.allergens.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium mb-1">Allergens:</p>
            <div className="flex flex-wrap gap-2">
              {item.allergens.map((allergen: string) => (
                <span
                  key={allergen}
                  className="text-xs bg-muted px-2 py-1 rounded"
                >
                  {allergen}
                </span>
              ))}
            </div>
          </div>
        )}

        {item.dietary_tags && item.dietary_tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {item.dietary_tags.map((tag: string) => (
                <span
                  key={tag}
                  className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <button className="w-full mt-6 bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
          Order Now
        </button>
      </div>
    </div>
  );
}
