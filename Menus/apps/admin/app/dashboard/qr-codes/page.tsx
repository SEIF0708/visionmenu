import { createClient } from "@/lib/supabase/server";
import { requireOrganizationContext } from "@/lib/auth";
import { QRCodeList } from "./qr-code-list";

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">QR Codes</h1>
      </div>

      {!menuItems || menuItems.length === 0 ? (
        <div className="rounded-lg border p-6 text-center text-muted-foreground">
          Add menu items first to generate QR codes.
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
