import type { ToolId } from "@/lib/tools";

export type { ToolId };
export type Tool = ToolId;
export type Lang = "ja" | "en" | "zh";
export type Availability = "available" | "busy" | "closed";
export type PriceType = "free" | "paid";

export interface Author {
  name: string;
  login: string;
  githubUrl: string;
  avatar: string;
}

export interface Product {
  id: string;
  title: string;
  title_en?: string;
  title_zh?: string;
  shortDescription: string;
  shortDescription_en?: string;
  shortDescription_zh?: string;
  description: string;
  description_en?: string;
  description_zh?: string;
  price: number;
  price_type: PriceType;
  tool: Tool;
  compatible_tools: string[];
  category: string;
  subcategory?: string;
  tags: string[];
  author: Author;
  content: string;
  repoUrl: string;
  stars?: number;
  purchases?: number;
  createdAt: string;
  lang: Lang;
}

export interface ProductsData {
  products: Product[];
}

// ── User Profile ──────────────────────────────────────────────────────────────

export interface WorkEntry {
  company: string;
  role: string;
  period: string;
}

export interface EducationEntry {
  school: string;
  detail: string;
  period: string;
}

export interface AwardEntry {
  title: string;
  year: string;
}

export interface PortfolioEntry {
  url: string;
  title: string;
  description: string;
}

export interface UserProfile {
  username: string;
  displayName: string;
  avatar: string;
  coverImage?: string;
  catchphrase: string;
  bio: string;
  specialties: string[];
  tools: string[];
  skillTags: string[];
  career: {
    work: WorkEntry[];
    education: EducationEntry[];
    awards: AwardEntry[];
  };
  portfolio: PortfolioEntry[];
  availability: Availability;
  schedule?: string;
  sns: {
    github?: string;
    twitter?: string;
    website?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UsersData {
  users: UserProfile[];
}

// ── Supabase Skill Row ────────────────────────────────────────────────────────

export interface SkillRow {
  id: string;
  title: string;
  title_en?: string;
  title_zh?: string;
  short_description: string;
  short_description_en?: string;
  short_description_zh?: string;
  description: string;
  description_en?: string;
  description_zh?: string;
  category: string;
  subcategory?: string;
  price_type: PriceType;
  price: number;
  tags: string[];
  compatible_tools: string[];
  skill_file_path?: string;
  seller_id: string;
  seller_name: string;
  seller_avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface PurchaseRow {
  id: string;
  skill_id: string;
  buyer_id: string;
  buyer_email?: string;
  stripe_session_id?: string;
  price: number;
  status: "pending" | "completed" | "failed";
  created_at: string;
  skills?: { title: string; price: number; category: string };
}

export interface DownloadRow {
  id: string;
  skill_id: string;
  user_id: string;
  created_at: string;
  skills?: { title: string; category: string };
}
