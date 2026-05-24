'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { componentRegistry } from '@/lib/component-registry'
import { Input } from '@admin-navanta/design-system'

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const close = useCallback(() => {
    setIsOpen(false)
    setQuery('')
    setActiveIndex(0)
  }, [])

  // Filter results based on query
  const results = componentRegistry.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.description.toLowerCase().includes(query.toLowerCase())
  )

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  // Open with Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Auto-focus input when palette opens
  useEffect(() => {
    if (isOpen) {
      // Use a small delay to ensure the DOM has rendered
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 10)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Keyboard navigation within results
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((prev) => (prev + 1) % Math.max(results.length, 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((prev) =>
        prev === 0 ? Math.max(results.length - 1, 0) : prev - 1
      )
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const selected = results[activeIndex]
      if (selected) {
        router.push(`/components/${selected.slug}`)
        close()
      }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      close()
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50"
        aria-hidden="true"
        onClick={close}
      />

      {/* Dialog */}
      <div
        className="fixed inset-x-4 top-[20%] z-50 mx-auto max-w-lg rounded-lg border border-border bg-background shadow-lg overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onKeyDown={handleKeyDown}
      >
        {/* Search input */}
        <div className="border-b border-border">
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search components..."
            className="h-11 rounded-none border-0 bg-transparent px-4 text-sm shadow-none focus:ring-0 focus-visible:ring-0 active:ring-0"
            aria-label="Search components"
          />
        </div>

        {/* Results */}
        <div className="max-h-72 overflow-y-auto py-2">
          {results.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">
              No components found.
            </p>
          ) : (
            results.map((component, index) => (
              <button
                key={component.slug}
                type="button"
                onClick={() => {
                  router.push(`/components/${component.slug}`)
                  close()
                }}
                className={`w-full flex items-start gap-3 px-4 py-2.5 text-left transition-colors ${
                  index === activeIndex
                    ? 'bg-accent text-accent-foreground'
                    : 'text-foreground hover:bg-accent/50'
                }`}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{component.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {component.description}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {component.category}
                </span>
              </button>
            ))
          )}
        </div>

        {/* Footer hint */}
        <div className="border-t border-border px-4 py-2 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-xs">↑</kbd>
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-xs">↓</kbd>
            navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-xs">↵</kbd>
            select
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-xs">Esc</kbd>
            close
          </span>
        </div>
      </div>
    </>
  )
}
