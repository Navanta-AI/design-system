"use client"
import React, { forwardRef, createContext, useContext } from 'react';
import { CaretUp, CaretDown, CaretUpDown } from '@phosphor-icons/react';
import { cn } from '../utils/cn';

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
        <div className={cn("w-full overflow-x-auto border border-border rounded-lg bg-background",
          "max-md:border-none max-md:rounded-none max-md:bg-transparent max-md:overflow-visible"
        )}>
          <table ref={ref} className={cn("w-full border-collapse text-sm text-foreground max-md:block", className)} {...props}>
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
        className={cn("bg-background max-md:hidden", stickyHeader && "sticky top-0 z-10", className)}
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
      <tbody ref={ref} className={cn("max-md:block", className)} {...props}>
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
        className={cn(
          "border-b border-border transition-colors last:border-b-0",
          hoverable && "hover:bg-muted/50",
          striped && "even:bg-muted/30",
          selected && "bg-primary/20",
          "max-md:block max-md:bg-card max-md:border max-md:border-border max-md:rounded-lg max-md:p-3 max-md:mb-4 max-md:shadow-sm max-md:last:border-b",
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
}

const TableHeadCell = forwardRef<HTMLTableCellElement, TableHeadCellProps>(
  ({ sortable, sortDirection, onSort, align, className, children, ...props }, ref) => {
    const { compact } = useContext(TableContext);
    return (
      <th
        ref={ref}
        className={cn(
          "text-left font-medium text-sm text-foreground border-b-2 border-border whitespace-nowrap",
          compact ? "p-2" : "p-4",
          align === 'center' && "text-center",
          align === 'right' && "text-right",
          sortable && "cursor-pointer select-none transition-colors hover:text-primary",
          className
        )}
        onClick={sortable ? onSort : undefined}
        aria-sort={sortDirection === 'asc' ? 'ascending' : sortDirection === 'desc' ? 'descending' : undefined}
        {...props}
      >
        <span className={cn("flex items-center gap-2", align === 'right' && "justify-end", align === 'center' && "justify-center")}>
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

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  align?: 'left' | 'center' | 'right';
  mono?: boolean;
  'data-label'?: string;
}

const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ align, mono, className, children, 'data-label': dataLabel, ...props }, ref) => {
    const { compact } = useContext(TableContext);
    return (
      <td 
        ref={ref} 
        data-label={dataLabel}
        className={cn(
          "text-muted-foreground align-middle",
          compact ? "p-2" : "p-4",
          align === 'center' && "text-center",
          align === 'right' && "text-right",
          mono && "font-mono text-xs tracking-tight",
          "max-md:flex max-md:justify-between max-md:items-start max-md:py-3 max-md:px-0 max-md:border-b max-md:border-border max-md:text-right max-md:last:border-b-0",
          className
        )} 
        {...props}
      >
        {dataLabel && <span className="md:hidden font-medium text-foreground text-xs uppercase tracking-wider text-left pr-4 opacity-80 shrink-0">{dataLabel}</span>}
        <span className="md:contents">{children}</span>
      </td>
    );
  }
);
TableCell.displayName = 'TableCell';

const Table = Object.assign(TableRoot, {
  Header: TableHeader,
  Body: TableBody,
  Row: TableRow,
  HeadCell: TableHeadCell,
  Cell: TableCell,
});

export { Table };
export default Table;
