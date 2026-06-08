'use client'

import { PanelInfoGrid } from '@admin-navanta/design-system'
import { Package, Truck, MapPin, CurrencyDollar } from '@phosphor-icons/react'
import { ComponentPreview } from '@/app/components/component-preview'
import type { ComponentMeta } from '@/lib/component-registry'

export function PanelInfoGridDemo({ meta }: { meta: ComponentMeta }) {
  return (
    <ComponentPreview
      meta={meta}
      hideKnobs
      codeTemplate={() => `import { PanelInfoGrid } from '@admin-navanta/design-system'
import { Package, Truck, MapPin, CurrencyDollar } from '@phosphor-icons/react'

export default function Example() {
  return (
    <PanelInfoGrid
      title="Order details"
      rows={[
        { label: 'Order', value: 'ORD-1847', icon: Package },
        { label: 'Carrier', value: 'FedEx', icon: Truck },
        { label: 'Destination', value: 'Austin, TX', icon: MapPin },
        { label: 'Total', value: '$4,980.00', icon: CurrencyDollar },
        { label: 'Tracking', value: 'Open tracking', icon: Truck, link: true, href: '#' },
      ]}
    />
  )
}`}
      renderPreview={() => (
        <div className="w-full max-w-[400px]">
          <PanelInfoGrid
            title="Order details"
            rows={[
              { label: 'Order', value: 'ORD-1847', icon: Package },
              { label: 'Carrier', value: 'FedEx', icon: Truck },
              { label: 'Destination', value: 'Austin, TX', icon: MapPin },
              { label: 'Total', value: '$4,980.00', icon: CurrencyDollar },
              { label: 'Tracking', value: 'Open tracking', icon: Truck, link: true, href: '#' },
            ]}
          />
        </div>
      )}
    />
  )
}
