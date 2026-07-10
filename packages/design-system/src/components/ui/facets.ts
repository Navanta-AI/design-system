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

/** (b2) Multi-select DROPDOWN (Vendor, Status) — same value shape as a
 *  toggle-group, but rendered as ONE inline dropdown (a checkbox list behind a
 *  single trigger) instead of a chip per option. So it stays inline like a
 *  `select` and counts as one control against the inline limit. */
export interface MultiSelectFacet extends FacetBase {
  kind: "multi-select";
  options: FacetOption[];
  /** Selected values; `[]` = inactive. */
  value: string[];
  onChange: (next: string[]) => void;
  /** Trigger text when nothing is selected (e.g. "Any status"). */
  placeholder?: string;
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

export type FilterFacet = SelectFacet | ToggleGroupFacet | MultiSelectFacet | ToggleFacet;

/** How many values a facet currently has applied (drives the badge + Clear all). */
export function facetActiveCount(f: FilterFacet): number {
  switch (f.kind) {
    case "select":
      return f.value != null && f.value !== "" ? 1 : 0;
    case "toggle-group":
    case "multi-select":
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
    case "multi-select":
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

/** Clear every facet back to its inactive state (drives the "Clear all" action). */
export function clearAllFacets(facets: FilterFacet[]): void {
  facets.forEach(resetFacet);
}

/** A single applied filter, shown as a removable chip in the applied-filters bar. */
export interface AppliedFacetChip {
  /** Unique React key. */
  key: string;
  /** Chip text — the selected option's label (or the insight's label). */
  label: ReactNode;
  /** Dimension name (e.g. "Status") — for an optional prefix. */
  facetLabel: ReactNode;
  /** Remove just this value (leaves the facet's other selections intact). */
  onRemove: () => void;
}

/**
 * Flatten every active facet value into one removable chip each — a select's value,
 * each of a toggle-group's selected values, or an active boolean insight. Drives the
 * TableShell applied-filters bar so a selection made anywhere (a facet control OR a
 * DataTable `ColumnFilterMenu` bound to the same state) shows as a crossable chip.
 */
export function facetAppliedChips(facets: FilterFacet[]): AppliedFacetChip[] {
  const chips: AppliedFacetChip[] = [];
  for (const f of facets) {
    if (f.kind === "select") {
      if (f.value != null && f.value !== "") {
        const opt = f.options.find((o) => o.value === f.value);
        chips.push({
          key: f.key,
          label: opt?.label ?? f.value,
          facetLabel: f.label,
          onRemove: () => f.onChange(null),
        });
      }
    } else if (f.kind === "toggle-group" || f.kind === "multi-select") {
      for (const v of f.value) {
        const opt = f.options.find((o) => o.value === v);
        chips.push({
          key: `${f.key}:${v}`,
          label: opt?.label ?? v,
          facetLabel: f.label,
          onRemove: () => f.onChange(f.value.filter((x) => x !== v)),
        });
      }
    } else if (f.active) {
      chips.push({ key: f.key, label: f.label, facetLabel: f.label, onRemove: () => f.onToggle() });
    }
  }
  return chips;
}
