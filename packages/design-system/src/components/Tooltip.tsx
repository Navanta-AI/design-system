"use client"
import React, { useState, useRef, useEffect, useId } from 'react';
import { cn } from '../utils/cn';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  delay?: number;
  /**
   * `default` — light popover surface. `inverse` — the HMTX portal look: dark
   * `--surface-inverse` bubble with the curved pointer aimed at the trigger
   * (the SideNav rail tooltip style).
   */
  variant?: 'default' | 'inverse';
  className?: string;
}

const Tooltip = React.forwardRef<HTMLSpanElement, TooltipProps>(({
  content,
  children,
  side = 'top',
  align = 'center',
  delay = 300,
  variant = 'default',
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

  // Inverse variant: 15px offset makes room for the pointer (vs 8px default).
  const inverseSideClasses = {
    top: 'bottom-[calc(100%+15px)]',
    bottom: 'top-[calc(100%+15px)]',
    left: 'right-[calc(100%+15px)] top-1/2 -translate-y-1/2',
    right: 'left-[calc(100%+15px)] top-1/2 -translate-y-1/2',
  };

  // Pointer placement/rotation per side. The path points left; it sits z-[1]
  // (above the bubble's drop shadow) and tucks ~4px under the bubble so the
  // shadow can't show through the joint.
  const inverseArrowClasses = {
    right: 'left-[-9px] top-1/2 -translate-y-1/2',
    left: 'right-[-9px] top-1/2 -translate-y-1/2 rotate-180',
    top: 'bottom-[-15.5px] left-1/2 -ml-[6.5px] -rotate-90',
    bottom: 'top-[-15.5px] left-1/2 -ml-[6.5px] rotate-90',
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
      {visible && variant === 'inverse' && (
        <span
          id={tooltipId}
          role="tooltip"
          className={cn(
            'absolute z-50 inline-block animate-in fade-in-0 zoom-in-95 pointer-events-none',
            inverseSideClasses[side],
            alignClasses[side][align]
          )}
        >
          <svg
            className={cn('absolute z-[1]', inverseArrowClasses[side])}
            width="13"
            height="26"
            viewBox="0 0 13 26"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M12.0179 0V25.8169L8.88842 21.0921C6.75085 17.8649 3.81579 15.2446 0.367753 13.4853C-0.113524 13.2397 -0.124773 12.5561 0.348165 12.2948L0.496595 12.2128C4.13714 10.2017 7.22982 7.32962 9.50446 3.84762L12.0179 0Z"
              fill="var(--surface-inverse)"
            />
          </svg>
          <span
            className="block w-max max-w-[min(240px,calc(100vw-1rem))] whitespace-normal break-words rounded-lg bg-[var(--surface-inverse)] pb-[7px] pl-4 pr-[18px] pt-2 text-sm font-medium text-white"
            style={{ boxShadow: 'var(--shadow-dropdown)' }}
          >
            {content}
          </span>
        </span>
      )}
      {visible && variant === 'default' && (
        <span
          id={tooltipId}
          role="tooltip"
          className={cn(
            'absolute z-50 inline-block w-max max-w-[min(240px,calc(100vw-1rem))] overflow-hidden rounded-md bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 pointer-events-none whitespace-normal break-words',
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
