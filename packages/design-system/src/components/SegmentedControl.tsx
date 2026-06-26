"use client"
import * as React from 'react'
import { cn } from '../utils/cn'

export interface SegmentedControlOption {
  /** Stable value emitted on selection. */
  value: string
  /** Visible label (string or node, e.g. an icon + text). */
  label: React.ReactNode
  disabled?: boolean
}

export interface SegmentedControlProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: SegmentedControlOption[]
  /** Controlled selected value. */
  value?: string
  /** Initial value when uncontrolled. */
  defaultValue?: string
  onValueChange?: (value: string) => void
  size?: 'sm' | 'md' | 'lg'
  /** Disables the whole control. */
  disabled?: boolean
  /** Stretch segments to fill the container width (equal widths). */
  fullWidth?: boolean
  /** Accessible name for the group. */
  'aria-label'?: string
}

const sizeStyles = {
  sm: { wrap: 'gap-0.5 p-0.5', seg: 'h-6 px-2.5 text-xs' },
  md: { wrap: 'gap-1 p-1', seg: 'h-7 px-3 text-xs' },
  lg: { wrap: 'gap-1 p-1', seg: 'h-9 px-4 text-sm' },
} as const

const SegmentedControl = React.forwardRef<HTMLDivElement, SegmentedControlProps>(
  (
    {
      options,
      value: controlledValue,
      defaultValue,
      onValueChange,
      size = 'md',
      disabled = false,
      fullWidth = false,
      className,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(
      defaultValue ?? options[0]?.value ?? ''
    )
    const value = controlledValue !== undefined ? controlledValue : internalValue
    const btnRefs = React.useRef<(HTMLButtonElement | null)[]>([])

    const select = (next: string) => {
      if (controlledValue === undefined) setInternalValue(next)
      onValueChange?.(next)
    }

    // Roving focus + arrow-key selection (radiogroup pattern). Skips disabled segments.
    const moveTo = (start: number, dir: 1 | -1) => {
      const n = options.length
      for (let step = 1; step <= n; step++) {
        const i = (start + dir * step + n) % n
        if (!options[i].disabled) {
          btnRefs.current[i]?.focus()
          select(options[i].value)
          return
        }
      }
    }

    const onKeyDown = (event: React.KeyboardEvent, index: number) => {
      if (disabled) return
      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault()
          moveTo(index, 1)
          break
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault()
          moveTo(index, -1)
          break
        case 'Home':
          event.preventDefault()
          moveTo(-1, 1)
          break
        case 'End':
          event.preventDefault()
          moveTo(0, -1)
          break
      }
    }

    const sz = sizeStyles[size]
    // Token utilities (bg-muted / border-border / bg-background / text-foreground /
    // text-muted-foreground) resolve from the shipped styles.css theme, matching the
    // rest of the DS chrome.
    return (
      <div
        ref={ref}
        role="radiogroup"
        aria-label={ariaLabel}
        aria-disabled={disabled || undefined}
        className={cn(
          'inline-flex items-center rounded-full bg-muted',
          sz.wrap,
          fullWidth && 'flex w-full',
          disabled && 'cursor-not-allowed opacity-50',
          className
        )}
        {...props}
      >
        {options.map((option, index) => {
          const isActive = option.value === value
          const isDisabled = disabled || option.disabled
          return (
            <button
              key={option.value}
              ref={(node) => {
                btnRefs.current[index] = node
              }}
              type="button"
              role="radio"
              aria-checked={isActive}
              disabled={isDisabled}
              // Roving tabindex: only the active segment is in the tab order.
              tabIndex={isActive ? 0 : -1}
              onClick={() => !isDisabled && select(option.value)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={cn(
                'inline-flex items-center justify-center rounded-full font-medium whitespace-nowrap outline-none transition-colors',
                'focus-visible:ring-ring/50 focus-visible:ring-[2px]',
                sz.seg,
                fullWidth && 'flex-1',
                isActive
                  ? 'border border-border bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
                isDisabled && 'pointer-events-none opacity-50'
              )}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    )
  }
)

SegmentedControl.displayName = 'SegmentedControl'

export { SegmentedControl }
export default SegmentedControl
