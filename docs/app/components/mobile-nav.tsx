'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { componentRegistry, CATEGORIES } from '@/lib/component-registry'
import { SidebarLink } from './sidebar-link'
import { cn } from '@navanta-ai/design-system'

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const close = useCallback(() => setIsOpen(false), [])

  // Close on route change
  useEffect(() => {
    close()
  }, [pathname, close])

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, close])

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      <button
        type="button"
        aria-label="Open navigation"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
      >
        <span className="flex flex-col gap-1.5 w-5" aria-hidden="true">
          <span className="block h-0.5 w-full bg-current rounded-full" />
          <span className="block h-0.5 w-full bg-current rounded-full" />
          <span className="block h-0.5 w-full bg-current rounded-full" />
        </span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/50"
            aria-hidden="true"
            onClick={close}
          />

          {/* Drawer */}
          <div
            className={cn(
              'fixed inset-y-0 left-0 z-50 w-72 bg-background border-r border-border p-6 overflow-y-auto',
              'transition-transform duration-200'
            )}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="font-semibold text-base">Navanta Design System</span>
              <button
                type="button"
                aria-label="Close navigation"
                onClick={close}
                className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="space-y-6">
              <div>
                <SidebarLink href="/about-navanta">
                  Portal Design System
                </SidebarLink>
                <SidebarLink href="/getting-started">
                  Getting Started
                </SidebarLink>
                <SidebarLink href="/resources">
                  Resources
                </SidebarLink>
                <SidebarLink href="/theme">
                  Theme
                </SidebarLink>
                <SidebarLink href="/iconography">
                  Iconography
                </SidebarLink>
                <SidebarLink href="/grid-layout">
                  Grid &amp; Layout
                </SidebarLink>
                <SidebarLink href="/validation">
                  Validation
                </SidebarLink>
                <SidebarLink href="/accessibility">
                  Accessibility
                </SidebarLink>
              </div>

              {CATEGORIES.map((category) => {
                const components = componentRegistry.filter(
                  (c) => c.category === category
                )

                if (components.length === 0) return null

                return (
                  <div key={category}>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
                      {category}
                    </p>
                    <div className="space-y-1">
                      {components.map((component) => (
                        <SidebarLink
                          key={component.slug}
                          href={`/components/${component.slug}`}
                        >
                          {component.name}
                        </SidebarLink>
                      ))}
                    </div>
                  </div>
                )
              })}
            </nav>
          </div>
        </>
      )}
    </>
  )
}
