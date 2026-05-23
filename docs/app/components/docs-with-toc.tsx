import type { ReactNode } from 'react'
import { OnThisPageNav, type OnThisPageLink } from '@/app/components/on-this-page-nav'

interface DocsWithTocProps {
  children: ReactNode
  links: OnThisPageLink[]
  contentClassName?: string
}

export function DocsWithToc({ children, links, contentClassName = 'space-y-8' }: DocsWithTocProps) {
  return (
    <div className="grid min-w-0 gap-8 xl:grid-cols-[minmax(0,1fr)_220px]">
      <div className={`min-w-0 ${contentClassName}`}>{children}</div>
      <aside className="hidden xl:block">
        <div className="sticky top-24 rounded-[10px] bg-background p-3">
          <p className="text-[12px] font-semibold uppercase tracking-[0.2px] text-muted-foreground">
            On this page
          </p>
          <OnThisPageNav links={links} />
        </div>
      </aside>
    </div>
  )
}
