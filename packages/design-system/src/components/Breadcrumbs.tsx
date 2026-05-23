"use client"
import React, { forwardRef } from 'react';
import { cn } from '../utils/cn';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  maxItems?: number;
}

const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(
  (
    {
      items,
      separator,
      maxItems,
      className,
      ...props
    },
    ref
  ) => {
    const defaultSeparator = (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 4l4 4-4 4" />
      </svg>
    );

    let displayItems = items;
    let collapsed = false;

    if (maxItems && items.length > maxItems && maxItems >= 2) {
      displayItems = [items[0], ...items.slice(-(maxItems - 1))];
      collapsed = true;
    }

    return (
      <nav
        ref={ref}
        className={cn('text-sm', className)}
        aria-label="Breadcrumb"
        {...props}
      >
        <ol className="flex flex-wrap items-center gap-1.5 sm:gap-2.5 break-words text-sm text-muted-foreground list-none m-0 p-0">
          {displayItems.map((item, i) => {
            const isLast = i === displayItems.length - 1;
            const showCollapse = collapsed && i === 0;

            const linkStyles = "transition-colors hover:text-foreground outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:rounded-sm";

            return (
              <React.Fragment key={i}>
                <li className="inline-flex items-center gap-1.5">
                  {isLast ? (
                    <span className="font-normal text-foreground" aria-current="page">
                      {item.label}
                    </span>
                  ) : item.href ? (
                    <a className={linkStyles} href={item.href} onClick={item.onClick}>
                      {item.label}
                    </a>
                  ) : (
                    <button className={linkStyles} onClick={item.onClick} type="button">
                      {item.label}
                    </button>
                  )}
                </li>
                {showCollapse && (
                  <>
                    <li className="[&>svg]:size-3.5" aria-hidden="true">
                      {separator || defaultSeparator}
                    </li>
                    <li className="flex h-9 w-9 items-center justify-center">
                      <span className="text-muted-foreground tracking-widest">...</span>
                    </li>
                  </>
                )}
                {!isLast && (
                  <li className="[&>svg]:size-3.5" aria-hidden="true">
                    {separator || defaultSeparator}
                  </li>
                )}
              </React.Fragment>
            );
          })}
        </ol>
      </nav>
    );
  }
);

Breadcrumbs.displayName = 'Breadcrumbs';
export { Breadcrumbs };
export default Breadcrumbs;
