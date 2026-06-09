'use client'

import { StackedBarChart, type StackedChartDatum } from '@navanta-ai/design-system'
import { ComponentPreview } from '@/app/components/component-preview'
import type { ComponentMeta } from '@/lib/component-registry'

const STACKED_DATASETS: Record<string, StackedChartDatum[]> = {
  claims: [
    {
      label: 'Claims Requested',
      segments: [
        { label: 'Damage', value: 3, color: 'var(--chart-1)' },
        { label: 'Warranty', value: 4, color: 'var(--chart-2)' },
        { label: 'Missing Items', value: 6, color: 'var(--chart-3)' },
      ],
    },
    {
      label: 'Claims Approved',
      segments: [
        { label: 'Damage', value: 2, color: 'var(--chart-1)' },
        { label: 'Warranty', value: 3, color: 'var(--chart-2)' },
        { label: 'Missing Items', value: 4, color: 'var(--chart-3)' },
      ],
    },
    {
      label: 'Claims Closed',
      segments: [
        { label: 'Damage', value: 1, color: 'var(--chart-1)' },
        { label: 'Warranty', value: 2, color: 'var(--chart-2)' },
        { label: 'Missing Items', value: 3, color: 'var(--chart-3)' },
      ],
    },
  ],
  operations: [
    {
      label: 'Tickets',
      segments: [
        { label: 'Billing', value: 18, color: 'var(--chart-1)' },
        { label: 'Technical', value: 32, color: 'var(--chart-2)' },
        { label: 'Delivery', value: 14, color: 'var(--chart-5)' },
      ],
    },
    {
      label: 'Resolved',
      segments: [
        { label: 'Billing', value: 16, color: 'var(--chart-1)' },
        { label: 'Technical', value: 24, color: 'var(--chart-2)' },
        { label: 'Delivery', value: 11, color: 'var(--chart-5)' },
      ],
    },
    {
      label: 'Escalated',
      segments: [
        { label: 'Billing', value: 4, color: 'var(--chart-1)' },
        { label: 'Technical', value: 9, color: 'var(--chart-2)' },
        { label: 'Delivery', value: 5, color: 'var(--chart-5)' },
      ],
    },
  ],
}

export function StackedBarChartDemo({ meta }: { meta: ComponentMeta }) {
  return (
    <ComponentPreview
      meta={meta}
      codeTemplate={(props) => {
        const datasetKey = ((props.dataset as string) || 'claims') as keyof typeof STACKED_DATASETS
        const data = STACKED_DATASETS[datasetKey] ?? STACKED_DATASETS.claims
        const showLegend = props.showLegend !== false
        const showTotals = props.showTotals !== false
        const showGrid = props.showGrid !== false
        const accessibilityMode = ((props.accessibilityMode as string) || 'default') as 'default' | 'colorblind-safe'

        return `import { StackedBarChart } from '@navanta-ai/design-system'

const data = ${JSON.stringify(data, null, 2)}

export default function Example() {
  return (
    <StackedBarChart
      data={data}
      showLegend={${showLegend}}
      showTotals={${showTotals}}
      showGrid={${showGrid}}
      accessibilityMode="${accessibilityMode}"
    />
  )
}`
      }}
      renderPreview={(props) => {
        const datasetKey = ((props.dataset as string) || 'claims') as keyof typeof STACKED_DATASETS
        const data = STACKED_DATASETS[datasetKey] ?? STACKED_DATASETS.claims
        const accessibilityMode = ((props.accessibilityMode as string) || 'default') as 'default' | 'colorblind-safe'

        return (
          <div className="w-full max-w-3xl space-y-2">
            <StackedBarChart
              data={data}
              showLegend={props.showLegend !== false}
              showTotals={props.showTotals !== false}
              showGrid={props.showGrid !== false}
              accessibilityMode={accessibilityMode}
            />
            {accessibilityMode === 'colorblind-safe' && (
              <p className="text-xs text-muted-foreground">
                Color-blind safe view is enabled: segment patterns and outlines are applied.
              </p>
            )}
          </div>
        )
      }}
    />
  )
}
