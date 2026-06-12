'use client'

import { Tooltip, Button } from '@navanta-ai/design-system'
import { ComponentPreview } from '@/app/components/component-preview'
import type { ComponentMeta } from '@/lib/component-registry'

export function TooltipDemo({ meta }: { meta: ComponentMeta }) {
  return (
    <div className="flex w-full flex-col gap-10">
      <ComponentPreview
        meta={meta}
        renderPreview={(props) => (
          <div className="flex items-center justify-center p-20">
            <Tooltip
              content="Add to library"
              variant={props.variant as 'default' | 'inverse' | undefined}
              side={props.side as 'top' | 'right' | 'bottom' | 'left' | undefined}
              align={props.align as 'start' | 'center' | 'end' | undefined}
              delay={Number(props.delay) || 0}
            >
              <Button variant="secondary" size="md">Hover over me</Button>
            </Tooltip>
          </div>
        )}
        codeTemplate={(props) => `import { Tooltip, Button } from '@navanta-ai/design-system'

<Tooltip
  content="Add to library"${props.variant === 'inverse' ? `\n  variant="inverse"` : ''}
  side="${props.side ?? 'top'}"
  align="${props.align ?? 'center'}"${props.delay && props.delay !== '300' ? `\n  delay={${Number(props.delay)}}` : ''}
>
  <Button variant="secondary">Hover over me</Button>
</Tooltip>`}
      />

      {/* Inverse variant — the HMTX portal / SideNav rail style, on every side */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Inverse (portal style) — pointer follows the side
        </span>
        <div className="flex flex-wrap items-center justify-center gap-6 p-12">
          {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
            <Tooltip key={side} content="Order Tracking" variant="inverse" side={side} delay={0}>
              <Button variant="secondary" size="md">{side}</Button>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  )
}
