"use client";

import { type ReactNode } from "react";
import { CaretUp } from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import { Dropdown } from "./Dropdown";

/* ─────────────────────────────────────────────
 *  TableShell — reusable table chrome
 *
 *  Handles the fixed layout around any table:
 *    ┌─ header (tabs, search, filters)  ─┐
 *    │  <table> children                  │
 *    └─ footer (count, pagination, size) ─┘
 * ───────────────────────────────────────────── */

interface TableShellProps {
  /** Table title (e.g., "My Orders", "Action Center") */
  title: string;
  /** Phosphor icon rendered duotone next to the title */
  icon?: Icon;
  /** Total filtered item count */
  totalItems: number;
  /** Current page (1-based) */
  currentPage: number;
  /** Page change handler */
  onPageChange: (page: number) => void;
  /** Items per page */
  pageSize: number;
  /** Page size change handler */
  onPageSizeChange: (size: number) => void;
  /** Available page size options (default [10, 25, 50]) */
  pageSizeOptions?: number[];
  /** Header slot — tabs, search, filters, filter chips */
  header?: ReactNode;
  /** The table content */
  children: ReactNode;
  /** Optional className for the outer wrapper */
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
  header,
  children,
  className = "",
}: TableShellProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const rangeStart = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const rangeEnd = Math.min(safePage * pageSize, totalItems);

  /* ── Page numbers with ellipsis ── */
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
    .reduce<(number | "\u2026")[]>((acc, p, idx, arr) => {
      if (idx > 0 && p - (arr[idx - 1]) > 1) acc.push("\u2026");
      acc.push(p);
      return acc;
    }, []);

  /* ── Page size as dropdown items ── */
  const pageSizeItems = pageSizeOptions.map((s) => ({
    label: String(s),
    value: String(s),
  }));

  return (
    <div className={`flex flex-col bg-[var(--surface-base)] border border-[var(--border-default)] rounded-xl overflow-hidden ${className}`}
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      {/* Title */}
      <div className="flex items-center pt-3 pb-2 px-4 shrink-0">
        <div className="flex items-center gap-2">
          {TitleIcon && <TitleIcon size={16} weight="duotone" className="text-[var(--brand-purple-deep)] shrink-0" />}
          <span className="text-base font-semibold text-[var(--brand-purple-deep)]">{title}</span>
        </div>
      </div>

      {/* Header */}
      {header && <div className="shrink-0">{header}</div>}

      {/* Table body — scrollable */}
      <div className="flex-1 min-h-0 overflow-x-auto">
        {children}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border-default)] shrink-0">
        {/* Item count */}
        <span className="text-[13px] text-[var(--text-secondary)]">
          {totalItems === 0 ? "No results" : `${rangeStart}\u2013${rangeEnd} of ${totalItems}`}
        </span>

        {/* Page navigation */}
        {totalItems > pageSize && (
          <div className="flex items-center gap-1">
            <button
              disabled={safePage <= 1}
              onClick={() => onPageChange(safePage - 1)}
              className="flex items-center justify-center w-[28px] h-[28px] rounded-lg border border-[var(--border-default)] hover:bg-[var(--surface-hover)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <CaretUp size={12} weight="bold" className="rotate-[-90deg] text-[var(--text-primary)]" />
            </button>

            {pageNumbers.map((p, idx) =>
              p === "\u2026" ? (
                <span key={`ellipsis-${idx}`} className="w-[28px] h-[28px] flex items-center justify-center text-[13px] text-[var(--text-secondary)]">
                  {"\u2026"}
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={`flex items-center justify-center w-[28px] h-[28px] rounded-lg text-[13px] font-medium transition-colors ${
                    p === safePage
                      ? "bg-[var(--brand-primary)] text-white"
                      : "hover:bg-[var(--surface-hover)] text-[var(--text-primary)]"
                  }`}
                >
                  {p}
                </button>
              ),
            )}

            <button
              disabled={safePage >= totalPages}
              onClick={() => onPageChange(safePage + 1)}
              className="flex items-center justify-center w-[28px] h-[28px] rounded-lg border border-[var(--border-default)] hover:bg-[var(--surface-hover)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <CaretUp size={12} weight="bold" className="rotate-[90deg] text-[var(--text-primary)]" />
            </button>
          </div>
        )}

        {/* Page size selector */}
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-[var(--text-secondary)]">Per page</span>
          <Dropdown
            mode="select"
            label={String(pageSize)}
            items={pageSizeItems}
            value={String(pageSize)}
            onChange={(v) => {
              onPageSizeChange(Number(v));
              onPageChange(1);
            }}
            menuMinWidth={70}
            itemHeight={32}
          />
        </div>
      </div>
    </div>
  );
}
