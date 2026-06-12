"use client"
import React, { forwardRef, createContext, useContext, useState } from 'react';
import { CaretUp, CaretDown, CaretUpDown, Copy, Check } from '@phosphor-icons/react';
import { cn } from '../utils/cn';
import { Input } from './Input';
import { Pill, type PillProps } from './Pill';
import { AiStar } from './ui/AiStar';
import {
  TABLE_STATUSES,
  statusToneColor,
  formatTableDate,
  formatRelativeTime,
  type TableStatusKey,
  type TableStatusTone,
} from './table-cell-utils';

/* Small inline copy-to-clipboard button used by `id` cells. */
function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      aria-label="Copy"
      onClick={() => {
        navigator.clipboard?.writeText(value).then(
          () => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
          },
          () => {},
        );
      }}
      className="inline-flex items-center py-1 text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
    >
      {copied ? <Check size={12} weight="bold" className="text-[var(--success)]" /> : <Copy size={12} weight="regular" />}
    </button>
  );
}

interface TableContextValue {
  striped: boolean;
  hoverable: boolean;
  compact: boolean;
  stickyHeader: boolean;
}

const TableContext = createContext<TableContextValue>({
  striped: false,
  hoverable: false,
  compact: false,
  stickyHeader: false,
});

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  striped?: boolean;
  hoverable?: boolean;
  compact?: boolean;
  stickyHeader?: boolean;
}

const TableRoot = forwardRef<HTMLTableElement, TableProps>(
  (
    {
      striped = false,
      hoverable = false,
      compact = false,
      stickyHeader = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <TableContext.Provider value={{ striped, hoverable, compact, stickyHeader }}>
        <div className={cn("w-full overflow-x-auto bg-background",
          "max-md:bg-transparent max-md:overflow-visible"
        )}>
          <table ref={ref} className={cn("w-full text-sm text-foreground max-md:block", className)} style={{ borderCollapse: 'collapse' }} {...props}>
            {children}
          </table>
        </div>
      </TableContext.Provider>
    );
  }
);
TableRoot.displayName = 'Table';

export interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, children, ...props }, ref) => {
    const { stickyHeader } = useContext(TableContext);
    return (
      <thead
        ref={ref}
        className={cn("bg-[#fafafa] [&>tr]:h-[50px] max-md:hidden", stickyHeader && "sticky top-0 z-10", className)}
        {...props}
      >
        {children}
      </thead>
    );
  }
);
TableHeader.displayName = 'TableHeader';

export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <tbody ref={ref} className={cn("[&>tr]:h-[56px] max-md:block", className)} {...props}>
        {children}
      </tbody>
    );
  }
);
TableBody.displayName = 'TableBody';

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean;
}

const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ selected, className, children, ...props }, ref) => {
    const { striped, hoverable } = useContext(TableContext);
    return (
      <tr
        ref={ref}
        // Selection is shown by the row checkbox only — no row tint. data-selected is
        // exposed so consumers can opt into their own styling.
        data-selected={selected || undefined}
        style={{ borderBottom: '1px solid var(--border-light)' }}
        className={cn(
          "bg-white transition-[opacity,background-color]",
          hoverable && "[tbody_&]:hover:bg-[#fafafa]",
          striped && "even:bg-muted/30",
          "max-md:block max-md:bg-card max-md:border max-md:border-border max-md:rounded-lg max-md:p-3 max-md:mb-4 max-md:shadow-sm",
          className
        )}
        {...props}
      >
        {children}
      </tr>
    );
  }
);
TableRow.displayName = 'TableRow';

export interface TableHeadCellProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean;
  sortDirection?: 'asc' | 'desc' | null;
  onSort?: () => void;
  align?: 'left' | 'center' | 'right';
  /** Flags an AI-derived column — renders the standard Christy AI star before the label. */
  ai?: boolean;
}

const TableHeadCell = forwardRef<HTMLTableCellElement, TableHeadCellProps>(
  ({ sortable, sortDirection, onSort, align, ai, className, children, ...props }, ref) => {
    const { compact } = useContext(TableContext);
    return (
      <th
        ref={ref}
        className={cn(
          "text-left font-semibold text-[13px] leading-[18px] text-foreground whitespace-nowrap",
          compact ? "p-2" : "px-4 py-3",
          align === 'center' && "text-center",
          align === 'right' && "text-right",
          // Default alignment: every column left (numbers included), last column right.
          // Only applies when `align` is unset, so an explicit align always wins.
          align == null && "last:text-right",
          sortable && "cursor-pointer select-none transition-colors hover:text-primary",
          className
        )}
        onClick={sortable ? onSort : undefined}
        aria-sort={sortDirection === 'asc' ? 'ascending' : sortDirection === 'desc' ? 'descending' : undefined}
        {...props}
      >
        <span
          className={cn(
            "flex items-center gap-2",
            align === 'right' && "justify-end",
            align === 'center' && "justify-center",
            // The label is a flex row, so the th's last:text-right can't move it — mirror
            // the last-column default here.
            align == null && "[th:last-child>&]:justify-end",
          )}
        >
          {ai && <AiStar size={14} className="shrink-0" title="AI-generated column" />}
          {children}
          {sortable && (
            <span className={cn(
              "inline-flex items-center transition-all",
              sortDirection ? "opacity-100 text-primary" : "opacity-40 hover:opacity-100"
            )} aria-hidden="true">
              {sortDirection === 'asc' ? <CaretUp weight="bold" size={12} /> : sortDirection === 'desc' ? <CaretDown weight="bold" size={12} /> : <CaretUpDown weight="bold" size={12} />}
            </span>
          )}
        </span>
      </th>
    );
  }
);
TableHeadCell.displayName = 'TableHeadCell';

