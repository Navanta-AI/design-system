"use client";

import { useState } from "react";
import {
  CalendarBlank,
  CaretLeft,
  CaretRight,
  ArrowsLeftRight,
} from "@phosphor-icons/react";
import { Button } from "./Button";
import { Popover } from "./ui/Popover";

// Single field → dual-month range popover. The user clicks a start day then an
// end day (either month) to draft a range; the selection is only committed when
// they press Done (Cancel discards). Replaces the two separate DatePicker
// fields in CampaignCreateModal.

export interface DateRangePickerProps {
  /** ISO yyyy-mm-dd */
  startDate: string;
  /** ISO yyyy-mm-dd */
  endDate: string;
  onChange: (startIso: string, endIso: string) => void;
  placeholder?: string;
  /** Render a non-interactive, read-only field (no popover). */
  disabled?: boolean;
  /** Start is fixed but the end can still move — an active campaign has already
   *  launched, so its start can't change while its end can be extended. The
   *  start segment reads as locked and calendar clicks only move the end. */
  startLocked?: boolean;
  /** Earliest selectable day (inclusive) — earlier days render muted and
   *  ignore clicks. A campaign can't start in the past. */
  minDate?: Date;
  /** Which edge the 496px panel is anchored to. Use "end" when the field sits
   *  near the right of its container, or the panel clips. */
  align?: "start" | "end";
}

function parseIso(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function toIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDisplay(iso: string, withYear = true): string {
  if (!iso) return "";
  return parseIso(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(withYear ? { year: "numeric" as const } : {}),
  });
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function addMonths(date: Date, n: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + n, 1);
}

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function buildMonthGrid(viewMonth: Date): (Date | null)[] {
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const startWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  return cells;
}

