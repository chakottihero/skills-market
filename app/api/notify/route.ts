import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "notifications.json");

interface Notification {
  email: string;
  skillId: string;
  createdAt: string;
}

function readNotifications(): Notification[] {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf-8")).notifications as Notification[];
  } catch {
    return [];
  }
}

function writeNotifications(list: Notification[]) {
  fs.writeFileSync(FILE, JSON.stringify({ notifications: list }, null, 2));
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const body = await req.json() as { email?: string; skillId?: string };
  const { email, skillId } = body;

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  if (!skillId) {
    return NextResponse.json({ error: "Missing skillId" }, { status: 400 });
  }

  const notifications = readNotifications();
  notifications.push({ email, skillId, createdAt: new Date().toISOString() });
  writeNotifications(notifications);

  return NextResponse.json({ success: true });
}
