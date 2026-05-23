import type { Metadata } from 'next'
import Link from 'next/link'
import { DocsWithToc } from '@/app/components/docs-with-toc'

export const metadata: Metadata = {
  title: 'Resources - Navanta Design System',
}

const sectionLinks = [
  { id: 'overview', label: 'Overview' },
  { id: 'resource-list', label: 'Resource List' },
]

const resourceItems = [
  {
    title: 'Getting Started',
    description: 'Set up the Navanta Design System quickly and start using components in your app.',
    href: '/getting-started',
  },
  {
    title: 'Components',
    description: 'Explore every component with examples, usage, and API reference.',
    href: '/components/button',
  },
  {
    title: 'Colors',
    description: 'Review the color system and semantic token usage for UI consistency.',
    href: '/colors',
  },
  {
    title: 'Typography',
    description: 'Reference type scale, text styles, and hierarchy rules.',
    href: '/typography',
  },
  {
    title: 'Iconography',
    description: 'Browse the Navanta Design System icon set with weight variants and copy-ready usage snippets.',
    href: '/iconography',
  },
  {
    title: 'Validation',
    description: 'Learn field-level and form-level validation patterns and messaging rules.',
    href: '/validation',
  },
  {
    title: 'Accessibility',
    description: 'Understand keyboard, screen reader, and WCAG AA expectations across components.',
    href: '/accessibility',
  },
  {
    title: 'Changelog',
    description: 'Track improvements, fixes, and component updates over time.',
    href: '/changelog',
  },
]

export default function ResourcesPage() {
  return (
    <DocsWithToc links={sectionLinks}>
      <section id="overview" className="scroll-mt-24">
        <h1 className="text-[20px] font-semibold text-[#161616] dark:text-foreground">Resources</h1>
        <p className="mt-2 text-[14px] text-[#535353] dark:text-muted-foreground">
          Helpful links and references for building with the Navanta Design System for the Navanta client portal.
        </p>
      </section>

      <section id="resource-list" className="scroll-mt-24 space-y-3 border-t border-border pt-6">
        <h2 className="text-[16px] font-semibold text-[#161616] dark:text-foreground">Resource List</h2>
        <div className="grid gap-3">
        {resourceItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-[10px] border border-border bg-background px-4 py-3 transition-colors hover:bg-muted/30"
          >
            <p className="text-[14px] font-medium text-[#161616] dark:text-foreground">{item.title}</p>
            <p className="mt-1 text-[13px] leading-relaxed text-[#535353] dark:text-muted-foreground">
              {item.description}
            </p>
          </Link>
        ))}
        </div>
      </section>
    </DocsWithToc>
  )
}
