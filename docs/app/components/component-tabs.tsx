'use client'

import React, { useState } from 'react'
import { Tabs } from '@navanta-ai/design-system'
import type { ComponentMeta } from '@/lib/component-registry'
import { CodeTabs } from './code-tabs'
import { DynamicCodeBlock } from './dynamic-code-block'
import { PropsTable } from './props-table'

interface ComponentTabsProps {
  component: ComponentMeta
  children: React.ReactNode
}

export function ComponentTabs({ component, children }: ComponentTabsProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'guidelines', label: 'Guidelines' },
    { id: 'accessibility', label: 'Accessibility' },
  ]

  return (
    <div className="space-y-8">
      {/* ── Native Tab Navigation ── */}
      <Tabs
        tabs={TABS}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="underline"
        className="mb-8"
      />

      {/* ── Tab 1: Overview ── */}
      {activeTab === 'overview' && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="space-y-4">
            <h2 className="text-[16px] font-medium text-[#161616] dark:text-foreground">
              Examples
            </h2>
            {children}
          </div>

          <div className="space-y-4">
            <h2 className="text-[16px] font-medium text-[#161616] dark:text-foreground">
              Installation
            </h2>
            <CodeTabs
              tabs={[
                {
                  label: 'CLI',
                  code: `npx @navanta-ai/design-system add ${component.slug}`,
                  lang: 'bash',
                },
                {
                  label: 'Manual',
                  code: `// Ensure you have configured @navanta-ai/design-system in your project first.\n// Copy the component code from the repository into your project:\n// components/ui/${component.slug}.tsx`,
                  lang: 'tsx',
                },
              ]}
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-[16px] font-medium text-[#161616] dark:text-foreground">
              Usage
            </h2>
            <DynamicCodeBlock
              code={
                component.usageExample ??
                `import { ${component.importName} } from '@navanta-ai/design-system'\n\nexport default function Example() {\n  return <${component.importName} />\n}`
              }
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-[16px] font-medium text-[#161616] dark:text-foreground">
              API Reference
            </h2>
            <PropsTable props={component.props} />
          </div>
        </div>
      )}

      {/* ── Tab 2: Guidelines ── */}
      {activeTab === 'guidelines' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h2 className="text-[16px] font-medium text-[#161616] dark:text-foreground border-b border-[#dcdcdc] dark:border-border pb-2">
            Design Guidelines
          </h2>
          <div className="text-[14px] leading-relaxed text-[#535353] dark:text-muted-foreground">
            {component.guidelines ? (
              <p>{component.guidelines}</p>
            ) : (
              <p>
                Guidelines and specific design spacings for the <strong>{component.name}</strong>{' '}
                component are currently being drafted. Check back soon for detailed layout
                principles, do's and don'ts, and usage metrics.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── Tab 3: Accessibility ── */}
      {activeTab === 'accessibility' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h2 className="text-[16px] font-medium text-[#161616] dark:text-foreground border-b border-[#dcdcdc] dark:border-border pb-2">
            Accessibility
          </h2>
          <div className="text-[14px] leading-relaxed text-[#535353] dark:text-muted-foreground">
            {component.accessibility ? (
              <p>{component.accessibility}</p>
            ) : (
              <p>
                Accessibility (a11y) notes for <strong>{component.name}</strong> are pending.
                Standard keyboard navigation and screen reader (ARIA) compliance rules should be
                applied natively based on the WAI-ARIA guidelines.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
