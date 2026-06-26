'use client'

import { SegmentedControl } from '@navanta-ai/design-system'
import { ComponentPreview } from '@/app/components/component-preview'
import type { ComponentMeta } from '@/lib/component-registry'
import { useState } from 'react'

const OPTIONS = [
  { value: 'list', label: 'List' },
  { value: 'board', label: 'Board' },
  { value: 'calendar', label: 'Calendar' },
]

export function SegmentedControlDemo({ meta }: { meta: ComponentMeta }) {
  const [view, setView] = useState('list')

  return (
    <div className="flex w-full flex-col gap-10">
      <ComponentPreview
        meta={meta}
        renderPreview={(props) => (
          <div className="flex w-full max-w-md items-center justify-center">
            <SegmentedControl
              aria-label="View"
              options={OPTIONS}
              value={view}
              onValueChange={setView}
              size={props.size as 'sm' | 'md' | 'lg' | undefined}
              fullWidth={props.fullWidth as boolean | undefined}
              disabled={props.disabled as boolean | undefined}
            />
          </div>
        )}
        codeTemplate={(props) => `import { SegmentedControl } from '@navanta-ai/design-system'

<SegmentedControl
  aria-label="View"${props.size && props.size !== 'md' ? `\n  size="${props.size}"` : ''}${props.fullWidth ? `\n  fullWidth` : ''}
  options={[
    { value: 'list', label: 'List' },
    { value: 'board', label: 'Board' },
    { value: 'calendar', label: 'Calendar' },
  ]}
/>`}
      />

      {/* Three sizes */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Sizes
        </span>
        <div className="flex flex-col items-start gap-4">
          {(['sm', 'md', 'lg'] as const).map((size) => (
            <SegmentedControl
              key={size}
              aria-label={`Size ${size}`}
              size={size}
              defaultValue="list"
              options={OPTIONS}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
