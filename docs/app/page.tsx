import Link from 'next/link'
import { Button } from '@admin-navanta/design-system'
import { FeatureCards } from '@/app/components/feature-cards'
import { GithubLogo } from '@phosphor-icons/react/dist/ssr'

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-[1000px] px-4 py-8 sm:px-6 md:py-10">
      <section className="border-b border-border pb-8 md:pb-10">
        <div className="flex items-center justify-between">
          <span className="inline-flex rounded-full border border-border bg-muted/40 px-3 py-1 text-[12px] font-medium text-muted-foreground">
            Navanta Design System
          </span>
          <Link target="_blank" rel="noreferrer" href="https://github.com/admin-navanta/design-system">
            <Button variant="ghost" size="md" className="h-9 px-3 gap-2">
              <GithubLogo className="h-4 w-4" />
              GitHub
            </Button>
          </Link>
        </div>
        <h1 className="mt-4 max-w-[760px] text-[30px] font-semibold leading-[1.1] tracking-tight text-foreground sm:text-[40px] md:text-[48px]">
          Build consistent, scalable interfaces for product dashboards.
        </h1>
        <p className="mt-3 max-w-[760px] text-[15px] leading-relaxed text-muted-foreground sm:text-[16px]">
          A design system and React component library for the Navanta client portal — focused on accessibility, clarity, and fast implementation.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link href="/getting-started">
            <Button size="md" className="h-9 px-4">
              Get Started
            </Button>
          </Link>
          <Link href="/components/button">
            <Button variant="outline" size="md" className="h-9 px-4">
              Browse Components
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-8">
        <FeatureCards />
      </section>
    </div>
  )
}
