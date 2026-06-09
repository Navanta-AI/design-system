import type { Metadata } from 'next'
import { CodeBlock } from '@/app/components/code-block'
import { DocsWithToc } from '@/app/components/docs-with-toc'

export const metadata: Metadata = {
  title: 'Getting Started - Navanta Design System',
}

const sectionLinks = [
  { id: 'overview', label: 'Overview' },
  { id: 'installation', label: 'Installation' },
  { id: 'setup', label: 'Setup' },
  { id: 'first-component', label: 'First Component' },
  { id: 'tailwind', label: 'Tailwind CSS' },
]

export default function GettingStartedPage() {
  return (
    <DocsWithToc links={sectionLinks} contentClassName="space-y-12">
      <section id="overview" className="scroll-mt-24">
        <h1 className="text-3xl font-bold tracking-tight">Getting Started</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Get up and running with the Navanta Design System — the component library for the Navanta client portal — in minutes.
        </p>
      </section>

      <section id="installation" className="scroll-mt-24 space-y-4 border-t border-border pt-6">
        <h2 className="text-2xl font-semibold tracking-tight">Installation</h2>
        <p className="text-muted-foreground leading-relaxed">
          Install the package from npm using your preferred package manager.
        </p>
        <CodeBlock code="npm install @navanta-ai/design-system" lang="bash" />
      </section>

      <section id="setup" className="scroll-mt-24 space-y-4 border-t border-border pt-6">
        <h2 className="text-2xl font-semibold tracking-tight">Setup</h2>
        <p className="text-muted-foreground leading-relaxed">
          Import the styles in your root layout or global CSS file:
        </p>
        <CodeBlock code={`import '@navanta-ai/design-system/styles.css'`} lang="typescript" />
      </section>

      <section id="first-component" className="scroll-mt-24 space-y-4 border-t border-border pt-6">
        <h2 className="text-2xl font-semibold tracking-tight">Your first component</h2>
        <p className="text-muted-foreground leading-relaxed">
          Import and use components directly — no additional configuration required.
        </p>
        <CodeBlock
          code={`import { Button } from '@navanta-ai/design-system'

export default function App() {
  return (
    <Button variant="primary" size="md">
      Get Started
    </Button>
  )
}`}
          lang="tsx"
        />
      </section>

      <section id="tailwind" className="scroll-mt-24 space-y-4 border-t border-border pt-6">
        <h2 className="text-2xl font-semibold tracking-tight">Tailwind CSS</h2>
        <p className="text-muted-foreground leading-relaxed">
          The Navanta Design System uses Tailwind CSS v4 for styling. Make sure your project has Tailwind CSS configured.
        </p>
      </section>
    </DocsWithToc>
  )
}
