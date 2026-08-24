"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Funnel, ArrowUp, ArrowDown, MagnifyingGlass } from "@phosphor-icons/react";
import { Checkbox } from "../Checkbox";
import { Input } from "../Input";

const PANEL_W = 240;
// STANDARD: a filter list longer than this gets an automatic search field so the
// user can find a value without scrolling a long checkbox list.
const SEARCH_THRESHOLD = 7;
// Accent for the active funnel / active sort arrow / Clear — the same
// "active/selected" blue the DataTable checkbox uses (--info-strong).
const ACCENT = "var(--info-strong, #004b71)";
const HOVER_BG = "var(--surface-hover, #f4f4f5)";
const TEXT_1 = "var(--text-primary, #18181b)";
const TEXT_2 = "var(--text-secondary, #71717a)";

/** The kind of data a column holds — picks the wording of its two Sort rows.
 *  "A → Z" only reads correctly for text; dates, amounts and severities each
 *  need their own asc/desc phrasing.
 *
 *  These are the GENERIC kinds. A column whose values carry a domain vocabulary
 *  of their own — an aging tier, a lifecycle stage, a grade — borrows the closest
 *  kind and overrides the wording with {@link ColumnFilterMenuProps.sortLabels},
 *  rather than this union growing a member per consuming app's domain. */
export type ColumnSortKind = "text" | "date" | "number" | "severity";

/** The asc/desc wording for one column. */
export interface ColumnSortLabels {
  asc: string;
  desc: string;
}

const SORT_LABELS: Record<ColumnSortKind, ColumnSortLabels> = {
  text: { asc: "A → Z", desc: "Z → A" },
  date: { asc: "Earliest first", desc: "Latest first" },
  number: { asc: "Low → High", desc: "High → Low" },
  severity: { asc: "Most urgent first", desc: "Least urgent first" },
};

export interface ColumnFilterMenuProps {
  /** Column header text shown next to the funnel (e.g. "Status"). */
  label: string;
  /** Active sort direction for THIS column, or null if sorted by another column / unsorted. */
  activeDir: "asc" | "desc" | null;
  /** The column's selectable filter values. `value` = stored key, `label` = display text. */
  options: { value: string; label: string }[];
  /** Currently-selected filter values (controlled). Empty = no filter. */
  selected: string[];
  /** Apply a sort direction to this column (fired from a Sort row). */
  onSort: (dir: "asc" | "desc") => void;
  /** Toggle a single filter value. Parent owns the add/remove logic. */
  onToggle: (value: string) => void;
  /** Clear all selected values for this column. */
  onClear: () => void;
  /** Show the Sort rows. Default true. */
  sortable?: boolean;
  /** Column data type — picks the asc/desc sort wording. Default "text". */
  sortKind?: ColumnSortKind;
  /**
   * Override the sort-row wording, for a column whose values speak a vocabulary
   * none of the `sortKind` presets says correctly — an aging tier sorts
   * "Obsolescence first", not "Most urgent first". Give one side or both; whatever
   * is omitted falls back to the `sortKind` label, so a caller can rename just the
   * direction that reads wrong.
   *
   * The DIRECTIONS still mean what they always mean: the `asc` label sits on the
   * row that fires `onSort("asc")`. Only the words change — never use this to
   * swap them, or the arrow beside the label will contradict it.
   */
  sortLabels?: Partial<ColumnSortLabels>;
}

/**
 * Filter + sort menu that lives in a DataTable column header, behind a funnel.
 * Fully controlled (the parent owns `selected` + sort), so the same state can be
 * edited from a TableShell facet — bind both to one `value`/`onChange` and the
 * applied filter shows in the filter band above the table automatically.
 *
 * The panel is portaled to <body> (position: fixed) so it escapes the DataTable's
 * overflow clipping, auto-flips above when it would overflow the bottom, clamps to
 * the viewport, and repositions (does NOT close) on scroll/resize.
 */
