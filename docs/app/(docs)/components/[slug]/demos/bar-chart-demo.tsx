'use client'

import { BarChart, type ChartDatum } from '@navanta/design-system'
import { ComponentPreview } from '@/app/components/component-preview'
import type { ComponentMeta } from '@/lib/component-registry'

const BAR_DATASETS: Record<string, ChartDatum[]> = {
  weekly: [
    { label: 'Mon', value: 24 },
    { label: 'Tue', value: 18 },
    { label: 'Wed', value: 32 },
    { label: 'Thu', value: 28 },
    { label: 'Fri', value: 40 },
    { label: 'Sat', value: 22 },
    { label: 'Sun', value: 16 },
  ],
  monthly: [
    { label: 'Jan', value: 120 },
    { label: 'Feb', value: 98 },
    { label: 'Mar', value: 136 },
    { label: 'Apr', value: 144 },
    { label: 'May', value: 126 },
    { label: 'Jun', value: 168 },
  ],
}

export function BarChartDemo({ meta }: { meta: ComponentMeta }) {
  return (
    <ComponentPreview
      meta={meta}
      codeTemplate={(props) => {
        const datasetKey = ((props.dataset as string) || 'weekly') as keyof typeof BAR_DATASETS
        const data = BAR_DATASETS[datasetKey] ?? BAR_DATASETS.weekly
        const colorToken = (props.color as string) || 'chart-2'
        const accessibilityMode = ((props.accessibilityMode as string) || 'default') as 'default' | 'colorblind-safe'
        const showGrid = props.showGrid !== false
        const showYAxisLabels = props.showYAxisLabels !== false
        const showValueLabels = props.showValueLabels === true || accessibilityMode === 'colorblind-safe'

        return `import { BarChart } from '@navanta/design-system'

const data = ${JSON.stringify(data, null, 2)}

export default function Example() {
  return (
    <BarChart
      data={data}
      color="var(--${colorToken})"
      accessibilityMode="${accessibilityMode}"
      showGrid={${showGrid}}
      showYAxisLabels={${showYAxisLabels}}
      showValueLabels={${showValueLabels}}
    />
  )
}`
      }}
      renderPreview={(props) => {
        const datasetKey = ((props.dataset as string) || 'weekly') as keyof typeof BAR_DATASETS
        const data = BAR_DATASETS[datasetKey] ?? BAR_DATASETS.weekly
        const colorToken = (props.color as string) || 'chart-2'
        const accessibilityMode = ((props.accessibilityMode as string) || 'default') as 'default' | 'colorblind-safe'

        return (
          <div className="w-full max-w-3xl space-y-2">
            <BarChart
              data={data}
              color={`var(--${colorToken})`}
              accessibilityMode={accessibilityMode}
              showGrid={props.showGrid !== false}
              showYAxisLabels={props.showYAxisLabels !== false}
              showValueLabels={props.showValueLabels === true || accessibilityMode === 'colorblind-safe'}
            />
            {accessibilityMode === 'colorblind-safe' && (
              <p className="text-xs text-muted-foreground">
                Color-blind safe view is enabled: pattern overlays and higher-contrast outlines are applied.
              </p>
            )}
          </div>
        )
      }}
    />
  )
}
