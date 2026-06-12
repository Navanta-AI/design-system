"use client";

import { Fragment, useState, type ReactNode } from "react";
import { MagnifyingGlass, GearSix, X, Funnel, CaretDown, DotsSixVertical } from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../Select";
import { Pagination } from "../Pagination";
import { Input } from "../Input";
import { Button } from "../Button";
import { Switch } from "../Switch";
import { Tabs, type TabItem } from "../Tabs";
import { type PillProps } from "../Pill";
import { Chip } from "../Chip";
import { Popover } from "./Popover";
import {
  type FilterFacet,
  type SelectFacet,
  type ToggleGroupFacet,
  facetsActiveCount,
} from "./facets";

export interface ActiveFilter {
  /** Unique key for this filter (used as React key). */
  key: string;
  /** Filter category label, e.g. "Status". */
  label: string;
  /** The selected value displayed in the pill, e.g. "Active". */
  value: string;
  /** Called when the user removes this pill. */
  onRemove: () => void;
}

/**
 * An "open filter" chip — a pill-style toggle shown inline in the toolbar as an
 * always-visible alternative to a filter dropdown. When active it adopts the
 * matching Pill semantic color; inactive it's a neutral outline. The DS consumer
 * decides what the chips filter on (priority, status, owner, …).
 */
export interface FilterChip {
  /** Unique key (React key + identity). */
  key: string;
  /** Chip label. */
  label: ReactNode;
  /** Pill semantic color applied when the chip is active. Defaults to neutral. */
  variant?: PillProps["variant"];
  /** Optional leading icon (duotone Phosphor glyph, to match Pill). */
  icon?: ReactNode;
  /** Optional count shown after the label. */
  count?: number;
  /** Whether this chip is currently selected. */
  active: boolean;
  /** Toggle handler. */
  onToggle: () => void;
}

/**
 * A customizable table column. Pass `columns` to TableShell to get the built-in
 * Customize popover (show/hide + drag-reorder); reflect the resulting order and
 * `hidden` flags when you render the table's header + cells.
 */
export interface TableColumn {
  /** Stable key (matches the cell/header you render for this column). */
  key: string;
  /** Display name shown in the Customize list. */
  label: string;
  /** Can the user hide this column? Default true. `false` = always shown. */
  hideable?: boolean;
  /** Currently hidden (controlled). */
  hidden?: boolean;
}

/* ── Unified filter band helpers (facets API) ─────────────────────────────── */

/** Sentinel for a select facet's "cleared" entry — a non-empty value so the DS
 *  Select collects it (it skips falsy values), keeping it keyboard-navigable and
 *  letting the trigger show the placeholder label. Mapped back to null on change. */
const FACET_CLEAR = "__all__";

