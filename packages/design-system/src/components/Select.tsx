'use client'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { cn } from '../utils/cn'

type SelectItemMeta = {
  value: string
  label: string
  disabled?: boolean
}

interface SelectContextValue {
  open: boolean
  value: string
  disabled?: boolean
  onValueChange: (value: string) => void
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  triggerRef: React.RefObject<HTMLButtonElement | null>
  highlightedIndex: number
  setHighlightedIndex: React.Dispatch<React.SetStateAction<number>>
  items: SelectItemMeta[]
  enabledItemValues: string[]
  hideCheck: boolean
}

const SelectContext = React.createContext<SelectContextValue | null>(null)

function useSelectContext() {
  const ctx = React.useContext(SelectContext)
  if (!ctx) {
    throw new Error('Select compound components must be used within <Select>')
  }
  return ctx
}

function extractText(node: React.ReactNode): string {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractText).join('').trim()
  if (React.isValidElement(node)) return extractText(node.props.children)
  return ''
}

export interface SelectProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  /** Hide the selected-item checkmark in the dropdown list (and its left gutter). */
  hideCheck?: boolean
  children: React.ReactNode
}

const Select: React.FC<SelectProps> & {
  Trigger: typeof SelectTrigger
  Value: typeof SelectValue
  Content: typeof SelectContent
  Group: typeof SelectGroup
  Label: typeof SelectLabel
  Item: typeof SelectItem
  Separator: typeof SelectSeparator
} = ({ value: controlledValue, defaultValue = '', onValueChange, disabled, hideCheck = false, children }) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const [open, setOpen] = React.useState(false)
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1)
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  const value = controlledValue !== undefined ? controlledValue : internalValue
  const items = React.useMemo(() => collectSelectItems(children), [children])

  const enabledItemValues = React.useMemo(
    () => items.filter((item) => !item.disabled).map((item) => item.value),
    [items]
  )

  const handleValueChange = React.useCallback(
    (newValue: string) => {
      if (controlledValue === undefined) {
        setInternalValue(newValue)
      }
      onValueChange?.(newValue)
      setOpen(false)
      triggerRef.current?.focus()
    },
    [controlledValue, onValueChange]
  )

  const contextValue = React.useMemo(
    () => ({
      open,
      value,
      disabled,
      onValueChange: handleValueChange,
      setOpen: disabled ? ((() => {}) as React.Dispatch<React.SetStateAction<boolean>>) : setOpen,
      triggerRef,
      highlightedIndex,
      setHighlightedIndex,
      items,
      enabledItemValues,
      hideCheck,
    }),
    [
      open,
      value,
      disabled,
      handleValueChange,
      highlightedIndex,
      items,
      enabledItemValues,
      hideCheck,
    ]
  )

  return <SelectContext.Provider value={contextValue}>{children}</SelectContext.Provider>
}

export interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg'
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, onClick, onKeyDown, size = 'md', ...props }, ref) => {
    const {
      open,
      setOpen,
      triggerRef,
      value,
      disabled,
      setHighlightedIndex,
      enabledItemValues,
    } = useSelectContext()

    const mergedRef = React.useCallback(
      (node: HTMLButtonElement | null) => {
        ;(triggerRef as React.MutableRefObject<HTMLButtonElement | null>).current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node
      },
      [ref, triggerRef]
    )

    const setDefaultHighlight = () => {
      const selectedIndex = enabledItemValues.indexOf(value)
      setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0)
    }

    return (
      <button
        ref={mergedRef}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        data-placeholder={!value ? '' : undefined}
        disabled={disabled || props.disabled}
        className={cn(
          'flex w-full items-center justify-between rounded-md border border-input bg-background transition-[border-color,color,box-shadow] outline-none',
          // Height sizes match the Input field exactly (sm/md/lg).
          size === 'sm'
            ? 'h-7 px-2.5 text-xs'
            : size === 'lg'
              ? 'h-9 px-3 text-base md:text-sm'
              : 'h-8 px-3 text-sm',
          'data-[placeholder]:text-muted-foreground',
          'focus:border-[var(--foreground)] focus:ring-ring/50 focus:ring-[3px]',
          'focus-visible:border-[var(--foreground)] focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'active:border-[var(--foreground)] active:ring-ring/30 active:ring-[2px]',
          'disabled:cursor-not-allowed disabled:opacity-50',
          // Selected value stays on one line and truncates with an ellipsis when the
          // trigger is too narrow — the trigger never wraps or grows. (The dropdown
          // list is where long options are shown in full / wrapped — see SelectContent.)
          '[&>span]:line-clamp-1',
          className
        )}
        onClick={(event) => {
          if (disabled) return
          onClick?.(event)
          if (event.defaultPrevented) return

          setOpen(!open)
          if (!open) setDefaultHighlight()
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event)
          if (event.defaultPrevented || disabled) return

          if (
            event.key === 'ArrowDown' ||
            event.key === 'ArrowUp' ||
            event.key === 'Enter' ||
            event.key === ' '
          ) {
            event.preventDefault()
            if (!open) {
              setOpen(true)
              setDefaultHighlight()
            }
          }
        }}
        {...props}
      >
        {children}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 shrink-0 opacity-50"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
    )
  }
)
SelectTrigger.displayName = 'SelectTrigger'

