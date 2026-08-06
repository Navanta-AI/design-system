"use client";

import * as React from "react";
import {
  CalendarBlank,
  CaretLeft,
  CaretRight,
  ArrowsLeftRight,
} from "@phosphor-icons/react";
import { cn } from "../utils/cn";
import { Button } from "./Button";
import { Select } from "./Select";
import { Popover } from "./ui/Popover";

/**
 * Two-segment date range field over a dual-month calendar.
 *
 * One control, two visible ends. A range is picked as a whole, but the two ends
 * aren't always equally editable — a record that has already started can extend
 * its end while its start is fixed, and a single merged field can't express
 * that. Hence `startLocked`, which reads the start as read-only and points every
 * calendar click at the end.
 *
 * Nothing commits until Done: Cancel (and reopening) restores the committed
 * value, so a half-drafted range never leaks out through `onChange`.
 */
export interface DateRangePickerProps {
  /** ISO `yyyy-mm-dd`. An empty string renders the placeholder. */
  startDate: string;
  /** ISO `yyyy-mm-dd`. An empty string renders the placeholder. */
  endDate: string;
  /** Called on Done with both ends as ISO `yyyy-mm-dd`. */
  onChange: (startIso: string, endIso: string) => void;
  /** Shown in an empty segment. Defaults to "Start" / "End" per segment. */
  placeholder?: string;
  /** Read-only field — no popover. */
  disabled?: boolean;
  /** Fix the start and let only the end move. The start segment reads as locked,
   *  calendar clicks set the end, and the panel opens on the end's month rather
   *  than the start's. */
  startLocked?: boolean;
  /** Earliest selectable day (inclusive). Earlier days render muted and ignore
   *  clicks, and month paging stops at this month rather than wandering into
   *  months where everything is blocked. */
  minDate?: Date;
  /** Latest selectable day (inclusive). Same treatment, other end. */
  maxDate?: Date;
  /** How many years ahead the year jump offers when `maxDate` doesn't cap it. */
  yearsAhead?: number;
  /** Which edge the panel anchors to. Use `"end"` when the field sits near the
   *  right of its container, or the panel clips. */
  align?: "start" | "end";
  /** Accessible name for the panel. */
  label?: string;
  className?: string;
}

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

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

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, n: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + n, 1);
}

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

