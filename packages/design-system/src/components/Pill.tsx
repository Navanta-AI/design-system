'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

/**
 * Pill — a compact status tag with a soft tinted background and strong tonal
 * text/icon. Four semantic variants (info=blue, danger=red, warning=amber,
 * neutral=grey) across three sizes. Each variant is a 50/800 tonal pair sourced
 * from Figma (Iris-Shareable "Stable Table Cell"): the `danger` pair is
 * Destructive/50 + Destructive/800; `neutral` is Neutral/100 + Neutral/900.
 *
 * Icons use the Phosphor `duotone` weight. They render inline and size to the
 * text (`1em`) — a glyph at `sm` renders at 12px, matching the Figma spec. Pass
 * a single `icon`, or compose a leading group (e.g. a glyph + a smaller
 * directional arrow via `size={8}`) for route/status pills like `🚚 → HOU`.
 */
const pillVariants = cva(
  'inline-flex items-center font-medium whitespace-nowrap [&>svg]:shrink-0',
  {
    variants: {
      variant: {
        info: 'bg-[var(--pill-info-bg)] text-[var(--pill-info-fg)]',
        danger: 'bg-[var(--pill-danger-bg)] text-[var(--pill-danger-fg)]',
        warning: 'bg-[var(--pill-warning-bg)] text-[var(--pill-warning-fg)]',
        neutral: 'bg-[var(--pill-neutral-bg)] text-[var(--pill-neutral-fg)]',
      },
      size: {
        sm: 'gap-[4px] px-[8px] py-[2px] rounded-[4px] text-[12px] leading-[1.33]',
        md: 'gap-[5px] px-[10px] py-[3px] rounded-[5px] text-[13px] leading-[1.33]',
        lg: 'gap-[6px] px-[12px] py-[4px] rounded-[6px] text-[14px] leading-[1.4]',
      },
    },
    defaultVariants: {
      variant: 'neutral',
      size: 'sm',
    },
  }
)

export interface PillProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof pillVariants> {
  /**
   * Optional leading icon — a duotone Phosphor glyph (sizes to the text), or a
   * composed group for route pills, e.g.
   * `icon={<><Truck weight="duotone" /><ArrowRight size={8} weight="duotone" /></>}`.
   */
  icon?: React.ReactNode
}

const Pill = React.forwardRef<HTMLSpanElement, PillProps>(
  ({ className, variant, size, icon, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(pillVariants({ variant, size }), className)}
        {...props}
      >
        {icon}
        {children}
      </span>
    )
  }
)
Pill.displayName = 'Pill'

export { Pill, pillVariants }
