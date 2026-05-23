"use client"
import React, { forwardRef } from 'react';
import { cn } from '../utils/cn';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  indeterminate?: boolean;
  showLabel?: boolean;
  striped?: boolean;
}

const sizeClasses = {
  sm: 'h-1',
  md: 'h-1.5',
  lg: 'h-2.5',
};

const variantClasses = {
  default: 'bg-primary',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
};

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
      className,
      ...props
    },
    ref
  ) => {
    const pct = Math.min(100, Math.max(0, (value / max) * 100));

    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-2 w-full', className)}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={max}
        {...props}
      >
        <div className={cn('relative w-full overflow-hidden rounded-full bg-primary/20', sizeClasses[size])}>
          <div
            className={cn(
              'h-full w-full flex-1 transition-all duration-500 ease-out',
              variantClasses[variant],
              indeterminate && 'animate-[navanta-indeterminate_1.5s_ease-out_infinite] w-[40%]',
              striped && 'animate-[navanta-stripe_1s_linear_infinite]',
              striped && 'bg-[image:linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%)] bg-[length:16px_16px]'
            )}
            style={indeterminate ? undefined : { width: `${pct}%` }}
          />
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
  variant?: 'default' | 'success' | 'warning' | 'error';
  indeterminate?: boolean;
  showLabel?: boolean;
}

const strokeClasses = {
  default: 'stroke-primary',
  success: 'stroke-green-500',
  warning: 'stroke-yellow-500',
  error: 'stroke-red-500',
};

const CircularProgress = forwardRef<HTMLDivElement, CircularProgressProps>(
  (
    {
      value = 0,
      size: svgSize = 48,
      strokeWidth = 4,
      variant = 'default',
      indeterminate = false,
      showLabel = false,
      className,
      ...props
    },
    ref
  ) => {
    const radius = (svgSize - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const pct = Math.min(100, Math.max(0, value));
    const offset = circumference - (pct / 100) * circumference;

    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center',
          indeterminate && 'animate-spin',
          className
        )}
        style={{ width: svgSize, height: svgSize }}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={100}
        {...props}
      >
        <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
          <circle
            className="opacity-15 text-muted-foreground"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx={svgSize / 2}
            cy={svgSize / 2}
          />
          <circle
            className={cn(
              '-rotate-90 origin-center transition-all duration-500 ease-out',
              strokeClasses[variant]
            )}
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