function DateRangePicker({
  startDate,
  endDate,
  onChange,
  placeholder,
  disabled = false,
  startLocked = false,
  minDate,
  maxDate,
  yearsAhead = 5,
  align = "start",
  label = "Select date range",
  className,
}: DateRangePickerProps) {
  /* Compared at day granularity, so the boundary day itself stays selectable. */
  const isOutOfRange = (day: Date) =>
    (minDate != null &&
      day <
        new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())) ||
    (maxDate != null &&
      day >
        new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate()));

  /* First and last month holding a selectable day — paging stops there. */
  const floorMonth = minDate ? startOfMonth(minDate) : null;
  const ceilMonth = maxDate ? startOfMonth(maxDate) : null;

  // Left calendar's month; the right calendar shows the following month.
  const [viewMonth, setViewMonth] = React.useState(() =>
    startOfMonth(parseIso(startDate || toIso(new Date()))),
  );
  // Working (uncommitted) selection — pushed to props only on Done.
  const [draftStart, setDraftStart] = React.useState<Date | null>(
    startDate ? parseIso(startDate) : null,
  );
  const [draftEnd, setDraftEnd] = React.useState<Date | null>(
    endDate ? parseIso(endDate) : null,
  );
  const [hoverDate, setHoverDate] = React.useState<Date | null>(null);

  const displayText =
    startDate && endDate
      ? `${formatDisplay(startDate)} – ${formatDisplay(endDate)}`
      : "";
  /* Two segments split the field's width, so a full "Jun 1, 2026" gets
     ellipsised. The year is only worth the space when the range crosses one. */
  const sameYear =
    !!startDate && !!endDate && startDate.slice(0, 4) === endDate.slice(0, 4);

  /** Restore the draft from props — on (re)open and on Cancel. */
  const resetDraft = () => {
    setDraftStart(startDate ? parseIso(startDate) : null);
    setDraftEnd(endDate ? parseIso(endDate) : null);
    setHoverDate(null);
    /* Open on the month the user can act in. Anchoring to the start is right
       when the whole range is in play, but a locked start would land them on
       months of blocked days — so follow the end instead, clamped to the
       selectable window. */
    const anchor = startLocked
      ? endDate
        ? parseIso(endDate)
        : (minDate ?? new Date())
      : parseIso(startDate || toIso(new Date()));
    const month = startOfMonth(anchor);
    setViewMonth(
      floorMonth && month < floorMonth
        ? floorMonth
        : ceilMonth && month > ceilMonth
          ? ceilMonth
          : month,
    );
  };

  // First click (or a click after a complete range) starts a new range; the next
  // click sets the other end. Nothing commits until Done.
  const handleDayClick = (day: Date) => {
    if (isOutOfRange(day)) return;
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
  };

  const selecting = draftStart !== null && draftEnd === null;
  const previewEnd = selecting ? (hoverDate ?? draftStart) : draftEnd;

  const atFloor =
    floorMonth != null &&
    viewMonth.getFullYear() === floorMonth.getFullYear() &&
    viewMonth.getMonth() === floorMonth.getMonth();
  const atCeil =
    ceilMonth != null &&
    viewMonth.getFullYear() === ceilMonth.getFullYear() &&
    viewMonth.getMonth() === ceilMonth.getMonth();

  /* Years the picker can jump to, so a window a year out is one pick rather than
     twelve caret clicks. */
  const yearOptions = React.useMemo(() => {
    const from = Math.min(
      (floorMonth ?? viewMonth).getFullYear(),
      viewMonth.getFullYear(),
    );
    const to = Math.max(
      from,
      ceilMonth ? ceilMonth.getFullYear() : from + yearsAhead,
      viewMonth.getFullYear(),
    );
    return Array.from({ length: to - from + 1 }, (_, i) => from + i);
  }, [floorMonth, ceilMonth, viewMonth, yearsAhead]);

  const renderMonth = (monthDate: Date) => {
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
      <div className="w-[224px]">
        <div className="mb-1 flex h-7 items-center justify-center text-sm font-medium text-[var(--text-primary,#09090b)]">
          {monthDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </div>

        <div className="mb-1 grid grid-cols-7">
          {WEEKDAY_LABELS.map((w) => (
            <span
              key={w}
              className="text-center text-xs text-[var(--text-secondary,#4b5563)]"
            >
              {w}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-0.5">
          {buildMonthGrid(monthDate).map((day, i) => {
            if (!day) return <span key={`empty-${i}`} />;

            const inRange = lo && hi ? day >= lo && day <= hi : false;
            const isEndpoint = Boolean(
              (draftStart && sameDay(day, draftStart)) ||
                (previewEnd && sameDay(day, previewEnd)),
            );
            const blocked =
              isOutOfRange(day) ||
              (startLocked && draftStart != null && day < draftStart);

            return (
              <button
                key={toIso(day)}
                type="button"
                disabled={blocked}
                aria-pressed={isEndpoint}
                /* Day buttons would otherwise announce as bare numbers, and
                   "14" out of two months of context says nothing. */
                aria-label={day.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
                onClick={() => handleDayClick(day)}
                onMouseEnter={() => selecting && !blocked && setHoverDate(day)}
                className={cn(
                  "h-7 rounded-[6px] text-sm transition-colors",
                  blocked && "cursor-not-allowed",
                  !blocked &&
                    !isEndpoint &&
                    "hover:bg-[var(--surface-hover,#f4f4f5)]",
                )}
                style={{
                  /* Info blue, not the brand accent: the range is the user's own
                     pick, and the accent is reserved for product voice. */
                  background: isEndpoint
                    ? "var(--info-strong, #004b71)"
                    : inRange
                      ? "var(--info-subtle, #f0f9ff)"
                      : "transparent",
                  color: blocked
                    ? "var(--text-neutral, #94a3b8)"
                    : isEndpoint
                      ? "var(--surface-base, #ffffff)"
                      : "var(--text-primary, #09090b)",
                }}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  if (disabled) {
    return (
      <div
        aria-disabled
        className={cn(
          "flex h-8 w-full cursor-not-allowed items-center gap-2 rounded-lg border border-[var(--border-default,#e4e4e7)] bg-[var(--surface-grey,#fafafa)] px-3",
          className,
        )}
      >
        <CalendarBlank
          size={14}
          weight="regular"
          color="var(--text-neutral, #94a3b8)"
          className="shrink-0"
        />
        <span
          className="min-w-0 flex-1 truncate text-sm"
          style={{
            color: displayText
              ? "var(--text-secondary, #4b5563)"
              : "var(--text-neutral, #94a3b8)",
          }}
        >
          {displayText || placeholder || "Select date range"}
        </span>
      </div>
    );
  }

  return (
    <Popover
      align={align}
      label={label}
      className={cn("w-full", className)}
      panelClassName="w-[496px] p-3"
      trigger={({ triggerProps }) => {
        const { onClick: triggerOnClick, ...rest } = triggerProps;
        const open = () => {
          resetDraft();
          triggerOnClick?.();
        };
        const segment = (
          fallback: string,
          value: string,
          locked: boolean,
          which: "start" | "end",
        ) => (
          <button
            /* The popover's ref lives on the end segment; the start opens the
               same panel, so it advertises the same relationship. */
            {...(which === "end"
              ? rest
              : {
                  "aria-haspopup": "dialog" as const,
                  "aria-expanded": rest["aria-expanded"],
                })}
            type="button"
            disabled={locked}
            aria-label={`${which === "start" ? "Start" : "End"} date${
              locked ? ", locked" : ""
            }`}
            onClick={locked ? undefined : open}
            className={cn(
              "flex h-[26px] min-w-0 flex-1 items-center gap-1.5 rounded-[6px] border border-[var(--border-default,#e4e4e7)] px-2 text-left text-sm transition-colors",
              locked
                ? "cursor-not-allowed bg-[var(--surface-grey,#fafafa)]"
                : "bg-[var(--surface-base,#ffffff)] hover:border-[var(--border-control,#9f9fa9)]",
            )}
          >
            <span
              className="min-w-0 flex-1 truncate"
              style={{
                color: value
                  ? locked
                    ? "var(--text-secondary, #4b5563)"
                    : "var(--text-primary, #09090b)"
                  : "var(--text-neutral, #94a3b8)",
              }}
            >
              {value || placeholder || fallback}
            </span>
          </button>
        );
        return (
          <span className="flex w-full items-center gap-1.5 rounded-lg border border-[var(--border-default,#e4e4e7)] bg-[var(--surface-base,#ffffff)] p-[3px]">
            <CalendarBlank
              size={14}
              weight="regular"
              color="var(--text-secondary, #4b5563)"
              className="ml-1 shrink-0"
            />
            {segment(
              "Start",
              formatDisplay(startDate, !sameYear),
              startLocked,
              "start",
            )}
            <ArrowsLeftRight
              size={12}
              weight="regular"
              color="var(--text-neutral, #94a3b8)"
              aria-hidden
              className="shrink-0"
            />
            {segment("End", formatDisplay(endDate, !sameYear), false, "end")}
          </span>
        );
      }}
    >
      {({ close }) => (
        <div>
          {/* Year on the left, month carets grouped right — the jump is a
              destination, the carets a nudge, so they don't interleave. */}
          <div className="mb-2 flex items-center justify-between">
            <span className="w-24">
              <Select
                value={String(viewMonth.getFullYear())}
                onValueChange={(v) => {
                  const next = new Date(Number(v), viewMonth.getMonth(), 1);
                  setViewMonth(
                    floorMonth && next < floorMonth
                      ? floorMonth
                      : ceilMonth && next > ceilMonth
                        ? ceilMonth
                        : next,
                  );
                }}
                size="sm"
              >
                <Select.Trigger aria-label="Jump to year">
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  {yearOptions.map((y) => (
                    <Select.Item key={y} value={String(y)}>
                      {String(y)}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
            </span>

            <span className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Previous month"
                /* Stops at the first month holding a selectable day. */
                disabled={atFloor}
                onClick={() =>
                  setViewMonth((m) => {
                    const back = addMonths(m, -1);
                    return floorMonth && back < floorMonth ? floorMonth : back;
                  })
                }
                className="flex rounded-[6px] p-1 transition-colors hover:bg-[var(--surface-hover,#f4f4f5)] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <CaretLeft
                  size={14}
                  weight="bold"
                  color="var(--text-primary, #09090b)"
                />
              </button>
              <button
                type="button"
                aria-label="Next month"
                disabled={atCeil}
                onClick={() =>
                  setViewMonth((m) => {
                    const fwd = addMonths(m, 1);
                    return ceilMonth && fwd > ceilMonth ? ceilMonth : fwd;
                  })
                }
                className="flex rounded-[6px] p-1 transition-colors hover:bg-[var(--surface-hover,#f4f4f5)] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <CaretRight
                  size={14}
                  weight="bold"
                  color="var(--text-primary, #09090b)"
                />
              </button>
            </span>
          </div>

          <div
            className="flex gap-4"
            onMouseLeave={() => selecting && setHoverDate(null)}
          >
            {renderMonth(viewMonth)}
            {renderMonth(addMonths(viewMonth, 1))}
          </div>

          <div className="mt-3 flex items-center justify-between gap-2 border-t border-[var(--border-default,#e4e4e7)] pt-2.5">
            {/* A half-picked range disables Done, so say what's missing rather
                than leaving a dead button to explain itself. */}
            <span className="text-xs text-[var(--text-secondary,#4b5563)]">
              {selecting ? "Pick an end date" : ""}
            </span>
            <span className="flex items-center gap-2">
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
            </span>
          </div>
        </div>
      )}
    </Popover>
  );
}

export { DateRangePicker };