/** Standardized cell content types (matches the HMTX Portal table design). */
export type TableCellVariant = 'id' | 'party' | 'status' | 'date' | 'input' | 'pill';

export interface TableCellProps extends Omit<React.TdHTMLAttributes<HTMLTableCellElement>, 'onChange'> {
  align?: 'left' | 'center' | 'right';
  mono?: boolean;
  'data-label'?: string;

  /** Renders standardized content instead of `children`. */
  variant?: TableCellVariant;

  /* variant="id" — ID / SKU with optional circle-badge icon + copy button */
  value?: string;
  /** Leading icon; when present a navy circle badge is shown (set badge={false} to suppress). */
  icon?: React.ReactNode;
  badge?: boolean;
  href?: string;
  copyable?: boolean;

  /* variant="party" — avatar + title + subtitle (e.g. "Ship to") */
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  avatar?: { src?: string; initials?: string; alt?: string };

  /* variant="status" — progress dots + label */
  status?: TableStatusKey;
  steps?: number;
  completed?: number;
  tone?: TableStatusTone;
  label?: React.ReactNode;

  /* variant="pill" — a status Pill (semantic color + optional outline icon).
     Uses `label` for the text and `icon` for the leading glyph. */
  pillVariant?: PillProps['variant'];
  pillSize?: PillProps['size'];

  /* variant="date" — formatted date + relative subtext */
  date?: Date | string | number;
  relative?: boolean;
  subtext?: React.ReactNode;
  now?: Date | number;

  /* variant="input" — inline editable cell (shares `value`) */
  onValueChange?: (value: string) => void;
  placeholder?: string;
  inputType?: 'text' | 'number' | 'email';
  inputDisabled?: boolean;
}

function StatusDots({ steps, completed, tone }: { steps: number; completed: number; tone: TableStatusTone }) {
  const color = statusToneColor[tone];
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: steps }, (_, i) => (
        <span
          key={i}
          className="size-2 shrink-0 rounded-full"
          style={i < completed ? { background: color } : { border: '1px solid var(--border-strong)' }}
        />
      ))}
    </div>
  );
}

