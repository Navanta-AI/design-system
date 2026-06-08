import type { Metadata } from 'next'
import Link from 'next/link'
import { TableShellPlayground } from '@/app/components/table-shell-playground'

export const metadata: Metadata = {
  title: 'TableShell Playground - Navanta Design System',
  description: 'Full-page playground for the standard TableShell — toggle chrome and exercise the table.',
}

export default function TableShellPlaygroundPage() {
  return (
    <div className="flex min-h-full flex-col px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">TableShell Playground</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Full-page view — toggle the chrome (search, filters, tabs, customize) and exercise the standard table.
          </p>
        </div>
        <Link
          href="/components/table-shell"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <span aria-hidden="true">←</span>
          Back to docs
        </Link>
      </div>
      <TableShellPlayground showCode={false} />
    </div>
  )
}
