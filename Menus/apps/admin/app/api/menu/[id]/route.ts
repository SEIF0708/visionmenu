import { NextResponse } from "next/server";
import {
  getAuthenticatedSupabase,
  unauthorizedResponse,
} from "@/lib/auth-api";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { supabase, user } = await getAuthenticatedSupabase();
  if (!supabase || !user) return unauthorizedResponse();

  const { id } = await params;
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { success: false, error: { code: "NOT_FOUND", message: "Menu item not found" } },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data,
    meta: { timestamp: new Date().toISOString(), version: "v1" },
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { supabase, user } = await getAuthenticatedSupabase();
  if (!supabase || !user) return unauthorizedResponse();

  const { id } = await params;
  try {
    const body = await request.json();
    const { data, error } = await supabase
      .from("menu_items")
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data,
      meta: { timestamp: new Date().toISOString(), version: "v1" },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Update failed";
    return NextResponse.json(
      { success: false, error: { code: "UPDATE_FAILED", message } },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { supabase, user } = await getAuthenticatedSupabase();
  if (!supabase || !user) return unauthorizedResponse();

  const { id } = await params;
  const { error } = await supabase.from("menu_items").delete().eq("id", id);

  if (error) {
    return NextResponse.json(
      { success: false, error: { code: "DELETE_FAILED", message: error.message } },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    meta: { timestamp: new Date().toISOString(), version: "v1" },
  });
}
