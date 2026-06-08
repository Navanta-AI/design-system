'use client'

import * as React from 'react'
import {
  DetailPanelShell,
  PanelInfoGrid,
  PanelTimeline,
  PanelAlert,
  Button,
} from '@admin-navanta/design-system'
import { Package, Truck, MapPin, CurrencyDollar } from '@phosphor-icons/react'
import { ComponentPreview } from '@/app/components/component-preview'
import type { ComponentMeta } from '@/lib/component-registry'

const MILESTONES = [
  { id: 'ordered', label: 'Ordered', status: 'completed' as const, date: 'May 3', events: [{ type: 'PO issued', date: 'May 3', severity: 'info' as const }] },
  { id: 'shipped', label: 'Shipped', status: 'active' as const, date: 'May 7', events: [{ type: 'In transit', date: 'May 7', severity: 'warning' as const, note: 'Weather delay' }] },
  { id: 'delivered', label: 'Delivered', status: 'pending' as const, events: [] },
]

export function DetailPanelDemo({ meta }: { meta: ComponentMeta }) {
  const [open, setOpen] = React.useState(false)

  return (
    <ComponentPreview
      meta={meta}
      codeTemplate={(props) => {
        const width = ((props.width as string) || '400').trim() || '400'
        return `import { DetailPanelShell, PanelInfoGrid, PanelTimeline, Button } from '@admin-navanta/design-system'
import { Package, Truck } from '@phosphor-icons/react'
import * as React from 'react'

export default function Example() {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>View order</Button>
      <DetailPanelShell
        open={open}
        onClose={() => setOpen(false)}
        title="ORD-1847"
        subtitle="Delivery Tracking · $4,980.00"
        externalHref="#"
        width={${width}}
        footer={<Button fullWidth onClick={() => setOpen(false)}>Close panel</Button>}
      >
        <PanelInfoGrid
          title="Order details"
          rows={[
            { label: 'Order', value: 'ORD-1847', icon: Package },
            { label: 'Carrier', value: 'FedEx', icon: Truck },
          ]}
        />
        <PanelTimeline title="Delivery progress" milestones={milestones} idPrefix="ord-1847" />
      </DetailPanelShell>
    </>
  )
}`
      }}
      renderPreview={(props) => {
        const rawWidth = ((props.width as string) || '400').trim() || '400'
        const width = Math.min(560, Math.max(320, Number.parseInt(rawWidth, 10) || 400))
        return (
          <>
            <Button onClick={() => setOpen(true)}>View order</Button>
            <DetailPanelShell
              open={open}
              onClose={() => setOpen(false)}
              title="ORD-1847"
              subtitle="Delivery Tracking · $4,980.00"
              externalHref="#"
              width={width}
              actions={
                <div className="flex gap-2">
                  <Button size="sm">Expedite</Button>
                  <Button variant="secondary" size="sm">Contact carrier</Button>
                </div>
              }
              footer={
                <Button fullWidth onClick={() => setOpen(false)}>
                  Close panel
                </Button>
              }
            >
              <div className="flex flex-col gap-4">
                <PanelAlert
                  type="warning"
                  title="Shipment delayed"
                  badge="2 days"
                  description="Carrier reported a weather hold in transit."
                />
                <PanelInfoGrid
                  title="Order details"
                  rows={[
                    { label: 'Order', value: 'ORD-1847', icon: Package },
                    { label: 'Carrier', value: 'FedEx', icon: Truck },
                    { label: 'Destination', value: 'Austin, TX', icon: MapPin },
                    { label: 'Total', value: '$4,980.00', icon: CurrencyDollar },
                  ]}
                />
                <PanelTimeline title="Delivery progress" milestones={MILESTONES} idPrefix="ord-1847" />
              </div>
            </DetailPanelShell>
          </>
        )
      }}
    />
  )
}
