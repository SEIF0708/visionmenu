import { NextResponse } from "next/server";
import {
  getAuthenticatedSupabase,
  unauthorizedResponse,
} from "@/lib/auth-api";
import { uploadErrorResponse, uploadImageFile } from "@/lib/upload-handler";

export async function POST(request: Request) {
  const { supabase, user } = await getAuthenticatedSupabase();
  if (!supabase || !user) return unauthorizedResponse();

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    const result = await uploadImageFile(file);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (err) {
    const { message, status } = uploadErrorResponse(err);
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
