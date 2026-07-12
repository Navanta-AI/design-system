'use client'

import { KpiBreakdownCard, KpiProgressCard, KpiStatCard } from '@navanta-ai/design-system'
import { ComponentPreview } from '@/app/components/component-preview'
import type { ComponentMeta } from '@/lib/component-registry'

type Variant = 'stat' | 'progress' | 'breakdown'
type Trend = 'up' | 'down' | 'neutral'
type ProgressColor =
  | 'brand'
  | 'success'
  | 'warning'
  | 'destructive'
  | 'info'

const escapeForTemplate = (value: string) => value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
const FIGMA_DESTRUCTIVE_GRADIENT =
  'linear-gradient(to left, #DE1010 0%, rgba(222,16,16,0.4) 17.788%, rgba(222,16,16,0.4) 100%)'
const tokenForColor = (color: ProgressColor) => {
  if (color === 'brand') return 'primary'
  return color
}
const tokenGradient = (token: string) =>
  `linear-gradient(to left, var(--${token}) 0%, color-mix(in srgb, var(--${token}) 40%, transparent) 17.788%, color-mix(in srgb, var(--${token}) 40%, transparent) 100%)`
const progressGradientFor = (color: ProgressColor) =>
  color === 'destructive' ? FIGMA_DESTRUCTIVE_GRADIENT : tokenGradient(tokenForColor(color))

export function KpiDemo({ meta }: { meta: ComponentMeta }) {
  return (
    <ComponentPreview
      meta={meta}
      codeTemplate={(props) => {
        const variant = (props.variant as Variant) || 'stat'
        const trend = (props.trend as Trend) || 'up'
        const showInfo =
          typeof props.showInfo === 'boolean'
            ? props.showInfo
            : typeof props.showIcon === 'boolean'
              ? props.showIcon
              : true
        const label = ((props.label as string) || 'Open Orders').trim() || 'Open Orders'
        const number = ((props.number as string) || '18').trim() || '18'
        const rawPercentage = ((props.percentage as string) || '78.5').trim() || '78.5'
        const rawCardWidth = ((props.cardWidth as string) || '320').trim() || '320'
        const parsedCardWidth = Number.parseInt(rawCardWidth, 10)
        const cardWidth = Number.isFinite(parsedCardWidth)
          ? Math.min(320, Math.max(220, parsedCardWidth))
          : 320
        const progressColor = (props.progressColor as ProgressColor) || 'destructive'
        const parsedPercentage = Number.parseFloat(rawPercentage)
        const percentageValue = Number.isFinite(parsedPercentage)
          ? Math.min(100, Math.max(0, parsedPercentage))
          : 78.5
        const safeLabel = escapeForTemplate(label)
        const safeNumber = escapeForTemplate(number)
        const safePercentage = escapeForTemplate(rawPercentage)
        const safeProgressGradient = escapeForTemplate(progressGradientFor(progressColor))
        const changeLabel =
          trend === 'down' ? '-3 vs last month' : trend === 'neutral' ? '0 vs last month' : '+3 vs last month'
        if (variant === 'progress') {
          // KpiProgressCard renders the standard info icon itself — just pass `info`.
          return `import { KpiProgressCard } from '@navanta-ai/design-system'

const progressGradient = "${safeProgressGradient}"

export default function Example() {
  return (
    <KpiProgressCard
      title="${safeLabel}"
      value="${safeNumber}"
      subtitle="${safePercentage}% of $1M credit limit used"
      progress={${percentageValue}}
      progressGradient={progressGradient}${showInfo ? '\n      info="More info"' : ''}
    />
  )
}`
        }

        if (variant === 'breakdown') {
          // KpiBreakdownCard renders the standard info icon itself — just pass `info`.
          return `import { KpiBreakdownCard } from '@navanta-ai/design-system'

export default function Example() {
  return (
    <KpiBreakdownCard
      title="${safeLabel}"
      value="${safeNumber}"
      subtitle="32 DOS · 12 SS · 3 service level"${showInfo ? '\n      info="More info"' : ''}
    />
  )
}`
        }

        // KpiStatCard renders the standard info icon itself — just pass `info`.
        return `import { KpiStatCard } from '@navanta-ai/design-system'

export default function Example() {
  return (
    <KpiStatCard
      title="${safeLabel}"
      value="${safeNumber}"
      change="${changeLabel}"
      trend="${trend}"${showInfo ? '\n      info="More info"' : ''}
    />
  )
}`
      }}
      renderPreview={(props) => {
        const variant = (props.variant as Variant) || 'stat'
        const trend = (props.trend as Trend) || 'up'
        const showInfo =
          typeof props.showInfo === 'boolean'
            ? props.showInfo
            : typeof props.showIcon === 'boolean'
              ? props.showIcon
              : true
        const label = ((props.label as string) || 'Open Orders').trim() || 'Open Orders'
        const number = ((props.number as string) || '18').trim() || '18'
        const rawPercentage = ((props.percentage as string) || '78.5').trim() || '78.5'
        const rawCardWidth = ((props.cardWidth as string) || '320').trim() || '320'
        const parsedCardWidth = Number.parseInt(rawCardWidth, 10)
        const cardWidth = Number.isFinite(parsedCardWidth)
          ? Math.min(320, Math.max(220, parsedCardWidth))
          : 320
        const progressColor = (props.progressColor as ProgressColor) || 'destructive'
        const parsedPercentage = Number.parseFloat(rawPercentage)
        const percentageValue = Number.isFinite(parsedPercentage)
          ? Math.min(100, Math.max(0, parsedPercentage))
          : 78.5
        const progressGradient = progressGradientFor(progressColor)

        return (
          <div className="w-full max-w-[680px]">
            <div style={{ width: `${cardWidth}px`, maxWidth: '100%' }}>
              {variant === 'breakdown' ? (
                <KpiBreakdownCard
                  className="max-w-none"
                  title={label}
                  value={number}
                  subtitle="32 DOS · 12 SS · 3 service level"
                  info={showInfo ? 'More info' : undefined}
                />
              ) : variant === 'progress' ? (
                <KpiProgressCard
                  className="max-w-none"
                  title={label}
                  value={number}
                  subtitle={`${rawPercentage}% of $1M credit limit used`}
                  progress={percentageValue}
                  progressGradient={progressGradient}
                  info={showInfo ? 'More info' : undefined}
                />
              ) : (
                <KpiStatCard
                  className="max-w-none"
                  title={label}
                  value={number}
                  change={trend === 'down' ? '-3 vs last month' : trend === 'neutral' ? '0 vs last month' : '+3 vs last month'}
                  trend={trend}
                  info={showInfo ? 'More info' : undefined}
                />
              )}
            </div>
          </div>
        )
      }}
    />
  )
}
