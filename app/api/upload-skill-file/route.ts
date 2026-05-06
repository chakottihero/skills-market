import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { validateUpload, SKILL_FILE_UPLOAD_OPTIONS } from "@/lib/upload-validation";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
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
    filename = body.filename || "SKILL.md";
    mimeType = typeof body.mimeType === "string" ? body.mimeType : undefined;
    fileSize = typeof body.fileSize === "number" ? body.fileSize : undefined;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const validation = validateUpload({ filename, mimeType, fileSize }, SKILL_FILE_UPLOAD_OPTIONS);
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const path = `${login}/${crypto.randomUUID()}.${validation.ext}`;

  const { data, error } = await supabaseAdmin.storage
    .from("skill-files")
    .createSignedUploadUrl(path);

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Failed to create upload URL." }, { status: 500 });
  }

  return NextResponse.json({ signedUrl: data.signedUrl, path });
}
