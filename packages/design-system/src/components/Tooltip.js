import React, { useState, useEffect } from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import styles from '../styles/Tooltip.module.css';

const Tooltip = ({ children, content, side = 'top', align = 'center', delayDuration = 300, ...props }) => {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Detect if the device primarily uses touch (no hover capability)
    const mediaQuery = window.matchMedia('(hover: none) and (pointer: coarse)');
    setIsTouch(mediaQuery.matches);
    
    const handler = (e) => setIsTouch(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  if (isTouch) {
    // Mobile experience: Tap to toggle using Popover
    return (
      <PopoverPrimitive.Root>
        <PopoverPrimitive.Trigger asChild>
          {children}
        </PopoverPrimitive.Trigger>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            className={styles.TooltipContent}
            side={side}
            align={align}
            sideOffset={5}
            // Close when tapping outside is handled natively by Popover
          >
            {content}
            <PopoverPrimitive.Arrow className={styles.TooltipArrow} />
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    );
  }

  // Desktop experience: Hover to show using Tooltip
  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root {...props}>
        <TooltipPrimitive.Trigger asChild>
          {children}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            className={styles.TooltipContent}
            side={side}
            align={align}
            sideOffset={5}
          >
            {content}
            <TooltipPrimitive.Arrow className={styles.TooltipArrow} />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};

export default Tooltip;
