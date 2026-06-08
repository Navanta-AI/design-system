'use client'

import * as React from 'react'
import { cn } from '../utils/cn'

export type RadioProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  /** Label rendered next to the radio button */
  label?: string
  /** Subtext rendered below the label */
  helperText?: string
  /** Error message or boolean error state */
  error?: string | boolean
  /** Render as a selectable card (Christy-style) with text + subtext and a tinted selected state */
  card?: boolean
  /** Optional badge rendered inline next to the label (card variant) */
  badge?: React.ReactNode
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      card = false,
      badge,
      id: propId,
      disabled,
      ...props
    },
    ref
  ) => {
    const autoId = React.useId()
    const id = propId ?? autoId
    const helperId = `${id}-helper`
    const hasError = Boolean(error)
    const errorMessage = typeof error === 'string' ? error : undefined
    const displayHelper = errorMessage ?? helperText

    /* ── Radio control (donut indicator) — shared by both layouts ── */
    const control = (
      <div className="relative flex items-center">
        <input
          id={id}
          type="radio"
          ref={ref}
          disabled={disabled}
          aria-invalid={hasError || undefined}
          aria-describedby={displayHelper ? helperId : undefined}
          className={cn(
            'peer size-4 shrink-0 rounded-full border border-input bg-background ring-offset-background appearance-none transition-colors cursor-pointer',
            // Selected: fill the whole circle with the neutral primary color (donut style)
            'checked:bg-primary checked:border-primary',
            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
            'disabled:cursor-not-allowed disabled:opacity-50',
            hasError && 'border-destructive checked:bg-destructive checked:border-destructive focus-visible:ring-destructive',
            className
          )}
          {...props}
        />
        {/* Inner hole — appears on select to create the donut indicator */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-1.5 rounded-full bg-background pointer-events-none scale-0 opacity-0 peer-checked:scale-100 peer-checked:opacity-100 transition-[transform,opacity] duration-150" />
      </div>
    )

    /* ── Card variant — clickable card with text + subtext (neutral) ── */
    if (card) {
      return (
        <label
          htmlFor={id}
          className={cn(
            'flex gap-2 rounded-[12px] border px-3 py-2 transition-colors',
            displayHelper ? 'items-start' : 'items-center',
            'border-border bg-background',
            // Selected card: neutral tinted background + stronger neutral border
            'has-[:checked]:border-primary has-[:checked]:bg-accent',
            hasError && 'border-destructive has-[:checked]:border-destructive',
            disabled
              ? 'opacity-60 cursor-not-allowed'
              : 'cursor-pointer hover:bg-accent/40'
          )}
        >
          <div className={cn('flex items-center shrink-0', displayHelper && 'py-0.5')}>
            {control}
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {label && (
                <span className="text-sm font-medium leading-none text-foreground">
                  {label}
                </span>
              )}
              {badge}
            </div>
            {displayHelper && (
              <p
                id={helperId}
                className={cn(
                  'text-xs mt-1 text-muted-foreground leading-normal',
                  hasError && 'text-destructive'
                )}
              >
                {displayHelper}
              </p>
            )}
          </div>
        </label>
      )
    }

    /* ── Default variant — inline radio + label ── */
    return (
      <div className={cn('flex gap-2', displayHelper ? 'items-start' : 'items-center')}>
        {control}
        {(label || displayHelper) && (
          <div className="flex flex-col">
            {label && (
              <label
                htmlFor={id}
                className={cn(
                  'relative top-px text-sm font-medium leading-none cursor-pointer',
                  disabled && 'cursor-not-allowed opacity-50'
                )}
              >
                {label}
              </label>
            )}
            {displayHelper && (
              <p
                id={helperId}
                className={cn(
                  'text-xs mt-1 text-muted-foreground',
                  hasError && 'text-destructive',
                  disabled && 'opacity-50'
                )}
              >
                {displayHelper}
              </p>
            )}
          </div>
        )}
      </div>
    )
  }
)
Radio.displayName = 'Radio'

export { Radio }
