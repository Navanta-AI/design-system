'use client'

import { useState } from 'react'
import { Chip } from '@navanta-ai/design-system'
import { WarningCircle, Warning, Lightning, Tag } from '@phosphor-icons/react'
import { ComponentPreview } from '@/app/components/component-preview'
import type { ComponentMeta } from '@/lib/component-registry'

type Variant = 'info' | 'danger' | 'warning' | 'neutral'

// Chip icons are duotone Phosphor glyphs; the variant tints them.
const iconFor: Record<Variant, React.ReactNode> = {
  info: <Lightning weight="duotone" />,
  danger: <WarningCircle weight="duotone" />,
  warning: <Warning weight="duotone" />,
  neutral: <Tag weight="duotone" />,
}

const FILTERS: { key: Variant; label: string; count: number }[] = [
  { key: 'danger', label: 'Critical', count: 4 },
  { key: 'warning', label: 'High', count: 7 },
  { key: 'info', label: 'High demand', count: 12 },
  { key: 'neutral', label: 'Standard', count: 23 },
]

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{title}</span>
      {children}
    </div>
  )
}

export function ChipDemo({ meta }: { meta: ComponentMeta }) {
  const [selected, setSelected] = useState<Set<Variant>>(() => new Set(['danger']))
  const toggle = (k: Variant) =>
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(k)) next.delete(k)
      else next.add(k)
      return next
    })

  return (
    <div className="flex w-full flex-col gap-10">
      <ComponentPreview
        meta={meta}
        defaultChildren="Critical"
        renderPreview={(props) => {
          const variant = (props.variant as Variant) ?? 'danger'
          const withIcon = props.icon !== false
          const count = props.count ? Number(props.count) : undefined
          return (
            <Chip
              selected={props.selected as boolean}
              variant={variant}
              icon={withIcon ? iconFor[variant] : undefined}
              count={Number.isNaN(count) ? undefined : count}
            >
              {(props.label as string) || 'Critical'}
            </Chip>
          )
        }}
        codeTemplate={(props) => {
          const variant = (props.variant as Variant) ?? 'danger'
          const withIcon = props.icon !== false
          const iconImport = { info: 'Lightning', danger: 'WarningCircle', warning: 'Warning', neutral: 'Tag' }[variant]
          return [
            `import { Chip } from '@navanta-ai/design-system'`,
            withIcon ? `import { ${iconImport} } from '@phosphor-icons/react'` : '',
            '',
            `<Chip`,
            `  variant="${variant}"${props.selected ? ' selected' : ''}${props.count ? ` count={${Number(props.count)}}` : ''}`,
            withIcon ? `  icon={<${iconImport} weight="duotone" />}` : '',
            `  onClick={() => {/* toggle */}}`,
            `>`,
            `  ${(props.label as string) || 'Critical'}`,
            `</Chip>`,
          ].filter((l) => l !== '').join('\n')
        }}
      />

      {/* Interactive filter group */}
      <Group title="Filter group (click to toggle)">
        <div className="flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => (
            <Chip
              key={f.key}
              selected={selected.has(f.key)}
              variant={f.key}
              icon={iconFor[f.key]}
              count={f.count}
              onClick={() => toggle(f.key)}
            >
              {f.label}
            </Chip>
          ))}
        </div>
      </Group>

      {/* Selected vs default — unselected sits on white with a default border; selected fills + strong border */}
      <Group title="Selected vs. default">
        <div className="flex flex-wrap items-center gap-2">
          <Chip variant="danger" icon={iconFor.danger}>Default</Chip>
          <Chip selected variant="danger" icon={iconFor.danger}>Selected</Chip>
        </div>
      </Group>
    </div>
  )
}
