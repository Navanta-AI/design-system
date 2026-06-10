"use client"
import React, { forwardRef, useState, useRef, useEffect, useCallback, useId } from 'react';
import { cn } from '../utils/cn';

/** Minimal structural type for a Phosphor-style icon component. */
type TabIconComponent = React.ComponentType<{
  size?: number;
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
  color?: string;
  className?: string;
}>;

export interface TabItem {
  id: string;
  label: string;
  disabled?: boolean;
  badge?: string | number;
  /** Leading icon (used by the `underline-pill` variant). */
  icon?: TabIconComponent;
  /** `critical` tints the leading icon red (urgency cue) — `underline-pill` only. */
  tone?: 'critical';
}

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  tabs: TabItem[];
  activeTab?: string;
  onChange?: (id: string) => void;
  /**
   * `underline-pill` is the wb-fe / IRIS tab bar: a bottom-divided row of
   * underline tabs whose label sits in a soft active pill, with optional
   * leading icon, count badge, and a right-aligned `rightSlot`.
   */
  variant?: 'underline' | 'pills' | 'bordered' | 'underline-pill';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  /** Right-aligned content (e.g. a filter/severity-chip group). `underline-pill` only. */
  rightSlot?: React.ReactNode;
}

const tabSizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-2.5 text-base',
};

