/**
 * DataTable visual defaults. Override per-table via the matching prop —
 * new tables should stick with these for visual consistency.
 */
export const DATA_TABLE_DEFAULTS = {
  rowHeight: 56,
  headerHeight: 50,
  /** Width of the auto-added selection checkbox slot (px). */
  selectionSlotWidth: 44,
  /** Default skeleton row count when isLoading. */
  loadingRowCount: 8,
  /** Compact variant — used by small static modal tables. */
  compactRowHeight: 36,
  compactHeaderHeight: 36,
} as const;
