'use client'

import { Progress, CircularProgress } from '@navanta-ai/design-system'
import { ComponentPreview } from '@/app/components/component-preview'
import type { ComponentMeta } from '@/lib/component-registry'
import { useState, useEffect } from 'react'

export function ProgressDemo({ meta }: { meta: ComponentMeta }) {
  const [value, setValue] = useState(13)

  useEffect(() => {
    const interval = setInterval(() => {
      setValue((v) => (v >= 100 ? 0 : v + 10))
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  const semantics = ['default', 'neutral', 'success', 'warning', 'error'] as const

  return (
    <div className="flex w-full flex-col gap-10">
      <ComponentPreview
        meta={meta}
        renderPreview={(props) => (
          <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-12">
            <Progress
              value={value}
              variant={props.variant as any}
              size={props.size as any}
              striped={props.striped as any}
              indeterminate={props.indeterminate as any}
              disabled={props.disabled as any}
              showLabel={props.showLabel !== false}
            />
            <CircularProgress
              value={value}
              variant={props.variant as any}
              indeterminate={props.indeterminate as any}
              disabled={props.disabled as any}
              showLabel={props.showLabel !== false}
              size={props.circularSize ? Number(props.circularSize) : 48}
            />
          </div>
        )}
      />

      {/* Gradient fill — every semantic + the disabled state. The saturated dark
          shade sits at the leading (progress-tip) edge per the Figma spec. */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Semantic gradients + disabled
        </span>
        <div className="flex w-full max-w-md flex-col gap-4">
          {semantics.map((v) => (
            <Progress key={v} value={66} variant={v} showLabel />
          ))}
          <Progress value={45} disabled showLabel />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-6">
          {semantics.map((v) => (
            <CircularProgress key={v} value={66} variant={v} showLabel />
          ))}
          <CircularProgress value={45} disabled showLabel />
        </div>
      </div>
    </div>
  )
}
