import { NextResponse } from "next/server";
import {
  getAuthenticatedSupabase,
  unauthorizedResponse,
} from "@/lib/auth-api";
import { getOrganizationContext } from "@/lib/auth";

export async function POST(request: Request) {
  const { supabase, user } = await getAuthenticatedSupabase();
  if (!supabase || !user) return unauthorizedResponse();

  const ctx = await getOrganizationContext();
  if (!ctx) {
    return NextResponse.json(
      { success: false, error: { code: "NO_ORG", message: "No organization" } },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { menuItemId } = body;

    const { data: item } = await supabase
      .from("menu_items")
      .select("slug, location_id")
      .eq("id", menuItemId)
      .eq("location_id", ctx.locationId)
      .single();

    if (!item) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Menu item not found" } },
        { status: 404 }
      );
    }

    const webBase =
      process.env.NEXT_PUBLIC_WEB_APP_URL ||
      process.env.NEXT_PUBLIC_APP_URL?.replace(":3001", ":3000") ||
      "http://localhost:3000";

    const url = `${webBase}/${ctx.locationSlug}/menu/${item.slug}`;
    const code = `qr-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

    const { data, error } = await supabase
      .from("qr_codes")
      .insert({
        menu_item_id: menuItemId,
        code,
        full_url: url,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      { success: true, data, meta: { timestamp: new Date().toISOString(), version: "v1" } },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Generate failed";
    return NextResponse.json(
      { success: false, error: { code: "GENERATE_FAILED", message } },
      { status: 400 }
    );
  }
}
