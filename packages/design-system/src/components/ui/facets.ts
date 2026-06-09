import type { ReactNode } from "react";
import type { PillProps } from "../Pill";

/**
 * Unified filter vocabulary for TableShell — search + dropdowns + toggle chips +
 * insight filters expressed as ONE list of facets. A discriminated union on
 * `kind` keeps each facet self-documenting and makes a boolean insight a
 * first-class primitive. The consumer declares their "top" task-oriented slices
 * as data: array order = display order, `promoted` decides inline vs. the
 * "More filters" overflow. Adding an arbitrary insight (e.g. "High demand",
 * "This week") — even a Christy-recommended one — is one more object here, with
 * zero TableShell changes.
 */

interface FacetBase {
  /** Unique key — React key + identity + active-count bookkeeping. */
  key: string;
  /** Dimension name, e.g. "Status", "Priority", or an insight label "High demand". */
  label: ReactNode;
  /** Optional leading glyph (Phosphor duotone, to match Pill). */
  icon?: ReactNode;
  /** TRUE = surface inline in the filter band; falsy = lives in the "More filters" popover. */
  promoted?: boolean;
  /** Popover section header, e.g. 'Status' | 'Due date' | 'Insights'. */
  group?: string;
}

export interface FacetOption {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
  count?: number;
  /** Pill semantic color when this option is active. */
  variant?: PillProps["variant"];
}

/** (a) Single-select dropdown (Status, Due date) — reuses the DS `Select` unmodified. */
export interface SelectFacet extends FacetBase {
  kind: "select";
  options: FacetOption[];
  /** Selected value, or `null` when cleared/inactive. */
  value: string | null;
  onChange: (value: string | null) => void;
  /** Label for the "any value" / cleared entry (e.g. "All statuses"). */
  placeholder?: string;
}

/** (b) Multi-select chip group (Priority) — reuses the existing `aria-pressed` chips. */
export interface ToggleGroupFacet extends FacetBase {
  kind: "toggle-group";
  options: FacetOption[];
  /** Selected values; `[]` = inactive. */
  value: string[];
  onChange: (next: string[]) => void;
}

/** (c) Boolean insight facet (High demand, This week) — the extensibility primitive. */
export interface ToggleFacet extends FacetBase {
  kind: "toggle";
  /** Tonal fill when active. */
  variant?: PillProps["variant"];
  count?: number;
  active: boolean;
  onToggle: () => void;
}

export type FilterFacet = SelectFacet | ToggleGroupFacet | ToggleFacet;

/** How many values a facet currently has applied (drives the badge + Clear all). */
export function facetActiveCount(f: FilterFacet): number {
  switch (f.kind) {
    case "select":
      return f.value != null && f.value !== "" ? 1 : 0;
    case "toggle-group":
      return f.value.length;
    case "toggle":
      return f.active ? 1 : 0;
  }
}

/** Clear a single facet back to its inactive state. */
export function resetFacet(f: FilterFacet): void {
  switch (f.kind) {
    case "select":
      f.onChange(null);
      break;
    case "toggle-group":
      f.onChange([]);
      break;
    case "toggle":
      if (f.active) f.onToggle();
      break;
  }
}

/** Total applied values across all facets. */
export function facetsActiveCount(facets: FilterFacet[]): number {
  return facets.reduce((n, f) => n + facetActiveCount(f), 0);
}
