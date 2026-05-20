import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireOrganizationContext } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";

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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Menu Items</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Upload photos and GLB models when adding each item
          </p>
        </div>
        <Link
          href="/dashboard/menu/new"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 text-center"
        >
          + Add Item (upload here)
        </Link>
      </div>

      {isEmpty ? (
        <div className="rounded-lg border border-dashed p-8 text-center space-y-4">
          <p className="text-muted-foreground">
            No menu items yet. Uploads happen on the add-item screen.
          </p>
          <ol className="text-sm text-muted-foreground text-left max-w-md mx-auto space-y-2 list-decimal list-inside">
            <li>Click <strong>Add Item</strong> below</li>
            <li>Drag & drop a <strong>food photo</strong></li>
            <li>Drag & drop a <strong>.glb</strong> 3D model for AR</li>
            <li>Save, then create a QR code</li>
          </ol>
          <Link
            href="/dashboard/menu/new"
            className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-md text-sm font-medium hover:bg-primary/90"
          >
            Add your first item
          </Link>
        </div>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 text-sm font-medium">Name</th>
                  <th className="text-left p-3 text-sm font-medium">Category</th>
                  <th className="text-left p-3 text-sm font-medium">Price</th>
                  <th className="text-left p-3 text-sm font-medium">Available</th>
                  <th className="text-left p-3 text-sm font-medium">Views</th>
                  <th className="text-left p-3 text-sm font-medium">AR Opens</th>
                  <th className="text-left p-3 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="p-3 text-sm">{item.name}</td>
                    <td className="p-3 text-sm capitalize text-muted-foreground">
                      {item.category || "-"}
                    </td>
                    <td className="p-3 text-sm">
                      {item.price
                        ? formatPrice(Number(item.price), item.currency)
                        : "-"}
                    </td>
                    <td className="p-3 text-sm">
                      <span
                        className={
                          item.is_available ? "text-green-600" : "text-red-600"
                        }
                      >
                        {item.is_available ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="p-3 text-sm">{item.view_count}</td>
                    <td className="p-3 text-sm">{item.ar_open_count}</td>
                    <td className="p-3 text-sm">
                      <Link
                        href={`/dashboard/menu/${item.id}/edit`}
                        className="text-primary hover:underline"
                      >
                        Edit
                      </Link>
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
