import React, { forwardRef } from 'react';
import type { SpaceToken, RadiusToken } from '../../types/tokens';
import { spaceMap, radiusMap } from '../../types/tokens';

type BoxElement = 'div' | 'section' | 'article' | 'aside' | 'main' | 'nav' | 'header' | 'footer' | 'span';

export interface BoxProps extends React.HTMLAttributes<HTMLElement> {
  as?: BoxElement;
  padding?: SpaceToken;
  paddingX?: SpaceToken;
  paddingY?: SpaceToken;
  margin?: SpaceToken;
  marginX?: SpaceToken;
  marginY?: SpaceToken;
  radius?: RadiusToken;
}

const Box = forwardRef<HTMLElement, BoxProps>(
  (
    {
      as: Component = 'div',
      padding,
      paddingX,
      paddingY,
      margin,
      marginX,
      marginY,
      radius,
      style,
      ...props
    },
    ref
  ) => {
    const computedStyle: React.CSSProperties = {
      ...(padding && { padding: spaceMap[padding] }),
      ...(paddingX && { paddingLeft: spaceMap[paddingX], paddingRight: spaceMap[paddingX] }),
      ...(paddingY && { paddingTop: spaceMap[paddingY], paddingBottom: spaceMap[paddingY] }),
      ...(margin && { margin: spaceMap[margin] }),
      ...(marginX && { marginLeft: spaceMap[marginX], marginRight: spaceMap[marginX] }),
      ...(marginY && { marginTop: spaceMap[marginY], marginBottom: spaceMap[marginY] }),
      ...(radius && { borderRadius: radiusMap[radius] }),
      ...style,
    };

    return (
      <Component
        ref={ref as React.Ref<HTMLDivElement>}
        style={computedStyle}
        {...props}
      />
    );
  }
);

Box.displayName = 'Box';
export default Box;