export interface SelectValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  placeholder?: string
}

const SelectValue = React.forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ placeholder, className, ...props }, ref) => {
    const { value, items } = useSelectContext()
    const selectedLabel = items.find((item) => item.value === value)?.label ?? value

    return (
      <span ref={ref} className={cn(!value && 'text-muted-foreground', className)} {...props}>
        {value ? selectedLabel : placeholder}
      </span>
    )
  }
)
SelectValue.displayName = 'SelectValue'

export interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: 'popper' | 'item-aligned'
}

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, children, position = 'popper', onKeyDown, ...props }, ref) => {
    const {
      open,
      setOpen,
      triggerRef,
      highlightedIndex,
      setHighlightedIndex,
      enabledItemValues,
      onValueChange,
    } = useSelectContext()

    const contentRef = React.useRef<HTMLDivElement>(null)
    const [pos, setPos] = React.useState<{
      top: number
      left: number
      minWidth: number
      maxWidth: number
      maxHeight?: number
    }>({ top: 0, left: 0, minWidth: 0, maxWidth: 280 })

    // Position the portaled listbox with viewport collision handling: open below the
    // trigger, but flip above when there isn't room; cap the height to the available
    // space (it scrolls); clamp horizontally so it never runs off the left/right edge.
    // Width grows to the widest option, ≥ trigger width, ≤ 280px (Material menu max).
    React.useEffect(() => {
      if (!open) return
      const compute = () => {
        const trig = triggerRef.current
        if (!trig) return
        const r = trig.getBoundingClientRect()
        const content = contentRef.current
        const sx = window.scrollX
        const sy = window.scrollY
        const vw = document.documentElement.clientWidth || window.innerWidth
        const vh = window.innerHeight || document.documentElement.clientHeight
        const canCollide = vw > 0 && vh > 0
        const GAP = position === 'popper' ? 4 : 0
        const MARGIN = 8
        const MENU_MAX_WIDTH = 280

        const minWidth = r.width
        const maxWidth = canCollide
          ? Math.max(r.width, Math.min(MENU_MAX_WIDTH, vw - 2 * MARGIN))
          : Math.max(r.width, MENU_MAX_WIDTH)

        // Height: prefer below; flip above when below can't fit and above has more room.
        const desired = content ? content.scrollHeight : 0
        const spaceBelow = vh - r.bottom - GAP - MARGIN
        const spaceAbove = r.top - GAP - MARGIN
        let maxHeight: number | undefined
        let placeAbove = false
        if (canCollide) {
          placeAbove = spaceBelow < Math.min(desired || 0, 384) && spaceAbove > spaceBelow
          maxHeight = Math.min(384, Math.max(96, placeAbove ? spaceAbove : spaceBelow))
        }
        const height = maxHeight != null ? Math.min(desired || maxHeight, maxHeight) : desired

        const top = placeAbove ? r.top + sy - GAP - height : r.bottom + sy + GAP

        // Clamp horizontally using the measured (or trigger) width.
        const w = content ? content.offsetWidth : r.width
        let left = r.left + sx
        if (canCollide) left = Math.max(sx + MARGIN, Math.min(left, sx + vw - w - MARGIN))

        setPos({ top, left, minWidth, maxWidth, maxHeight })
      }
      compute()
      const onMove = () => compute()
      window.addEventListener('scroll', onMove, true)
      window.addEventListener('resize', onMove)
      return () => {
        window.removeEventListener('scroll', onMove, true)
        window.removeEventListener('resize', onMove)
      }
    }, [open, position])

    React.useEffect(() => {
      if (!open) return

      const handleOutsideClick = (event: MouseEvent) => {
        if (
          contentRef.current &&
          !contentRef.current.contains(event.target as Node) &&
          triggerRef.current &&
          !triggerRef.current.contains(event.target as Node)
        ) {
          setOpen(false)
        }
      }

      document.addEventListener('mousedown', handleOutsideClick)
      return () => document.removeEventListener('mousedown', handleOutsideClick)
    }, [open, setOpen, triggerRef])

    React.useEffect(() => {
      if (!open) return

      const handleKeyboard = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          event.preventDefault()
          setOpen(false)
          triggerRef.current?.focus()
          return
        }

        if (event.key === 'ArrowDown') {
          event.preventDefault()
          setHighlightedIndex((prev) => Math.min(prev + 1, Math.max(enabledItemValues.length - 1, 0)))
          return
        }

        if (event.key === 'ArrowUp') {
          event.preventDefault()
          setHighlightedIndex((prev) => Math.max(prev - 1, 0))
          return
        }

        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          const nextValue = enabledItemValues[highlightedIndex]
          if (nextValue) onValueChange(nextValue)
        }
      }

      document.addEventListener('keydown', handleKeyboard)
      return () => document.removeEventListener('keydown', handleKeyboard)
    }, [
      open,
      highlightedIndex,
      enabledItemValues,
      onValueChange,
      setHighlightedIndex,
      setOpen,
      triggerRef,
    ])

    if (!open) return null

    const portal = (
      <div
        ref={(node) => {
          ;(contentRef as React.MutableRefObject<HTMLDivElement | null>).current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
        }}
        role="listbox"
        data-state="open"
        style={{
          position: 'absolute',
          top: pos.top,
          left: pos.left,
          width: 'max-content',
          minWidth: pos.minWidth,
          maxWidth: pos.maxWidth,
          maxHeight: pos.maxHeight,
          zIndex: 9999,
        }}
        className={cn(
          'relative z-50 max-h-96 min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md',
          'ds-select-in',
          className
        )}
        onKeyDown={onKeyDown}
        {...props}
      >
        <div className="p-1">{children}</div>
      </div>
    )

    if (typeof document === 'undefined') return null
    return ReactDOM.createPortal(portal, document.body)
  }
)
SelectContent.displayName = 'SelectContent'

