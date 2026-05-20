import type { createAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";

type AdminClient = ReturnType<
  typeof import("@/lib/supabase/admin").createAdminClient
>;

async function uniqueOrgSlug(
  admin: AdminClient,
  baseSlug: string
): Promise<string> {
  let slug = baseSlug;
  let attempt = 0;

  while (attempt < 20) {
    const { data } = await admin
      .from("organizations")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (!data) return slug;
    attempt += 1;
    slug = `${baseSlug}-${attempt}`;
  }

  return `${baseSlug}-${Date.now()}`;
}

export async function bootstrapOrganization(
  admin: AdminClient,
  userId: string,
  restaurantName: string
) {
  const baseSlug = slugify(restaurantName);
  const orgSlug = await uniqueOrgSlug(admin, baseSlug);

  const { data: org, error: orgError } = await admin
    .from("organizations")
    .insert({
      name: restaurantName,
      slug: orgSlug,
      plan_tier: "free",
    })
    .select("id, slug")
    .single();

  if (orgError || !org) {
    throw new Error(orgError?.message ?? "Failed to create organization");
  }

  const { data: location, error: locError } = await admin
    .from("locations")
    .insert({
      organization_id: org.id,
      name: restaurantName,
      slug: orgSlug,
      is_active: true,
    })
    .select("id, slug")
    .single();

  if (locError || !location) {
    await admin.from("organizations").delete().eq("id", org.id);
    throw new Error(locError?.message ?? "Failed to create location");
  }

  const { error: roleError } = await admin.from("user_roles").insert({
    user_id: userId,
    organization_id: org.id,
    role: "owner",
  });

  if (roleError) {
    await admin.from("locations").delete().eq("id", location.id);
    await admin.from("organizations").delete().eq("id", org.id);
    throw new Error(roleError.message);
  }

  return {
    organizationId: org.id,
    organizationSlug: org.slug,
    locationId: location.id,
    locationSlug: location.slug,
  };
}
