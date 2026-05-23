import React, { forwardRef } from 'react';
import type { SpaceToken } from '../../types/tokens';
import { spaceMap } from '../../types/tokens';

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: SpaceToken;
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  inline?: boolean;
}

const alignMap = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  baseline: 'baseline',
} as const;

const justifyMap = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
} as const;

const Flex = forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      gap,
      align = 'center',
      justify = 'start',
      wrap = false,
      direction = 'row',
      inline = false,
      style,
      ...props
    },
    ref
  ) => {
    const computedStyle: React.CSSProperties = {
      display: inline ? 'inline-flex' : 'flex',
      flexDirection: direction,
      alignItems: alignMap[align],
      justifyContent: justifyMap[justify],
      flexWrap: wrap ? 'wrap' : 'nowrap',
      ...(gap && { gap: spaceMap[gap] }),
      ...style,
    };

    return <div ref={ref} style={computedStyle} {...props} />;
  }
);

Flex.displayName = 'Flex';
export default Flex;
