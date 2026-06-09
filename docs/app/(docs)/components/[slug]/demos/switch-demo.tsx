'use client'

import { useState } from 'react'
import { Switch } from '@navanta-ai/design-system'
import { ComponentPreview } from '@/app/components/component-preview'
import type { ComponentMeta } from '@/lib/component-registry'

interface SwitchDemoProps {
  meta: ComponentMeta
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{title}</span>
      {children}
    </div>
  )
}

function SwitchPreview({ label, error, disabled }: { label?: string; error?: string; disabled?: boolean }) {
  const [playground, setPlayground] = useState(true)
  const [off, setOff] = useState(false)
  const [on, setOn] = useState(true)

  return (
    <div className="flex w-full max-w-[420px] flex-col gap-8">
      {/* Knob-driven playground */}
      <Group title="Playground">
        <Switch
          label={label || 'Enable notifications'}
          error={error || undefined}
          disabled={disabled}
          checked={playground}
          onCheckedChange={setPlayground}
        />
      </Group>

      {/* On / off, no label */}
      <Group title="On / Off">
        <div className="flex items-center gap-6">
          <Switch checked={off} onCheckedChange={setOff} aria-label="Toggle (off example)" />
          <Switch checked={on} onCheckedChange={setOn} aria-label="Toggle (on example)" />
        </div>
      </Group>

      {/* Label + helper text */}
      <Group title="With helper text">
        <Switch
          label="Email notifications"
          helperText="Get notified when an order ships."
          defaultChecked
        />
      </Group>

      {/* States */}
      <Group title="States">
        <div className="flex flex-col gap-3">
          <Switch label="Disabled (off)" disabled />
          <Switch label="Disabled (on)" disabled defaultChecked />
          <Switch label="Marketing emails" error="You must opt in to continue." />
        </div>
      </Group>
    </div>
  )
}

export function SwitchDemo({ meta }: SwitchDemoProps) {
  return (
    <ComponentPreview
      meta={meta}
      defaultChildren=""
      renderPreview={(props) => (
        <SwitchPreview
          label={(props.label as string) || undefined}
          error={(props.error as string) || undefined}
          disabled={props.disabled as boolean | undefined}
        />
      )}
      codeTemplate={() =>
        `import { Switch } from '@navanta-ai/design-system'
import * as React from 'react'

// Uncontrolled
<Switch label="Enable notifications" defaultChecked />

// Controlled
const [on, setOn] = React.useState(true)
<Switch
  label="Email notifications"
  helperText="Get notified when an order ships."
  checked={on}
  onCheckedChange={setOn}
/>

// Error / disabled
<Switch label="Marketing emails" error="You must opt in to continue." />
<Switch label="Read only" disabled defaultChecked />`
      }
    />
  )
}
