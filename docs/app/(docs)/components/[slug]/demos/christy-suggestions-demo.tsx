'use client'

import * as React from 'react'
import { ChristySuggestions, type SuggestionOption } from '@admin-navanta/design-system'
import { ComponentPreview } from '@/app/components/component-preview'
import type { ComponentMeta } from '@/lib/component-registry'

const OPTIONS: SuggestionOption[] = [
  { label: 'Expedite via Globex', detail: '+$120 freight · arrives Fri', credit: 'Recommended', creditColor: '#10b981' },
  { label: 'Wait for primary vendor', detail: 'No added cost · arrives next Wed' },
  { label: 'Split shipment', detail: '+$60 freight · partial Fri, rest Mon' },
]

const REASONING = [
  'Primary vendor lead time slipped 4 days',
  'Globex has the full quantity in stock today',
]

export function ChristySuggestionsDemo({ meta }: { meta: ComponentMeta }) {
  const [mode, setMode] = React.useState<'selection' | 'confirmed'>('selection')
  const [selectedIdx, setSelectedIdx] = React.useState(0)
  const [phase, setPhase] = React.useState<'idle' | 'confirming' | 'confirmed'>('idle')

  return (
    <ComponentPreview
      meta={meta}
      hideKnobs
      codeTemplate={() => `import { ChristySuggestions } from '@admin-navanta/design-system'
import * as React from 'react'

const options = [
  { label: 'Expedite via Globex', detail: '+$120 freight · arrives Fri', credit: 'Recommended', creditColor: '#10b981' },
  { label: 'Wait for primary vendor', detail: 'No added cost · arrives next Wed' },
  { label: 'Split shipment', detail: '+$60 freight · partial Fri, rest Mon' },
]

export default function Example() {
  const [selectedIdx, setSelectedIdx] = React.useState(0)
  const [phase, setPhase] = React.useState<'idle' | 'confirming' | 'confirmed'>('idle')

  return (
    <ChristySuggestions
      mode="selection"
      summary="Christy recommends expediting through the secondary vendor to hit the delivery window."
      reasoning={['Primary vendor lead time slipped 4 days', 'Globex has the full quantity in stock today']}
      options={options}
      recommendedIdx={0}
      selectedIdx={selectedIdx}
      onSelect={setSelectedIdx}
      confirmLabel="Confirm choice"
      onConfirm={() => setPhase('confirmed')}
      phase={phase}
    />
  )
}`}
      renderPreview={() => (
        <div className="w-full max-w-[420px]">
          {mode === 'confirmed' ? (
            <div className="flex flex-col gap-3">
              <ChristySuggestions
                mode="confirmed"
                confirmedLabel={`Confirmed: ${OPTIONS[selectedIdx].label}`}
                detail={OPTIONS[selectedIdx].detail}
                reasoning={REASONING}
              />
              <button
                type="button"
                onClick={() => {
                  setMode('selection')
                  setPhase('idle')
                }}
                className="self-start text-[13px] text-[var(--text-accent-dark)] hover:underline"
              >
                Reset demo
              </button>
            </div>
          ) : (
            <ChristySuggestions
              mode="selection"
              summary="Christy recommends expediting through the secondary vendor to hit the delivery window."
              reasoning={REASONING}
              options={OPTIONS}
              recommendedIdx={0}
              selectedIdx={selectedIdx}
              onSelect={setSelectedIdx}
              confirmLabel="Confirm choice"
              onConfirm={() => {
                setPhase('confirmed')
                setMode('confirmed')
              }}
              phase={phase}
            />
          )}
        </div>
      )}
    />
  )
}
