import type { Metadata } from 'next'
import Link from 'next/link'
import { DocsWithToc } from '@/app/components/docs-with-toc'
import {
  TEMPLATE_CATEGORIES,
  getTemplatesByCategory,
} from '@/lib/template-registry'

export const metadata: Metadata = {
  title: 'Templates - Navanta Design System',
  description: 'Full-screen reference designs composed entirely from DS components.',
}

const sectionLinks = [
  { id: 'overview', label: 'Overview' },
  ...TEMPLATE_CATEGORIES.map((c) => ({ id: c.toLowerCase().replace(/\s+/g, '-'), label: c })),
]

export default function TemplatesPage() {
  return (
    <DocsWithToc links={sectionLinks}>
      <section id="overview" className="scroll-mt-24">
        <h1 className="text-[20px] font-semibold text-[#161616] dark:text-foreground">Templates</h1>
        <p className="mt-2 text-[14px] text-[#535353] dark:text-muted-foreground">
          Full-screen reference designs composed entirely from DS components — a starting point
          you can drop in and adapt. Each opens as a live, full-page screen.
        </p>
      </section>

      {TEMPLATE_CATEGORIES.map((category) => {
        const templates = getTemplatesByCategory(category)
        if (templates.length === 0) return null
        return (
          <section
            key={category}
            id={category.toLowerCase().replace(/\s+/g, '-')}
            className="scroll-mt-24 space-y-4 border-t border-border pt-6"
          >
            <div>
              <h2 className="text-[16px] font-semibold text-[#161616] dark:text-foreground">{category}</h2>
              <p className="mt-1 text-[13px] text-[#535353] dark:text-muted-foreground">
                Screens driven by the unified <code className="rounded bg-muted/60 px-1 py-0.5 text-[12px]">TableShell</code>.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {templates.map((t) => (
                <Link
                  key={t.slug}
                  href={t.href}
                  className="group flex flex-col overflow-hidden rounded-[12px] border border-border bg-background transition-colors hover:border-foreground/20 hover:bg-muted/20"
                >
                  {t.thumbnail && (
                    <div className="aspect-[16/7] overflow-hidden border-b border-border bg-muted/20">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={t.thumbnail}
                        alt={`${t.name} preview`}
                        className="h-full w-full object-cover object-left-top transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[14px] font-medium text-[#161616] dark:text-foreground">{t.name}</p>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                        className="shrink-0 text-muted-foreground transition-colors group-hover:text-[var(--text-link)]"
                      >
                        <path d="M7 17 17 7" />
                        <path d="M7 7h10v10" />
                      </svg>
                    </div>
                    <p className="text-[13px] leading-relaxed text-[#535353] dark:text-muted-foreground">
                      {t.description}
                    </p>
                    {t.tags && t.tags.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {t.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-border bg-muted/30 px-2 py-0.5 text-[11px] text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )
      })}
    </DocsWithToc>
  )
}
