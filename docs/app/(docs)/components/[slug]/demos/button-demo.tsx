'use client'

import { useState } from 'react'
import { Button, Checkbox, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@navanta-ai/design-system'
import { ArrowRight, Envelope, Check, X } from '@phosphor-icons/react'
import { DynamicCodeBlock } from '@/app/components/dynamic-code-block'
import type { ComponentMeta } from '@/lib/component-registry'

// ─── Types ────────────────────────────────────────────────
type Variant      = 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive' | 'link' | 'christy'
type IconOption   = 'none' | 'prefix-icon' | 'suffix-icon' | 'icon-only'
type SizeOption   = 'default' | 'sm' | 'lg'

interface ButtonDemoProps {
  meta: ComponentMeta
}

// ─── Shadcn-style pill toggle ─────────────────────────────
function PillOption({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
        checked
          ? 'bg-white dark:bg-background text-[#09090b] dark:text-foreground shadow-sm'
          : 'bg-transparent text-[#71717a] dark:text-muted-foreground hover:text-[#09090b] dark:hover:text-foreground'
      }`}
    >
      {label}
    </button>
  )
}

// ─── Control row label ─────────────────────────────────────
function ControlLabel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`text-xs font-medium text-[#71717a] dark:text-muted-foreground ${className}`}>{children}</span>
  )
}

// ─── Button Demo ──────────────────────────────────────────
export function ButtonDemo({ meta: _ }: ButtonDemoProps) {
  const [variant, setVariant]   = useState<Variant>('primary')
  const [size, setSize]         = useState<SizeOption>('default')
  const [icon, setIcon]         = useState<IconOption>('none')
  const [disabled, setDisabled] = useState(false)

  const VARIANTS: { label: string; value: Variant }[] = [
    { label: 'Primary',     value: 'primary'     },
    { label: 'Secondary',   value: 'secondary'   },
    { label: 'Ghost',       value: 'ghost'       },
    { label: 'Outline',     value: 'outline'     },
    { label: 'Destructive', value: 'destructive' },
    { label: 'Link',        value: 'link'        },
    { label: 'Christy',     value: 'christy'     },
  ]

  const SIZES: { label: string; value: SizeOption }[] = [
    { label: 'Default', value: 'default' },
    { label: 'Small',   value: 'sm'      },
    { label: 'Large',   value: 'lg'      },
  ]

  const ICONS: { label: string; value: IconOption }[] = [
    { label: 'None',   value: 'none'        },
    { label: 'Prefix', value: 'prefix-icon' },
    { label: 'Suffix', value: 'suffix-icon' },
    { label: 'Icon only', value: 'icon-only' },
  ]

  // ── Live preview ──────────────────────────────────────
  function renderPreview() {
    const resolvedSize = icon === 'icon-only' ? 'icon' : (size !== 'default' ? size : undefined)

    return (
      <Button
        variant={variant}
        size={resolvedSize}
        disabled={disabled}
        iconLeft={icon === 'prefix-icon' ? <Envelope size={15} /> : undefined}
        iconRight={icon === 'suffix-icon' ? <ArrowRight size={15} /> : undefined}
      >
        {icon === 'icon-only' ? <Envelope size={15} /> : 'Button'}
      </Button>
    )
  }

  // ── Dynamic code ──────────────────────────────────────
  function getCode() {
    const lines: string[] = [`import { Button } from '@navanta-ai/design-system'`]

    if (icon === 'prefix-icon' || icon === 'icon-only') lines.push(`import { Envelope } from '@phosphor-icons/react'`)
    if (icon === 'suffix-icon') lines.push(`import { ArrowRight } from '@phosphor-icons/react'`)

    lines.push('')

    const props: string[] = []
    if (variant !== 'primary')      props.push(`variant="${variant}"`)
    if (icon === 'icon-only')       props.push(`size="icon"`)
    else if (size !== 'default')    props.push(`size="${size}"`)
    if (icon === 'prefix-icon')     props.push(`iconLeft={<Envelope size={15} />}`)
    if (icon === 'suffix-icon')     props.push(`iconRight={<ArrowRight size={15} />}`)
    if (disabled)                   props.push(`disabled`)

    const attrStr = props.length ? '\n  ' + props.join('\n  ') + '\n' : ''
    const childrenStr = icon === 'icon-only' ? '\n  <Envelope size={15} />\n' : 'Button'
    lines.push(`<Button${attrStr}>${childrenStr}</Button>`)

    return lines.join('\n')
  }

  const code = getCode()

  return (
    <div className="space-y-6">

      {/* ── Preview + Code card ──────────────────────────── */}
      <div className="overflow-hidden rounded-xl border border-[#e4e4e7] dark:border-border">

        {/* Controls bar — Shadcn pill style */}
        <div className="grid grid-cols-1 gap-4 px-4 py-3 border-b border-[#e4e4e7] dark:border-border bg-[#fafafa] dark:bg-muted/10 md:grid-cols-3">

          {/* Size — navanta Select */}
          <div className="flex w-full flex-col items-start gap-1.5">
            <ControlLabel>Size</ControlLabel>
            <Select value={size} onValueChange={(v: string) => setSize(v as SizeOption)}>
              <SelectTrigger size="md" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SIZES.map(s => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Icon — navanta Select */}
          <div className="flex w-full flex-col items-start gap-1.5">
            <ControlLabel>Icon</ControlLabel>
            <Select value={icon} onValueChange={(v: string) => setIcon(v as IconOption)}>
              <SelectTrigger size="md" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ICONS.map(i => (
                  <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* State — navanta Checkbox */}
          <div className="flex w-full flex-col items-start gap-1.5">
            <ControlLabel>State</ControlLabel>
            <Checkbox
              label="Disabled"
              checked={disabled}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDisabled(e.target.checked)}
            />
          </div>

          {/* Variant — Shadcn pill strip */}
          <div className="flex w-full flex-col items-start gap-1.5 md:col-span-3">
            <ControlLabel>Variant</ControlLabel>
            <div className="inline-flex flex-wrap items-center gap-0.5 rounded-lg bg-[#f4f4f5] dark:bg-muted p-1">
              {VARIANTS.map(v => (
                <PillOption key={v.value} label={v.label} checked={variant === v.value} onChange={() => setVariant(v.value)} />
              ))}
            </div>
          </div>

        </div>

        {/* Live preview */}
        <div className="flex min-h-[280px] items-center justify-center bg-white dark:bg-background p-10">
          {renderPreview()}
        </div>

        {/* Code — always visible below */}
        <div className="relative border-t border-[#e4e4e7] dark:border-border">
          <DynamicCodeBlock code={code} />
        </div>
      </div>

      {/* ── Do's and Don'ts ───────────────────────────── */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold tracking-tight">Do&apos;s and Don&apos;ts</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          <div className="rounded-xl border border-border p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/15">
                <Check size={11} weight="bold" className="text-green-600" />
              </span>
              <span className="text-sm font-semibold text-green-600">Do</span>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Use one primary action per screen or section.</li>
              <li>Use <strong className="text-foreground font-medium">primary</strong> for the main call-to-action.</li>
              <li>Use <strong className="text-foreground font-medium">secondary</strong> for less prominent actions.</li>
              <li>Use <strong className="text-foreground font-medium">ghost</strong> for tertiary or toolbar actions.</li>
            </ul>
          </div>

          <div className="rounded-xl border border-border p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500/15">
                <X size={11} weight="bold" className="text-red-600" />
              </span>
              <span className="text-sm font-semibold text-red-600">Don&apos;t</span>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Use <strong className="text-foreground font-medium">primary</strong> for destructive actions — use <strong className="text-foreground font-medium">destructive</strong> instead.</li>
              <li>Place multiple primary buttons in the same area.</li>
              <li>Use buttons for navigation — use the <strong className="text-foreground font-medium">link</strong> variant instead.</li>
              <li>Use an icon-only button without an <code className="text-xs">aria-label</code>.</li>
            </ul>
          </div>

        </div>
      </div>

    </div>
  )
}
