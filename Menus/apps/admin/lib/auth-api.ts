import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function getAuthenticatedSupabase() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { supabase: null, user: null };
  }

  return { supabase, user };
}

export function unauthorizedResponse() {
  return NextResponse.json(
    { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
    { status: 401 }
  );
}
