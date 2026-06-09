'use client'

import { useState } from 'react'
import { Radio } from '@navanta-ai/design-system'
import { ComponentPreview } from '@/app/components/component-preview'
import type { ComponentMeta } from '@/lib/component-registry'

interface RadioDemoProps {
  meta: ComponentMeta
}

const DEFAULT_OPTIONS = ['Option 1', 'Option 2', 'Option 3']

const CARD_OPTIONS = [
  { label: 'Standard shipping', helperText: 'Arrives in 3–5 business days', badge: 'Free' },
  { label: 'Express shipping', helperText: 'Arrives in 1–2 business days', badge: '$12' },
  { label: 'Overnight', helperText: 'Next business day', badge: '$28' },
]

function RadioPreview({ error, disabled }: { error?: string; disabled?: boolean }) {
  const [basic, setBasic] = useState(0)
  const [card, setCard] = useState(1)

  return (
    <div className="flex w-full max-w-[380px] flex-col gap-8">
      {/* Default variant */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Default
        </span>
        <div className="flex flex-col gap-2.5">
          {DEFAULT_OPTIONS.map((opt, i) => (
            <Radio
              key={opt}
              name="radio-default"
              label={opt}
              checked={basic === i}
              onChange={() => setBasic(i)}
              error={i === 0 ? error : undefined}
              disabled={disabled}
            />
          ))}
        </div>
      </div>

      {/* Card variant */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Card
        </span>
        <div className="flex flex-col gap-2.5">
          {CARD_OPTIONS.map((opt, i) => (
            <Radio
              key={opt.label}
              card
              name="radio-card"
              label={opt.label}
              helperText={opt.helperText}
              badge={
                <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                  {opt.badge}
                </span>
              }
              checked={card === i}
              onChange={() => setCard(i)}
              error={i === 0 ? error : undefined}
              disabled={disabled}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export function RadioDemo({ meta }: RadioDemoProps) {
  return (
    <ComponentPreview
      meta={meta}
      defaultChildren=""
      renderPreview={(props) => (
        <RadioPreview
          error={(props.error as string) || undefined}
          disabled={props.disabled as boolean | undefined}
        />
      )}
      codeTemplate={() =>
        `import { Radio } from '@navanta-ai/design-system'

// Default
<Radio name="plan" label="Option 1" checked onChange={...} />

// Card variant — text + subtext + badge (neutral)
<Radio
  card
  name="shipping"
  label="Express shipping"
  helperText="Arrives in 1–2 business days"
  badge={<span>$12</span>}
  checked
  onChange={...}
/>`
      }
    />
  )
}
