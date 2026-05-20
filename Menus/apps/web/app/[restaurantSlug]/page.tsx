import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";

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
      <div className="flex min-h-screen flex-col items-center justify-center p-8">
        <h1 className="text-2xl font-bold">Restaurant not found</h1>
        <p className="text-muted-foreground mt-2">
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

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">{location.name}</h1>
          <p className="text-muted-foreground mt-1">Our Menu</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!menuItems || menuItems.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            No menu items available at this time.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={`/${restaurantSlug}/menu/${item.slug}`}
                className="group rounded-lg border overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-[4/3] bg-muted">
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      {item.category && (
                        <p className="text-xs text-muted-foreground capitalize">
                          {item.category}
                        </p>
                      )}
                    </div>
                    <p className="font-bold">
                      ${Number(item.price).toFixed(2)}
                    </p>
                  </div>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