export function DateRangePicker({
  startDate,
  endDate,
  onChange,
  placeholder = "Select date range",
  disabled = false,
  minDate,
  align = "start",
  startLocked = false,
}: DateRangePickerProps) {
  /** Compared at day granularity so "today" itself stays selectable. */
  const isBeforeMin = (day: Date) =>
    minDate != null && day < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
  // Left calendar's month; the right calendar shows the following month.
  const [viewMonth, setViewMonth] = useState(() =>
    parseIso(startDate || toIso(new Date())),
  );
  // Working (uncommitted) selection — committed to props only on Done.
  const [draftStart, setDraftStart] = useState<Date | null>(
    startDate ? parseIso(startDate) : null,
  );
  const [draftEnd, setDraftEnd] = useState<Date | null>(
    endDate ? parseIso(endDate) : null,
  );
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const displayText =
    startDate && endDate
      ? `${formatDisplay(startDate)} – ${formatDisplay(endDate)}`
      : "";
  /* Two segments split the field's width in half, so a full "Jun 1, 2026" gets
     ellipsised. The year is only worth the space when the window crosses one. */
  const sameYear =
    !!startDate && !!endDate && startDate.slice(0, 4) === endDate.slice(0, 4);

  // Reset the draft to the committed values — called when (re)opening and on Cancel.
  function resetDraft() {
    setDraftStart(startDate ? parseIso(startDate) : null);
    setDraftEnd(endDate ? parseIso(endDate) : null);
    setHoverDate(null);
    // Open on the month the user can actually act in. Anchoring to the start is
    // right when the whole range is in play, but a locked start would land them
    // on two months of blocked days — so follow the end instead, and never open
    // earlier than minDate's month.
    const anchor = startLocked
      ? (endDate ? parseIso(endDate) : (minDate ?? new Date()))
      : parseIso(startDate || toIso(new Date()));
    const floor = minDate
      ? new Date(minDate.getFullYear(), minDate.getMonth(), 1)
      : null;
    const month = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
    setViewMonth(floor && month < floor ? floor : month);
  }

  // First click (or a click after a complete range) starts a new range;
  // the next click sets the other endpoint. Nothing commits until Done.
  function handleDayClick(day: Date) {
    if (isBeforeMin(day)) return;
    if (startLocked) {
      /* Only the end is in play; a day before the fixed start is meaningless. */
      if (draftStart && day < draftStart) return;
      setDraftEnd(day);
      setHoverDate(null);
      return;
    }
    if (!draftStart || (draftStart && draftEnd)) {
      setDraftStart(day);
      setDraftEnd(null);
      setHoverDate(null);
      return;
    }
    const [lo, hi] = day < draftStart ? [day, draftStart] : [draftStart, day];
    setDraftStart(lo);
    setDraftEnd(hi);
    setHoverDate(null);
  }

  const selecting = draftStart !== null && draftEnd === null;
  const previewEnd = selecting ? (hoverDate ?? draftStart) : draftEnd;

  function renderMonth(monthDate: Date) {
    const lo =
      draftStart && previewEnd
        ? draftStart <= previewEnd
          ? draftStart
          : previewEnd
        : null;
    const hi =
      draftStart && previewEnd
        ? draftStart <= previewEnd
          ? previewEnd
          : draftStart
        : null;

    return (
      <div style={{ width: 224 }}>
        <div
          className="flex items-center justify-center type-body-medium"
          style={{ height: 28, marginBottom: 4, color: "var(--ds-text-primary)" }}
        >
          {monthDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </div>

        <div
          className="grid"
          style={{ gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 4 }}
        >
          {WEEKDAY_LABELS.map((w) => (
            <span
              key={w}
              className="type-caption font-normal"
              style={{ textAlign: "center", color: "var(--ds-text-secondary)" }}
            >
              {w}
            </span>
          ))}
        </div>

        <div className="grid" style={{ gridTemplateColumns: "repeat(7, 1fr)", rowGap: 2 }}>
          {buildMonthGrid(monthDate).map((day, i) => {
            if (!day) return <span key={`empty-${i}`} />;

            const inRange = lo && hi ? day >= lo && day <= hi : false;
            const isEndpoint =
              (draftStart && sameDay(day, draftStart)) ||
              (previewEnd && sameDay(day, previewEnd));
            const blocked =
              isBeforeMin(day) ||
              (startLocked && draftStart != null && day < draftStart);

            return (
              <button
                key={toIso(day)}
                type="button"
                disabled={blocked}
                aria-disabled={blocked || undefined}
                onClick={() => handleDayClick(day)}
                onMouseEnter={() => selecting && !blocked && setHoverDate(day)}
                className="type-body font-normal"
                style={{
                  height: 28,
                  borderRadius: 6,
                  /* Blue, not iris purple — purple is reserved for IRIS's own
                     voice, and this range is the user's own pick. */
                  background: isEndpoint
                    ? "var(--color-info-700)"
                    : inRange
                      ? "var(--color-info-50)"
                      : "transparent",
                  color: blocked
                    ? "var(--ds-text-placeholder)"
                    : isEndpoint
                      ? "#fff"
                      : "var(--ds-text-primary)",
                  cursor: blocked ? "not-allowed" : "pointer",
                }}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (disabled) {
    return (
      <div
        className="flex items-center gap-2 px-3 w-full"
        style={{
          height: 32,
          border: "1px solid var(--ds-border-default)",
          borderRadius: 8,
          background: "var(--ds-surface-grey)",
          cursor: "not-allowed",
        }}
      >
        <CalendarBlank size={14} weight="regular" color="var(--ds-text-placeholder)" style={{ flexShrink: 0 }} />
        <span
          className="type-body font-normal"
          style={{
            flex: 1,
            minWidth: 0,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            color: displayText ? "var(--ds-text-secondary)" : "var(--ds-text-placeholder)",
          }}
        >
          {displayText || placeholder}
        </span>
      </div>
    );
  }

  return (
    <Popover
      align={align}
      label="Select campaign duration"
      trigger={({ triggerProps }) => {
        const { onClick: triggerOnClick, ...rest } = triggerProps;
        const open = () => {
          resetDraft();
          triggerOnClick?.();
        };
        /* Two segments, one popover: a range is picked as a whole, but the two
           ends aren't always equally editable — an active campaign's start is
           fixed while its end can move, and a single merged field can't show
           that. The locked segment reads as read-only and doesn't open. */
        const segment = (
          label: string,
          value: string,
          locked: boolean,
          which: "start" | "end",
        ) => (
          <button
            {...(which === "end" ? rest : {})}
            type="button"
            disabled={locked}
            aria-label={`${which === "start" ? "Start" : "End"} date${
              locked ? " (locked)" : ""
            }`}
            title={
              locked ? "Locked — the campaign has already started" : undefined
            }
            onClick={locked ? undefined : open}
            className="flex items-center px-2 min-w-0"
            style={{
              height: 26,
              flex: 1,
              gap: 6,
              borderRadius: 6,
              background: locked ? "var(--ds-surface-grey)" : "var(--surface-base)",
              border: "1px solid var(--ds-border-subtle)",
              cursor: locked ? "not-allowed" : "pointer",
              textAlign: "left",
            }}
          >
            <span
              className="type-body font-normal"
              style={{
                flex: 1,
                minWidth: 0,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                color: value
                  ? locked
                    ? "var(--ds-text-secondary)"
                    : "var(--ds-text-primary)"
                  : "var(--ds-text-placeholder)",
              }}
            >
              {value || label}
            </span>
          </button>
        );
        return (
          <span
            className="flex items-center w-full"
            style={{
              gap: 6,
              padding: 3,
              borderRadius: 8,
              border: "1px solid var(--ds-border-default)",
              background: "var(--surface-base)",
            }}
          >
            <CalendarBlank
              size={14}
              weight="regular"
              color="var(--ds-text-secondary)"
              style={{ flexShrink: 0, marginLeft: 4 }}
            />
            {segment("Start", formatDisplay(startDate, !sameYear), startLocked, "start")}
            <ArrowsLeftRight
              size={12}
              weight="regular"
              color="var(--ds-text-placeholder)"
              aria-hidden
              style={{ flexShrink: 0 }}
            />
            {segment("End", formatDisplay(endDate, !sameYear), false, "end")}
          </span>
        );
      }}
    >
      {({ close }) => (
        <div style={{ padding: 12, width: 496 }}>
          <div className="flex items-start justify-between" style={{ marginBottom: 8 }}>
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => setViewMonth((m) => addMonths(m, -1))}
              style={{ padding: 4, display: "flex" }}
            >
              <CaretLeft size={14} weight="bold" color="var(--ds-text-primary)" />
            </button>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => setViewMonth((m) => addMonths(m, 1))}
              style={{ padding: 4, display: "flex" }}
            >
              <CaretRight size={14} weight="bold" color="var(--ds-text-primary)" />
            </button>
          </div>

          <div
            className="flex gap-4"
            onMouseLeave={() => selecting && setHoverDate(null)}
          >
            {renderMonth(viewMonth)}
            {renderMonth(addMonths(viewMonth, 1))}
          </div>

          <div
            className="flex items-center justify-end gap-2"
            style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid var(--ds-border-subtle)" }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                resetDraft();
                close();
              }}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={!(draftStart && draftEnd)}
              onClick={() => {
                if (draftStart && draftEnd) {
                  onChange(toIso(draftStart), toIso(draftEnd));
                  close();
                }
              }}
            >
              Done
            </Button>
          </div>
        </div>
      )}
    </Popover>
  );
}
