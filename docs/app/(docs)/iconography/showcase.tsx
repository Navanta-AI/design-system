'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  CaretDown,
  Check,
  CopySimple,
  MagnifyingGlass,
  type Icon,
  type IconWeight,
} from '@phosphor-icons/react'
import * as PhosphorIcons from '@phosphor-icons/react'

type IconStyle = 'duotone' | 'medium' | 'fill'

const WEIGHT_OPTIONS: Array<{ id: IconStyle; label: string }> = [
  { id: 'duotone', label: 'Duotone' },
  { id: 'medium', label: 'Regular' },
  { id: 'fill', label: 'Fill' },
]

const SIZE_OPTIONS = [14, 16, 20, 24]
const MAX_RESULTS = 120

const STYLE_TO_WEIGHT: Record<IconStyle, IconWeight> = {
  duotone: 'duotone',
  medium: 'regular',
  fill: 'fill',
}

function labelFromName(name: string) {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1 $2').trim()
}

function normalizeSearch(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function isPhosphorIconComponent(value: unknown): value is Icon {
  if (!value || typeof value !== 'object') return false
  const maybe = value as Record<string, unknown>
  return '$$typeof' in maybe && 'render' in maybe
}

const PHOSPHOR_ICON_NAMES = Object.entries(PhosphorIcons)
  .filter(([name, value]) => /^[A-Z]/.test(name) && !name.endsWith('Icon') && isPhosphorIconComponent(value))
  .map(([name]) => name)
  .sort((a, b) => a.localeCompare(b))

export function IconographyShowcase() {
  const [weight, setWeight] = useState<IconStyle>('duotone')
  const [size, setSize] = useState(20)
  const [query, setQuery] = useState('')
  const [showMore, setShowMore] = useState(false)
  const [copiedName, setCopiedName] = useState<string | null>(null)

  useEffect(() => {
    if (!copiedName) return
    const timer = window.setTimeout(() => setCopiedName(null), 1200)
    return () => window.clearTimeout(timer)
  }, [copiedName])

  useEffect(() => { setShowMore(false) }, [query])

  const normalizedQuery = useMemo(() => normalizeSearch(query), [query])
  const matchedIcons = useMemo(() => {
    if (!normalizedQuery) return PHOSPHOR_ICON_NAMES
    return PHOSPHOR_ICON_NAMES.filter((name) => {
      const haystack = `${normalizeSearch(name)} ${normalizeSearch(labelFromName(name))}`
      return haystack.includes(normalizedQuery)
    })
  }, [normalizedQuery])

  const visibleIcons = useMemo(
    () => matchedIcons.slice(0, showMore ? MAX_RESULTS * 2 : MAX_RESULTS),
    [matchedIcons, showMore]
  )
  const remainingCount = matchedIcons.length - visibleIcons.length
  const hasMore = remainingCount > 0
  const previewWeight = STYLE_TO_WEIGHT[weight]

  async function handleCopy(name: string) {
    const snippet = `import { ${name} } from '@phosphor-icons/react'\n\n<${name} size={${size}} weight="${previewWeight}" />`
    try {
      await navigator.clipboard.writeText(snippet)
      setCopiedName(name)
    } catch {
      setCopiedName(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* toolbar */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          {/* style pills */}
          <div className="flex items-center gap-0.5 rounded-md bg-muted p-0.5">
            {WEIGHT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setWeight(opt.id)}
                className={`rounded px-2.5 py-1 text-[12px] font-medium transition-colors ${
                  weight === opt.id
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* size picker */}
          <div className="flex items-center gap-0.5 rounded-md bg-muted p-0.5">
            {SIZE_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`rounded px-2.5 py-1 text-[12px] font-medium transition-colors ${
                  size === s
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* result count */}
          <span className="ml-auto text-[11px] text-muted-foreground">
            {matchedIcons.length.toLocaleString()} icons
            {matchedIcons.length > visibleIcons.length ? ` · showing ${visibleIcons.length}` : ''}
          </span>
        </div>
      </div>

      {/* search */}
      <div className="relative">
        <MagnifyingGlass size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search icons — e.g. arrow, warning, user…"
          aria-label="Search icons"
          className="w-full rounded-[8px] border border-border bg-background py-2 pl-8 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      {/* icon grid */}
      {visibleIcons.length > 0 ? (
        <>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(64px,1fr))] gap-0.5">
            {visibleIcons.map((name) => {
              const IconComponent = PhosphorIcons[name as keyof typeof PhosphorIcons] as Icon
              const isCopied = copiedName === name
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => void handleCopy(name)}
                  title={labelFromName(name)}
                  className="group flex flex-col items-center gap-1.5 rounded-[8px] px-1 py-3 text-center transition-colors hover:bg-muted/40"
                >
                  <div className="flex h-6 w-6 items-center justify-center text-foreground">
                    {isCopied
                      ? <Check size={size} className="text-green-600" />
                      : <IconComponent size={size} weight={previewWeight} />
                    }
                  </div>
                  <span className="w-full truncate text-[10px] leading-tight text-muted-foreground group-hover:text-foreground">
                    {isCopied ? 'copied!' : labelFromName(name)}
                  </span>
                </button>
              )
            })}
          </div>

          {hasMore && (
            <div className="relative flex items-center justify-center py-2">
              <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-border" />
              <button
                onClick={() => setShowMore(true)}
                className="relative z-[1] inline-flex h-[28px] items-center justify-center gap-2 rounded-[8px] border border-[#DADEE2] bg-white pl-[14px] pr-[16px] text-[14px] font-medium text-[#18181B] transition-colors hover:bg-muted/20 dark:border-border dark:bg-background dark:text-foreground"
              >
                <CaretDown size={16} weight="regular" />
                <span>{`View ${remainingCount} More`}</span>
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-[10px] border border-border bg-background px-4 py-8 text-center">
          <p className="text-[14px] text-foreground">No icons found for &quot;{query}&quot;</p>
          <p className="mt-1 text-[12px] text-muted-foreground">
            Try keywords like <code className="rounded bg-muted px-1 text-[11px]">arrow</code>,{' '}
            <code className="rounded bg-muted px-1 text-[11px]">share</code>, or{' '}
            <code className="rounded bg-muted px-1 text-[11px]">user</code>.
          </p>
        </div>
      )}
    </div>
  )
}
