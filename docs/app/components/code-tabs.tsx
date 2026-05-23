'use client'

import { useState } from 'react'
import { DynamicCodeBlock } from './dynamic-code-block'

interface Tab {
  label: string
  code: string
  lang?: string
}

interface CodeTabsProps {
  tabs: Tab[]
}

export function CodeTabs({ tabs }: CodeTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (!tabs || tabs.length === 0) return null

  return (
    <div className="flex flex-col overflow-hidden rounded-lg bg-muted/20">
      <div className="flex items-center gap-1 overflow-x-auto border-b border-border bg-muted/30 px-4 py-2">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`
              px-3 py-1.5 text-sm font-medium rounded-md transition-colors
              ${
                activeIndex === idx
                  ? 'bg-background text-foreground shadow-sm ring-1 ring-border'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="-mx-px -mb-px -mt-px">
        <DynamicCodeBlock code={tabs[activeIndex].code} lang={tabs[activeIndex].lang} transparentBg />
      </div>
    </div>
  )
}
