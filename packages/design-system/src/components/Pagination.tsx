"use client"
import React, { forwardRef, useMemo } from 'react';
import { cn } from '../utils/cn';

export interface PaginationProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  total: number;
  page: number;
  onChange: (page: number) => void;
  pageSize?: number;
  siblingCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showEdges?: boolean;
}

function getRange(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

const sizeClasses = {
  sm: 'min-w-7 h-7 px-1 text-xs',
  md: 'min-w-8 h-8 px-1.5 text-sm',
  lg: 'min-w-10 h-10 px-2 text-base',
};

const Pagination = forwardRef<HTMLElement, PaginationProps>(
  (
    {
      total,
      page,
      onChange,
      pageSize = 10,
      siblingCount = 1,
      size = 'md',
      showEdges = true,
      className,
      ...props
    },
    ref
  ) => {
    const totalPages = Math.ceil(total / pageSize);

    const pages = useMemo(() => {
      const totalNumbers = siblingCount * 2 + 3; // siblings + current + first + last
      const totalBlocks = totalNumbers + 2; // + 2 ellipses

      if (totalPages <= totalBlocks) {
        return getRange(1, totalPages);
      }

      const leftSibling = Math.max(page - siblingCount, 1);
      const rightSibling = Math.min(page + siblingCount, totalPages);

      const showLeftDots = leftSibling > 2;
      const showRightDots = rightSibling < totalPages - 1;

      if (!showLeftDots && showRightDots) {
        const leftRange = getRange(1, 3 + 2 * siblingCount);
        return [...leftRange, 'dots-right', totalPages];
      }

      if (showLeftDots && !showRightDots) {
        const rightRange = getRange(totalPages - (2 + 2 * siblingCount), totalPages);
        return [1, 'dots-left', ...rightRange];
      }

      const middleRange = getRange(leftSibling, rightSibling);
      return [1, 'dots-left', ...middleRange, 'dots-right', totalPages];
    }, [page, totalPages, siblingCount]);

    if (totalPages <= 1) return null;

    const itemBaseClass = cn(
      'inline-flex items-center justify-center font-medium bg-transparent rounded-md cursor-pointer transition-colors outline-none select-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
      sizeClasses[size]
    );

    return (
      <nav
        ref={ref}
        className={cn('mx-auto flex w-full justify-center', className)}
        aria-label="Pagination"
        {...props}
      >
        <ul className="flex flex-row items-center gap-1">
          {showEdges && (
            <li>
              <button
                className={cn(
                  itemBaseClass,
                  'text-foreground hover:bg-accent hover:text-accent-foreground px-2'
                )}
                onClick={() => onChange(page - 1)}
                disabled={page <= 1}
                aria-label="Previous page"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <path d="M10 12L6 8l4-4" />
                </svg>
                <span className="max-sm:hidden">Previous</span>
              </button>
            </li>
          )}

          {pages.map((p, i) => {
            if (typeof p === 'string') {
              return (
                <li key={`${p}-${i}`} className="flex h-9 w-9 items-center justify-center">
                  <span className="text-muted-foreground tracking-widest select-none">...</span>
                </li>
              );
            }

            return (
              <li key={p}>
                <button
                  className={cn(
                    itemBaseClass,
                    p === page 
                      ? 'border border-primary bg-primary text-primary-foreground shadow-sm pointer-events-none'
                      : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                  onClick={() => onChange(p as number)}
                  aria-label={`Page ${p}`}
                  aria-current={p === page ? 'page' : undefined}
                >
                  {p}
                </button>
              </li>
            );
          })}

          {showEdges && (
            <li>
              <button
                className={cn(
                  itemBaseClass,
                  'text-foreground hover:bg-accent hover:text-accent-foreground px-2'
                )}
                onClick={() => onChange(page + 1)}
                disabled={page >= totalPages}
                aria-label="Next page"
              >
                <span className="max-sm:hidden">Next</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                  <path d="M6 4l4 4-4 4" />
                </svg>
              </button>
            </li>
          )}
        </ul>
      </nav>
    );
  }
);

Pagination.displayName = 'Pagination';
export { Pagination };
export default Pagination;
