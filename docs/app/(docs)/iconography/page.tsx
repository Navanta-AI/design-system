import type { Metadata } from 'next'
import { DocsWithToc } from '@/app/components/docs-with-toc'
import { IconographyShowcase } from './showcase'

export const metadata: Metadata = {
  title: 'Iconography - Navanta Design System',
  description: 'Phosphor icon styles, search, and copy-ready implementation snippets.',
}

const sectionLinks = [
  { id: 'overview', label: 'Overview' },
  { id: 'icon-library', label: 'Icon Library' },
  { id: 'usage-guidance', label: 'Usage Guidance' },
]

export default function IconographyPage() {
  return (
    <DocsWithToc links={sectionLinks}>
      <section id="overview" className="scroll-mt-24">
        <h1 className="text-[20px] font-semibold text-[#161616] dark:text-foreground">Iconography</h1>
        <p className="mt-2 text-[14px] text-[#535353] dark:text-muted-foreground">
          This page uses the Phosphor icon set directly. Search by icon name, preview style weights,
          and copy ready-to-use code.
        </p>
      </section>

      <section id="icon-library" className="scroll-mt-24 space-y-3 border-t border-border pt-6">
        <h2 className="text-[16px] font-semibold text-[#161616] dark:text-foreground">Phosphor Catalog</h2>
        <IconographyShowcase />
      </section>

      <section id="usage-guidance" className="scroll-mt-24 space-y-3 pt-6">
        <h2 className="text-[16px] font-semibold text-[#161616] dark:text-foreground">Usage Guidance</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[10px] border border-border bg-background p-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.2px] text-green-600">Do</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-[13px] text-muted-foreground">
              <li>Use outline (`weight="regular"`) as the default in implementation code.</li>
              <li>Use `duotone` only for heading-level icon treatment.</li>
              <li>Use `fill` only for high-emphasis states.</li>
            </ul>
          </div>
          <div className="rounded-[10px] border border-border bg-background p-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.2px] text-red-600">Don&apos;t</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-[13px] text-muted-foreground">
              <li>Mix random icon packs in one surface.</li>
              <li>Use filled icons everywhere by default.</li>
              <li>Set non-tokenized icon colors in components.</li>
            </ul>
          </div>
        </div>
      </section>
    </DocsWithToc>
  )
}
