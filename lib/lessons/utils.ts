/**
 * Shared utility functions for lesson components.
 */

const STEP_COLORS = [
  { bg: "bg-cyan-500/10", border: "border-cyan-400/20", text: "text-cyan-500", badge: "bg-cyan-500/20 text-cyan-600 dark:text-cyan-400" },
  { bg: "bg-amber-500/10", border: "border-amber-400/20", text: "text-amber-500", badge: "bg-amber-500/20 text-amber-600 dark:text-amber-400" },
  { bg: "bg-emerald-500/10", border: "border-emerald-400/20", text: "text-emerald-500", badge: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" },
] as const;

/**
 * Returns a color scheme for a step based on its position.
 * First step = cyan, middle = amber, last = emerald.
 */
export function getStepColor(index: number, total: number) {
  if (total <= 1) return STEP_COLORS[2]; // single step = emerald (result)
  if (index === total - 1) return STEP_COLORS[2]; // last = emerald
  if (index === 0) return STEP_COLORS[0]; // first = cyan
  return STEP_COLORS[1]; // middle = amber
}

const OPERATOR_SYMBOLS: Record<string, string> = {
  "+": "+",
  "-": "\u2212",
  "*": "\u00d7",
  "/": "\u00f7",
};

/**
 * Returns the visual symbol for an operator.
 */
export function getOperatorSymbol(op: string): string {
  return OPERATOR_SYMBOLS[op] ?? op;
}
