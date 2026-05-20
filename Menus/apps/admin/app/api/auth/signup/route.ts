import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { signupSchema } from "@ar-menu/shared";
import { bootstrapOrganization } from "@/lib/organization-bootstrap";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password, name, restaurantName } = parsed.data;
    const admin = createAdminClient();

    const { data: authData, error: authError } =
      await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: name },
      });

    if (authError || !authData.user) {
      return NextResponse.json(
        { success: false, error: authError?.message ?? "Failed to create user" },
        { status: 400 }
      );
    }

    const userId = authData.user.id;

    try {
      const data = await bootstrapOrganization(admin, userId, restaurantName);
      return NextResponse.json({ success: true, data });
    } catch (bootstrapErr) {
      await admin.auth.admin.deleteUser(userId);
      const message =
        bootstrapErr instanceof Error ? bootstrapErr.message : "Setup failed";
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Signup failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
