import React, { forwardRef } from 'react';
import type { SpaceToken } from '../../types/tokens';
import { spaceMap } from '../../types/tokens';

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: SpaceToken;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  direction?: 'column' | 'row';
}

const alignMap = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
} as const;

const justifyMap = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
} as const;

const Stack = forwardRef<HTMLDivElement, StackProps>(
  ({ gap = 'md', align, justify, direction = 'column', style, ...props }, ref) => {
    const computedStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: direction,
      gap: spaceMap[gap],
      ...(align && { alignItems: alignMap[align] }),
      ...(justify && { justifyContent: justifyMap[justify] }),
      ...style,
    };

    return <div ref={ref} style={computedStyle} {...props} />;
  }
);

Stack.displayName = 'Stack';
export default Stack;
