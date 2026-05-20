import { NextResponse } from "next/server";
import {
  getAuthenticatedSupabase,
  unauthorizedResponse,
} from "@/lib/auth-api";
import { getOrganizationContext } from "@/lib/auth";

export async function GET() {
  const { supabase, user } = await getAuthenticatedSupabase();
  if (!supabase || !user) return unauthorizedResponse();

  const ctx = await getOrganizationContext();
  if (!ctx) {
    return NextResponse.json(
      { success: false, error: { code: "NO_ORG", message: "No organization" } },
      { status: 403 }
    );
  }

  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("location_id", ctx.locationId)
    .order("sort_order");

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    data,
    meta: { timestamp: new Date().toISOString(), version: "v1" },
  });
}

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
    const { data, error } = await supabase
      .from("menu_items")
      .insert({
        ...body,
        location_id: ctx.locationId,
        published_at: body.published_at ?? new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      {
        success: true,
        data,
        meta: { timestamp: new Date().toISOString(), version: "v1" },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Create failed";
    return NextResponse.json(
      { success: false, error: { code: "CREATE_FAILED", message } },
      { status: 400 }
    );
  }
}
