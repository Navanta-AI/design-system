'use client'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { cn } from '../utils/cn'
import { Checkbox } from './Checkbox'
import { Input } from './Input'

// STANDARD: a list longer than this auto-shows a search field (unless `searchable`
// is set explicitly). Matches the DS >7 filter-search threshold.
const SELECT_SEARCH_THRESHOLD = 7

type SelectItemMeta = {
  value: string
  label: string
  disabled?: boolean
  /** Optional leading glyph (Phosphor duotone) — mirrored on the trigger when selected. */
  icon?: React.ReactNode
}

interface SelectContextValue {
  open: boolean
  /** Single-select current value ('' in multi mode). */
  value: string
  /** True when the Select allows multiple selections. */
  multiple: boolean
  /** Normalized selected values — one entry (or none) in single mode, N in multi. */
  selectedValues: string[]
  disabled?: boolean
  /** Select (single) or toggle (multi) this item value. */
  onValueChange: (value: string) => void
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  triggerRef: React.RefObject<HTMLButtonElement | null>
  highlightedIndex: number
  setHighlightedIndex: React.Dispatch<React.SetStateAction<number>>
  items: SelectItemMeta[]
  enabledItemValues: string[]
  hideCheck: boolean
  size: 'sm' | 'md' | 'lg'
  /** Whether the dropdown shows a search field that filters options by label. */
  searchable: boolean
  /** Current search query (lowercased comparison happens in `matchesQuery`). */
  query: string
  setQuery: React.Dispatch<React.SetStateAction<string>>
  /** True when the option's label passes the active search query. */
  matchesQuery: (label: string) => boolean
  /** How many options (incl. disabled) match the query — drives the "No results" row. */
  visibleCount: number
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

interface SelectBaseProps {
  disabled?: boolean
  /** Hide the selected-item checkmark in the dropdown list (and its left gutter). */
  hideCheck?: boolean
  /** Show a search field at the top of the dropdown that filters options by label.
   *  Omit to auto-enable for lists longer than 7 options; set explicitly to force
   *  on/off. */
  searchable?: boolean
  /** Trigger height (matches the Input field). Set here on the root, or per-trigger
   *  on `SelectTrigger` (an explicit `SelectTrigger size` wins). */
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

/** Single-select (default): one string value. Picking an option closes the menu. */
export interface SingleSelectProps extends SelectBaseProps {
  multiple?: false
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}

/** Multi-select: an array of values. Picking an option TOGGLES it and the menu stays
 *  open; the trigger summarizes as the single label or "N selected". */
export interface MultiSelectProps extends SelectBaseProps {
  multiple: true
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
}

export type SelectProps = SingleSelectProps | MultiSelectProps

const Select: React.FC<SelectProps> & {
  Trigger: typeof SelectTrigger
  Value: typeof SelectValue
  Content: typeof SelectContent
  Group: typeof SelectGroup
  Label: typeof SelectLabel
  Item: typeof SelectItem
  Separator: typeof SelectSeparator
} = (props) => {
  const { disabled, hideCheck = false, size = 'md', children } = props
  const multiple = props.multiple === true
  const controlledValue = props.value
  const isControlled = controlledValue !== undefined
  const onValueChange = props.onValueChange as
    | ((value: string | string[]) => void)
    | undefined

  const [internalValue, setInternalValue] = React.useState<string | string[]>(
    props.defaultValue ?? (multiple ? [] : '')
  )
  const [open, setOpen] = React.useState(false)
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1)
  const [query, setQuery] = React.useState('')
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  const rawValue = isControlled ? controlledValue : internalValue
  const selectedValues: string[] = multiple
    ? ((rawValue as string[]) ?? [])
    : rawValue
      ? [rawValue as string]
      : []

  const items = React.useMemo(() => collectSelectItems(children), [children])

  // Search auto-enables past the threshold unless the consumer sets `searchable`.
  const searchable = props.searchable ?? items.length > SELECT_SEARCH_THRESHOLD
  const q = query.trim().toLowerCase()
  const matchesQuery = React.useCallback(
    (label: string) => !searchable || !q || label.toLowerCase().includes(q),
    [searchable, q]
  )

