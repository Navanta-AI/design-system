"use client";

import { useCallback, useMemo, useState } from "react";

export type SortDirection = "asc" | "desc";

export interface TableSortState {
  key: string | null;
  direction: SortDirection;
}

export interface UseTableSortResult<T> {
  /** The data sorted by the current sort state (or original order when no key). */
  sorted: T[];
  /** Currently sorted column key, or null. */
  sortKey: string | null;
  /** Current sort direction. */
  sortDirection: SortDirection;
  /** Toggle sorting for a column: sets asc, flips asc⇄desc on repeat clicks. */
  toggle: (key: string) => void;
  /** Programmatically set the sort state. */
  setSort: (key: string | null, direction?: SortDirection) => void;
  /**
   * Props to spread onto a `<Table.HeadCell>` for a column. Pass `enabled: false`
   * to render the header as non-sortable (no caret, no click).
   */
  getHeadProps: (
    key: string,
    enabled?: boolean,
  ) => { sortable: boolean; sortDirection: SortDirection | null; onSort?: () => void };
}

function compare(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
}

/**
 * Managed sorting for a children-based `<Table>`. Pass the row data and an
 * accessor that returns a comparable value for a given column key; get back the
 * sorted rows plus `getHeadProps(key)` to wire each `<Table.HeadCell>`.
 *
 *   const { sorted, getHeadProps } = useTableSort(rows, (r, key) => r[key], { key: 'po' })
 *   <Table.HeadCell {...getHeadProps('po')}>HD PO #</Table.HeadCell>
 *
 * Per-column enable/disable: `getHeadProps('warehouse', sortableCols.warehouse)`.
 */
export function useTableSort<T>(
  data: T[],
  getValue: (row: T, key: string) => string | number | Date | null | undefined,
  initial?: { key: string; direction?: SortDirection },
): UseTableSortResult<T> {
  // Key + direction live in one state object so `toggle` can flip both with a
  // single pure updater. (Nesting `setDirection` inside a `setKey` updater
  // double-fires under React Strict Mode and cancels the flip — the column
  // would only ever sort one way.)
  const [sort, setSortState] = useState<TableSortState>({
    key: initial?.key ?? null,
    direction: initial?.direction ?? "asc",
  });
  const { key, direction } = sort;

  const sorted = useMemo(() => {
    if (!key) return data;
    const copy = [...data];
    const dir = direction === "asc" ? 1 : -1;
    copy.sort((a, b) => compare(getValue(a, key), getValue(b, key)) * dir);
    return copy;
  }, [data, key, direction, getValue]);

  const toggle = useCallback((next: string) => {
    setSortState((prev) =>
      prev.key === next
        ? { key: next, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key: next, direction: "asc" },
    );
  }, []);

  const setSort = useCallback((next: string | null, dir: SortDirection = "asc") => {
    setSortState({ key: next, direction: dir });
  }, []);

  const getHeadProps = useCallback(
    (col: string, enabled = true) => ({
      sortable: enabled,
      sortDirection: enabled && key === col ? direction : null,
      onSort: enabled ? () => toggle(col) : undefined,
    }),
    [key, direction, toggle],
  );

  return { sorted, sortKey: key, sortDirection: direction, toggle, setSort, getHeadProps };
}
