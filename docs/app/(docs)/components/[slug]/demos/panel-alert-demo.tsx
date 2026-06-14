'use client'

import { PanelAlert } from '@navanta-ai/design-system'
import { ComponentPreview } from '@/app/components/component-preview'
import type { ComponentMeta } from '@/lib/component-registry'

type AlertType = 'danger' | 'warning' | 'info' | 'success' | 'cancelled'

const COPY: Record<AlertType, { title: string; description: string }> = {
  danger: {
    title: 'Payment failed',
    description: 'The card on file was declined during capture.',
  },
  warning: {
    title: 'Shipment delayed',
    description: 'Carrier reported a weather hold in transit.',
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
        const c = COPY[type]
        return `import { PanelAlert } from '@navanta-ai/design-system'

export default function Example() {
  return (
    <PanelAlert
      type="${type}"
      title="${c.title}"
      description="${c.description}"
    />
  )
}`
      }}
      renderPreview={(props) => {
        const type = (props.type as AlertType) || 'warning'
        const c = COPY[type]
        return (
          <div className="w-full max-w-[400px]">
            <PanelAlert
              type={type}
              title={c.title}
              description={c.description}
            />
          </div>
        )
      }}
    />
  )
}
