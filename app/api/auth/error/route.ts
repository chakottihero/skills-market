import { NextRequest, NextResponse } from "next/server";

// App Router では具体的なルートがキャッチオールより優先される。
// NextAuth の [...nextauth] より先にここで /api/auth/error を捕捉し、
// カスタムエラーページへリダイレクトする。
export function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const error = searchParams.get("error") ?? "";
  const url = new URL(`/auth/error`, req.url);
  if (error) url.searchParams.set("error", error);
  return NextResponse.redirect(url);
}
