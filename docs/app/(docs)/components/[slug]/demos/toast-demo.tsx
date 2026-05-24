'use client'

import * as React from 'react'
import { Button, useToast, type ToastType } from '@admin-navanta/design-system'
import { ComponentPreview } from '@/app/components/component-preview'
import type { ComponentMeta } from '@/lib/component-registry'

export function ToastDemo({ meta }: { meta: ComponentMeta }) {
  const { addToast } = useToast()

  return (
    <ComponentPreview
      meta={meta}
      defaultChildren=""
      renderPreview={(props) => (
        <Button
          onClick={() => {
            const duration = parseInt((props.duration as string) || '5000', 10)
            addToast(
              (props.message as string) || 'This is a sample toast message.',
              {
                type: (props.type as ToastType) || 'info',
                title: (props.title as string) || undefined,
                duration: Number.isNaN(duration) ? 5000 : duration,
                position:
                  (props.position as
                    | 'top-right'
                    | 'top-left'
                    | 'bottom-right'
                    | 'bottom-left'
                    | 'top-center'
                    | 'bottom-center') || 'bottom-right',
              }
            )
          }}
        >
          Show Toast
        </Button>
      )}
      codeTemplate={(props) => `import { useToast, Button } from '@admin-navanta/design-system'

export function Example() {
  const { addToast } = useToast()

  return (
    <Button 
      onClick={() =>
        addToast('${props.message || 'Action successful'}', {
          type: '${props.type || 'info'}',
          title: '${props.title || 'Profile Updated'}',
          duration: ${props.duration || '5000'},
          position: '${props.position || 'bottom-right'}',
        })
      }
    >
      Show Toast
    </Button>
  )
}`}
    />
  )
}
