export type ToolId =
  | "claude-code"
  | "cursor"
  | "copilot"
  | "windsurf"
  | "cline"
  | "roo-code"
  | "aider"
  | "other";

export interface ToolDef {
  id: ToolId;
  name: string;
  badgeClass: string;
}

export const TOOLS: ToolDef[] = [
  { id: "claude-code", name: "Claude Code",    badgeClass: "bg-orange-100 text-orange-800" },
  { id: "cursor",      name: "Cursor",          badgeClass: "bg-purple-100 text-purple-800" },
  { id: "copilot",     name: "GitHub Copilot",  badgeClass: "bg-green-100 text-green-800" },
  { id: "windsurf",    name: "Windsurf",         badgeClass: "bg-blue-100 text-blue-800" },
  { id: "cline",       name: "Cline",            badgeClass: "bg-yellow-100 text-yellow-800" },
  { id: "roo-code",    name: "Roo Code",         badgeClass: "bg-red-100 text-red-800" },
  { id: "aider",       name: "Aider",            badgeClass: "bg-gray-100 text-gray-800" },
  { id: "other",       name: "その他",            badgeClass: "bg-slate-100 text-slate-800" },
];

export const TOOL_MAP = Object.fromEntries(
  TOOLS.map((t) => [t.id, t])
) as Record<ToolId, ToolDef>;

export function getToolName(id: string): string {
  return TOOL_MAP[id as ToolId]?.name ?? id;
}

export function getToolBadgeClass(id: string): string {
  return TOOL_MAP[id as ToolId]?.badgeClass ?? "bg-slate-100 text-slate-800";
}
