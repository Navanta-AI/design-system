"use client"
import React, { forwardRef, useState, useRef, useEffect, useCallback, useId } from 'react';
import { cn } from '../utils/cn';

export interface TabItem {
  id: string;
  label: string;
  disabled?: boolean;
  badge?: string | number;
}

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  tabs: TabItem[];
  activeTab?: string;
  onChange?: (id: string) => void;
  variant?: 'underline' | 'pills' | 'bordered';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
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

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        <div
          ref={listRef}
          role="tablist"
          onKeyDown={handleKeyDown}
          className={cn(
            'relative flex items-center',
            variant !== 'pills' && 'gap-1',
            fullWidth && 'w-full',
            variant === 'pills' && 'inline-flex justify-center rounded-md bg-muted p-1 text-muted-foreground',
            variant === 'underline' && 'border-b border-border',
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
                  'relative inline-flex items-center gap-2 font-medium bg-transparent cursor-pointer whitespace-nowrap transition-colors outline-none select-none disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-1 focus-visible:ring-ring focus-visible:rounded-md',
                  tabSizes[size],
                  fullWidth && 'flex-1 justify-center',
                  
                  // Base state logic
                  !isActive && 'text-muted-foreground hover:text-foreground',
                  isActive && 'text-foreground',

                  // Pills variant
                  variant === 'pills' && 'rounded-md ring-offset-background transition-all focus-visible:ring-1 focus-visible:ring-offset-2',
                  variant === 'pills' && isActive && 'bg-background text-foreground shadow',
                  variant === 'pills' && !isActive && 'hover:text-foreground',

                  // Bordered variant
                  variant === 'bordered' && 'border border-transparent border-b-0 -mb-px rounded-t-md',
                  variant === 'bordered' && isActive && 'border-border bg-muted/20'
                )}
              >
                {tab.label}
                {tab.badge !== undefined && (
                  <span className={cn(
                    'inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 rounded-full text-[10px] font-semibold leading-none',
                    isActive ? 'bg-primary/20 text-primary' : 'bg-muted-foreground/20 text-muted-foreground'
                  )}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
          {variant === 'underline' && (
            <span
              className="absolute bottom-[-1px] h-[2px] bg-primary rounded-full transition-all duration-200 ease-out"
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