  // The search query is transient — reset it every time the dropdown closes.
  React.useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  // Keyboard nav + the "No results" row operate on the QUERY-FILTERED set.
  const enabledItemValues = React.useMemo(
    () => items.filter((item) => !item.disabled && matchesQuery(item.label)).map((item) => item.value),
    [items, matchesQuery]
  )
  const visibleCount = React.useMemo(
    () => items.filter((item) => matchesQuery(item.label)).length,
    [items, matchesQuery]
  )

  const handleValueChange = React.useCallback(
    (itemValue: string) => {
      if (multiple) {
        const cur = ((isControlled ? controlledValue : internalValue) as string[]) ?? []
        const next = cur.includes(itemValue)
          ? cur.filter((v) => v !== itemValue)
          : [...cur, itemValue]
        if (!isControlled) setInternalValue(next)
        ;(onValueChange as ((v: string[]) => void) | undefined)?.(next)
        // Multi keeps the menu open so several values can be picked in one visit.
      } else {
        if (!isControlled) setInternalValue(itemValue)
        ;(onValueChange as ((v: string) => void) | undefined)?.(itemValue)
        setOpen(false)
        triggerRef.current?.focus()
      }
    },
    [multiple, isControlled, controlledValue, internalValue, onValueChange]
  )

  const contextValue = React.useMemo(
    () => ({
      open,
      value: multiple ? '' : ((rawValue as string) || ''),
      multiple,
      selectedValues,
      disabled,
      onValueChange: handleValueChange,
      setOpen: disabled ? ((() => {}) as React.Dispatch<React.SetStateAction<boolean>>) : setOpen,
      triggerRef,
      highlightedIndex,
      setHighlightedIndex,
      items,
      enabledItemValues,
      hideCheck,
      size,
      searchable,
      query,
      setQuery,
      matchesQuery,
      visibleCount,
    }),
    [
      open,
      multiple,
      rawValue,
      selectedValues,
      disabled,
      handleValueChange,
      highlightedIndex,
      items,
      enabledItemValues,
      hideCheck,
      size,
      searchable,
      query,
      matchesQuery,
      visibleCount,
    ]
  )

  return <SelectContext.Provider value={contextValue}>{children}</SelectContext.Provider>
}

export interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg'
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, onClick, onKeyDown, size: sizeProp, ...props }, ref) => {
    const {
      open,
      setOpen,
      triggerRef,
      value,
      multiple,
      selectedValues,
      disabled,
      setHighlightedIndex,
      enabledItemValues,
      size: contextSize,
    } = useSelectContext()
    // An explicit `size` on SelectTrigger wins; otherwise inherit the root `<Select size>`.
    const size = sizeProp ?? contextSize
    const isEmpty = multiple ? selectedValues.length === 0 : !value

    const mergedRef = React.useCallback(
      (node: HTMLButtonElement | null) => {
        ;(triggerRef as React.MutableRefObject<HTMLButtonElement | null>).current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node
      },
      [ref, triggerRef]
    )

    const setDefaultHighlight = () => {
      const target = multiple ? (selectedValues[0] ?? '') : value
      const selectedIndex = enabledItemValues.indexOf(target)
      setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0)
    }

    return (
      <button
        ref={mergedRef}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        data-placeholder={isEmpty ? '' : undefined}
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
    const { value, items, multiple, selectedValues } = useSelectContext()

    if (multiple) {
      const count = selectedValues.length
      const soleItem = count === 1 ? items.find((item) => item.value === selectedValues[0]) : undefined
      const summary =
        count === 0 ? placeholder : count === 1 ? (soleItem?.label ?? selectedValues[0]) : `${count} selected`
      return (
        <span
          ref={ref}
          className={cn('inline-flex items-center gap-1.5', count === 0 && 'text-muted-foreground', className)}
          {...props}
        >
          {soleItem?.icon != null && (
            <span className="inline-flex shrink-0 items-center text-[var(--text-secondary,#71717a)] [&>svg]:size-4">
              {soleItem.icon}
            </span>
          )}
          {summary}
        </span>
      )
    }

    const selectedItem = items.find((item) => item.value === value)
    const selectedLabel = selectedItem?.label ?? value
    return (
      <span
        ref={ref}
        className={cn('inline-flex items-center gap-1.5', !value && 'text-muted-foreground', className)}
        {...props}
      >
        {value && selectedItem?.icon != null && (
          <span className="inline-flex shrink-0 items-center text-[var(--text-secondary,#71717a)] [&>svg]:size-4">
            {selectedItem.icon}
          </span>
        )}
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
      searchable,
      query,
      setQuery,
      visibleCount,
    } = useSelectContext()

    const contentRef = React.useRef<HTMLDivElement>(null)

    // Focus the search field when the dropdown opens so typing filters immediately.
    React.useEffect(() => {
      if (open && searchable) {
        const id = requestAnimationFrame(() =>
          contentRef.current?.querySelector<HTMLInputElement>('input[type="search"]')?.focus()
        )
        return () => cancelAnimationFrame(id)
      }
    }, [open, searchable])
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
        {searchable && (
          // Pinned above the scrolling option list so it stays put while the list scrolls.
          <div className="sticky top-0 z-10 border-b border-border bg-popover p-1">
            <Input
              size="sm"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              iconRight={<MagnifyingGlass weight="regular" />}
              clearable
              onClear={() => setQuery('')}
              // Let ArrowUp/Down/Enter fall through to the list's keyboard handler.
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter') e.preventDefault()
              }}
            />
          </div>
        )}
        <div className="p-1">
          {children}
          {searchable && query.trim() !== '' && visibleCount === 0 && (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">No results</div>
          )}
        </div>
      </div>
    )

    if (typeof document === 'undefined') return null
    return ReactDOM.createPortal(portal, document.body)
  }
)
SelectContent.displayName = 'SelectContent'

