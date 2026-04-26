export type Tool = "claude-code" | "cursor" | "copilot" | "codex" | "windsurf" | "other";
export type Lang = "ja" | "en" | "zh";
export type Availability = "available" | "depends" | "busy";

export interface Author {
  name: string;
  login: string;        // URL-safe username (GitHub login)
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
  tool: Tool;
  category: string;
  tags: string[];
  author: Author;
  content: string;
  repoUrl: string;
  stars: number;
  purchases: number;
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
  username: string;           // URL key (GitHub login)
  displayName: string;
  avatar: string;
  coverImage: string;
  catchphrase: string;
  bio: string;               // Markdown
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
