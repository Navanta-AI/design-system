'use client'

import Link from 'next/link'
import { ArrowSquareOut } from '@phosphor-icons/react'
import { TableShellPlayground } from '@/app/components/table-shell-playground'
import type { ComponentMeta } from '@/lib/component-registry'

export function TableShellDemo({ meta: _ }: { meta: ComponentMeta }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-end gap-4">
        <Link
          href="/playground/product-catalog"
          className="inline-flex items-center gap-1 text-sm font-medium text-[var(--text-link)] hover:underline"
        >
          Product Catalog template
          <ArrowSquareOut size={14} weight="bold" />
        </Link>
        <Link
          href="/playground/table-shell"
          className="inline-flex items-center gap-1 text-sm font-medium text-[var(--text-link)] hover:underline"
        >
          Open full-page playground
          <ArrowSquareOut size={14} weight="bold" />
        </Link>
      </div>
      <TableShellPlayground />
    </div>
  )
}
