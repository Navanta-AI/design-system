'use client'

import * as React from 'react'
import { cn } from '../utils/cn'

export type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  /** Label rendered next to the checkbox */
  label?: string
  /** Font weight of the label text */
  labelWeight?: 'regular' | 'medium'
  /** Subtext rendered below the label */
  helperText?: string
  /** Error message or boolean error state */
  error?: string | boolean
  /** Mixed/partial state — e.g. a "select all" when only some rows are selected. */
  indeterminate?: boolean
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      label,
      labelWeight = 'regular',
      helperText,
      error,
      indeterminate,
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

    // `indeterminate` is a DOM property (not an attribute), so set it via a ref.
    const innerRef = React.useRef<HTMLInputElement>(null)
    React.useEffect(() => {
      if (innerRef.current) innerRef.current.indeterminate = Boolean(indeterminate)
    }, [indeterminate])
    const setRefs = (node: HTMLInputElement | null) => {
      innerRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node
    }

    return (
      <div className="flex items-start gap-2">
        <div className="relative flex items-center">
          <input
            id={id}
            type="checkbox"
            ref={setRefs}
            disabled={disabled}
            aria-invalid={hasError || undefined}
            aria-checked={indeterminate ? 'mixed' : undefined}
            aria-describedby={displayHelper ? helperId : undefined}
            className={cn(
              'peer relative z-10 size-4 shrink-0 rounded border border-input bg-transparent ring-offset-background appearance-none transition-colors cursor-pointer',
              // Selected (checked) and partial (indeterminate) states get the dark primary border.
              'checked:border-primary indeterminate:border-primary',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-1 focus-visible:ring-offset-background',
              'disabled:cursor-not-allowed disabled:opacity-50',
              hasError && 'border-destructive focus-visible:ring-destructive',
              className
            )}
            {...props}
          />
          {/* Filled background — sibling after peer input, z-index behind input */}
          <div className="absolute inset-0 size-4 rounded bg-background pointer-events-none peer-checked:bg-primary peer-indeterminate:bg-primary transition-colors z-0" />
          {/* Checkmark SVG — shown when fully checked */}
          <svg
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-3 text-primary-foreground pointer-events-none opacity-0 peer-checked:opacity-100 peer-indeterminate:opacity-0 transition-opacity z-20"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {/* Dash — shown for the indeterminate (mixed) state */}
          <svg
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-3 text-primary-foreground pointer-events-none opacity-0 peer-indeterminate:opacity-100 transition-opacity z-20"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </div>
        {(label || displayHelper) && (
          <div className="flex flex-col">
            {label && (
              <label
                htmlFor={id}
                className={cn(
                  'relative top-px text-sm leading-none cursor-pointer',
                  labelWeight === 'medium' ? 'font-medium' : 'font-normal',
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
Checkbox.displayName = 'Checkbox'

export { Checkbox }
