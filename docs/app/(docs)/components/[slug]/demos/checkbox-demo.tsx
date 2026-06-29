'use client'

import { Checkbox } from '@navanta-ai/design-system'
import { ComponentPreview } from '@/app/components/component-preview'
import type { ComponentMeta } from '@/lib/component-registry'

interface CheckboxDemoProps {
  meta: ComponentMeta
}

export function CheckboxDemo({ meta }: CheckboxDemoProps) {
  return (
    <div className="flex w-full flex-col gap-10">
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

      {/* States — disabled uses an achromatic grey fill (not just dimming) so it
          reads regardless of colour vision; compare enabled vs disabled below. */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          States
        </span>
        <div className="grid grid-cols-2 gap-x-10 gap-y-3">
          <Checkbox label="Enabled — unchecked" />
          <Checkbox label="Enabled — checked" defaultChecked />
          <Checkbox label="Enabled — indeterminate" indeterminate />
          <Checkbox label="Error" error="Required" />
          <Checkbox label="Disabled — unchecked" disabled />
          <Checkbox label="Disabled — checked" defaultChecked disabled />
          <Checkbox label="Disabled — indeterminate" indeterminate disabled />
        </div>
      </div>
    </div>
  )
}