export function ColumnFilterMenu({
  label,
  activeDir,
  options,
  selected,
  onSort,
  onToggle,
  onClear,
  sortable = true,
  sortKind = "text",
  sortLabels: sortLabelsOverride,
}: ColumnFilterMenuProps) {
  // Preset first, caller's words on top — so an override may replace one side
  // and leave the other reading as its kind.
  const sortLabels = { ...SORT_LABELS[sortKind], ...sortLabelsOverride };
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const active = selected.length > 0 || activeDir != null;

  // Auto-search when the value list is long. The query is local to the popover and
  // resets each time it closes; it never touches the parent's `selected` state.
  const [query, setQuery] = useState("");
  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);
  const showSearch = options.length > SEARCH_THRESHOLD;
  const q = query.trim().toLowerCase();
  const visibleOptions =
    showSearch && q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;

  const place = useCallback(() => {
    if (!btnRef.current || !menuRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    const panelH = menuRef.current.offsetHeight;
    const MARGIN = 8;
    const GAP = 6;
    const left = Math.max(MARGIN, Math.min(r.left, window.innerWidth - PANEL_W - MARGIN));
    let top = r.bottom + GAP;
    if (top + panelH > window.innerHeight - MARGIN) {
      const above = r.top - GAP - panelH;
      top = above >= MARGIN ? above : Math.max(MARGIN, window.innerHeight - MARGIN - panelH);
    }
    setPos({ top, left });
  }, []);

  // Measure-then-reveal: render hidden (coords null), place after commit, reveal.
  useEffect(() => {
    if (open) place();
  }, [open, place]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (btnRef.current?.contains(t) || menuRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    let raf = 0;
    const reposition = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(place);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
      cancelAnimationFrame(raf);
    };
  }, [open, place]);

  const rowCls =
    "flex items-center w-full text-left rounded-[6px] transition-colors hover:bg-[var(--surface-hover,#f4f4f5)]";

  return (
    <span className="inline-flex items-center" style={{ gap: 6 }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: TEXT_1, whiteSpace: "nowrap" }}>{label}</span>
      <button
        ref={btnRef}
        type="button"
        aria-label={`Filter and sort ${label}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          if (!open) setPos(null);
          setOpen((o) => !o);
        }}
        className="inline-flex items-center justify-center rounded-[4px] transition-colors hover:bg-[var(--surface-hover,#f4f4f5)]"
        style={{ width: 20, height: 20 }}
      >
        <Funnel size={13} weight={active || open ? "fill" : "regular"} color={active ? ACCENT : TEXT_2} />
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            role="dialog"
            aria-label={`${label} — filter and sort`}
            className="flex flex-col"
            style={{
              position: "fixed",
              top: pos?.top ?? 0,
              left: pos?.left ?? 0,
              visibility: pos ? "visible" : "hidden",
              zIndex: 1000,
              minWidth: PANEL_W,
              maxWidth: PANEL_W,
              padding: 8,
              gap: 1,
              borderRadius: 10,
              border: "1px solid var(--border-default, #e4e4e7)",
              background: "var(--surface-base, #ffffff)",
              // Match the DS Popover chrome (same border + shadow token).
              boxShadow:
                "var(--shadow-menu, 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1))",
              maxHeight: "min(440px, calc(100vh - 16px))",
              overflowY: "auto",
            }}
          >
            {sortable && (
              <>
                <span className="text-xs font-medium" style={{ color: TEXT_2, padding: "4px 8px" }}>
                  Sort
                </span>
                <button
                  type="button"
                  className={rowCls}
                  style={{ gap: 8, padding: "6px 8px" }}
                  onClick={() => {
                    onSort("asc");
                    setOpen(false);
                  }}
                >
                  <ArrowUp size={14} weight="bold" color={activeDir === "asc" ? ACCENT : TEXT_2} />
                  <span className="text-sm font-normal" style={{ color: TEXT_1 }}>
                    {sortLabels.asc}
                  </span>
                </button>
                <button
                  type="button"
                  className={rowCls}
                  style={{ gap: 8, padding: "6px 8px" }}
                  onClick={() => {
                    onSort("desc");
                    setOpen(false);
                  }}
                >
                  <ArrowDown size={14} weight="bold" color={activeDir === "desc" ? ACCENT : TEXT_2} />
                  <span className="text-sm font-normal" style={{ color: TEXT_1 }}>
                    {sortLabels.desc}
                  </span>
                </button>
                <div style={{ height: 1, background: "var(--border-default, #e4e4e7)", margin: "4px 8px" }} />
              </>
            )}

            <div className="flex items-center justify-between" style={{ padding: "4px 8px" }}>
              <span className="text-xs font-medium" style={{ color: TEXT_2 }}>
                Filter
              </span>
              {selected.length > 0 && (
                <button
                  type="button"
                  onClick={onClear}
                  className="text-xs font-medium transition-opacity hover:opacity-70"
                  style={{ color: ACCENT, background: "transparent" }}
                >
                  Clear{selected.length > 1 ? ` (${selected.length})` : ""}
                </button>
              )}
            </div>

            {showSearch && (
              <div style={{ padding: "2px 4px 6px" }}>
                <Input
                  size="sm"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={`Search ${label.toLowerCase()}`}
                  iconRight={<MagnifyingGlass weight="regular" />}
                  clearable
                  onClear={() => setQuery("")}
                />
              </div>
            )}

            {/* The value list scrolls INTERNALLY so the Sort rows + search stay pinned. */}
            <div
              className="flex flex-col"
              style={{ gap: 1, ...(showSearch ? { maxHeight: 220, overflowY: "auto" } : null) }}
            >
              {visibleOptions.length === 0 ? (
                <span className="text-sm font-normal" style={{ color: TEXT_2, padding: "6px 8px" }}>
                  No matches
                </span>
              ) : (
                visibleOptions.map((o) => (
                  <label
                    key={o.value}
                    className="flex items-center rounded-[6px] cursor-pointer hover:bg-[var(--surface-hover,#f4f4f5)]"
                    style={{ gap: 8, padding: "6px 8px" }}
                  >
                    <Checkbox
                      checked={selected.includes(o.value)}
                      onChange={() => onToggle(o.value)}
                      aria-label={o.label}
                    />
                    <span className="text-sm font-normal" style={{ color: TEXT_1 }}>
                      {o.label}
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>,
          document.body,
        )}
    </span>
  );
}
