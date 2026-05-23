"use client"
import React, { useState, useRef, useEffect, useId } from 'react';
import { cn } from '../utils/cn';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  delay?: number;
  className?: string;
}

const Tooltip = React.forwardRef<HTMLSpanElement, TooltipProps>(({
  content,
  children,
  side = 'top',
  align = 'center',
  delay = 300,
  className,
}, ref) => {
  const [visible, setVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const id = useId();
  const tooltipId = `tooltip-${id}`;

  useEffect(() => {
    const mq = window.matchMedia('(hover: none) and (pointer: coarse)');
    setIsTouch(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const show = () => {
    timeoutRef.current = setTimeout(() => setVisible(true), delay);
  };

  const hide = () => {
    clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  const toggle = () => {
    if (isTouch) setVisible((v) => !v);
  };

  const sideClasses = {
    top: 'bottom-[calc(100%+8px)]',
    bottom: 'top-[calc(100%+8px)]',
    left: 'right-[calc(100%+8px)] top-1/2 -translate-y-1/2',
    right: 'left-[calc(100%+8px)] top-1/2 -translate-y-1/2',
  };

  const alignClasses = {
    top: {
      center: 'left-1/2 -translate-x-1/2',
      start: 'left-0',
      end: 'right-0 left-auto',
    },
    bottom: {
      center: 'left-1/2 -translate-x-1/2',
      start: 'left-0',
      end: 'right-0 left-auto',
    },
    left: { center: '', start: '', end: '' },
    right: { center: '', start: '', end: '' },
  };

  const arrowSideClasses = {
    top: '-bottom-1',
    bottom: '-top-1',
    left: '-right-1 top-1/2 -mt-1',
    right: '-left-1 top-1/2 -mt-1',
  };

  const arrowAlignClasses = {
    top: {
      center: 'left-1/2 -ml-1',
      start: 'left-3 -ml-0',
      end: 'right-3 left-auto -ml-0',
    },
    bottom: {
      center: 'left-1/2 -ml-1',
      start: 'left-3 -ml-0',
      end: 'right-3 left-auto -ml-0',
    },
    left: { center: '', start: '', end: '' },
    right: { center: '', start: '', end: '' },
  };

  return (
    <span
      ref={ref}
      className={cn("relative inline-flex", className)}
      onMouseEnter={!isTouch ? show : undefined}
      onMouseLeave={!isTouch ? hide : undefined}
      onFocus={!isTouch ? show : undefined}
      onBlur={!isTouch ? hide : undefined}
      onClick={toggle}
    >
      <span aria-describedby={visible ? tooltipId : undefined}>
        {children}
      </span>
      {visible && (
        <span 
          id={tooltipId} 
          role="tooltip" 
          className={cn(
            'absolute z-50 inline-block w-max max-w-[min(240px,calc(100vw-1rem))] overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 pointer-events-none whitespace-normal break-words',
            sideClasses[side],
            alignClasses[side][align]
          )}
        >
          {content}
        </span>
      )}
    </span>
  );
});

Tooltip.displayName = 'Tooltip';
export { Tooltip };
export default Tooltip;
