import type { Metadata } from 'next'
import { DocsWithToc } from '@/app/components/docs-with-toc'

export const metadata: Metadata = {
  title: 'About - Navanta Design System',
}

const sectionLinks = [
  { id: 'overview', label: 'Overview' },
  { id: 'what-includes', label: 'What It Includes' },
  { id: 'principles', label: 'Principles' },
]

export default function AboutNavantaPortalPage() {
  return (
    <DocsWithToc links={sectionLinks} contentClassName="space-y-10">
      <section id="overview" className="scroll-mt-24">
        <h1 className="text-[20px] font-semibold text-[#161616] dark:text-foreground">
          Navanta Design System
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-[#535353] dark:text-muted-foreground">
          The Navanta Design System is specifically engineered for building the Navanta client portal web experience — focused on delivering consistent, highly accessible, and premium interfaces tailored exclusively for Navanta clients.
        </p>
      </section>

      <section id="what-includes" className="scroll-mt-24 space-y-3 border-t border-border pt-6">
        <h2 className="text-[16px] font-medium text-[#161616] dark:text-foreground">What It Includes</h2>
        <ul className="list-disc space-y-2 pl-5 text-[14px] leading-relaxed text-[#535353] dark:text-muted-foreground">
          <li>Production-ready components with standardized states and sizing.</li>
          <li>Shared design tokens for color, spacing, radius, and typography.</li>
          <li>Component guidance for implementation, accessibility, and usage.</li>
        </ul>
      </section>

      <section id="principles" className="scroll-mt-24 space-y-3 border-t border-border pt-6">
        <h2 className="text-[16px] font-medium text-[#161616] dark:text-foreground">Principles</h2>
        <ul className="list-disc space-y-2 pl-5 text-[14px] leading-relaxed text-[#535353] dark:text-muted-foreground">
          <li>Consistency first: predictable UI behavior across pages.</li>
          <li>Accessibility by default: keyboard and screen reader support.</li>
          <li>Composable APIs: easy to adapt without breaking visual language.</li>
        </ul>
      </section>
    </DocsWithToc>
  )
}