function renderVariant(props: TableCellProps): React.ReactNode {
  switch (props.variant) {
    case 'id': {
      const showBadge = props.badge ?? Boolean(props.icon);
      // Only link-style (link color + medium weight) when the ID is actually a
      // link. A plain ID (no href) is neutral, normal-weight text — link color
      // implies clickability.
      const isLink = Boolean(props.href);
      const text = (
        <span
          className={`text-[14px] leading-[22px] whitespace-nowrap ${
            isLink ? 'font-medium text-[var(--text-link)]' : 'font-normal text-[var(--text-primary)]'
          }`}
        >
          {props.value}
        </span>
      );
      const idRow = (
        <span className="inline-flex items-center gap-2">
          {showBadge && props.icon && (
            <span
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-white [&>svg]:size-4"
              style={{ background: 'var(--info-strong)' }}
            >
              {props.icon}
            </span>
          )}
          <span className="inline-flex items-start gap-1">
            {isLink ? (
              <a href={props.href} className="no-underline hover:underline">{text}</a>
            ) : (
              text
            )}
            {(props.copyable ?? true) && props.value != null && <CopyButton value={props.value} />}
          </span>
        </span>
      );
      // Optional product/description subtitle below the ID (e.g. SKU + product name).
      if (props.subtitle != null) {
        return (
          <span className="flex flex-col gap-[var(--text-stack-gap)]">
            {idRow}
            <span className="text-[12px] leading-[18px] text-[var(--text-secondary)] whitespace-nowrap">
              {props.subtitle}
            </span>
          </span>
        );
      }
      return idRow;
    }
    case 'party': {
      const a = props.avatar;
      return (
        <span className="inline-flex items-center gap-2">
          {a && (
            <span
              className="inline-flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full"
              style={{ background: 'var(--info-subtle)' }}
            >
              {a.src ? (
                <img src={a.src} alt={a.alt ?? ''} className="size-full object-cover" />
              ) : (
                <span className="text-[14px] font-medium text-[var(--text-link)]">{a.initials}</span>
              )}
            </span>
          )}
          <span className="flex flex-col gap-[var(--text-stack-gap)]">
            <span className="text-[14px] font-medium leading-[22px] text-[var(--text-primary)] whitespace-nowrap">{props.title}</span>
            {props.subtitle != null && (
              <span className="text-[12px] leading-[18px] text-[var(--text-secondary)] whitespace-nowrap">{props.subtitle}</span>
            )}
          </span>
        </span>
      );
    }
    case 'status': {
      const def = props.status ? TABLE_STATUSES[props.status] : undefined;
      const steps = props.steps ?? def?.steps ?? 0;
      const completed = props.completed ?? def?.completed ?? 0;
      const tone = props.tone ?? def?.tone ?? 'neutral';
      const label = props.label ?? def?.label;
      return (
        <span className="flex flex-col gap-1">
          {steps > 0 && <StatusDots steps={steps} completed={completed} tone={tone} />}
          {label != null && (
            <span className="text-[12px] leading-[18px] text-[var(--text-secondary)] whitespace-nowrap">{label}</span>
          )}
        </span>
      );
    }
    case 'date': {
      const sub =
        props.subtext ?? (props.relative !== false && props.date != null ? formatRelativeTime(props.date, props.now) : null);
      return (
        <span className="flex flex-col gap-[var(--text-stack-gap)]">
          <span className="text-[14px] leading-[22px] text-[var(--text-primary)] whitespace-nowrap">
            {props.date != null ? formatTableDate(props.date) : null}
          </span>
          {sub != null && <span className="text-[12px] leading-[18px] text-[var(--text-secondary)] whitespace-nowrap">{sub}</span>}
        </span>
      );
    }
    case 'input':
      return (
        <div className="min-w-[120px]">
          <Input
            size="sm"
            className="w-full"
            value={props.value ?? ''}
            type={props.inputType}
            disabled={props.inputDisabled}
            placeholder={props.placeholder}
            onChange={(e) => props.onValueChange?.(e.target.value)}
          />
        </div>
      );
    case 'pill':
      return (
        <Pill variant={props.pillVariant} size={props.pillSize ?? 'sm'} icon={props.icon}>
          {props.label}
        </Pill>
      );
    default:
      return null;
  }
}

const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>((props, ref) => {
  const { compact } = useContext(TableContext);
  const {
    align,
    mono,
    className,
    children,
    'data-label': dataLabel,
    variant,
    // pull variant-only props out so they aren't spread onto the <td>
    value, icon, badge, href, copyable,
    title, subtitle, avatar,
    status, steps, completed, tone, label,
    pillVariant, pillSize,
    date, relative, subtext, now,
    onValueChange, placeholder, inputType, inputDisabled,
    ...rest
  } = props;

  const content = variant ? renderVariant(props) : <span className="md:contents">{children}</span>;

  return (
    <td
      ref={ref}
      data-label={dataLabel}
      style={compact ? undefined : { padding: '0 16px', verticalAlign: 'middle' }}
      className={cn(
        "text-muted-foreground",
        compact && "p-2",
        align === 'center' && "text-center",
        align === 'right' && "text-right",
        // Default alignment: left for every column (numbers included), right for the
        // last column only. An explicit `align` wins.
        align == null && "last:text-right",
        mono && !variant && "font-mono text-xs tracking-tight",
        "max-md:flex max-md:justify-between max-md:items-start max-md:py-3 max-md:px-0 max-md:border-b max-md:border-border max-md:text-right max-md:last:border-b-0",
        className
      )}
      {...rest}
    >
      {dataLabel && <span className="md:hidden font-medium text-foreground text-xs uppercase tracking-wider text-left pr-4 opacity-80 shrink-0">{dataLabel}</span>}
      {content}
    </td>
  );
});
TableCell.displayName = 'TableCell';

export interface TableEmptyProps extends React.HTMLAttributes<HTMLTableRowElement> {
  /** Columns to span (default 100 — spans the whole row regardless of column count). */
  colSpan?: number;
  /** Minimum height of the centered area (default 320). */
  minHeight?: number;
}

/**
 * Full-width centered empty row — keeps the table's column headers visible and
 * centers an <EmptyState> (or any content) in the body. Use when a Table.Body
 * has no rows (no results / first-time).
 */
const TableEmpty = forwardRef<HTMLTableRowElement, TableEmptyProps>(
  ({ colSpan = 100, minHeight = 320, className, children, ...props }, ref) => (
    <tr ref={ref} className={cn('max-md:block', className)} {...props}>
      <td colSpan={colSpan} className="p-0 max-md:block">
        <div className="flex items-center justify-center" style={{ minHeight }}>
          {children}
        </div>
      </td>
    </tr>
  )
);
TableEmpty.displayName = 'TableEmpty';

const Table = Object.assign(TableRoot, {
  Header: TableHeader,
  Body: TableBody,
  Row: TableRow,
  HeadCell: TableHeadCell,
  Cell: TableCell,
  Empty: TableEmpty,
});

export { Table };
export default Table;
