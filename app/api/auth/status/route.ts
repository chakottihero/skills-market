import { NextResponse } from "next/server";
import { isOAuthConfigured } from "@/lib/auth";

export async function GET() {
  return NextResponse.json({ configured: isOAuthConfigured });
}
