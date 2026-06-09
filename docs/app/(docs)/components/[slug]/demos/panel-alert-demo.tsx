'use client'

import { PanelAlert } from '@navanta-ai/design-system'
import { ComponentPreview } from '@/app/components/component-preview'
import type { ComponentMeta } from '@/lib/component-registry'

type AlertType = 'danger' | 'warning' | 'info' | 'success' | 'cancelled'

const COPY: Record<AlertType, { title: string; description: string; details?: string[] }> = {
  danger: {
    title: 'Payment failed',
    description: 'The card on file was declined during capture.',
    details: ['Retry with a different method', 'Contact billing if this persists'],
  },
  warning: {
    title: 'Shipment delayed',
    description: 'Carrier reported a weather hold in transit.',
    details: ['Re-route available', 'ETA updated to May 12'],
  },
  info: {
    title: 'Tracking enabled',
    description: 'Live tracking updates will appear here as they arrive.',
  },
  success: {
    title: 'Delivered on time',
    description: 'The order arrived within the promised window.',
  },
  cancelled: {
    title: 'Order cancelled',
    description: 'This order was cancelled before fulfilment.',
  },
}

export function PanelAlertDemo({ meta }: { meta: ComponentMeta }) {
  return (
    <ComponentPreview
      meta={meta}
      codeTemplate={(props) => {
        const type = (props.type as AlertType) || 'warning'
        const showBadge = props.badge as boolean
        const c = COPY[type]
        const badgeAttr = showBadge ? '\n      badge="2 days"' : ''
        const detailsAttr = c.details
          ? `\n      details={${JSON.stringify(c.details)}}`
          : ''
        return `import { PanelAlert } from '@navanta-ai/design-system'

export default function Example() {
  return (
    <PanelAlert
      type="${type}"
      title="${c.title}"${badgeAttr}
      description="${c.description}"${detailsAttr}
    />
  )
}`
      }}
      renderPreview={(props) => {
        const type = (props.type as AlertType) || 'warning'
        const showBadge = props.badge as boolean
        const c = COPY[type]
        return (
          <div className="w-full max-w-[400px]">
            <PanelAlert
              type={type}
              title={c.title}
              badge={showBadge ? '2 days' : undefined}
              description={c.description}
              details={c.details}
            />
          </div>
        )
      }}
    />
  )
}
