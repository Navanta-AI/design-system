'use client'

import { Tooltip, Button } from '@navanta/design-system'
import { ComponentPreview } from '@/app/components/component-preview'
import type { ComponentMeta } from '@/lib/component-registry'

export function TooltipDemo({ meta }: { meta: ComponentMeta }) {
  return (
    <ComponentPreview
      meta={meta}
      renderPreview={(props) => (
        <div className="flex items-center justify-center p-20">
          <Tooltip 
            content="Add to library" 
            side={props.side as 'top' | 'right' | 'bottom' | 'left' | undefined}
            align={props.align as 'start' | 'center' | 'end' | undefined}
            delay={Number(props.delay) || 0}
          >
            <Button variant="secondary" size="md">Hover over me</Button>
          </Tooltip>
        </div>
      )}
    />
  )
}
