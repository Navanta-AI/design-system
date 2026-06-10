"use client";

import { CaretDown, CaretUp, CaretUpDown } from "@phosphor-icons/react";
import type { SortState } from "./types";

/**
 * Sort caret. `side` controls which margin carries the gap so the caret can
 * sit AFTER the label (trailing, default) or BEFORE it (leading — used by
 * right-aligned numeric headers).
 */
export function SortIcon({
  field,
  sort,
  side = "trailing",
}: {
  field: string;
  sort: SortState;
  side?: "trailing" | "leading";
}) {
  const gap = side === "leading" ? "mr-1" : "ml-1";
  const active = sort.field === field;
  if (!active) {
    return <CaretUpDown size={14} weight="bold" className={`text-[var(--text-secondary)] ${gap}`} />;
  }
  return sort.dir === "asc" ? (
    <CaretUp size={14} weight="bold" className={`text-[var(--text-primary)] ${gap}`} />
  ) : (
    <CaretDown size={14} weight="bold" className={`text-[var(--text-primary)] ${gap}`} />
  );
}

interface TableCheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  onChange: () => void;
  ariaLabel?: string;
}

export function TableCheckbox({
  checked,
  indeterminate = false,
  disabled = false,
  onChange,
  ariaLabel,
}: TableCheckboxProps) {
  const filled = checked || indeterminate;
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? "mixed" : checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onChange();
      }}
      className="inline-flex items-center justify-center shrink-0 transition-colors"
      style={{
        width: 16,
        height: 16,
        borderRadius: 4,
        border: filled
          ? "1px solid var(--info-strong)"
          : "1px solid var(--border-strong)",
        background: filled ? "var(--info-strong)" : "var(--surface-base)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {indeterminate ? (
        <span style={{ width: 8, height: 2, background: "white", borderRadius: 1 }} />
      ) : checked ? (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path
            d="M1.5 5L4 7.5L8.5 2.5"
            stroke="white"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
    </button>
  );
}