export interface SelectGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

const SelectGroup = React.forwardRef<HTMLDivElement, SelectGroupProps>(
  ({ className, children, ...props }, ref) => {
    const { matchesQuery } = useSelectContext()
    // Hide the whole group (incl. its label) when a search query filters out every
    // option inside it — so no orphan section header is left behind.
    const groupItems = React.useMemo(() => collectSelectItems(children), [children])
    if (groupItems.length > 0 && !groupItems.some((item) => matchesQuery(item.label))) return null
    return (
      <div ref={ref} role="group" className={cn(className)} {...props}>
        {children}
      </div>
    )
  }
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
  /** Optional leading glyph — render a Phosphor icon with `weight="duotone"` to match
   *  the DS icon convention. Sized to the option text; also mirrored on the trigger
   *  (via SelectValue) when this option is the selected one. */
  icon?: React.ReactNode
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, value: itemValue, disabled, icon, onClick, onMouseEnter, ...props }, ref) => {
    const {
      selectedValues,
      multiple,
      onValueChange,
      highlightedIndex,
      enabledItemValues,
      setHighlightedIndex,
      hideCheck,
      matchesQuery,
    } = useSelectContext()

    const itemLabel = React.useMemo(() => extractText(children) || itemValue, [children, itemValue])

    // Hidden by the active search query (label doesn't match).
    if (!matchesQuery(itemLabel)) return null

    const isSelected = selectedValues.includes(itemValue)
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
        {!hideCheck &&
          (multiple ? (
            // Multi-select reads as a checkbox list. The row's onClick drives the
            // toggle, so the box is display-only (pointer-events-none + readOnly).
            <span className="pointer-events-none absolute left-2 flex items-center">
              <Checkbox checked={isSelected} readOnly tabIndex={-1} aria-hidden />
            </span>
          ) : (
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
          ))}
        {icon != null && (
          <span className="mr-2 inline-flex shrink-0 items-center text-[var(--text-secondary,#71717a)] [&>svg]:size-4">
            {icon}
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
        const itemProps = current.props as {
          children?: React.ReactNode
          disabled?: boolean
          icon?: React.ReactNode
        }
        map.set(itemValue, {
          value: itemValue,
          label: extractText(itemProps.children) || itemValue,
          disabled: Boolean(itemProps.disabled),
          icon: itemProps.icon,
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
