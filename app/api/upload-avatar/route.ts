import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase-admin";
import { validateUpload, IMAGE_UPLOAD_OPTIONS } from "@/lib/upload-validation";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!supabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const login = (session.user as { login?: string }).login ?? session.user.name ?? "unknown";

  let filename: string;
  let mimeType: string | undefined;
  let fileSize: number | undefined;
  try {
    const body = await req.json() as { filename?: string; mimeType?: string; fileSize?: number };
    filename = body.filename || "avatar.jpg";
    mimeType = typeof body.mimeType === "string" ? body.mimeType : undefined;
    fileSize = typeof body.fileSize === "number" ? body.fileSize : undefined;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const validation = validateUpload({ filename, mimeType, fileSize }, IMAGE_UPLOAD_OPTIONS);
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const timestamp = Date.now();
  const path = `${login}/${timestamp}_${validation.sanitizedFilename}`;

  const { data, error } = await supabaseAdmin.storage
    .from("avatars")
    .createSignedUploadUrl(path);

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Failed to create signed URL" }, { status: 500 });
  }

  const publicUrl = supabaseAdmin.storage.from("avatars").getPublicUrl(path).data.publicUrl;

  return NextResponse.json({ signedUrl: data.signedUrl, token: data.token, path, publicUrl });
}
