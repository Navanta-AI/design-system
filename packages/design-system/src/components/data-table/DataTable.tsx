"use client";

import { useMemo, type CSSProperties, type ReactNode } from "react";
import { SortIcon, TableCheckbox } from "./parts";
import { DATA_TABLE_DEFAULTS } from "./constants";

/**
 * Cell layout registry — the flex wrapper injected around every cell's content.
 *   row    — horizontal content (avatar + text, single value)
 *   col    — stacked content (primary + secondary line)
 *   center — horizontally centred (icon-only / status-dot cells)
 *   end    — right-aligned (numeric / currency columns)
 */
export const CELL_LAYOUTS = {
  row:    "flex items-center gap-[10px] h-full min-w-0 overflow-hidden whitespace-nowrap",
  col:    "flex flex-col justify-center items-start gap-[10px] h-full min-w-0 overflow-hidden",
  center: "flex items-center justify-center gap-[10px] h-full min-w-0 overflow-hidden whitespace-nowrap",
  end:    "flex items-center justify-end gap-[10px] h-full min-w-0 overflow-hidden whitespace-nowrap",
} as const;

export type CellLayout = keyof typeof CELL_LAYOUTS;
export const DEFAULT_CELL_LAYOUT: CellLayout = "row";

import type {
  CellContext,
  Column,
  DataTableAppearance,
  GroupConfig,
  SelectionConfig,
  SlotColumn,
  SortState,
} from "./types";

export interface DataTableProps<T> extends DataTableAppearance {
  /** Declarative columns — single source of truth for header + cell. */
  columns: readonly Column<T>[];
  /** Flat rows. Mutually exclusive with `groups`. */
  data?: readonly T[];
  /** Grouped rows (vendor buckets, sections…). Mutually exclusive with `data`. */
  groups?: readonly GroupConfig<T>[];
  rowKey: (row: T) => string;

  /** Ordered visible column keys. When omitted, all columns show in array order. */
  visibleKeys?: readonly string[];

  /** Controlled sort. Sortable columns call `onSortChange` with the next state. */
  sort?: SortState;
  onSortChange?: (next: SortState) => void;
  /** "client" sorts internally (flat data only); "controlled" (default) defers to the caller. */
  sortMode?: "controlled" | "client";

  /** Selection — adds a checkbox slot column on the left automatically. */
  selection?: SelectionConfig<T>;

  leadingSlots?: readonly SlotColumn<T>[];
  trailingSlots?: readonly SlotColumn<T>[];

  isLoading?: boolean;
  loadingRowCount?: number;
  loadingRow?: ReactNode;
  isFetching?: boolean;
  emptyState?: ReactNode;

  /** Reserved vertical space as a row count (ignored when rowHeight is "auto"). */
  reserveRowCount?: number;

  onRowClick?: (row: T) => void;
  rowClassName?: (row: T) => string;
  /** Per-row inline styles — e.g. a resolved/selected row background. Merged onto the `<tr>`. */
  rowStyle?: (row: T) => CSSProperties | undefined;
  /**
   * Per-row clickability. When provided, only rows returning `true` get
   * `cursor-pointer` and fire `onRowClick` — lets "done"/disabled rows opt out
   * while the rest stay interactive.
   */
  isRowClickable?: (row: T) => boolean;
  /**
   * Per-row hover background — overrides `rowHoverBg` for that row via a
   * row-level CSS var. Lets a resolved row keep its own tint on hover instead
   * of the table-wide hover color.
   */
  rowHoverColor?: (row: T) => string | undefined;
  /** Fixed row height (px), or "auto" to let multi-line content size the row. */
  rowHeight?: number | "auto";
  headerHeight?: number;

  renderMobileCard?: (row: T, ctx: CellContext<T>) => ReactNode;
  mobileEmpty?: ReactNode;

  footer?:
    | ReactNode
    | ReadonlyArray<
        | ReactNode
        | { content: ReactNode; align?: "left" | "right" | "center"; className?: string }
      >;
}

