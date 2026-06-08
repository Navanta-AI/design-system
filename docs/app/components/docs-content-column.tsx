'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Docs pages render in a centered 1000px reading column by default. A few pages
 * host genuinely wide content (e.g. the TableShell orders table) and read better
 * edge-to-edge — list those routes here to opt them into the full-width layout.
 * The `(docs)` layout is a server component with no access to the `[slug]` param,
 * so the per-route decision is made client-side from the pathname.
 */
const FULL_WIDTH_PATHS = new Set(['/components/table-shell'])

export function DocsContentColumn({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const normalized = pathname?.replace(/\/+$/, '') || pathname
  const fullWidth = normalized ? FULL_WIDTH_PATHS.has(normalized) : false

  return (
    <div
      className={`mx-auto flex w-full min-w-0 flex-1 flex-col px-4 sm:px-6 md:px-8 ${
        fullWidth ? '' : 'max-w-[1000px]'
      }`}
    >
      {children}
    </div>
  )
}
