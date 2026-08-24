'use client'

import * as React from 'react'
import { cn } from '../utils/cn'

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  /** Input field size */
  size?: 'sm' | 'md' | 'lg'
  /** Label rendered above the input */
  label?: string
  /** Helper text below the input */
  helperText?: string
  /** Error message or boolean error state */
  error?: string | boolean
  /** Show a clear (×) button when the input has a value */
  clearable?: boolean
  /** Called when the clear button is clicked */
  onClear?: () => void
  /** Icon or element rendered inside the input on the left */
  iconLeft?: React.ReactNode
  /** Icon or element rendered inside the input on the right */
  iconRight?: React.ReactNode
  /** Inline text (or node) shown INSIDE the field before the input — e.g. "$", "https://".
   *  Muted, non-selectable, part of the bordered box (Figma: prefix in Neutral-600). */
  prefix?: React.ReactNode
  /** Inline text (or node) shown INSIDE the field after the input — e.g. ".00", "kg", "@acme.com". */
  suffix?: React.ReactNode
}

/** `type="search"` makes WebKit draw its own clear button, which would then sit
 *  beside the one `clearable` renders — two crosses for one field. Suppress the
 *  native affordances so this component's cross is the only one, on every path. */
const NATIVE_SEARCH_AFFORDANCE_RESET =
  '[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-cancel-button]:hidden ' +
  '[&::-webkit-search-decoration]:appearance-none'

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      size = 'md',
      label,
      helperText,
      error,
      clearable = false,
      onClear,
      iconLeft,
      iconRight,
      prefix,
      suffix,
      id: propId,
      value,
      defaultValue,
      onChange,
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

    // Internal ref for clear button focus restore
    const internalRef = React.useRef<HTMLInputElement>(null)
    const inputRef = (ref as React.RefObject<HTMLInputElement>) ?? internalRef

    // Support controlled and uncontrolled for clearable
    const [internalValue, setInternalValue] = React.useState(
      (defaultValue as string) ?? ''
    )
    const isControlled = value !== undefined
    const currentValue = isControlled ? String(value) : internalValue

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setInternalValue(e.target.value)
      onChange?.(e)
    }

    const handleClear = () => {
      if (!isControlled) setInternalValue('')
      onClear?.()
      // Dispatch a synthetic change event for controlled consumers
      if (inputRef && 'current' in inputRef && inputRef.current) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value'
        )?.set
        nativeInputValueSetter?.call(inputRef.current, '')
        inputRef.current.dispatchEvent(new Event('input', { bubbles: true }))
        inputRef.current.focus()
      }
    }

    const showClear = clearable && currentValue.length > 0 && !disabled
    // Split into box (height + padding) and text size so the affix path can put the box
    // sizing on the wrapper while the input still carries its own text size.
    const boxSize = size === 'sm' ? 'h-7 px-2.5' : size === 'md' ? 'h-8 px-3' : 'h-9 px-3'
    const textSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base md:text-sm' : 'text-sm'
    const sizeClass = `${boxSize} ${textSize}`
    const hasAffix = prefix != null || suffix != null
    const affixText = 'shrink-0 select-none text-muted-foreground [&>svg]:size-3.5'

    const clearButton = showClear ? (
      <button
        type="button"
        tabIndex={-1}
        onClick={handleClear}
        className="flex shrink-0 items-center justify-center rounded p-0.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        aria-label="Clear input"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    ) : null

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={id}
            className="text-xs font-normal text-muted-foreground px-0.5"
          >
            {label}
          </label>
        )}
        {hasAffix ? (
          // Affix path: a flex box OWNS the border/fill/states (via focus-within); the
          // input sits inside it borderless with the prefix/suffix as inline segments.
          <div
            className={cn(
              'flex items-center gap-1.5 rounded-md border border-input bg-background transition-[border-color,color,box-shadow]',
              boxSize,
              textSize,
              'focus-within:ring-ring/50 focus-within:ring-[3px]',
              !hasError &&
                'hover:border-[var(--border-control,#9f9fa9)] focus-within:!border-black dark:focus-within:!border-white',
              hasError &&
                'border-destructive focus-within:!border-destructive focus-within:ring-destructive/20 dark:focus-within:ring-destructive/40',
              disabled &&
                'cursor-not-allowed bg-[var(--surface-grey,#fafafa)]',
              className
            )}
          >
            {iconLeft && <span className={affixText}>{iconLeft}</span>}
            {prefix != null && <span className={affixText}>{prefix}</span>}
            <input
              id={id}
              ref={inputRef}
              value={isControlled ? value : internalValue}
              onChange={handleChange}
              disabled={disabled}
              aria-invalid={hasError || undefined}
              aria-describedby={displayHelper ? helperId : undefined}
              className={cn(
                'h-full min-w-0 flex-1 border-0 bg-transparent p-0 text-foreground outline-none',
                NATIVE_SEARCH_AFFORDANCE_RESET,
                textSize,
                'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground',
                'focus:ring-0 focus-visible:ring-0',
                'disabled:cursor-not-allowed disabled:text-muted-foreground disabled:placeholder:text-muted-foreground'
              )}
              {...props}
            />
            {clearButton}
            {suffix != null && !showClear && <span className={affixText}>{suffix}</span>}
            {iconRight && !showClear && <span className={affixText}>{iconRight}</span>}
          </div>
        ) : (
        <div className="relative">
          {iconLeft && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground [&>svg]:size-3.5">
              {iconLeft}
            </span>
          )}
          <input
            id={id}
            ref={inputRef}
            value={isControlled ? value : internalValue}
            onChange={handleChange}
            disabled={disabled}
            aria-invalid={hasError || undefined}
            aria-describedby={displayHelper ? helperId : undefined}
            className={cn(
              'flex w-full min-w-0 rounded-md border border-input bg-background py-1 text-foreground transition-[border-color,color,box-shadow] outline-none',
              NATIVE_SEARCH_AFFORDANCE_RESET,
              sizeClass,
              'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
              'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground',
              'focus:ring-ring/50 focus:ring-[3px]',
              'focus-visible:ring-ring/50 focus-visible:ring-[3px]',
              'active:ring-ring/30 active:ring-[2px]',
              !hasError &&
                'hover:border-[var(--border-control,#9f9fa9)] focus:!border-black dark:focus:!border-white focus-visible:!border-black dark:focus-visible:!border-white active:!border-black dark:active:!border-white',
              'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
              // Disabled = a defined grey fill + muted (readable) text, NOT a flat 50%
              // fade. Border stays --input. (Figma: Surface/Grey #fafafa + Neutral-600 text.)
              'disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-[var(--surface-grey,#fafafa)] disabled:text-muted-foreground disabled:placeholder:text-muted-foreground',
              hasError &&
                'border-destructive focus:!border-destructive focus-visible:!border-destructive active:!border-destructive focus:ring-destructive/20 dark:focus:ring-destructive/40 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 active:ring-destructive/20',
              iconLeft && 'pl-9',
              (showClear || iconRight) && 'pr-8',
              className
            )}
            {...props}
          />
          {showClear && (
            <button
              type="button"
              tabIndex={-1}
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center rounded p-0.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              aria-label="Clear input"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          )}
          {iconRight && !showClear && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground [&>svg]:size-3.5">
              {iconRight}
            </span>
          )}
        </div>
        )}
        {displayHelper && (
          <p
            id={helperId}
            className={cn(
              'text-xs text-muted-foreground px-0.5',
              hasError && 'text-destructive'
            )}
          >
            {displayHelper}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
