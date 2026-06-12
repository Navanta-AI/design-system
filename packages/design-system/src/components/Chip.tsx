'use client'

import * as React from 'react'
import { cn } from '../utils/cn'
import type { PillProps } from './Pill'

/**
 * Chip — a compact, toggleable filter/selection control in a fully-rounded shape
 * (Figma: Iris-Shareable chip, node 736:10951). Unselected chips sit on a white
 * surface (`--background`) with a default border; selecting fills with the secondary
 * surface and swaps in a strong border. The leading icon is tinted by `variant`
 * (the Pill semantics) so chips stay distinguishable at a glance. The trailing
 * `count` renders in its own rounded container (`--muted` on white; white on the
 * selected fill so it stays distinct).
 *
 * Used by TableShell's filter chips, but standalone and reusable.
 */
const ICON_COLOR: Record<NonNullable<PillProps['variant']>, string> = {
  info: 'text-[var(--pill-info-fg)]',
  danger: 'text-[var(--pill-danger-fg)]',
  warning: 'text-[var(--pill-warning-fg)]',
  neutral: 'text-[var(--pill-neutral-fg)]',
}

export interface ChipProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Selected/pressed state — shown with a strong border. */
  selected?: boolean
  /** Tints the leading icon by semantic (blue/red/amber/grey). Default neutral. */
  variant?: PillProps['variant']
  /** Leading icon — a duotone Phosphor glyph, to match the DS. */
  icon?: React.ReactNode
  /** Optional trailing count — rendered in its own rounded container. */
  count?: number
  /** Chip label. */
  children: React.ReactNode
}

const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ selected = false, variant = 'neutral', icon, count, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={selected}
        className={cn(
          // Fully-rounded chip shape (Figma: gap 4, px 12, py 2, 14px label on 22px line).
          'inline-flex items-center gap-1 rounded-full border px-3 py-[2px] text-sm font-normal leading-[22px] transition-colors',
          'text-[var(--text-primary)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kds-color-focus-ring)] focus-visible:ring-offset-1',
          'disabled:pointer-events-none disabled:opacity-50',
          // Unselected: white surface + default border; selected: secondary fill + strong border.
          selected
            ? 'border-[var(--primary)] bg-secondary hover:bg-secondary/80'
            : 'border-[var(--border-default)] bg-background hover:bg-secondary/60',
          className,
        )}
        {...props}
      >
        {icon != null && (
          <span className={cn('inline-flex shrink-0 [&>svg]:size-3', ICON_COLOR[variant])}>
            {icon}
          </span>
        )}
        <span>{children}</span>
        {count != null && (
          <span
            className={cn(
              // Separate count container (Figma "Number": min-w 16, px 6, fully rounded,
              // 12px medium on neutral-100). White on the selected fill so it stays distinct.
              'inline-flex min-w-4 items-center justify-center rounded-full px-1.5 text-xs font-medium leading-normal text-[var(--text-secondary)]',
              selected ? 'bg-background' : 'bg-muted',
            )}
          >
            {count}
          </span>
        )}
      </button>
    )
  },
)
Chip.displayName = 'Chip'

export { Chip }
