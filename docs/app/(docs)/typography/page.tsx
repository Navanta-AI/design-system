import type { Metadata } from 'next'
import { TypographyShowcase } from './showcase'
import { DocsWithToc } from '@/app/components/docs-with-toc'

export const metadata: Metadata = {
  title: 'Typography - Navanta Design System',
  description: 'Responsive typography scale and text hierarchy for Navanta.',
}

const sectionLinks = [
  { id: 'overview', label: 'Overview' },
  { id: 'type-scale', label: 'Type Scale' },
]

export default function TypographyPage() {
  return (
    <DocsWithToc links={sectionLinks}>
      <section id="overview" className="scroll-mt-24">
        <h1 className="text-[20px] font-semibold text-[#161616] dark:text-foreground">Typography</h1>
        <p className="mt-2 text-[14px] text-[#535353] dark:text-muted-foreground">
          Responsive text styles and hierarchy guidelines for desktop, tablet, and mobile.
        </p>
      </section>
      <section id="type-scale" className="scroll-mt-24 space-y-3 border-t border-border pt-6">
        <h2 className="text-[16px] font-semibold text-[#161616] dark:text-foreground">Type Scale</h2>
        <TypographyShowcase />
      </section>
    </DocsWithToc>
  )
}
