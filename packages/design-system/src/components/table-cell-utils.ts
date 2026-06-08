/* ─────────────────────────────────────────────
 *  Table cell helpers — status registry + date/relative-time formatting
 *  Shared by the Table.Cell `variant` renderers (id / party / status / date / input).
 * ───────────────────────────────────────────── */

/** Visual tone of a status — maps to a DS color token for the progress dots. */
export type TableStatusTone = "success" | "warning" | "danger" | "neutral";

/** A status definition: how many steps, how many are complete, tone, and label. */
export interface TableStatusDef {
  /** Total number of progress dots (the lifecycle length). */
  steps: number;
  /** How many dots are filled. */
  completed: number;
  /** Dot color tone. */
  tone: TableStatusTone;
  /** Human-readable label shown beneath the dots. */
  label: string;
}

/**
 * Canonical order-lifecycle statuses (seeded from the HMTX Portal design — a
 * 4-step flow: Open → In Process → Shipped → Delivered, plus off-track states).
 * Per-row `tone` can still be overridden on the cell. Extend this map to add
 * statuses; keep `steps` consistent within a given lifecycle.
 */
export const TABLE_STATUSES = {
  open: { steps: 4, completed: 1, tone: "success", label: "Open" },
  "in-process": { steps: 4, completed: 2, tone: "success", label: "In Process" },
  shipped: { steps: 4, completed: 3, tone: "success", label: "Shipped" },
  delivered: { steps: 4, completed: 4, tone: "success", label: "Delivered" },
  "on-hold": { steps: 4, completed: 2, tone: "warning", label: "On Hold" },
  delayed: { steps: 4, completed: 2, tone: "warning", label: "Delayed" },
  cancelled: { steps: 4, completed: 0, tone: "danger", label: "Cancelled" },
} satisfies Record<string, TableStatusDef>;

export type TableStatusKey = keyof typeof TABLE_STATUSES;

/** Filled-dot color per tone, resolved to a DS token. */
export const statusToneColor: Record<TableStatusTone, string> = {
  success: "var(--success)",
  warning: "var(--warning)",
  danger: "var(--destructive)",
  neutral: "var(--text-neutral)",
};

/** "Mar 03, 2026" */
export function formatTableDate(value: Date | string | number): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

const UNITS: { limit: number; secs: number; one: string; many: string }[] = [
  { limit: 60, secs: 1, one: "sec", many: "secs" },
  { limit: 3600, secs: 60, one: "min", many: "mins" },
  { limit: 86400, secs: 3600, one: "hour", many: "hours" },
  { limit: 604800, secs: 86400, one: "day", many: "days" },
  { limit: 2629800, secs: 604800, one: "week", many: "weeks" },
  { limit: 31557600, secs: 2629800, one: "month", many: "months" },
  { limit: Infinity, secs: 31557600, one: "year", many: "years" },
];

/**
 * Relative time matching the design style: past → "5 mins ago",
 * future → "in 2 days". `now` is injectable for deterministic rendering/tests.
 */
export function formatRelativeTime(
  value: Date | string | number,
  now: Date | number = new Date(),
): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const nowMs = now instanceof Date ? now.getTime() : now;
  const diffSec = Math.round((date.getTime() - nowMs) / 1000);
  const abs = Math.abs(diffSec);

  if (abs < 30) return "just now";

  const unit = UNITS.find((u) => abs < u.limit) ?? UNITS[UNITS.length - 1];
  const count = Math.max(1, Math.round(abs / unit.secs));
  const label = count === 1 ? unit.one : unit.many;

  return diffSec < 0 ? `${count} ${label} ago` : `in ${count} ${label}`;
}
