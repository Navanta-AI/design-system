"use client"
import React, { forwardRef } from 'react';
import { cn } from '../utils/cn';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  count?: number;
  animate?: boolean;
}

const variantClasses = {
  text: 'w-full h-4 rounded-sm mb-2 last:w-4/5 last:mb-0',
  circular: 'rounded-full w-10 h-10',
  rectangular: 'rounded-none w-full h-[120px]',
  rounded: 'rounded-lg w-full h-[120px]',
};

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      variant = 'text',
      width,
      height,
      count = 1,
      animate = true,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const elements = Array.from({ length: count });

    return (
      <>
        {elements.map((_, i) => (
          <div
            key={i}
            ref={i === 0 ? ref : undefined}
            className={cn(
              'bg-muted',
              variantClasses[variant],
              animate && 'animate-pulse',
              className
            )}
            style={{ width, height, ...style }}
            aria-hidden="true"
            {...props}
          />
        ))}
      </>
    );
  }
);

Skeleton.displayName = 'Skeleton';
export { Skeleton };
export default Skeleton;
