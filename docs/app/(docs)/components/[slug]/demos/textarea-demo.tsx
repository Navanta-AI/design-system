'use client'

import { Textarea } from '@navanta/design-system'
import { ComponentPreview } from '@/app/components/component-preview'
import type { ComponentMeta } from '@/lib/component-registry'

interface TextareaDemoProps {
  meta: ComponentMeta
}

export function TextareaDemo({ meta }: TextareaDemoProps) {
  return (
    <ComponentPreview
      meta={meta}
      defaultChildren=""
      renderPreview={(props) => (
        <div className="w-full max-w-sm">
          <Textarea
            label={(props.label as string) || undefined}
            placeholder={(props.placeholder as string) || undefined}
            error={(props.error as string) || undefined}
            disabled={props.disabled as boolean | undefined}
          />
        </div>
      )}
    />
  )
}
