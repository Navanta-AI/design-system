'use client'

import { LineChart, type ChartDatum } from '@navanta-ai/design-system'
import { ComponentPreview } from '@/app/components/component-preview'
import type { ComponentMeta } from '@/lib/component-registry'

const LINE_DATASETS: Record<string, ChartDatum[]> = {
  weekly: [
    { label: 'Mon', value: 12 },
    { label: 'Tue', value: 18 },
    { label: 'Wed', value: 16 },
    { label: 'Thu', value: 24 },
    { label: 'Fri', value: 28 },
    { label: 'Sat', value: 22 },
    { label: 'Sun', value: 26 },
  ],
  monthly: [
    { label: 'Jan', value: 62 },
    { label: 'Feb', value: 68 },
    { label: 'Mar', value: 74 },
    { label: 'Apr', value: 70 },
    { label: 'May', value: 84 },
    { label: 'Jun', value: 92 },
  ],
}

export function LineChartDemo({ meta }: { meta: ComponentMeta }) {
  return (
    <ComponentPreview
      meta={meta}
      codeTemplate={(props) => {
        const datasetKey = ((props.dataset as string) || 'monthly') as keyof typeof LINE_DATASETS
        const data = LINE_DATASETS[datasetKey] ?? LINE_DATASETS.monthly
        const colorToken = (props.color as string) || 'chart-3'
        const showGrid = props.showGrid !== false
        const showArea = props.showArea !== false
        const smooth = props.smooth !== false
        const showPoints = props.showPoints !== false

        return `import { LineChart } from '@navanta-ai/design-system'

const data = ${JSON.stringify(data, null, 2)}

export default function Example() {
  return (
    <LineChart
      data={data}
      lineColor="var(--${colorToken})"
      areaColor="var(--${colorToken})"
      showGrid={${showGrid}}
      showArea={${showArea}}
      smooth={${smooth}}
      showPoints={${showPoints}}
    />
  )
}`
      }}
      renderPreview={(props) => {
        const datasetKey = ((props.dataset as string) || 'monthly') as keyof typeof LINE_DATASETS
        const data = LINE_DATASETS[datasetKey] ?? LINE_DATASETS.monthly
        const colorToken = (props.color as string) || 'chart-3'

        return (
          <div className="w-full max-w-3xl">
            <LineChart
              data={data}
              lineColor={`var(--${colorToken})`}
              areaColor={`var(--${colorToken})`}
              showGrid={props.showGrid !== false}
              showArea={props.showArea !== false}
              smooth={props.smooth !== false}
              showPoints={props.showPoints !== false}
            />
          </div>
        )
      }}
    />
  )
}
