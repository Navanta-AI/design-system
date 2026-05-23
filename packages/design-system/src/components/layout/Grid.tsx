import React, { forwardRef } from 'react';
import type { SpaceToken } from '../../types/tokens';
import { spaceMap } from '../../types/tokens';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: number | string;
  rows?: number | string;
  gap?: SpaceToken;
  gapX?: SpaceToken;
  gapY?: SpaceToken;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'stretch';
  flow?: 'row' | 'column' | 'dense';
}

const Grid = forwardRef<HTMLDivElement, GridProps>(
  (
    {
      columns,
      rows,
      gap = 'md',
      gapX,
      gapY,
      align,
      justify,
      flow,
      style,
      ...props
    },
    ref
  ) => {
    const templateColumns =
      typeof columns === 'number'
        ? `repeat(${columns}, 1fr)`
        : columns;

    const templateRows =
      typeof rows === 'number'
        ? `repeat(${rows}, 1fr)`
        : rows;

    const computedStyle: React.CSSProperties = {
      display: 'grid',
      ...(templateColumns && { gridTemplateColumns: templateColumns }),
      ...(templateRows && { gridTemplateRows: templateRows }),
      gap: gapX || gapY ? undefined : spaceMap[gap],
      ...(gapX && { columnGap: spaceMap[gapX] }),
      ...(gapY && { rowGap: spaceMap[gapY] }),
      ...(align && { alignItems: align === 'start' || align === 'end' ? `${align}` : align }),
      ...(justify && { justifyItems: justify === 'start' || justify === 'end' ? `${justify}` : justify }),
      ...(flow && { gridAutoFlow: flow }),
      ...style,
    };

    return <div ref={ref} style={computedStyle} {...props} />;
  }
);

Grid.displayName = 'Grid';
export default Grid;
