"use client"
import React, { useState, useRef, useEffect, useCallback, useId } from 'react';
import * as ReactDOM from 'react-dom';
import { cn } from '../utils/cn';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  delay?: number;
  /**
   * Both variants use the **theme-inverse** surface (dark bubble in light theme,
   * light bubble in dark theme). `inverse` adds the HMTX curved pointer aimed at
   * the trigger (the SideNav rail style); `default` is a plain bubble.
   */
  variant?: 'default' | 'inverse';
  className?: string;
}

type Side = 'top' | 'right' | 'bottom' | 'left';

// Pointer placement/rotation per side (inverse variant). The path points left; it
// sits z-[1] above the bubble's drop shadow and tucks ~4px under the bubble.
const inverseArrowClasses: Record<Side, string> = {
  right: 'left-[-9px] top-1/2 -translate-y-1/2',
  left: 'right-[-9px] top-1/2 -translate-y-1/2 rotate-180',
  top: 'bottom-[-15.5px] left-1/2 -ml-[6.5px] -rotate-90',
  bottom: 'top-[-15.5px] left-1/2 -ml-[6.5px] rotate-90',
};

const OPPOSITE: Record<Side, Side> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };
const VIEWPORT_MARGIN = 8;

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
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [resolvedSide, setResolvedSide] = useState<Side>(side);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const id = useId();
  const tooltipId = `tooltip-${id}`;

  const setRefs = (node: HTMLSpanElement | null) => {
    triggerRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) (ref as React.MutableRefObject<HTMLSpanElement | null>).current = node;
  };

  useEffect(() => {
    const mq = window.matchMedia('(hover: none) and (pointer: coarse)');
    setIsTouch(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Measure the trigger + tooltip, pick the side that fits the viewport (auto-flip
  // to the opposite side when the preferred one is too close to an edge), then place
  // the tooltip box in document coords and clamp the cross-axis so it never renders
  // off-screen. Positioned via top/left (no transform) so collision math is exact.
  const computePosition = useCallback(() => {
    const el = triggerRef.current;
    const tip = tooltipRef.current;
    if (!el || !tip) return;

    const r = el.getBoundingClientRect();          // viewport coords
    const tw = tip.offsetWidth;
    const th = tip.offsetHeight;
    const sx = window.scrollX;
    const sy = window.scrollY;
    const vw = document.documentElement.clientWidth || window.innerWidth;
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const gap = variant === 'inverse' ? 15 : 8;
    // Only run collision logic when the viewport size is known (>0). In degenerate
    // environments (headless/SSR-ish 0-size), fall back to the preferred side with
    // no clamp so the tooltip still anchors to the trigger rather than mis-placing.
    const canCollide = vw > 0 && vh > 0;

    // Free space on each side of the trigger (viewport coords).
    const space: Record<Side, number> = {
      top: r.top,
      bottom: vh - r.bottom,
      left: r.left,
      right: vw - r.right,
    };
    const need = (s: Side) =>
      (s === 'top' || s === 'bottom' ? th : tw) + gap + VIEWPORT_MARGIN;

    // Flip to the opposite side if the preferred side can't fit but the opposite can
    // (or simply has more room).
    let s: Side = side;
    if (canCollide && space[s] < need(s) && (space[OPPOSITE[s]] >= need(s) || space[OPPOSITE[s]] > space[s])) {
      s = OPPOSITE[s];
    }

    const clamp = (v: number, min: number, max: number) => (max < min ? min : Math.max(min, Math.min(v, max)));

    let left: number;
    let top: number;
    if (s === 'top' || s === 'bottom') {
      if (align === 'start') left = r.left + sx;
      else if (align === 'end') left = r.right + sx - tw;
      else left = r.left + sx + r.width / 2 - tw / 2;
      // clamp horizontally into the viewport
      if (canCollide) left = clamp(left, sx + VIEWPORT_MARGIN, sx + vw - tw - VIEWPORT_MARGIN);
      top = s === 'top' ? r.top + sy - gap - th : r.bottom + sy + gap;
    } else {
      top = r.top + sy + r.height / 2 - th / 2;
      // clamp vertically into the viewport
      if (canCollide) top = clamp(top, sy + VIEWPORT_MARGIN, sy + vh - th - VIEWPORT_MARGIN);
      left = s === 'left' ? r.left + sx - gap - tw : r.right + sx + gap;
    }

    setResolvedSide(s);
    setCoords({ top, left });
  }, [side, align, variant]);

  useEffect(() => {
    if (!visible) return;
    computePosition();
    const onMove = () => computePosition();
    window.addEventListener('scroll', onMove, true);
    window.addEventListener('resize', onMove);
    return () => {
      window.removeEventListener('scroll', onMove, true);
      window.removeEventListener('resize', onMove);
    };
  }, [visible, computePosition]);

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

  const positionStyle: React.CSSProperties = {
    top: coords.top,
    left: coords.left,
    zIndex: 9999,
  };

  const tooltipNode = variant === 'inverse' ? (
    <span
      ref={tooltipRef}
      id={tooltipId}
      role="tooltip"
      className="absolute inline-block ds-tooltip-in pointer-events-none"
      style={positionStyle}
    >
      <svg
        className={cn('absolute z-[1]', inverseArrowClasses[resolvedSide])}
        width="13"
        height="26"
        viewBox="0 0 13 26"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M12.0179 0V25.8169L8.88842 21.0921C6.75085 17.8649 3.81579 15.2446 0.367753 13.4853C-0.113524 13.2397 -0.124773 12.5561 0.348165 12.2948L0.496595 12.2128C4.13714 10.2017 7.22982 7.32962 9.50446 3.84762L12.0179 0Z"
          fill="var(--surface-inverse, #18181b)"
        />
      </svg>
      <span
        // Radius hard-pinned to 12px (not `rounded-lg`): the curved pointer is tuned
        // to flow into a 12px corner. Colours use the theme-inverse tokens so the
        // bubble is dark in light theme and light in dark theme.
        className="block w-max max-w-[min(240px,calc(100vw-1rem))] whitespace-normal break-words rounded-[12px] bg-[var(--surface-inverse,#18181b)] pb-[7px] pl-4 pr-[18px] pt-2 text-sm font-medium text-[var(--surface-inverse-foreground,#fafafa)]"
        style={{ boxShadow: 'var(--shadow-dropdown, 0px 4px 15px 0px rgba(0,0,0,0.25))' }}
      >
        {content}
      </span>
    </span>
  ) : (
    <span
      ref={tooltipRef}
      id={tooltipId}
      role="tooltip"
      className="absolute inline-block w-max max-w-[min(240px,calc(100vw-1rem))] overflow-hidden rounded-md bg-[var(--surface-inverse,#18181b)] px-3 py-1.5 text-sm text-[var(--surface-inverse-foreground,#fafafa)] shadow-md ds-tooltip-in pointer-events-none whitespace-normal break-words"
      style={positionStyle}
    >
      {content}
    </span>
  );

  return (
    <span
      ref={setRefs}
      className={cn('relative inline-flex', className)}
      onMouseEnter={!isTouch ? show : undefined}
      onMouseLeave={!isTouch ? hide : undefined}
      onFocus={!isTouch ? show : undefined}
      onBlur={!isTouch ? hide : undefined}
      onClick={toggle}
    >
      <span aria-describedby={visible ? tooltipId : undefined}>
        {children}
      </span>
      {/* Portaled to <body> so an `overflow:hidden` ancestor can never clip it; the
          side auto-flips and the position clamps to keep it fully within the viewport. */}
      {visible && typeof document !== 'undefined'
        ? ReactDOM.createPortal(tooltipNode, document.body)
        : null}
    </span>
  );
});

Tooltip.displayName = 'Tooltip';
export { Tooltip };
export default Tooltip;
