import type { Metadata } from 'next'
import { DocsWithToc } from '@/app/components/docs-with-toc'
import { ColorsShowcase } from './showcase'

export const metadata: Metadata = {
  title: 'Colors - Navanta Design System',
  description: 'Semantic color tokens and usage guidance for Navanta.',
}

const sectionLinks = [
  { id: 'overview', label: 'Overview' },
  { id: 'token-showcase', label: 'Token Showcase' },
  { id: 'dashboard-colorography', label: 'Dashboard Colorography' },
  { id: 'state-hierarchy', label: 'State Hierarchy' },
  { id: 'alias-mapping', label: 'Alias Mapping' },
]

export default function ColorsPage() {
  return (
    <DocsWithToc links={sectionLinks}>
      <section id="overview" className="scroll-mt-24">
        <h1 className="text-[20px] font-semibold text-[#161616] dark:text-foreground">Colors</h1>
        <p className="mt-2 text-[14px] text-[#535353] dark:text-muted-foreground">
          Semantic color tokens that stay consistent across components and adapt between light and dark themes.
        </p>
      </section>
      <section id="token-showcase" className="scroll-mt-24 space-y-3 border-t border-border pt-6">
        <h2 className="text-[16px] font-semibold text-[#161616] dark:text-foreground">Token Showcase</h2>
        <ColorsShowcase />
      </section>

      <section id="dashboard-colorography" className="scroll-mt-24 space-y-3 border-t border-border pt-6">
        <h2 className="text-[16px] font-semibold text-[#161616] dark:text-foreground">
          Dashboard Colorography
        </h2>
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          Dashboards should feel neutral and readable first. Use accent color only where attention
          is needed: primary action, active state, focus, links, and chart emphasis.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[10px] border border-border bg-background p-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.2px] text-green-600">Do</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-[13px] text-muted-foreground">
              <li>Use neutral surfaces: <code>background</code>, <code>card</code>, <code>muted</code>.</li>
              <li>Use semantic feedback colors for status and validation.</li>
              <li>Keep chart series tokens consistent across pages.</li>
            </ul>
          </div>
          <div className="rounded-[10px] border border-border bg-background p-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.2px] text-red-600">Don&apos;t</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-[13px] text-muted-foreground">
              <li>Use brand accents as default background color for all cards/panels.</li>
              <li>Reuse warning/destructive tokens as decorative colors.</li>
              <li>Mix custom hex values instead of tokenized semantic variables.</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="state-hierarchy" className="scroll-mt-24 space-y-3 border-t border-border pt-6">
        <h2 className="text-[16px] font-semibold text-[#161616] dark:text-foreground">
          State Hierarchy
        </h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-[8px] border border-border bg-background px-3 py-2">
            <p className="text-[11px] uppercase tracking-[0.2px] text-muted-foreground">Default</p>
            <p className="mt-1 text-[13px] text-foreground">background / foreground / border</p>
          </div>
          <div className="rounded-[8px] border border-border bg-background px-3 py-2">
            <p className="text-[11px] uppercase tracking-[0.2px] text-muted-foreground">Interactive</p>
            <p className="mt-1 text-[13px] text-foreground">primary / accent / ring</p>
          </div>
          <div className="rounded-[8px] border border-border bg-background px-3 py-2">
            <p className="text-[11px] uppercase tracking-[0.2px] text-muted-foreground">Feedback</p>
            <p className="mt-1 text-[13px] text-foreground">success / warning / destructive / info</p>
          </div>
        </div>
      </section>

      <section id="alias-mapping" className="scroll-mt-24 space-y-3 border-t border-border pt-6">
        <h2 className="text-[16px] font-semibold text-[#161616] dark:text-foreground">
          Immutable Alias Mapping
        </h2>
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          Figma-friendly aliases (<code>--kds-color-*</code>) map one-to-one to runtime semantic
          tokens and should not be renamed once published.
        </p>
        <div className="rounded-[10px] border border-border bg-background p-4 text-[13px] text-muted-foreground">
          <p><code>--kds-color-surface-default</code> → <code>--background</code></p>
          <p><code>--kds-color-text-primary</code> → <code>--foreground</code></p>
          <p><code>--kds-color-action-primary</code> → <code>--primary</code></p>
          <p><code>--kds-color-feedback-success</code> → <code>--success</code></p>
          <p><code>--kds-color-focus-ring</code> → <code>--ring</code></p>
          <p><code>--kds-color-chart-positive</code> → <code>--chart-positive</code></p>
        </div>
      </section>
    </DocsWithToc>
  )
}
