'use client'

import * as React from 'react'
import { cn } from '../utils/cn'

export type SwitchProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'onChange'> & {
  /** The controlled checked state of the switch */
  checked?: boolean
  /** The default checked state when initially rendered */
  defaultChecked?: boolean
  /** Event handler called when the state of the switch changes */
  onCheckedChange?: (checked: boolean) => void
  /** Label rendered next to the switch */
  label?: string
  /** Subtext rendered below the label */
  helperText?: string
  /** Error message or boolean error state */
  error?: string | boolean
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      id: propId,
      checked,
      defaultChecked,
      onCheckedChange,
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

    const [internalChecked, setInternalChecked] = React.useState(defaultChecked ?? false)
    const isControlled = checked !== undefined
    const isChecked = isControlled ? checked : internalChecked

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return
      if (!isControlled) setInternalChecked(!isChecked)
      onCheckedChange?.(!isChecked)
      props.onClick?.(e)
    }

    return (
      <div className={cn('flex gap-2', displayHelper ? 'items-start' : 'items-center')}>
        <button
          type="button"
          role="switch"
          id={id}
          ref={ref}
          aria-checked={isChecked}
          aria-invalid={hasError || undefined}
          aria-describedby={displayHelper ? helperId : undefined}
          disabled={disabled}
          onClick={handleClick}
          className={cn(
            // HMTX Portal "Toggle - Switch" (Figma 535:20294 / 535:20313, Apple HIG):
            // a flat, fully-rounded track with a 2px inset (p-0.5) and a wide white pill
            // knob that travels edge-to-edge. On = info blue, off = translucent label gray.
            // Scaled down from the Figma master (64×28) to a 44×20 track / 26×16 knob,
            // preserving the wide-pill knob ratio (≈1.6:1).
            'peer inline-flex h-5 w-11 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            'disabled:cursor-not-allowed disabled:opacity-50',
            isChecked ? 'bg-[var(--switch-on)]' : 'bg-[var(--switch-off)]',
            className
          )}
          {...props}
        >
          <span
            className={cn(
              'pointer-events-none block h-4 w-[26px] rounded-full bg-[var(--switch-knob)] ring-0 transition-transform duration-200 ease-in-out',
              'shadow-[0_1px_2px_0_rgba(0,0,0,0.2)]',
              isChecked ? 'translate-x-[14px]' : 'translate-x-0'
            )}
          />
        </button>
        {(label || displayHelper) && (
          <div className="flex flex-col">
            {label && (
              <label
                htmlFor={id}
                onClick={(e) => {
                  e.preventDefault()
                  handleClick(e as any)
                }}
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
Switch.displayName = 'Switch'

export { Switch }
