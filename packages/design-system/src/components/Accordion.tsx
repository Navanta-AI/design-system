"use client"
import React, { useState, useId } from 'react';
import { CaretDown } from '@phosphor-icons/react';
import { cn } from '../utils/cn';

export interface AccordionItem {
  title: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  multiple?: boolean;
  defaultOpen?: number[];
  variant?: 'default' | 'bordered' | 'separated';
  className?: string;
}

const variantClasses = {
  default: '',
  bordered: 'border border-border rounded-md overflow-hidden',
  separated: '',
};

const itemClasses = {
  default: 'border-b border-border last:border-b-0',
  bordered: 'border-b border-border last:border-b-0',
  separated: 'border border-border rounded-md mb-4 overflow-hidden last:mb-0',
};

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(({
  items,
  multiple = false,
  defaultOpen = [],
  variant = 'default',
  className,
}, ref) => {
  const [openItems, setOpenItems] = useState<number[]>(defaultOpen);
  const id = useId();

  const toggle = (index: number) => {
    if (multiple) {
      setOpenItems((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      );
    } else {
      setOpenItems((prev) => (prev.includes(index) ? [] : [index]));
    }
  };

  return (
    <div ref={ref} className={cn('w-full', variantClasses[variant], className)}>
      {items.map((item, index) => {
        const isOpen = openItems.includes(index);
        const headerId = `${id}-header-${index}`;
        const panelId = `${id}-panel-${index}`;

        return (
          <div
            key={index}
            className={cn(
              itemClasses[variant],
              item.disabled && 'opacity-50'
            )}
          >
            <button
              type="button"
              id={headerId}
              className={cn(
                'flex items-center justify-between w-full py-4 px-4 bg-transparent cursor-pointer text-left text-foreground text-sm font-medium transition-colors hover:bg-muted/50 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed'
              )}
              onClick={() => !item.disabled && toggle(index)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              aria-disabled={item.disabled || undefined}
              disabled={item.disabled}
            >
              <span className="flex-1 min-w-0">{item.title}</span>
              <CaretDown
                size={16}
                weight="bold"
                className={cn(
                  'shrink-0 text-muted-foreground transition-transform duration-200',
                  isOpen && 'rotate-180'
                )}
              />
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              className={cn(
                'grid transition-[grid-template-rows] duration-200 ease-out',
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              )}
            >
              <div className="overflow-hidden">
                <div className={cn(
                  'px-4 text-muted-foreground text-sm leading-relaxed',
                  isOpen && 'pb-4'
                )}>
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
});

Accordion.displayName = 'Accordion';
export { Accordion };
export default Accordion;
