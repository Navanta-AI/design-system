'use client'

import { Pill } from '@navanta-ai/design-system'
import { Info, WarningCircle, Warning, Tag, Truck, ArrowRight } from '@phosphor-icons/react'
import { ComponentPreview } from '@/app/components/component-preview'
import type { ComponentMeta } from '@/lib/component-registry'

interface PillDemoProps {
  meta: ComponentMeta
}

type Variant = 'info' | 'danger' | 'warning' | 'neutral'
type Size = 'sm' | 'md' | 'lg'

// Pill icons use the Phosphor duotone weight.
const iconFor: Record<Variant, React.ReactNode> = {
  info: <Info weight="duotone" />,
  danger: <WarningCircle weight="duotone" />,
  warning: <Warning weight="duotone" />,
  neutral: <Tag weight="duotone" />,
}

const variants: { key: Variant; label: string }[] = [
  { key: 'info', label: 'Info' },
  { key: 'danger', label: 'Critical' },
  { key: 'warning', label: 'On Hold' },
  { key: 'neutral', label: 'Draft' },
]

const sizes: Size[] = ['sm', 'md', 'lg']

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {title}
      </span>
      {children}
    </div>
  )
}

export function PillDemo({ meta }: PillDemoProps) {
  return (
    <div className="flex w-full flex-col gap-10">
      {/* Knob-driven playground */}
      <ComponentPreview
        meta={meta}
        renderPreview={(props) => {
          const variant = (props.variant as Variant) ?? 'danger'
          const size = (props.size as Size) ?? 'sm'
          const withIcon = props.icon !== false
          return (
            <Pill
              variant={variant}
              size={size}
              icon={withIcon ? iconFor[variant] : undefined}
            >
              {(props.label as string) || 'Critical'}
            </Pill>
          )
        }}
        codeTemplate={(props) => {
          const variant = (props.variant as Variant) ?? 'danger'
          const size = (props.size as Size) ?? 'sm'
          const withIcon = props.icon !== false
          const iconImport = { info: 'Info', danger: 'WarningCircle', warning: 'Warning', neutral: 'Tag' }[variant]
          const label = (props.label as string) || 'Critical'
          return [
            `import { Pill } from '@navanta-ai/design-system'`,
            withIcon ? `import { ${iconImport} } from '@phosphor-icons/react'` : '',
            '',
            `<Pill variant="${variant}" size="${size}"${withIcon ? ` icon={<${iconImport} weight="duotone" />}` : ''}>`,
            `  ${label}`,
            `</Pill>`,
          ].filter((l) => l !== '').join('\n')
        }}
      />

      {/* All semantic variants (small) */}
      <Group title="Semantic variants">
        <div className="flex flex-wrap items-center gap-2">
          {variants.map((v) => (
            <Pill key={v.key} variant={v.key} icon={iconFor[v.key]}>
              {v.label}
            </Pill>
          ))}
        </div>
      </Group>

      {/* Sizes */}
      <Group title="Sizes">
        <div className="flex flex-wrap items-center gap-2">
          {sizes.map((s) => (
            <Pill key={s} variant="danger" size={s} icon={iconFor.danger}>
              Critical
            </Pill>
          ))}
        </div>
      </Group>

      {/* Directional / route — leading icon + small arrow + code (Figma node 546-3127) */}
      <Group title="Directional / route">
        <div className="flex flex-wrap items-center gap-2">
          {(['sm', 'md', 'lg'] as Size[]).map((s) => (
            <Pill
              key={s}
              variant="neutral"
              size={s}
              icon={
                <>
                  <Truck weight="duotone" />
                  <ArrowRight size={s === 'sm' ? 8 : s === 'md' ? 9 : 10} weight="duotone" />
                </>
              }
            >
              HOU
            </Pill>
          ))}
        </div>
      </Group>

      {/* Without icon */}
      <Group title="Text only">
        <div className="flex flex-wrap items-center gap-2">
          {variants.map((v) => (
            <Pill key={v.key} variant={v.key}>
              {v.label}
            </Pill>
          ))}
        </div>
      </Group>
    </div>
  )
}
