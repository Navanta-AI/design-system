import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  center?: boolean;
}

const sizeMap = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  full: 'max-w-full',
} as const;

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ size = 'lg', center = true, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'w-full px-4 md:px-6', // Base styles with responsive padding
          center && 'mx-auto',
          sizeMap[size],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container';
export default Container;
