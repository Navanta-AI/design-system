import { DocsHeader } from '@/app/components/docs-header'
import { MobileNav } from '@/app/components/mobile-nav'

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-full w-full min-w-0 flex-col">
      <div className="flex items-center gap-4 border-b border-border px-4 py-3 md:hidden">
        <MobileNav />
        <span className="font-medium text-sm">Documentation</span>
      </div>
      <div className="mx-auto flex w-full min-w-0 max-w-[1000px] flex-1 flex-col px-4 sm:px-6 md:px-8">
        <DocsHeader />
        <main className="min-w-0 flex-1 pt-6 pb-10 md:pt-[53px]">
          {children}
        </main>
      </div>
    </div>
  )
}
