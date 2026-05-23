import type { Metadata } from 'next'
import { GridLayoutShowcase } from './showcase'
import { DocsWithToc } from '@/app/components/docs-with-toc'

export const metadata: Metadata = {
  title: 'Grid & Layout - Navanta Design System',
  description: 'Responsive grid and layout structure for desktop, tablet, and mobile.',
}

const sectionLinks = [
  { id: 'overview', label: 'Overview' },
  { id: 'responsive-grid', label: 'Responsive Grid' },
  { id: 'grid-patterns', label: 'Grid Patterns' },
  { id: 'dos-donts', label: "Do's & Don'ts" },
]

export default function GridLayoutPage() {
  return (
    <DocsWithToc links={sectionLinks}>
      <section id="overview" className="scroll-mt-24">
        <h1 className="text-[20px] font-semibold text-[#161616] dark:text-foreground">Grid &amp; Layout</h1>
        <p className="mt-2 text-[14px] text-[#535353] dark:text-muted-foreground">
          A consistent grid keeps components aligned and spacing predictable across every screen size. Navanta Design System uses a column-based grid with configurable gutters and margins — desktop gets 12 columns, tablet 9, and mobile 4.
        </p>
      </section>

      <section id="responsive-grid" className="scroll-mt-24 space-y-3 border-t border-border pt-6">
        <h2 className="text-[16px] font-semibold text-[#161616] dark:text-foreground">Responsive Grid</h2>
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          Use the interactive preview below to explore how columns, gutters, and margins behave across viewports.
        </p>
        <GridLayoutShowcase />
      </section>

      <section id="grid-patterns" className="scroll-mt-24 space-y-4 border-t border-border pt-6">
        <h2 className="text-[16px] font-semibold text-[#161616] dark:text-foreground">Grid Patterns</h2>
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          These are the recommended column span patterns for common UI structures. All examples assume a 12-column desktop grid.
        </p>

        <div className="space-y-3">
          {/* Full width */}
          <div className="overflow-hidden rounded-[10px] border border-border bg-background">
            <div className="border-b border-border px-4 py-3">
              <p className="text-[13px] font-medium text-foreground">Full Width — 12 col</p>
              <p className="mt-0.5 text-[12px] text-muted-foreground">Page headers, data tables, full-width banners.</p>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-12 gap-1.5">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="h-6 rounded-[3px]" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }} />
                ))}
                <div className="col-span-12 h-8 rounded-[4px] border border-border bg-muted/40 flex items-center px-3 text-[11px] text-muted-foreground">
                  Content
                </div>
              </div>
            </div>
          </div>

          {/* Main + sidebar */}
          <div className="overflow-hidden rounded-[10px] border border-border bg-background">
            <div className="border-b border-border px-4 py-3">
              <p className="text-[13px] font-medium text-foreground">Main + Sidebar — 8 + 4 col</p>
              <p className="mt-0.5 text-[12px] text-muted-foreground">Dashboard pages, detail views with contextual info panels.</p>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-12 gap-1.5">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="h-6 rounded-[3px]" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }} />
                ))}
                <div className="col-span-8 h-16 rounded-[4px] border border-border bg-muted/40 flex items-center px-3 text-[11px] text-muted-foreground">
                  Main Content
                </div>
                <div className="col-span-4 h-16 rounded-[4px] border border-border bg-muted/50 flex items-center px-3 text-[11px] text-muted-foreground">
                  Sidebar
                </div>
              </div>
            </div>
          </div>

          {/* Two equal columns */}
          <div className="overflow-hidden rounded-[10px] border border-border bg-background">
            <div className="border-b border-border px-4 py-3">
              <p className="text-[13px] font-medium text-foreground">Two Equal Columns — 6 + 6 col</p>
              <p className="mt-0.5 text-[12px] text-muted-foreground">Comparison views, split forms, two-up card layouts.</p>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-12 gap-1.5">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="h-6 rounded-[3px]" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }} />
                ))}
                <div className="col-span-6 h-16 rounded-[4px] border border-border bg-muted/40 flex items-center px-3 text-[11px] text-muted-foreground">
                  Column A
                </div>
                <div className="col-span-6 h-16 rounded-[4px] border border-border bg-muted/40 flex items-center px-3 text-[11px] text-muted-foreground">
                  Column B
                </div>
              </div>
            </div>
          </div>

          {/* Three columns */}
          <div className="overflow-hidden rounded-[10px] border border-border bg-background">
            <div className="border-b border-border px-4 py-3">
              <p className="text-[13px] font-medium text-foreground">Three Equal Columns — 4 + 4 + 4 col</p>
              <p className="mt-0.5 text-[12px] text-muted-foreground">Metric cards, feature grids, KPI rows.</p>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-12 gap-1.5">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="h-6 rounded-[3px]" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }} />
                ))}
                {['Metric A', 'Metric B', 'Metric C'].map((label) => (
                  <div key={label} className="col-span-4 h-16 rounded-[4px] border border-border bg-muted/40 flex items-center px-3 text-[11px] text-muted-foreground">
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mixed layout */}
          <div className="overflow-hidden rounded-[10px] border border-border bg-background">
            <div className="border-b border-border px-4 py-3">
              <p className="text-[13px] font-medium text-foreground">Mixed — 8 + 4 top, 4 + 4 + 4 bottom</p>
              <p className="mt-0.5 text-[12px] text-muted-foreground">Dashboard overview pages combining a chart with a stats row.</p>
            </div>
            <div className="p-4 space-y-1.5">
              <div className="grid grid-cols-12 gap-1.5">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="h-6 rounded-[3px]" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }} />
                ))}
                <div className="col-span-8 h-16 rounded-[4px] border border-border bg-muted/40 flex items-center px-3 text-[11px] text-muted-foreground">
                  Chart
                </div>
                <div className="col-span-4 h-16 rounded-[4px] border border-border bg-muted/50 flex items-center px-3 text-[11px] text-muted-foreground">
                  Summary
                </div>
                {['Stat A', 'Stat B', 'Stat C'].map((label) => (
                  <div key={label} className="col-span-4 h-12 rounded-[4px] border border-border bg-muted/30 flex items-center px-3 text-[11px] text-muted-foreground">
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="dos-donts" className="scroll-mt-24 space-y-4 border-t border-border pt-6">
        <h2 className="text-[16px] font-semibold text-[#161616] dark:text-foreground">Do's &amp; Don'ts</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[10px] border border-border bg-background p-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.2px] text-green-600">Do</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-[13px] text-muted-foreground">
              <li>Align components to column boundaries — never place content between columns.</li>
              <li>Use consistent gutters across the same page — don't mix 16px and 24px in one layout.</li>
              <li>Let content collapse to fewer columns on smaller screens — 8+4 on desktop becomes 12 on mobile.</li>
              <li>Use fluid margins on desktop. Switch to fixed margins on tablet and mobile.</li>
              <li>Span <code className="text-[11px] bg-muted px-1 py-0.5 rounded">Card</code> and <code className="text-[11px] bg-muted px-1 py-0.5 rounded">Table</code> to even column counts (4, 6, 8, 12).</li>
            </ul>
          </div>
          <div className="rounded-[10px] border border-border bg-background p-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.2px] text-red-600">Don&apos;t</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-[13px] text-muted-foreground">
              <li>Use arbitrary widths like <code className="text-[11px] bg-muted px-1 py-0.5 rounded">w-[340px]</code> — always express width as column spans.</li>
              <li>Nest grids more than two levels deep — it creates misalignment that's hard to debug.</li>
              <li>Use a sidebar pattern on mobile — collapse to a single full-width column instead.</li>
              <li>Override gutter spacing inside a component — gutters are a layout concern, not a component concern.</li>
              <li>Mix <code className="text-[11px] bg-muted px-1 py-0.5 rounded">gap-*</code> values and manual margins to fake gutters — use the grid's <code className="text-[11px] bg-muted px-1 py-0.5 rounded">columnGap</code> only.</li>
            </ul>
          </div>
        </div>
      </section>
    </DocsWithToc>
  )
}
