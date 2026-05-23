"use client"
import React, { forwardRef } from 'react';
import { cn } from '../utils/cn';

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string;
  alt?: string;
  initials?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'square';
  status?: 'online' | 'offline' | 'away' | 'busy' | 'none';
}

const sizeClasses = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

const statusClasses = {
  none: '',
  online: 'bg-green-500',
  offline: 'bg-muted-foreground',
  away: 'bg-yellow-500',
  busy: 'bg-red-500',
};

const AvatarRoot = forwardRef<HTMLSpanElement, AvatarProps>(
  (
    {
      src,
      alt = 'Avatar',
      initials,
      size = 'md',
      shape = 'circle',
      status,
      className,
      ...props
    },
    ref
  ) => {
    const [imgError, setImgError] = React.useState(false);
    const showFallback = !src || imgError;

    return (
      <span
        ref={ref}
        className={cn(
          'relative inline-flex shrink-0 align-middle select-none',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        <span
          className={cn(
            'flex h-full w-full items-center justify-center overflow-hidden bg-muted text-muted-foreground font-medium',
            shape === 'circle' ? 'rounded-full' : 'rounded-md'
          )}
        >
          {!showFallback ? (
            <img
              className="w-full h-full object-cover"
              src={src}
              alt={alt}
              onError={() => setImgError(true)}
            />
          ) : initials ? (
            <span className="uppercase tracking-tight">{initials}</span>
          ) : (
            <svg
              className="w-1/2 h-1/2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          )}
        </span>
        {status && status !== 'none' && (
          <span
            className={cn(
              'absolute -bottom-0.5 -right-0.5 z-[1] h-1/4 w-1/4 min-h-2 min-w-2 rounded-full border-2 border-background box-content',
              statusClasses[status]
            )}
          />
        )}
      </span>
    );
  }
);

AvatarRoot.displayName = 'Avatar';

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number;
  size?: AvatarProps['size'];
  children: React.ReactNode;
}

const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ max, size = 'md', children, className, ...props }, ref) => {
    const childArray = React.Children.toArray(children);
    const visible = max ? childArray.slice(0, max) : childArray;
    const overflow = max ? childArray.length - max : 0;

    return (
      <div
        ref={ref}
        className={cn('inline-flex items-center flex-row-reverse', className)}
        {...props}
      >
        {visible.map((child, i) =>
          React.isValidElement<AvatarProps>(child)
            ? React.cloneElement(child, {
                size,
                key: i,
                className: cn(
                  '-ml-2 transition-transform hover:z-10 hover:-translate-y-0.5 last:ml-0',
                  child.props.className
                ),
              })
            : child
        )}
        {overflow > 0 && (
          <span
            className={cn(
              'relative inline-flex items-center justify-center overflow-hidden shrink-0 bg-muted/50 border-2 border-border text-muted-foreground font-medium align-middle select-none rounded-full -ml-2 transition-transform hover:z-10 hover:-translate-y-0.5 text-[11px]',
              sizeClasses[size]
            )}
          >
            <span className="uppercase tracking-tight">+{overflow}</span>
          </span>
        )}
      </div>
    );
  }
);

AvatarGroup.displayName = 'AvatarGroup';

export const Avatar = Object.assign(AvatarRoot, {
  Group: AvatarGroup,
});