const DEFAULT_SORT: SortState = { field: null, dir: "asc" };
const EMPTY: readonly never[] = [];

export function DataTable<T>(props: DataTableProps<T>) {
  const {
    columns,
    data = EMPTY,
    groups,
    rowKey,
    visibleKeys,
    sort = DEFAULT_SORT,
    onSortChange,
    sortMode = "controlled",
    selection,
    leadingSlots = [],
    trailingSlots = [],
    isLoading = false,
    isFetching = false,
    loadingRowCount = DATA_TABLE_DEFAULTS.loadingRowCount,
    loadingRow,
    emptyState,
    onRowClick,
    rowClassName,
    rowStyle,
    isRowClickable,
    rowHoverColor,
    rowHeight = DATA_TABLE_DEFAULTS.rowHeight,
    headerHeight = DATA_TABLE_DEFAULTS.headerHeight,
    reserveRowCount,
    renderMobileCard,
    mobileEmpty,
    footer,
    // Appearance (defaults = DS house style; consumers override for parity)
    cellPaddingX = 12,
    headerPaddingX = 12,
    rowBorderColor = "var(--border-light)",
    rowHoverBg = "var(--muted)",
    headerVariant = "default",
    headerBg = "var(--muted)",
    headerRadius = 8,
  } = props;

  const isGrouped = groups != null;
  const isAutoHeight = rowHeight === "auto";
  const numericRowHeight = isAutoHeight ? undefined : (rowHeight as number);

  const isCapsule = headerVariant === "capsule";
  const headerRowStyle: CSSProperties = { height: headerHeight };
  if (headerVariant === "filled") {
    headerRowStyle.background = headerBg;
  } else if (isCapsule) {
    headerRowStyle.position = "sticky";
    headerRowStyle.top = 0;
    headerRowStyle.zIndex = 1;
  }

  // CSS vars carry the row border/hover (the `:hover` can't be inline).
  const rootVars = {
    "--dt-row-border": rowBorderColor,
    "--dt-row-hover": rowHoverBg,
  } as CSSProperties;

  const reservedHeight =
    reserveRowCount != null && !isAutoHeight
      ? headerHeight + reserveRowCount * (numericRowHeight as number)
      : undefined;

  const orderedColumns = useMemo(() => {
    if (!visibleKeys) return columns.slice();
    const byKey = new Map(columns.map((c) => [c.key, c]));
    return visibleKeys.map((k) => byKey.get(k)).filter((c): c is Column<T> => Boolean(c));
  }, [columns, visibleKeys]);

  const selectionSlot: SlotColumn<T> | null = useMemo(() => {
    if (!selection) return null;
    const groupRows = groups ? groups.flatMap((g) => g.rows as T[]) : data;
    const ids = groupRows.map(rowKey);
    const allSelected = ids.length > 0 && ids.every((id) => selection.selected.has(id));
    const someSelected = !allSelected && ids.some((id) => selection.selected.has(id));
    return {
      id: "__select",
      width: DATA_TABLE_DEFAULTS.selectionSlotWidth,
      headerClassName: "pl-[16px] pr-[8px]",
      cellClassName: "pl-[16px] pr-[8px] py-[10px]",
      header: () => (
        <TableCheckbox
          checked={allSelected}
          indeterminate={someSelected}
          onChange={selection.onToggleAll}
          ariaLabel="Select all rows"
        />
      ),
      cell: (row) => {
        const id = rowKey(row);
        return (
          <TableCheckbox
            checked={selection.selected.has(id)}
            disabled={selection.isRowDisabled?.(row)}
            onChange={() => selection.onToggleRow(id)}
            ariaLabel={`Select row ${id}`}
          />
        );
      },
      stopRowClick: true,
    };
  }, [selection, data, groups, rowKey]);

  const leftSlots = useMemo(
    () => (selectionSlot ? [selectionSlot, ...leadingSlots] : [...leadingSlots]),
    [selectionSlot, leadingSlots],
  );
  const rightSlots = trailingSlots;

  // Client-side sort (flat data only — grouped data is pre-ordered by caller).
  const sortedData = useMemo(() => {
    if (isGrouped) return data.slice();
    if (sortMode !== "client" || !sort.field) return data.slice();
    const col = columns.find((c) => (c.sortKey ?? c.key) === sort.field || c.key === sort.field);
    if (!col) return data.slice();
    const dir = sort.dir === "asc" ? 1 : -1;
    return data.slice().sort((a, b) => {
      const av = (a as Record<string, unknown>)[col.key];
      const bv = (b as Record<string, unknown>)[col.key];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
  }, [data, sort, sortMode, columns, isGrouped]);

  const colCount = leftSlots.length + orderedColumns.length + rightSlots.length;
  const rowCountTotal = isGrouped
    ? groups!.reduce((n, g) => n + g.rows.length, 0)
    : sortedData.length;
  const showEmpty = !isLoading && !isFetching && rowCountTotal === 0;

  const handleHeaderSort = (col: Column<T>) => {
    if (!col.sortable || !onSortChange) return;
    const token = col.sortKey ?? col.key;
    if (sort.field === token) {
      onSortChange({ field: token, dir: sort.dir === "asc" ? "desc" : "asc" });
    } else {
      onSortChange({ field: token, dir: "asc" });
    }
  };

  const renderHeaderCell = (col: Column<T>, index: number) => {
    const alignCls =
      col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left";
    const base = `py-3 align-middle font-semibold text-[13px] text-[var(--text-primary)] whitespace-nowrap ${alignCls}`;
    const cls = `${base} ${col.headerClassName ?? ""} ${col.sortable ? "cursor-pointer select-none" : ""}`;
    const thStyle: CSSProperties = {
      paddingLeft: headerPaddingX,
      paddingRight: headerPaddingX,
      ...(col.width == null
        ? {
            ...(col.minWidth != null ? { minWidth: col.minWidth } : null),
            ...(col.maxWidth != null ? { maxWidth: col.maxWidth } : null),
          }
        : null),
    };
    if (isCapsule) {
      thStyle.background = headerBg;
      if (index === 0) {
        thStyle.borderTopLeftRadius = headerRadius;
        thStyle.borderBottomLeftRadius = headerRadius;
      }
      if (index === orderedColumns.length - 1 && rightSlots.length === 0) {
        thStyle.borderTopRightRadius = headerRadius;
        thStyle.borderBottomRightRadius = headerRadius;
      }
    }
    const caretSide = col.caretSide ?? "trailing";
    return (
      <th
        key={col.key}
        className={cls}
        style={thStyle}
        onClick={col.sortable ? () => handleHeaderSort(col) : undefined}
      >
        {col.headerCell ? (
          col.headerCell({ sort })
        ) : (
          <span className="inline-flex items-center">
            {col.sortable && caretSide === "leading" && (
              <SortIcon field={col.sortKey ?? col.key} sort={sort} side="leading" />
            )}
            {col.label}
            {col.sortable && caretSide === "trailing" && (
              <SortIcon field={col.sortKey ?? col.key} sort={sort} />
            )}
          </span>
        )}
      </th>
    );
  };

  const renderSlotHeader = (slot: SlotColumn<T>) => {
    const flatRows = isGrouped ? groups!.flatMap((g) => g.rows as T[]) : sortedData;
    const allSelected =
      selection != null && flatRows.length > 0 && flatRows.every((r) => selection.selected.has(rowKey(r)));
    const someSelected =
      selection != null && !allSelected && flatRows.some((r) => selection.selected.has(rowKey(r)));
    const slotStyle: CSSProperties | undefined = isCapsule ? { background: headerBg } : undefined;
    return (
      <th key={slot.id} className={`align-middle ${slot.headerClassName ?? ""}`} style={slotStyle}>
        {slot.header ? slot.header({ rows: flatRows as T[], allSelected, someSelected }) : null}
      </th>
    );
  };

  const renderBodyRow = (row: T, index: number) => {
    const id = rowKey(row);
    const isSelected = selection?.selected.has(id) ?? false;
    const ctx: CellContext<T> = { row, index, isSelected };
    const clickable = !!onRowClick && (isRowClickable ? isRowClickable(row) : true);
    const rowCls = `border-b border-[color:var(--dt-row-border)] hover:bg-[var(--dt-row-hover)] transition-colors align-middle ${
      clickable ? "cursor-pointer" : ""
    } ${rowClassName?.(row) ?? ""}`;
    const rowHoverVar =
      rowHoverColor != null ? ({ "--dt-row-hover": rowHoverColor(row) ?? rowHoverBg } as CSSProperties) : null;

    const slotCell = (slot: SlotColumn<T>) => {
      const stop = slot.stopRowClick !== false;
      return (
        <td
          key={slot.id}
          className={`align-middle ${slot.cellClassName ?? ""}`}
          style={{ height: numericRowHeight }}
          onClick={stop ? (e) => e.stopPropagation() : undefined}
        >
          <div className="flex h-full items-center">{slot.cell(row, ctx)}</div>
        </td>
      );
    };

    return (
      <tr
        key={id}
        className={rowCls}
        style={{ height: numericRowHeight, ...rowHoverVar, ...rowStyle?.(row) }}
        onClick={clickable ? () => onRowClick!(row) : undefined}
      >
        {leftSlots.map(slotCell)}
        {orderedColumns.map((col) => {
          const alignCls =
            col.align === "right"
              ? "text-right"
              : col.align === "center"
                ? "text-center"
                : "text-left";
          const extra =
            typeof col.cellClassName === "function"
              ? col.cellClassName(row)
              : (col.cellClassName ?? "");
          const tdStyle: CSSProperties = {
            ...(isAutoHeight
              ? null
              : { height: numericRowHeight, maxHeight: numericRowHeight, overflow: "hidden" }),
            paddingLeft: cellPaddingX,
            paddingRight: cellPaddingX,
            ...(col.width == null
              ? {
                  ...(col.minWidth != null ? { minWidth: col.minWidth } : null),
                  ...(col.maxWidth != null ? { maxWidth: col.maxWidth } : null),
                }
              : null),
          };
          const derivedLayout: CellLayout =
            col.cellLayout ??
            (col.align === "right" ? "end" : col.align === "center" ? "center" : DEFAULT_CELL_LAYOUT);
          let layoutCls: string = CELL_LAYOUTS[derivedLayout];
          if (col.wrapLines === 2) {
            layoutCls = layoutCls.replace(" whitespace-nowrap", "");
          }
          if (isAutoHeight) {
            layoutCls = layoutCls.replace(" h-full", "").replace(" overflow-hidden", "");
          }
          return (
            <td key={col.key} className={`py-0 ${alignCls} ${extra}`} style={tdStyle}>
              <div className={layoutCls}>{col.cell(row, ctx)}</div>
            </td>
          );
        })}
        {rightSlots.map(slotCell)}
      </tr>
    );
  };

  const renderGroupBand = (group: GroupConfig<T>) => (
    <tr key={`__g_${group.key}`}>
      <td colSpan={colCount} className={group.headerClassName}>
        {typeof group.header === "function" ? group.header({ rows: group.rows }) : group.header}
      </td>
    </tr>
  );

  const skeletonRow = (key: number) =>
    loadingRow ?? (
      <tr
        key={`sk-${key}`}
        style={{ height: numericRowHeight }}
        className="border-b border-[color:var(--dt-row-border)]"
      >
        {Array.from({ length: colCount }, (_, i) => (
          <td key={i} className="py-0" style={{ height: numericRowHeight, paddingLeft: cellPaddingX, paddingRight: cellPaddingX }}>
            <div className="rounded" style={{ height: 14, background: "var(--surface-sunken)", width: "70%" }} />
          </td>
        ))}
      </tr>
    );

  return (
    <>
      <div
        className={`${renderMobileCard ? "hidden md:flex" : "flex"} w-full flex-col`}
        style={{ ...rootVars, ...(reservedHeight != null ? { minHeight: reservedHeight } : null) }}
      >
        <div className={`w-full overflow-x-auto hide-scrollbar ${showEmpty ? "" : "flex-1"}`}>
          <table
            className="min-w-full text-sm"
            style={{ tableLayout: orderedColumns.some((c) => c.width == null) ? "auto" : "fixed" }}
          >
            <colgroup>
              {leftSlots.map((s) => (
                <col key={s.id} style={{ width: s.width }} />
              ))}
              {orderedColumns.map((c) => {
                const style = c.width
                  ? { width: c.width }
                  : {
                      ...(c.minWidth != null ? { minWidth: c.minWidth } : null),
                      ...(c.maxWidth != null ? { maxWidth: c.maxWidth } : null),
                    };
                return <col key={c.key} style={style} />;
              })}
              {rightSlots.map((s) => (
                <col key={s.id} style={{ width: s.width }} />
              ))}
            </colgroup>
            <thead>
              <tr className="border-b border-[color:var(--dt-row-border)] text-left" style={headerRowStyle}>
                {leftSlots.map(renderSlotHeader)}
                {orderedColumns.map(renderHeaderCell)}
                {rightSlots.map(renderSlotHeader)}
              </tr>
            </thead>
            <tbody>
              {isLoading && Array.from({ length: loadingRowCount }, (_, i) => skeletonRow(i))}
              {!isLoading && isGrouped &&
                groups!.flatMap((group) => [
                  renderGroupBand(group),
                  ...group.rows.map((row, i) => renderBodyRow(row, i)),
                ])}
              {!isLoading && !isGrouped && sortedData.map(renderBodyRow)}
            </tbody>
            {footer != null && (() => {
              const isArrayFooter = Array.isArray(footer);
              if (isArrayFooter) {
                const cells = footer as unknown as ReadonlyArray<
                  | ReactNode
                  | { content: ReactNode; align?: "left" | "right" | "center"; className?: string }
                >;
                return (
                  <tfoot>
                    <tr
                      className="border-t border-[color:var(--dt-row-border)]"
                      style={{ height: headerHeight, background: "var(--surface-sunken)" }}
                    >
                      {cells.map((cell, i) => {
                        const isObj =
                          cell != null &&
                          typeof cell === "object" &&
                          !Array.isArray(cell) &&
                          "content" in (cell as object);
                        const content = isObj ? (cell as { content: ReactNode }).content : (cell as ReactNode);
                        const align = isObj
                          ? (cell as { align?: "left" | "right" | "center" }).align
                          : undefined;
                        const className = isObj ? (cell as { className?: string }).className : undefined;
                        const alignCls =
                          align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left";
                        return (
                          <td
                            key={i}
                            className={`py-3 text-[14px] font-medium text-[var(--text-primary)] whitespace-nowrap ${alignCls} ${className ?? ""}`}
                            style={{ paddingLeft: cellPaddingX, paddingRight: cellPaddingX }}
                          >
                            {content}
                          </td>
                        );
                      })}
                    </tr>
                  </tfoot>
                );
              }
              return <tfoot>{footer as ReactNode}</tfoot>;
            })()}
          </table>
        </div>

        {showEmpty && emptyState && (
          <div
            className="flex flex-1 w-full items-center justify-center"
            style={{ minHeight: reservedHeight != null ? 0 : 320 }}
          >
            {emptyState}
          </div>
        )}
      </div>

      {renderMobileCard && (
        <div className="md:hidden flex flex-col">
          {(() => {
            const flat = isGrouped ? groups!.flatMap((g) => g.rows as T[]) : sortedData;
            return flat.length === 0
              ? mobileEmpty
              : flat.map((row, index) =>
                  renderMobileCard(row, {
                    row,
                    index,
                    isSelected: selection?.selected.has(rowKey(row)) ?? false,
                  }),
                );
          })()}
        </div>
      )}
    </>
  );
}

export type {
  Column,
  SlotColumn,
  SortState,
  SortDirection,
  CellContext,
  HeaderContext,
  SlotHeaderContext,
  SelectionConfig,
  GroupConfig,
  DataTableAppearance,
} from "./types";