export interface SelectGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

const SelectGroup = React.forwardRef<HTMLDivElement, SelectGroupProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} role="group" className={cn(className)} {...props}>
      {children}
    </div>
  )
)
SelectGroup.displayName = 'SelectGroup'

export interface SelectLabelProps extends React.HTMLAttributes<HTMLDivElement> {}

const SelectLabel = React.forwardRef<HTMLDivElement, SelectLabelProps>(
  ({ className, ...props }, ref) => {
    const { hideCheck } = useSelectContext()
    return (
      <div
        ref={ref}
        className={cn(
          'py-1.5 pr-2 text-sm font-semibold text-foreground',
          // match the item gutter so labels align with option text
          hideCheck ? 'pl-2' : 'pl-8',
          className
        )}
        {...props}
      />
    )
  }
)
SelectLabel.displayName = 'SelectLabel'

export interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  disabled?: boolean
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, value: itemValue, disabled, onClick, onMouseEnter, ...props }, ref) => {
    const {
      value,
      onValueChange,
      highlightedIndex,
      enabledItemValues,
      setHighlightedIndex,
      hideCheck,
    } = useSelectContext()

    const itemLabel = React.useMemo(() => extractText(children) || itemValue, [children, itemValue])

    const isSelected = value === itemValue
    const enabledIndex = enabledItemValues.indexOf(itemValue)
    const isHighlighted = enabledIndex >= 0 && highlightedIndex === enabledIndex

    return (
      <div
        ref={ref}
        role="option"
        aria-selected={isSelected}
        aria-disabled={disabled}
        data-disabled={disabled ? '' : undefined}
        data-highlighted={isHighlighted ? '' : undefined}
        className={cn(
          'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pr-2 text-sm outline-none transition-colors',
          // left gutter holds the selected checkmark; drop it when checks are hidden
          hideCheck ? 'pl-2' : 'pl-8',
          isHighlighted && 'bg-accent text-accent-foreground',
          'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
          className
        )}
        onClick={(event) => {
          onClick?.(event)
          if (event.defaultPrevented || disabled) return
          onValueChange(itemValue)
        }}
        onMouseEnter={(event) => {
          onMouseEnter?.(event)
          if (disabled || enabledIndex < 0) return
          setHighlightedIndex(enabledIndex)
        }}
        {...props}
      >
        {!hideCheck && (
          <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            {isSelected && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            )}
          </span>
        )}
        <span className="whitespace-normal break-words">{children}</span>
      </div>
    )
  }
)
SelectItem.displayName = 'SelectItem'

export interface SelectSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

const SelectSeparator = React.forwardRef<HTMLDivElement, SelectSeparatorProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('-mx-1 my-1 h-px bg-muted', className)} {...props} />
  )
)
SelectSeparator.displayName = 'SelectSeparator'

Select.Trigger = SelectTrigger
Select.Value = SelectValue
Select.Content = SelectContent
Select.Group = SelectGroup
Select.Label = SelectLabel
Select.Item = SelectItem
Select.Separator = SelectSeparator

function collectSelectItems(node: React.ReactNode): SelectItemMeta[] {
  const map = new Map<string, SelectItemMeta>()

  const walk = (current: React.ReactNode) => {
    if (current == null || typeof current === 'boolean') return

    if (Array.isArray(current)) {
      current.forEach(walk)
      return
    }

    if (!React.isValidElement(current)) return

    const elementType = current.type as { displayName?: string }
    if (elementType.displayName === 'SelectItem') {
      const itemValue = (current.props as { value?: string }).value
      if (itemValue) {
        map.set(itemValue, {
          value: itemValue,
          label: extractText((current.props as { children?: React.ReactNode }).children) || itemValue,
          disabled: Boolean((current.props as { disabled?: boolean }).disabled),
        })
      }
      return
    }

    walk((current.props as { children?: React.ReactNode }).children)
  }

  walk(node)
  return [...map.values()]
}

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectSeparator,
}
