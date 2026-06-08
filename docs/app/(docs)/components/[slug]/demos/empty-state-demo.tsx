'use client'

import { EmptyState, Button } from '@admin-navanta/design-system'
import { Package, MagnifyingGlass, Star } from '@phosphor-icons/react'
import { ComponentPreview } from '@/app/components/component-preview'
import type { ComponentMeta } from '@/lib/component-registry'

export function EmptyStateDemo({ meta }: { meta: ComponentMeta }) {
  return (
    <ComponentPreview
      meta={meta}
      hideKnobs
      codeTemplate={() => `import { EmptyState, Button } from '@admin-navanta/design-system'
import { Package, Star } from '@phosphor-icons/react'

// First-time / empty — offer a primary action
<EmptyState
  icon={<Package weight="duotone" />}
  title="No orders yet"
  description="When orders come in, they'll appear here."
  action={<Button size="sm">New order</Button>}
/>

// No results — offer a way to clear
<EmptyState
  icon={<MagnifyingGlass weight="duotone" />}
  title="No matching results"
  description="Try adjusting your search or filters."
  action={<Button variant="outline" size="sm">Clear filters</Button>}
/>

// Inline link sits directly under the description (no Button)
<EmptyState
  icon={<Star weight="duotone" />}
  title="Your watchlist is empty"
  description="Star an order to track it here for quick access."
  link={{ label: 'search the order you want to track.', onClick: () => {} }}
/>`}
      renderPreview={() => (
        <div className="grid w-full max-w-[760px] gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border">
            <EmptyState
              icon={<Package weight="duotone" />}
              title="No orders yet"
              description="When orders come in, they'll appear here."
              action={<Button size="sm">New order</Button>}
            />
          </div>
          <div className="rounded-xl border border-border">
            <EmptyState
              icon={<MagnifyingGlass weight="duotone" />}
              title="No matching results"
              description="Try adjusting your search or filters."
              action={<Button variant="outline" size="sm">Clear filters</Button>}
            />
          </div>
          <div className="rounded-xl border border-border sm:col-span-2">
            <EmptyState
              icon={<Star weight="duotone" />}
              title="Your watchlist is empty"
              description="Star an order to track it here for quick access."
              link={{ label: 'search the order you want to track.', onClick: () => {} }}
            />
          </div>
        </div>
      )}
    />
  )
}
