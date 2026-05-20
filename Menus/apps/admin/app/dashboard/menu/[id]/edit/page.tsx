import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { requireOrganizationContext } from "@/lib/auth";
import { MenuItemForm } from "./menu-item-form";

interface EditMenuItemPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditMenuItemPage({ params }: EditMenuItemPageProps) {
  const ctx = await requireOrganizationContext();
  const { id } = await params;
  const isNew = id === "new";
  const supabase = await createClient();

  let item = null;
  if (!isNew) {
    const { data } = await supabase
      .from("menu_items")
      .select("*")
      .eq("id", id)
      .eq("location_id", ctx.locationId)
      .single();
    if (!data) notFound();
    item = data;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">
        {isNew ? "Add Menu Item" : "Edit Menu Item"}
      </h1>
      <MenuItemForm item={item} isNew={isNew} locationId={ctx.locationId} />
    </div>
  );
}
