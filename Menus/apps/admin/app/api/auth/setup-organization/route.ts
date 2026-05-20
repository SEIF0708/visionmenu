import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUser, getOrganizationContext } from "@/lib/auth";
import { bootstrapOrganization } from "@/lib/organization-bootstrap";

const setupSchema = z.object({
  restaurantName: z.string().min(1).max(100),
});

export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const existing = await getOrganizationContext();
    if (existing) {
      return NextResponse.json({
        success: true,
        data: existing,
        message: "Organization already exists",
      });
    }

    const body = await request.json();
    const parsed = setupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Restaurant name is required" },
        { status: 400 }
      );
    }

    const admin = createAdminClient();
    const data = await bootstrapOrganization(
      admin,
      user.id,
      parsed.data.restaurantName
    );

    return NextResponse.json({ success: true, data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Setup failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
