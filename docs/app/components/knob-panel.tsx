'use client'

import {
  Checkbox,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@admin-navanta/design-system'
import type { KnobDef } from '@/lib/component-registry'

interface KnobPanelProps {
  knobs: KnobDef[]
  values: Record<string, string | boolean>
  onChange: (name: string, value: string | boolean) => void
}

export function KnobPanel({ knobs, values, onChange }: KnobPanelProps) {
  if (knobs.length === 0) return null

  const toLabel = (name: string) =>
    name
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/[_-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, (c) => c.toUpperCase())

  const getProgressSwatchStyle = (option: string) => ({
    backgroundColor:
      option === 'brand'
        ? 'var(--primary)'
        : option === 'success'
          ? 'var(--success)'
          : option === 'warning'
            ? 'var(--warning)'
            : option === 'destructive'
              ? 'var(--destructive)'
              : 'var(--info)',
  })

  const getProgressOptionLabel = (option: string) =>
    option === 'brand'
      ? 'Brand'
      : option === 'success'
        ? 'Success'
        : option === 'warning'
          ? 'Warning'
          : option === 'destructive'
            ? 'Destructive'
            : 'Info'

  const variantKnob = knobs.find((knob) => knob.name === 'variant' && knob.type === 'select')
  const selectedVariant = (values.variant as string) || ''
  const isProgressVariant = selectedVariant === 'progress'

  const isHiddenByVariant = (knob: KnobDef) =>
    ((knob.name === 'percentage' || knob.name === 'progressColor') && !isProgressVariant) ||
    (knob.name === 'trend' && isProgressVariant)

  const isKpiKnobSet =
    knobs.some((knob) => knob.name === 'progressColor') &&
    knobs.some((knob) => knob.name === 'percentage')

  const visibleKnobs = knobs
    .filter((knob) => knob !== variantKnob && !isHiddenByVariant(knob))
    .sort((a, b) => {
      if (!isKpiKnobSet) return 0
      const order = isProgressVariant
        ? ['cardWidth', 'label', 'number', 'percentage', 'progressColor', 'showInfo']
        : ['cardWidth', 'label', 'number', 'trend', 'showInfo', 'percentage', 'progressColor']
      const aIndex = order.indexOf(a.name)
      const bIndex = order.indexOf(b.name)
      if (aIndex === -1 && bIndex === -1) return 0
      if (aIndex === -1) return 1
      if (bIndex === -1) return -1
      return aIndex - bIndex
    })

  const renderKnob = (knob: KnobDef) => {
    const value = values[knob.name]
    const fieldLabel = toLabel(knob.name)
    const heading = knob.type === 'boolean' ? 'State' : fieldLabel

    return (
      <div key={knob.name} className="flex w-full flex-col items-start gap-1.5">
        <label className="text-xs font-medium text-[#71717a] dark:text-muted-foreground">
          {heading}
        </label>

        {knob.type === 'select' && (
          <Select
            value={value as string}
            onValueChange={(nextValue: string) => onChange(knob.name, nextValue)}
          >
            <SelectTrigger size="md" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {knob.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {knob.name === 'progressColor' ? (
                    <span className="inline-flex items-center gap-2">
                      <span
                        className="size-3.5 shrink-0 rounded-[2px] border border-border/70"
                        style={getProgressSwatchStyle(option)}
                      />
                      <span>{getProgressOptionLabel(option)}</span>
                    </span>
                  ) : (
                    toLabel(option)
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {knob.type === 'boolean' && (
          <Checkbox
            checked={value as boolean}
            onChange={(e) => onChange(knob.name, e.target.checked)}
            label={fieldLabel}
          />
        )}

        {knob.type === 'text' && (
          <Input
            type="text"
            size="md"
            value={value as string}
            onChange={(e) => onChange(knob.name, e.target.value)}
            className="w-full text-sm"
          />
        )}
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {variantKnob?.options && variantKnob.options.length > 0 && (
        <div className="flex w-full flex-col items-start gap-1.5">
          <label className="text-xs font-medium text-[#71717a] dark:text-muted-foreground">
            {toLabel(variantKnob.name)}
          </label>
          <div className="inline-flex flex-wrap items-center gap-1 rounded-full bg-muted p-1">
            {variantKnob.options.map((option) => {
              const isActive = selectedVariant === option
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => onChange('variant', option)}
                  className={
                    isActive
                      ? 'inline-flex h-7 items-center rounded-full border border-border bg-background px-3 text-xs font-medium text-foreground shadow-sm'
                      : 'inline-flex h-7 items-center rounded-full px-3 text-xs font-medium text-muted-foreground hover:text-foreground'
                  }
                >
                  {toLabel(option)}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleKnobs.map(renderKnob)}
      </div>
    </div>
  )
}
