'use client'

import { Radio } from '@navanta/design-system'
import { ComponentPreview } from '@/app/components/component-preview'
import type { ComponentMeta } from '@/lib/component-registry'

interface RadioDemoProps {
  meta: ComponentMeta
}

export function RadioDemo({ meta }: RadioDemoProps) {
  return (
    <ComponentPreview
      meta={meta}
      defaultChildren=""
      renderPreview={(props) => (
        <Radio
          label={(props.label as string) || undefined}
          error={(props.error as string) || undefined}
          disabled={props.disabled as boolean | undefined}
        />
      )}
    />
  )
}
