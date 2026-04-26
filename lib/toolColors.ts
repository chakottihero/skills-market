import type { Tool } from "@/types";

export const toolColors: Record<Tool, { bg: string; text: string; label: string }> = {
  "claude-code": { bg: "#8B5CF6", text: "#ffffff", label: "Claude Code" },
  cursor: { bg: "#3B82F6", text: "#ffffff", label: "Cursor" },
  copilot: { bg: "#10B981", text: "#ffffff", label: "Copilot" },
  codex: { bg: "#F59E0B", text: "#ffffff", label: "Codex" },
  windsurf: { bg: "#06B6D4", text: "#ffffff", label: "Windsurf" },
  other: { bg: "#6B7280", text: "#ffffff", label: "Other" },
};
