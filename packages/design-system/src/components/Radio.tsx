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
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      className,
      label,
      helperText,
      error,
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

    return (
      <div className={cn('flex gap-2', displayHelper ? 'items-start' : 'items-center')}>
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
              'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
              'disabled:cursor-not-allowed disabled:opacity-50',
              hasError && 'border-destructive focus-visible:ring-destructive',
              className
            )}
            {...props}
          />
          {/* Custom Radio Dot Icon */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-2 rounded-full pointer-events-none opacity-0 peer-checked:opacity-100 peer-checked:bg-primary transition-opacity" />
          {/* Checked Border */}
          <div className="absolute inset-0 size-4 rounded-full pointer-events-none peer-checked:border-primary peer-checked:border -z-10 transition-colors" />
        </div>
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
