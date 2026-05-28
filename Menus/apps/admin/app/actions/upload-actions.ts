"use server";

import { getAuthenticatedSupabase } from "@/lib/auth-api";
import { uploadModelFile } from "@/lib/upload-handler";

export async function uploadModelAction(formData: FormData) {
  const { supabase, user } = await getAuthenticatedSupabase();
  if (!supabase || !user) {
    return { success: false, error: "Unauthorized" };
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return { success: false, error: "No file provided" };
  }

  try {
    const result = await uploadModelFile(file);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Upload failed" };
  }
}
