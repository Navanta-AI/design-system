'use client'

import { useMemo, useState } from 'react'
import type { ComponentMeta } from '@/lib/component-registry'
import { KnobPanel } from './knob-panel'
import { DynamicCodeBlock } from './dynamic-code-block'

interface ComponentPreviewProps {
  meta: ComponentMeta
  renderPreview: (props: Record<string, string | boolean>) => React.ReactNode
  defaultChildren?: string
  codeTemplate?: (props: Record<string, string | boolean>) => string
  hideKnobs?: boolean
}

export function ComponentPreview({
  meta,
  renderPreview,
  defaultChildren = 'Click me',
  codeTemplate,
  hideKnobs = false,
}: ComponentPreviewProps) {
  // Initialise knob values from registry defaults
  const initialValues = Object.fromEntries(
    meta.knobs.map((k) => [k.name, k.default]),
  ) as Record<string, string | boolean>

  const [knobValues, setKnobValues] = useState<Record<string, string | boolean>>(initialValues)

  const handleKnobChange = (name: string, value: string | boolean) => {
    setKnobValues((prev) => ({ ...prev, [name]: value }))
  }

  // Build the JSX snippet from current knob state
  const codeString = useMemo(() => {
    if (codeTemplate) return codeTemplate(knobValues)

    const propsStr = Object.entries(knobValues)
      .filter(([key, val]) => {
        const knob = meta.knobs.find((k) => k.name === key)
        return val !== knob?.default
      })
      .map(([key, val]) => {
        if (typeof val === 'boolean') return val ? key : ''
        return `${key}="${val}"`
      })
      .filter(Boolean)
      .join(' ')

    const openTag = propsStr
      ? `<${meta.importName} ${propsStr}>`
      : `<${meta.importName}>`

    return `import { ${meta.importName} } from '@navanta/design-system'\n\n${openTag}${defaultChildren}</${meta.importName}>`
  }, [knobValues, meta, defaultChildren, codeTemplate])

  const showKnobs = !hideKnobs && meta.knobs.length > 0

  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-border">
      {/* Controls bar */}
      {showKnobs && (
        <div className="border-b border-[#e4e4e7] bg-[#fafafa] px-4 py-3 dark:border-border dark:bg-muted/10">
          <KnobPanel
            knobs={meta.knobs}
            values={knobValues}
            onChange={handleKnobChange}
          />
        </div>
      )}

      {/* Live preview */}
      <div className="flex min-h-[220px] min-w-0 items-center justify-start overflow-x-auto bg-background p-4 sm:min-h-[240px] sm:justify-center sm:p-6 md:min-h-[280px] md:p-10">
        {renderPreview(knobValues)}
      </div>

      {/* Code — always visible below */}
      <div className="relative border-t border-border">
        <DynamicCodeBlock code={codeString} />
      </div>
    </div>
  )
}
