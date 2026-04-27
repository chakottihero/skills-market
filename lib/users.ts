import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type { UserProfile, UsersData } from "@/types";

const DATA_PATH = join(process.cwd(), "data", "users.json");

export function readUsers(): UserProfile[] {
  const raw = readFileSync(DATA_PATH, "utf-8");
  const data = JSON.parse(raw) as UsersData;
  return data.users;
}

export function writeUsers(users: UserProfile[]): void {
  const data: UsersData = { users };
  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export function getUser(username: string): UserProfile | undefined {
  return readUsers().find((u) => u.username === username);
}

export function defaultProfile(
  username: string,
  displayName: string,
  avatar: string,
  githubUrl: string
): UserProfile {
  return {
    username,
    displayName,
    avatar,
    coverImage: "",
    catchphrase: "",
    bio: "",
    specialties: [],
    tools: [],
    skillTags: [],
    career: { work: [], education: [], awards: [] },
    portfolio: [],
    availability: "available",
    schedule: "",
    sns: { github: githubUrl, twitter: "", website: "" },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