/** Search field shared by the legacy toolbar and the unified facet band. */
function FacetSearch({
  value,
  onChange,
  placeholder,
}: {
  value?: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  // Figma search spec (Iris-Shareable 449-4173): rounded-8 box, regular-weight
  // trailing magnifier, light neutral-400 placeholder. Fixed width via the
  // --table-search-width DS token (capped to the container on narrow screens).
  return (
    <div className="w-[var(--table-search-width)] max-w-full shrink-0">
      <Input
        size="md"
        type="search"
        className="w-full rounded-[8px] placeholder:text-[var(--text-neutral)]"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        clearable
        onClear={() => onChange("")}
        iconRight={<MagnifyingGlass weight="regular" />}
      />
    </div>
  );
}

/** Multi-select chip group — one DS `Chip` per option. */
function ToggleGroupChips({ facet }: { facet: ToggleGroupFacet }) {
  const toggle = (val: string) => {
    const on = facet.value.includes(val);
    facet.onChange(on ? facet.value.filter((v) => v !== val) : [...facet.value, val]);
  };
  return (
    <>
      {facet.options.map((opt) => (
        <Chip
          key={opt.value}
          selected={facet.value.includes(opt.value)}
          variant={opt.variant}
          icon={opt.icon}
          count={opt.count}
          onClick={() => toggle(opt.value)}
        >
          {opt.label}
        </Chip>
      ))}
    </>
  );
}

/** Single-select dropdown — reuses the DS `Select` unmodified (null ↔ "" bridge). */
function FacetSelectControl({ facet }: { facet: SelectFacet }) {
  const placeholder = facet.placeholder ?? "All";
  return (
    <Select
      value={facet.value ?? FACET_CLEAR}
      onValueChange={(v) => facet.onChange(v === FACET_CLEAR ? null : v)}
    >
      <SelectTrigger size="md" className="w-auto min-w-[120px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={FACET_CLEAR}>{placeholder}</SelectItem>
        {facet.options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/** Render one promoted facet inline in the band. */
function InlineFacet({ facet }: { facet: FilterFacet }) {
  switch (facet.kind) {
    case "select":
      return <FacetSelectControl facet={facet} />;
    case "toggle-group":
      return (
        <div
          role="group"
          aria-label={typeof facet.label === "string" ? facet.label : undefined}
          className="flex items-center gap-1.5"
        >
          {facet.label != null && (
            <span className="text-[13px] font-medium text-[var(--text-secondary)]">{facet.label}</span>
          )}
          <ToggleGroupChips facet={facet} />
        </div>
      );
    case "toggle":
      return (
        <Chip
          selected={facet.active}
          variant={facet.variant}
          icon={facet.icon}
          count={facet.count}
          onClick={facet.onToggle}
        >
          {facet.label}
        </Chip>
      );
  }
}

/** Contents of the "More filters" popover — facets sectioned by `group`. */
function MoreFiltersContent({ facets }: { facets: FilterFacet[] }) {
  const groups: { group: string; facets: FilterFacet[] }[] = [];
  for (const f of facets) {
    const g = f.group ?? "Filters";
    const bucket = groups.find((x) => x.group === g);
    if (bucket) bucket.facets.push(f);
    else groups.push({ group: g, facets: [f] });
  }
  return (
    <div className="flex min-w-[240px] flex-col gap-3">
      {groups.map(({ group, facets: fs }) => (
        <div key={group} className="flex flex-col gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
            {group}
          </span>
          {fs.map((f) => (
            <div key={f.key} className="flex flex-col gap-1.5">
              {f.kind !== "toggle" && (
                <span className="text-[12px] text-[var(--text-secondary)]">{f.label}</span>
              )}
              {f.kind === "select" && <FacetSelectControl facet={f} />}
              {f.kind === "toggle-group" && (
                <div className="flex flex-wrap gap-1.5">
                  <ToggleGroupChips facet={f} />
                </div>
              )}
              {f.kind === "toggle" && (
                <Chip
                  selected={f.active}
                  variant={f.variant}
                  icon={f.icon}
                  count={f.count}
                  onClick={f.onToggle}
                >
                  {f.label}
                </Chip>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/** Built-in Customize popover content — per-column show/hide (Switch) + drag-reorder. */
function ColumnCustomizeList({
  columns,
  onChange,
}: {
  columns: TableColumn[];
  onChange?: (columns: TableColumn[]) => void;
}) {
  const [dragKey, setDragKey] = useState<string | null>(null);
  const toggle = (key: string) =>
    onChange?.(columns.map((c) => (c.key === key ? { ...c, hidden: !c.hidden } : c)));
  const reorder = (fromKey: string, toKey: string) => {
    if (fromKey === toKey) return;
    const next = [...columns];
    const from = next.findIndex((c) => c.key === fromKey);
    const to = next.findIndex((c) => c.key === toKey);
    if (from < 0 || to < 0) return;
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange?.(next);
  };
  return (
    <div className="flex w-[244px] flex-col gap-0.5">
      <span className="px-1 pb-1.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
        Customize columns
      </span>
      {columns.map((c) => (
        <div
          key={c.key}
          draggable
          onDragStart={() => setDragKey(c.key)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => {
            if (dragKey) reorder(dragKey, c.key);
            setDragKey(null);
          }}
          onDragEnd={() => setDragKey(null)}
          className={`flex items-center gap-2 rounded-md px-1 py-1.5 transition-colors hover:bg-[var(--surface-hover)] ${dragKey === c.key ? "opacity-50" : ""}`}
        >
          <span className="cursor-grab text-[var(--text-neutral)] [&>svg]:size-4" aria-hidden="true">
            <DotsSixVertical weight="bold" />
          </span>
          <span className="flex-1 truncate text-[13px] text-[var(--text-primary)]">{c.label}</span>
          <Switch
            checked={!c.hidden}
            disabled={c.hideable === false}
            onCheckedChange={() => toggle(c.key)}
          />
        </div>
      ))}
    </div>
  );
}

/** Number of visible filter controls a facet renders inline (a multi-select group
 *  shows one chip per option, so it counts as its option count). */
function facetWeight(f: FilterFacet): number {
  return f.kind === "toggle-group" ? f.options.length : 1;
}

/** Promoted facets render inline until the running CONTROL count reaches `maxInline`
 *  (counting each option of a toggle-group); the rest overflow into "More filters".
 *  Order-preserving: once a promoted facet doesn't fit, it and the remaining promoted
 *  facets demote, so inline order always matches the array order. */
function splitFacets(
  facets: FilterFacet[],
  maxInline: number,
): { inline: FilterFacet[]; overflow: FilterFacet[] } {
  const inline: FilterFacet[] = [];
  const overflow: FilterFacet[] = [];
  let used = 0;
  let full = false;
  for (const f of facets) {
    if (!full && f.promoted && used + facetWeight(f) <= maxInline) {
      inline.push(f);
      used += facetWeight(f);
    } else {
      overflow.push(f);
      if (f.promoted) full = true;
    }
  }
  return { inline, overflow };
}

/* ─────────────────────────────────────────────
 *  TableShell — the standard table chrome.
 *
 *    ┌─ heading (title + Customize)         ─┐
 *    ├─ toolbar (search + filters)           │
 *    ├─ tabs (optional, count badges)        │
 *    │  <table> children                     │
 *    └─ footer (count, pagination, size)    ─┘
 *
 *  Empty / no-results handling is INTEGRAL: pass `emptyState` (no data) and/or
 *  `noResultsState` (with `isFiltered`) and TableShell paints the screen centered
 *  in the body with the column headers still visible — render just the header (no
 *  rows) in `children` when `totalItems === 0`. (The lower-level `<Table.Empty>` is
 *  still available for fully custom bodies.)
 * ───────────────────────────────────────────── */

interface TableShellProps {
  /** Table title. */
  title: string;
  /** Phosphor icon rendered duotone next to the title. */
  icon?: Icon;
  /** Total (filtered) item count — drives pagination + the footer count. */
  totalItems: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];

  /** Built-in search — providing `onSearchChange` renders the toolbar search field. */
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  /** Filter controls rendered at the right of the toolbar (e.g. Select dropdowns). */
  filters?: ReactNode;
  /** Active filters displayed as removable pills below the toolbar. */
  activeFilters?: ActiveFilter[];
  /** Called when the user clicks "Clear all" on the active filter pills. */
  onClearAllFilters?: () => void;

  /** Open filter chips (pill-style toggles) — an always-visible row of quick
      filters, shown below the toolbar as an alternative to a filter dropdown.
      @deprecated Prefer `facets` (a `toggle-group` facet). Still supported. */
  filterChips?: FilterChip[];
  /** Optional leading label for the filter chip row (e.g. "Priority"). */
  filterChipsLabel?: ReactNode;

  /** Unified filter model — search + dropdowns + toggle chips + insight filters as
      ONE band. When provided, it renders the single unified filter band and the
      legacy `filters` / `filterChips` / `activeFilters` props are ignored (facets
      wins). Saved-view `tabs` remain a separate axis. */
  facets?: FilterFacet[];
  /** Max inline filter CONTROLS before the rest auto-demote into the "More filters"
      dropdown. A multi-select group counts as one control per option. Default 5. */
  maxInlineChips?: number;
  /** Trigger label for the overflow popover. Default "More filters". */
  moreFiltersLabel?: ReactNode;

  /** Tabs row for quick filtering (count badges supported via TabItem.badge). */
  tabs?: TabItem[];
  activeTab?: string;
  onTabChange?: (id: string) => void;

  /** The "Customize" action (gear) is an integral part of the heading and is shown
      by DEFAULT. Set `customize={false}` to omit it. */
  customize?: boolean;
  /** Handler for the Customize action. Used only when `columns` is NOT provided —
      otherwise the button opens the built-in column-customize popover. */
  onCustomize?: () => void;
  customizeLabel?: string;
  /** Column definitions for the built-in Customize popover (show/hide + drag-reorder).
      When provided, the Customize button opens that popover; reflect the resulting
      order and `hidden` flags when you render the table header + cells. */
  columns?: TableColumn[];
  /** Called when columns are toggled/reordered in the Customize popover. */
  onColumnsChange?: (columns: TableColumn[]) => void;

  /** Extra header slot rendered above the table body (filter chips, banners, …). */
  header?: ReactNode;

  /** Empty state shown centered in the body when `totalItems === 0` and NOT filtered
      (no data yet). Pass an `<EmptyState>` (or any node); TableShell keeps the column
      headers visible and centers it — no manual `<Table.Empty>` needed. */
  emptyState?: ReactNode;
  /** Shown instead of `emptyState` when `isFiltered` and `totalItems === 0`
      (search/filters returned nothing). Falls back to `emptyState` if omitted. */
  noResultsState?: ReactNode;
  /** Whether search/filters are active — selects `noResultsState` over `emptyState`. */
  isFiltered?: boolean;

  /** The table content — a `<Table>` with its header + rows. When `totalItems === 0`,
      render just the header (no rows); TableShell paints the empty/no-results screen. */
  children: ReactNode;
  className?: string;
}

export function TableShell({
  title,
  icon: TitleIcon,
  totalItems,
  currentPage,
  onPageChange,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50],
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search",
  filters,
  activeFilters,
  onClearAllFilters,
  filterChips,
  filterChipsLabel,
  facets,
  maxInlineChips = 5,
  moreFiltersLabel = "More filters",
  tabs,
  activeTab,
  onTabChange,
  customize = true,
  onCustomize,
  customizeLabel = "Customize",
  columns,
  onColumnsChange,
  header,
  emptyState,
  noResultsState,
  isFiltered,
  children,
  className = "",
}: TableShellProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const rangeStart = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const rangeEnd = Math.min(safePage * pageSize, totalItems);

  const facetList = facets ?? [];
  const hasFacets = facetList.length > 0;
  const hasToolbar = Boolean(onSearchChange || filters);
  const { inline: inlineFacets, overflow: overflowFacets } = splitFacets(facetList, maxInlineChips);
  const overflowActive = facetsActiveCount(overflowFacets);
  // Render chips (toggle / toggle-group) first, then dropdowns (selects) — stable sort.
  const orderedInline = [...inlineFacets].sort(
    (a, b) => (a.kind === "select" ? 1 : 0) - (b.kind === "select" ? 1 : 0),
  );

  // Integral empty handling: when there are no rows, TableShell paints the
  // empty/no-results screen itself (headers stay visible above it).
  const emptyNode =
    totalItems === 0
      ? (isFiltered ? noResultsState : emptyState) ?? emptyState ?? noResultsState ?? null
      : null;

  return (
    <div
      className={`flex flex-col bg-[var(--surface-base)] rounded-xl overflow-hidden ${className}`}
      style={{ boxShadow: "0 0 1px 0 rgba(0,0,0,0.25), 0 1px 4px 0 rgba(0,0,0,0.06)" }}
    >
      {/* Heading: title + Customize */}
      <div className="flex items-center justify-between gap-3 px-4 pt-4 pb-3 shrink-0">
        <div className="flex items-center gap-2">
          {TitleIcon && <TitleIcon size={14} weight="duotone" className="size-[14px] shrink-0 text-[var(--text-primary)]" />}
          {/* Heading uses the body-medium type style (14px / medium weight). */}
          <span className="text-[14px] font-medium leading-[1.4] text-[var(--text-primary)]">{title}</span>
        </div>
        {customize &&
          (columns ? (
            <Popover
              align="end"
              label="Customize columns"
              trigger={({ triggerProps }) => {
                const { ref, ...rest } = triggerProps;
                return (
                  <Button
                    ref={ref}
                    {...rest}
                    variant="ghost"
                    size="sm"
                    iconLeft={<GearSix size={16} weight="regular" />}
                  >
                    {customizeLabel}
                  </Button>
                );
              }}
            >
              <ColumnCustomizeList columns={columns} onChange={onColumnsChange} />
            </Popover>
          ) : (
            <Button variant="ghost" size="sm" iconLeft={<GearSix size={16} weight="regular" />} onClick={onCustomize}>
              {customizeLabel}
            </Button>
          ))}
      </div>

      {hasFacets ? (
        /* Unified filter band — search + promoted facets + "More filters" + Clear all */
        <div className="flex flex-wrap items-center gap-2 px-4 py-4 border-b border-[var(--border-light)] shrink-0">
          {onSearchChange && (
            <FacetSearch
              value={searchValue}
              onChange={onSearchChange}
              placeholder={searchPlaceholder}
            />
          )}
          {/* Filters live to the right of the search (Figma layout). */}
          <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
            {orderedInline.map((f) => (
              <Fragment key={f.key}>
                <InlineFacet facet={f} />
              </Fragment>
            ))}
            {overflowFacets.length > 0 && (
              <Popover
                label={typeof moreFiltersLabel === "string" ? moreFiltersLabel : "More filters"}
                trigger={({ open, triggerProps }) => (
                  <button
                    type="button"
                    {...triggerProps}
                    className="inline-flex h-8 items-center gap-2 rounded-md border border-input bg-background px-3 text-[13px] font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] [&>svg]:shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kds-color-focus-ring)] focus-visible:ring-offset-1"
                  >
                    <Funnel weight="duotone" className="size-3.5" />
                    <span>{moreFiltersLabel}</span>
                    {overflowActive > 0 && (
                      <span className="rounded-full bg-[var(--pill-info-bg)] px-1.5 text-[11px] text-[var(--pill-info-fg)]">
                        {overflowActive}
                      </span>
                    )}
                    <CaretDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
                  </button>
                )}
              >
                <MoreFiltersContent facets={overflowFacets} />
              </Popover>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Toolbar: search + filters */}
          {hasToolbar && (
            <div className="flex flex-wrap items-center gap-3 px-4 py-4 border-b border-[var(--border-light)] shrink-0">
              {onSearchChange && (
                <FacetSearch value={searchValue} onChange={onSearchChange} placeholder={searchPlaceholder} />
              )}
              {filters && <div className="ml-auto flex flex-wrap items-center gap-2">{filters}</div>}
            </div>
          )}

          {/* Open filter chips (pill-style toggles) */}
          {filterChips && filterChips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-b border-[var(--border-light)] shrink-0">
              {filterChipsLabel != null && (
                <span className="mr-1 text-[13px] font-medium text-[var(--text-secondary)]">{filterChipsLabel}</span>
              )}
              {filterChips.map((chip) => (
                <Chip
                  key={chip.key}
                  selected={chip.active}
                  variant={chip.variant}
                  icon={chip.icon}
                  count={chip.count}
                  onClick={chip.onToggle}
                >
                  {chip.label}
                </Chip>
              ))}
            </div>
          )}

          {/* Active filter pills */}
          {activeFilters && activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 px-4 pb-3 shrink-0">
              {activeFilters.map((f) => (
                <span
                  key={f.key}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-light)] bg-[var(--surface-hover)] px-2.5 py-0.5 text-xs text-[var(--text-primary)]"
                >
                  <span className="text-[var(--text-secondary)]">{f.label}:</span>
                  <span className="font-medium">{f.value}</span>
                  <button
                    type="button"
                    aria-label={`Remove ${f.label} filter`}
                    onClick={f.onRemove}
                    className="inline-flex items-center justify-center rounded-full p-0.5 text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-base)] hover:text-[var(--text-primary)]"
                  >
                    <X size={12} weight="bold" />
                  </button>
                </span>
              ))}
              {onClearAllFilters && activeFilters.length > 1 && (
                <button
                  type="button"
                  onClick={onClearAllFilters}
                  className="text-xs font-medium text-[var(--text-link)] transition-colors hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* Tabs */}
      {tabs && tabs.length > 0 && (
        <div className="border-b border-[var(--border-light)] px-4 shrink-0">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={onTabChange} variant="underline" />
        </div>
      )}

      {/* Extra header slot */}
      {header && <div className="shrink-0">{header}</div>}

      {/* Table body — headers + rows; an integral empty/no-results screen renders
          centered below the (header-only) table when there are no rows. */}
      <div className="flex flex-1 flex-col min-h-[320px]">
        <div className="overflow-x-auto">{children}</div>
        {emptyNode != null && (
          <div className="flex flex-1 items-center justify-center px-4 py-10">{emptyNode}</div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 px-4 py-4 shrink-0">
        <span className="text-[14px] text-[var(--text-primary)]">
          {totalItems === 0 ? "No results" : `${rangeStart}–${rangeEnd} of ${totalItems}`}
        </span>

        {totalItems > 0 && (
          <Pagination
            total={totalItems}
            page={safePage}
            pageSize={pageSize}
            onChange={onPageChange}
            siblingCount={1}
            size="sm"
            className="mx-0 w-auto"
          />
        )}

        <div className="flex items-center gap-2">
          <span className="text-[14px] text-[var(--text-primary)]">Show per Page</span>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => {
              onPageSizeChange(Number(v));
              onPageChange(1);
            }}
          >
            <SelectTrigger size="md" className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((s) => (
                <SelectItem key={s} value={String(s)}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
