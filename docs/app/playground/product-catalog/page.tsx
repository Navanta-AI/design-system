import type { Metadata } from 'next'
import Link from 'next/link'
import { ProductCatalogTemplate } from '@/app/components/product-catalog-template'

export const metadata: Metadata = {
  title: 'Product Catalog Template - Navanta Design System',
  description: 'A full-page template composed entirely from DS components — the unified TableShell filter bar, saved-view tabs, pill cells, and a Christy (AI) insight column.',
}

export default function ProductCatalogTemplatePage() {
  return (
    <div className="flex min-h-full flex-col px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Product Catalog</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Template — a real screen built only from DS components: the unified filter bar
            (search + Critical/High/Transfers chips + a time select), saved-view tabs, pill
            cells (Source, Exception), an id cell with a product subtitle, and the Iris (AI) insight column.
          </p>
        </div>
        <Link
          href="/templates"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <span aria-hidden="true">←</span>
          Back to templates
        </Link>
      </div>
      <ProductCatalogTemplate />
    </div>
  )
}
