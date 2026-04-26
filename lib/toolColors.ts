import type { Tool } from "@/types";

export const toolColors: Record<Tool, { bg: string; text: string; label: string }> = {
  "claude-code": { bg: "#ea580c", text: "#ffffff", label: "Claude Code" },
  cursor:        { bg: "#7c3aed", text: "#ffffff", label: "Cursor" },
  copilot:       { bg: "#16a34a", text: "#ffffff", label: "GitHub Copilot" },
  windsurf:      { bg: "#2563eb", text: "#ffffff", label: "Windsurf" },
  cline:         { bg: "#ca8a04", text: "#ffffff", label: "Cline" },
  "roo-code":    { bg: "#dc2626", text: "#ffffff", label: "Roo Code" },
  aider:         { bg: "#4b5563", text: "#ffffff", label: "Aider" },
  other:         { bg: "#64748b", text: "#ffffff", label: "Other" },
};
