import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;
  return user;
}

export async function requireUser() {
  const user = await getUser();
  if (!user) redirect("/login");
  return user;
}

export type OrganizationContext = {
  organizationId: string;
  organizationName: string;
  organizationSlug: string;
  locationId: string;
  locationSlug: string;
  role: string;
};

export async function getOrganizationContext(): Promise<OrganizationContext | null> {
  const supabase = await createClient();
  const user = await getUser();
  if (!user) return null;

  const { data: roleRow, error: roleError } = await supabase
    .from("user_roles")
    .select("role, organization_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (roleError || !roleRow) return null;

  const { data: org, error: orgError } = await supabase
    .from("organizations")
    .select("id, name, slug")
    .eq("id", roleRow.organization_id)
    .single();

  if (orgError || !org) return null;

  const { data: location, error: locError } = await supabase
    .from("locations")
    .select("id, slug")
    .eq("organization_id", roleRow.organization_id)
    .eq("is_active", true)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (locError || !location) return null;

  return {
    organizationId: org.id,
    organizationName: org.name,
    organizationSlug: org.slug,
    locationId: location.id,
    locationSlug: location.slug,
    role: roleRow.role,
  };
}

export async function requireOrganizationContext() {
  const ctx = await getOrganizationContext();
  if (!ctx) redirect("/dashboard/setup");
  return ctx;
}
