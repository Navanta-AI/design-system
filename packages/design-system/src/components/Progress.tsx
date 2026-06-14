"use client"
import React, { forwardRef, useId } from 'react';
import { cn } from '../utils/cn';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  indeterminate?: boolean;
  showLabel?: boolean;
  striped?: boolean;
  /** Muted, non-interactive state — fill switches to the neutral grey gradient. */
  disabled?: boolean;
}

const sizeClasses = {
  sm: 'h-1',
  md: 'h-1.5',
  lg: 'h-2.5',
};

/**
 * Fill gradients — the "color placement structure" from Figma (Iris-Shareable,
 * node 740-18842): the saturated DARK shade sits at the leading (progress-tip)
 * edge, fading to a LIGHT tint toward the start. Tokens carry a full-gradient
 * hex fallback (multi-value → inline style only) so the fill renders even when a
 * consumer never imports tokens.css. `disabled` overrides to the neutral ramp.
 */
const fillGradient = {
  default: 'var(--gradient-progress-blue, linear-gradient(90deg,#89a9e5 0%,#89a9e5 54%,#234687 100%))',
  success: 'var(--gradient-progress-green, linear-gradient(90deg,#86efac 0%,#86efac 54%,#166534 100%))',
  warning: 'var(--gradient-progress-amber, linear-gradient(90deg,#fcd34d 0%,#fcd34d 54%,#b45309 100%))',
  error:   'var(--gradient-progress-red, linear-gradient(90deg,#fca5a5 0%,#fca5a5 54%,#991b1b 100%))',
  neutral: 'var(--gradient-progress-neutral, linear-gradient(90deg,#a1a1aa 0%,#a1a1aa 54%,#232122 100%))',
} as const;

const disabledGradient = 'var(--gradient-progress-disabled, linear-gradient(90deg,#e4e4e7 0%,#e4e4e7 54%,#a1a1aa 100%))';

// Stop pairs for the circular (SVG) variant — mirror the linear gradient tokens.
const strokeStops = {
  default: ['#89a9e5', '#234687'],
  success: ['#86efac', '#166534'],
  warning: ['#fcd34d', '#b45309'],
  error:   ['#fca5a5', '#991b1b'],
  neutral: ['#a1a1aa', '#232122'],
} as const;
const disabledStops = ['#d4d4d8', '#a1a1aa'] as const;

const STRIPE_OVERLAY =
  'linear-gradient(45deg,rgba(255,255,255,0.25) 25%,transparent 25%,transparent 50%,rgba(255,255,255,0.25) 50%,rgba(255,255,255,0.25) 75%,transparent 75%)';

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      value = 0,
      max = 100,
      variant = 'default',
      size = 'md',
      indeterminate = false,
      showLabel = false,
      striped = false,
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    const pct = Math.min(100, Math.max(0, (value / max) * 100));
    const fillBg = disabled ? disabledGradient : fillGradient[variant];

    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-2 w-full', disabled && 'opacity-70', className)}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-disabled={disabled || undefined}
        {...props}
      >
        <div
          className={cn('relative w-full overflow-hidden rounded-full', sizeClasses[size])}
          style={{ background: 'var(--progress-track, #e4e4e7)' }}
        >
          <div
            className={cn(
              'relative h-full rounded-full transition-all duration-500 ease-out',
              indeterminate && 'animate-[navanta-indeterminate_1.5s_ease-out_infinite] w-[40%]'
            )}
            style={{
              backgroundImage: fillBg,
              ...(indeterminate ? {} : { width: `${pct}%` }),
            }}
          >
            {striped && !disabled && (
              <span
                aria-hidden="true"
                className="absolute inset-0 animate-[navanta-stripe_1s_linear_infinite]"
                style={{ backgroundImage: STRIPE_OVERLAY, backgroundSize: '16px 16px' }}
              />
            )}
          </div>
        </div>
        {showLabel && !indeterminate && (
          <span className="font-mono text-xs text-muted-foreground whitespace-nowrap min-w-[36px] text-right">
            {Math.round(pct)}%
          </span>
        )}
        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes navanta-indeterminate {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(350%); }
          }
          @keyframes navanta-stripe {
            0% { background-position: 0 0; }
            100% { background-position: 16px 0; }
          }
        `}} />
      </div>
    );
  }
);

Progress.displayName = 'Progress';

export interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  size?: number;
  strokeWidth?: number;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'neutral';
  indeterminate?: boolean;
  showLabel?: boolean;
  /** Muted, non-interactive state — stroke switches to the neutral grey gradient. */
  disabled?: boolean;
}

const CircularProgress = forwardRef<HTMLDivElement, CircularProgressProps>(
  (
    {
      value = 0,
      size: svgSize = 48,
      strokeWidth = 4,
      variant = 'default',
      indeterminate = false,
      showLabel = false,
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    const gradId = useId();
    const radius = (svgSize - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const pct = Math.min(100, Math.max(0, value));
    const offset = circumference - (pct / 100) * circumference;
    const [from, to] = disabled ? disabledStops : strokeStops[variant];

    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center',
          indeterminate && 'animate-spin',
          disabled && 'opacity-70',
          className
        )}
        style={{ width: svgSize, height: svgSize }}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-disabled={disabled || undefined}
        {...props}
      >
        <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
          <defs>
            <linearGradient id={`progress-${gradId}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={from} />
              <stop offset="54%" stopColor={from} />
              <stop offset="100%" stopColor={to} />
            </linearGradient>
          </defs>
          <circle
            stroke="var(--progress-track, #e4e4e7)"
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx={svgSize / 2}
            cy={svgSize / 2}
          />
          <circle
            className="-rotate-90 origin-center transition-all duration-500 ease-out"
            stroke={`url(#progress-${gradId})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={indeterminate ? circumference * 0.75 : offset}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx={svgSize / 2}
            cy={svgSize / 2}
          />
        </svg>
        {showLabel && !indeterminate && (
          <span className="absolute font-mono text-[11px] font-medium text-muted-foreground">
            {Math.round(pct)}%
          </span>
        )}
      </div>
    );
  }
);

CircularProgress.displayName = 'CircularProgress';

export { Progress, CircularProgress };
export default Progress;
