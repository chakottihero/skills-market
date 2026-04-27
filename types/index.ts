import type { ToolId } from "@/lib/tools";

export type { ToolId };
export type Tool = ToolId; // backward compat alias
export type Lang = "ja" | "en" | "zh";
export type Availability = "available" | "depends" | "busy";
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
  tool: Tool;                   // primary tool (for filter compat)
  compatible_tools: string[];   // all compatible tools
  category: string;             // category id e.g. "dev-tools"
  subcategory?: string;         // subcategory id e.g. "code-review"
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
  description: string;
}

export interface EducationEntry {
  school: string;
  major: string;
  period: string;
}

export interface AwardEntry {
  title: string;
  year: number;
  description: string;
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
  coverImage: string;
  catchphrase: string;
  bio: string;
  specialties: string[];
  supportedTools: string[];
  skills: string[];
  experience: {
    work: WorkEntry[];
    education: EducationEntry[];
    awards: AwardEntry[];
  };
  portfolio: PortfolioEntry[];
  availability: Availability;
  schedule: string;
  sns: {
    github: string;
    twitter: string;
    other: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UsersData {
  users: UserProfile[];
}
