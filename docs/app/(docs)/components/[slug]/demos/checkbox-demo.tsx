'use client'

import { Checkbox } from '@navanta-ai/design-system'
import { ComponentPreview } from '@/app/components/component-preview'
import type { ComponentMeta } from '@/lib/component-registry'

interface CheckboxDemoProps {
  meta: ComponentMeta
}

export function CheckboxDemo({ meta }: CheckboxDemoProps) {
  return (
    <ComponentPreview
      meta={meta}
      defaultChildren=""
      renderPreview={(props) => (
        <Checkbox
          label={(props.label as string) || undefined}
          error={(props.error as string) || undefined}
          indeterminate={props.indeterminate as boolean | undefined}
          disabled={props.disabled as boolean | undefined}
        />
      )}
    />
  )
}
