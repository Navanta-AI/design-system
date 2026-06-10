import type { ReactNode } from "react";
import type { CellLayout } from "./DataTable";

export type SortDirection = "asc" | "desc";

export interface SortState {
  field: string | null;
  dir: SortDirection;
}

export interface CellContext<T> {
  row: T;
  index: number;
  isSelected: boolean;
}

export interface HeaderContext {
  sort: SortState;
}

/**
 * Declarative column — single source of truth for a column's header + body
 * cell. (Declarative `DataTable`; distinct from the compound `Table`.)
 */
export interface Column<T> {
  key: string;
  label: string;
  description?: string;
  /** Pinned visible; cannot be hidden. */
  alwaysVisible?: boolean;
  /** Click header to fire onSortChange. */
  sortable?: boolean;
  /** Server sort token. Defaults to `key`. */
  sortKey?: string;
  /**
   * Fixed width. A number is px; a `"NN%"` string is emitted verbatim into the
   * `<colgroup>` so proportional layouts reproduce exactly. Omit to flex.
   */
  width?: number | `${number}%`;
  /** Minimum px width for a flex-fit column. Ignored when `width` is set. */
  minWidth?: number;
  /** Maximum px width for a flex-fit column. Ignored when `width` is set. */
  maxWidth?: number;
  align?: "left" | "right" | "center";
  /** Render the body cell. REQUIRED — no column ships without data. */
  cell: (row: T, ctx: CellContext<T>) => ReactNode;
  /** Optional custom header content. Defaults to label + sort caret. */
  headerCell?: (ctx: HeaderContext) => ReactNode;
  cellClassName?: string | ((row: T) => string);
  headerClassName?: string;
  cellLayout?: CellLayout;
  wrapLines?: 1 | 2;
  /**
   * Which side of the label the sort caret sits on. Right-aligned numeric
   * headers often want the caret BEFORE the label. Defaults to "trailing".
   */
  caretSide?: "trailing" | "leading";
}

export interface SlotHeaderContext<T> {
  rows: T[];
  allSelected: boolean;
  someSelected: boolean;
}

/**
 * A non-data column rendered before/after data columns — checkboxes,
 * star/watchlist buttons, expand chevrons, action menus, etc.
 */
export interface SlotColumn<T> {
  id: string;
  width: number;
  header?: (ctx: SlotHeaderContext<T>) => ReactNode;
  cell: (row: T, ctx: CellContext<T>) => ReactNode;
  headerClassName?: string;
  cellClassName?: string;
  /** When true (default), clicks inside the slot cell don't bubble to onRowClick. */
  stopRowClick?: boolean;
}

export interface SelectionConfig<T> {
  selected: Set<string>;
  onToggleRow: (id: string) => void;
  onToggleAll: () => void;
  isRowDisabled?: (row: T) => boolean;
}

/**
 * Grouped rendering. When `DataTable` receives `groups`, it renders one table
 * with a shared `<colgroup>` (so every group's columns align), and per group a
 * full-width header band row followed by that group's rows. Mutually exclusive
 * with `data`. Enables vendor-grouped / sectioned tables without a second
 * component.
 */
export interface GroupConfig<T> {
  key: string;
  /** Full-width band rendered above the group's rows (spans all columns). */
  header: ReactNode | ((ctx: { rows: readonly T[] }) => ReactNode);
  rows: readonly T[];
  /** Extra className on the band's `<td>`. */
  headerClassName?: string;
}

/**
 * Purely-visual knobs that let one DataTable reproduce different house styles
 * without forking. Every field is optional and defaults to the DS house style;
 * a consuming app (e.g. wb-fe) overrides these to hit pixel parity with an
 * existing bespoke design.
 */
export interface DataTableAppearance {
  /** Horizontal padding (px) for body cells. Default 12. */
  cellPaddingX?: number;
  /** Horizontal padding (px) for header cells. Default 12. */
  headerPaddingX?: number;
  /** Row bottom-border color token. Default `var(--border-light)`. */
  rowBorderColor?: string;
  /** Row hover background token. Default `var(--muted)`. */
  rowHoverBg?: string;
  /**
   *   • "default" — transparent header.
   *   • "filled"  — flat band (`headerBg`).
   *   • "capsule" — rounded `headerBg` band with `headerRadius` on the first
   *     and last header cells (sticky).
   */
  headerVariant?: "default" | "filled" | "capsule";
  /** Background for "filled"/"capsule" header. Default `var(--muted)`. */
  headerBg?: string;
  /** Corner radius (px) for the "capsule" header's outer cells. Default 8. */
  headerRadius?: number;
}
