'use client'

import { Skeleton } from '@admin-navanta/design-system'
import { ComponentPreview } from '@/app/components/component-preview'
import type { ComponentMeta } from '@/lib/component-registry'

export function SkeletonDemo({ meta }: { meta: ComponentMeta }) {
  return (
    <ComponentPreview
      meta={meta}
      defaultChildren=""
      renderPreview={(props) => (
        <div className="w-full max-w-sm mx-auto">
          <Skeleton
            variant={(props.variant as 'text' | 'circular' | 'rectangular' | 'rounded') || 'text'}
            animate={props.animate as boolean | undefined}
            count={props.variant === 'text' ? 3 : 1}
            width={props.variant === 'circular' ? 56 : '100%'}
            height={
              props.variant === 'circular'
                ? 56
                : props.variant === 'rectangular' || props.variant === 'rounded'
                  ? 160
                  : undefined
            }
          />
        </div>
      )}
    />
  )
}
