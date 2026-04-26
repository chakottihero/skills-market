export type Tool = "claude-code" | "cursor" | "copilot" | "codex" | "other";
export type Lang = "ja" | "en" | "zh";

export interface Author {
  name: string;
  githubUrl: string;
  avatar: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number; // 0 = free
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
