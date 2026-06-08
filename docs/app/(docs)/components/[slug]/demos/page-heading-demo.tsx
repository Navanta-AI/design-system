'use client'

import { PageHeading } from '@admin-navanta/design-system'
import { ComponentPreview } from '@/app/components/component-preview'
import type { ComponentMeta } from '@/lib/component-registry'

export function PageHeadingDemo({ meta }: { meta: ComponentMeta }) {
  return (
    <ComponentPreview
      meta={meta}
      codeTemplate={(props) => {
        const title = ((props.title as string) || 'Order Dashboard').trim() || 'Order Dashboard'
        const subtitle =
          ((props.subtitle as string) || 'Track shipments and resolve claims in one place').trim() ||
          'Track shipments and resolve claims in one place'
        return `import { PageHeading } from '@admin-navanta/design-system'

export default function Example() {
  return <PageHeading title="${title}" subtitle="${subtitle}" />
}`
      }}
      renderPreview={(props) => {
        const title = ((props.title as string) || 'Order Dashboard').trim() || 'Order Dashboard'
        const subtitle =
          ((props.subtitle as string) || 'Track shipments and resolve claims in one place').trim() ||
          'Track shipments and resolve claims in one place'
        return (
          <div className="w-full max-w-[560px]">
            <PageHeading title={title} subtitle={subtitle} />
          </div>
        )
      }}
    />
  )
}
