'use client'

import { PanelTimeline } from '@admin-navanta/design-system'
import { ComponentPreview } from '@/app/components/component-preview'
import type { ComponentMeta } from '@/lib/component-registry'

const MILESTONES = [
  {
    id: 'ordered',
    label: 'Ordered',
    status: 'completed' as const,
    date: 'May 3',
    events: [{ type: 'PO issued', date: 'May 3', severity: 'info' as const }],
  },
  {
    id: 'processing',
    label: 'Processing',
    status: 'completed' as const,
    date: 'May 5',
    events: [{ type: 'Picked & packed', date: 'May 5', severity: 'info' as const }],
  },
  {
    id: 'shipped',
    label: 'Shipped',
    status: 'active' as const,
    date: 'May 7',
    events: [{ type: 'In transit', date: 'May 7', severity: 'warning' as const, note: 'Weather delay in transit hub' }],
  },
  {
    id: 'delivered',
    label: 'Delivered',
    status: 'pending' as const,
    events: [],
  },
]

export function PanelTimelineDemo({ meta }: { meta: ComponentMeta }) {
  return (
    <ComponentPreview
      meta={meta}
      hideKnobs
      codeTemplate={() => `import { PanelTimeline } from '@admin-navanta/design-system'

const milestones = [
  { id: 'ordered', label: 'Ordered', status: 'completed', date: 'May 3', events: [{ type: 'PO issued', date: 'May 3', severity: 'info' }] },
  { id: 'processing', label: 'Processing', status: 'completed', date: 'May 5', events: [{ type: 'Picked & packed', date: 'May 5', severity: 'info' }] },
  { id: 'shipped', label: 'Shipped', status: 'active', date: 'May 7', events: [{ type: 'In transit', date: 'May 7', severity: 'warning', note: 'Weather delay in transit hub' }] },
  { id: 'delivered', label: 'Delivered', status: 'pending', events: [] },
]

export default function Example() {
  return <PanelTimeline title="Delivery progress" milestones={milestones} idPrefix="order-1847" />
}`}
      renderPreview={() => (
        <div className="w-full max-w-[400px]">
          <PanelTimeline title="Delivery progress" milestones={MILESTONES} idPrefix="demo" />
        </div>
      )}
    />
  )
}
