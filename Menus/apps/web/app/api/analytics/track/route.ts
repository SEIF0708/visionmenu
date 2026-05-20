import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { data, error } = await supabaseServer
      .from("analytics_events")
      .insert({
        menu_item_id: body.menuItemId,
        event_type: body.eventType,
        session_id: body.sessionId,
        user_agent: body.userAgent,
        device_type: body.deviceType,
        os: body.os,
        browser: body.browser,
        load_time_ms: body.loadTimeMs,
        model_load_time_ms: body.modelLoadTimeMs,
        country_code: body.countryCode,
        city: body.city,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error("Analytics track error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to track event" },
      { status: 500 }
    );
  }
}
