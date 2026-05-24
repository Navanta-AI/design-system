'use client'

import { Switch } from '@admin-navanta/design-system'
import { ComponentPreview } from '@/app/components/component-preview'
import type { ComponentMeta } from '@/lib/component-registry'

interface SwitchDemoProps {
  meta: ComponentMeta
}

export function SwitchDemo({ meta }: SwitchDemoProps) {
  return (
    <ComponentPreview
      meta={meta}
      defaultChildren=""
      renderPreview={(props) => (
        <Switch
          label={(props.label as string) || undefined}
          error={(props.error as string) || undefined}
          disabled={props.disabled as boolean | undefined}
        />
      )}
    />
  )
}
