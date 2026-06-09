'use client'

import { Breadcrumbs } from '@navanta-ai/design-system'
import { ComponentPreview } from '@/app/components/component-preview'
import type { ComponentMeta } from '@/lib/component-registry'

export function BreadcrumbsDemo({ meta }: { meta: ComponentMeta }) {
  const items = [
    { label: 'Home', href: '#' },
    { label: 'Components', href: '#' },
    { label: 'Data Display', href: '#' },
    { label: 'Breadcrumbs', href: '#' },
  ]

  return (
    <ComponentPreview
      meta={meta}
      renderPreview={(props) => {
        const max = props.maxItems === '0' ? undefined : Number(props.maxItems)
        const displayItems = max === undefined ? items.slice(0, 3) : items

        return (
          <Breadcrumbs 
            items={displayItems} 
            maxItems={max} 
          />
        )
      }}
    />
  )
}