const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      tabs,
      activeTab,
      onChange,
      variant = 'underline',
      size = 'md',
      fullWidth = false,
      rightSlot,
      className,
      ...props
    },
    ref
  ) => {
    const baseId = useId();
    const [active, setActive] = useState(activeTab || tabs[0]?.id || '');
    const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});
    const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
    const listRef = useRef<HTMLDivElement>(null);

    const currentActive = activeTab !== undefined ? activeTab : active;

    const updateIndicator = useCallback(() => {
      if (variant !== 'underline') return;
      const el = tabRefs.current.get(currentActive);
      const list = listRef.current;
      if (el && list) {
        const listRect = list.getBoundingClientRect();
        const tabRect = el.getBoundingClientRect();
        setIndicatorStyle({
          left: tabRect.left - listRect.left,
          width: tabRect.width,
        });
      }
    }, [currentActive, variant]);

    useEffect(() => {
      updateIndicator();
    }, [currentActive, updateIndicator]);

    useEffect(() => {
      window.addEventListener('resize', updateIndicator);
      return () => window.removeEventListener('resize', updateIndicator);
    }, [updateIndicator]);

    const handleClick = (id: string) => {
      if (activeTab === undefined) setActive(id);
      onChange?.(id);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      const enabledTabs = tabs.filter((t) => !t.disabled);
      const currentIndex = enabledTabs.findIndex((t) => t.id === currentActive);

      let nextIndex = currentIndex;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        nextIndex = (currentIndex + 1) % enabledTabs.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        nextIndex = (currentIndex - 1 + enabledTabs.length) % enabledTabs.length;
      } else if (e.key === 'Home') {
        e.preventDefault();
        nextIndex = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        nextIndex = enabledTabs.length - 1;
      }

      if (nextIndex !== currentIndex) {
        const nextTab = enabledTabs[nextIndex];
        handleClick(nextTab.id);
        tabRefs.current.get(nextTab.id)?.focus();
      }
    };

    // wb-fe / IRIS tab bar: bottom-divided row, soft active pill, optional
    // leading icon + count badge, right-aligned slot. Static border-b-2 per
    // tab (no sliding indicator).
    if (variant === 'underline-pill') {
      return (
        <div
          ref={ref}
          className={cn(
            'flex items-center justify-between border-b border-[var(--surface-sunken)]',
            className,
          )}
          {...props}
        >
          <div
            role="tablist"
            onKeyDown={handleKeyDown}
            className="hide-scrollbar flex items-center gap-4 overflow-x-auto px-4 min-w-0"
          >
            <div className="flex items-center gap-4 min-w-max">
              {tabs.map((tab) => {
                const isActive = currentActive === tab.id;
                const Icon = tab.icon;
                const iconColor =
                  tab.tone === 'critical' ? 'var(--color-critical-700, #B91C1C)' : undefined;
                return (
                  <button
                    key={tab.id}
                    ref={(el) => {
                      if (el) tabRefs.current.set(tab.id, el);
                    }}
                    role="tab"
                    id={`${baseId}-tab-${tab.id}`}
                    aria-selected={isActive}
                    aria-controls={`${baseId}-panel-${tab.id}`}
                    tabIndex={isActive ? 0 : -1}
                    disabled={tab.disabled}
                    onClick={() => handleClick(tab.id)}
                    className={cn(
                      'flex items-center justify-center h-12 text-sm transition-colors border-b-2 bg-transparent cursor-pointer outline-none disabled:opacity-40 disabled:cursor-not-allowed',
                      isActive
                        ? 'border-[var(--tab-active-border)] text-[var(--text-primary)] font-medium'
                        : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
                    )}
                  >
                    <span
                      className={cn(
                        'flex items-center gap-1.5 px-[8px] py-[4px] rounded-[8px] transition-colors',
                        isActive && 'bg-[var(--ds-surface-active)]',
                      )}
                    >
                      {Icon && (
                        <Icon
                          size={14}
                          weight={isActive ? 'duotone' : 'regular'}
                          color={iconColor}
                          className="shrink-0"
                        />
                      )}
                      {tab.label}
                      {tab.badge !== undefined && (
                        <span
                          className={cn(
                            'inline-flex items-center justify-center min-w-[16px] h-[18px] px-1.5 rounded-full text-xs',
                            isActive
                              ? 'gradient-badge text-[var(--text-inverse-muted)] font-semibold'
                              : 'bg-[var(--surface-sunken)] text-[var(--text-secondary)] font-medium',
                          )}
                        >
                          {tab.badge}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          {rightSlot && <div className="flex items-center shrink-0 pr-4">{rightSlot}</div>}
        </div>
      );
    }

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        <div
          ref={listRef}
          role="tablist"
          onKeyDown={handleKeyDown}
          className={cn(
            'relative flex items-center',
            variant === 'underline' && 'gap-4',
            variant === 'bordered' && 'gap-1',
            fullWidth && 'w-full',
            variant === 'pills' && 'inline-flex justify-center rounded-md bg-muted p-1 text-muted-foreground',
            variant === 'bordered' && 'border-b border-border'
          )}
        >
          {tabs.map((tab) => {
            const isActive = currentActive === tab.id;
            return (
              <button
                key={tab.id}
                ref={(el) => {
                  if (el) tabRefs.current.set(tab.id, el);
                }}
                role="tab"
                id={`${baseId}-tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`${baseId}-panel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                disabled={tab.disabled}
                onClick={() => handleClick(tab.id)}
                className={cn(
                  'relative inline-flex items-center bg-transparent cursor-pointer whitespace-nowrap transition-colors outline-none select-none disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-1 focus-visible:ring-ring focus-visible:rounded-md',
                  variant === 'underline' ? 'py-3' : tabSizes[size],
                  fullWidth && 'flex-1 justify-center',

                  // Underline variant — text color handled on inner pill
                  variant === 'underline' && !isActive && 'text-[var(--text-secondary)]',
                  variant === 'underline' && isActive && 'text-[var(--text-primary)]',

                  // Non-underline base state
                  variant !== 'underline' && 'font-medium gap-2',
                  variant !== 'underline' && !isActive && 'text-muted-foreground hover:text-foreground',
                  variant !== 'underline' && isActive && 'text-foreground',

                  // Pills variant
                  variant === 'pills' && 'rounded-md ring-offset-background transition-all focus-visible:ring-1 focus-visible:ring-offset-2',
                  variant === 'pills' && isActive && 'bg-background text-foreground shadow',
                  variant === 'pills' && !isActive && 'hover:text-foreground',

                  // Bordered variant
                  variant === 'bordered' && 'border border-transparent border-b-0 -mb-px rounded-t-md',
                  variant === 'bordered' && isActive && 'border-border bg-muted/20'
                )}
              >
                {variant === 'underline' ? (
                  <span className={cn(
                    'inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm leading-[22px] transition-colors',
                    isActive ? 'bg-[var(--surface-hover)] font-medium' : 'font-normal hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]'
                  )}>
                    {tab.label}
                    {tab.badge !== undefined && (
                      <span className={cn(
                        'inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 rounded-full text-[10px] font-semibold leading-none',
                        isActive ? 'bg-primary/20 text-primary' : 'bg-muted-foreground/20 text-muted-foreground'
                      )}>
                        {tab.badge}
                      </span>
                    )}
                  </span>
                ) : (
                  <>
                    {tab.label}
                    {tab.badge !== undefined && (
                      <span className={cn(
                        'inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 rounded-full text-[10px] font-semibold leading-none',
                        isActive ? 'bg-primary/20 text-primary' : 'bg-muted-foreground/20 text-muted-foreground'
                      )}>
                        {tab.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
          {variant === 'underline' && (
            <span
              className="absolute bottom-0 h-[2px] bg-[var(--text-primary)] transition-all duration-200 ease-out"
              style={indicatorStyle}
            />
          )}
        </div>
      </div>
    );
  }
);
Tabs.displayName = 'Tabs';

export interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  tabId: string;
  activeTab: string;
}

const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(
  ({ tabId, activeTab, children, className, ...props }, ref) => {
    if (tabId !== activeTab) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        className={cn('py-4', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabPanel.displayName = 'TabPanel';

export { Tabs, TabPanel };
export default Tabs;
