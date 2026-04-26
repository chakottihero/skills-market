import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { readUsers, writeUsers, getUser, defaultProfile } from "@/lib/users";
import type { UserProfile } from "@/types";

type Params = { params: Promise<{ username: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { username } = await params;
  const profile = getUser(username);
  if (!profile) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ profile });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { username } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const login = (session.user as { login?: string }).login ?? session.user.name ?? "";
  if (login !== username) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json() as Partial<UserProfile>;
  const users = readUsers();
  const idx = users.findIndex((u) => u.username === username);

  if (idx === -1) {
    // 初回作成
    const profileUrl = (session.user as { profileUrl?: string }).profileUrl ?? `https://github.com/${login}`;
    const fresh = defaultProfile(login, session.user.name ?? login, session.user.image ?? "", profileUrl);
    const merged: UserProfile = { ...fresh, ...body, username, updatedAt: new Date().toISOString() };
    users.push(merged);
    writeUsers(users);
    return NextResponse.json({ profile: merged }, { status: 201 });
  }

  const updated: UserProfile = {
    ...users[idx],
    ...body,
    username,
    updatedAt: new Date().toISOString(),
  };
  users[idx] = updated;
  writeUsers(users);
  return NextResponse.json({ profile: updated });
}
