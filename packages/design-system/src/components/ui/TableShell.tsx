"use client";

import { type ReactNode } from "react";
import { MagnifyingGlass, Gear, X } from "@phosphor-icons/react";
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
import { Tabs, type TabItem } from "../Tabs";

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

/* ─────────────────────────────────────────────
 *  TableShell — the standard table chrome.
 *
 *    ┌─ heading (title + Customize)         ─┐
 *    ├─ toolbar (search + filters)           │
 *    ├─ tabs (optional, count badges)        │
 *    │  <table> children                     │
 *    └─ footer (count, pagination, size)    ─┘
 *
 *  Empty / no-results screens are rendered inside the table body via
 *  `<Table.Empty>` + `<EmptyState>` so the column headers stay visible and the
 *  content centers (see the TableShell docs demo). This is the default until a
 *  screen needs something different.
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

  /** Tabs row for quick filtering (count badges supported via TabItem.badge). */
  tabs?: TabItem[];
  activeTab?: string;
  onTabChange?: (id: string) => void;

  /** Renders a "Customize" action (gear) in the heading — wire it to column customization. */
  onCustomize?: () => void;
  customizeLabel?: string;

  /** Extra header slot rendered above the table body (filter chips, banners, …). */
  header?: ReactNode;
  /** The table content (a `<Table>`; use `<Table.Empty>` for the empty body). */
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
  tabs,
  activeTab,
  onTabChange,
  onCustomize,
  customizeLabel = "Customize",
  header,
  children,
  className = "",
}: TableShellProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const rangeStart = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const rangeEnd = Math.min(safePage * pageSize, totalItems);

  const hasToolbar = Boolean(onSearchChange || filters);

  return (
    <div
      className={`flex flex-col bg-[var(--surface-base)] rounded-xl overflow-hidden ${className}`}
      style={{ boxShadow: "0 0 1px 0 rgba(0,0,0,0.25), 0 1px 4px 0 rgba(0,0,0,0.06)" }}
    >
      {/* Heading: title + Customize */}
      <div className="flex items-center justify-between gap-3 px-4 pt-4 pb-3 shrink-0">
        <div className="flex items-center gap-2">
          {TitleIcon && <TitleIcon size={18} weight="duotone" className="text-[var(--text-primary)] shrink-0" />}
          <span className="text-[16px] font-semibold leading-[1.3] text-[var(--text-primary)]">{title}</span>
        </div>
        {onCustomize && (
          <Button variant="ghost" size="sm" iconLeft={<Gear size={16} />} onClick={onCustomize}>
            {customizeLabel}
          </Button>
        )}
      </div>

      {/* Toolbar: search + filters */}
      {hasToolbar && (
        <div className="flex flex-wrap items-center gap-3 px-4 py-4 border-b border-[var(--border-light)] shrink-0">
          {onSearchChange && (
            <div className="min-w-[200px] flex-1 sm:max-w-[480px]">
              <Input
                size="md"
                type="search"
                className="w-full"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                clearable
                onClear={() => onSearchChange("")}
                iconRight={<MagnifyingGlass weight="bold" />}
              />
            </div>
          )}
          {filters && <div className="ml-auto flex flex-wrap items-center gap-2">{filters}</div>}
        </div>
      )}

      {/* Active filter pills */}
      {activeFilters && activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 px-4 pb-3 shrink-0">
          {activeFilters.map((f) => (
            <span
              key={f.key}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-default)] bg-[var(--surface-hover)] px-2.5 py-0.5 text-xs text-[var(--text-primary)]"
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

      {/* Tabs */}
      {tabs && tabs.length > 0 && (
        <div className="border-b border-[var(--border-default)] px-4 shrink-0">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={onTabChange} variant="underline" />
        </div>
      )}

      {/* Extra header slot */}
      {header && <div className="shrink-0">{header}</div>}

      {/* Table body — scrollable (renders headers + rows, or a centered Table.Empty) */}
      <div className="flex-1 min-h-[320px] overflow-x-auto">{children}</div>

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
