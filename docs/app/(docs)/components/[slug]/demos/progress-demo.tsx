'use client'

import { Progress, CircularProgress } from '@navanta-ai/design-system'
import { ComponentPreview } from '@/app/components/component-preview'
import type { ComponentMeta } from '@/lib/component-registry'
import { useState, useEffect } from 'react'

export function ProgressDemo({ meta }: { meta: ComponentMeta }) {
  const [value, setValue] = useState(13)

  useEffect(() => {
    const interval = setInterval(() => {
      setValue((v) => (v >= 100 ? 0 : v + 10))
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  return (
    <ComponentPreview
      meta={meta}
      renderPreview={(props) => (
        <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-12">
          <Progress 
            value={value} 
            variant={props.variant as any}
            size={props.size as any}
            striped={props.striped as any}
            indeterminate={props.indeterminate as any}
            showLabel={props.showLabel !== false}
          />
          <CircularProgress 
            value={value} 
            variant={props.variant as any}
            indeterminate={props.indeterminate as any}
            showLabel={props.showLabel !== false}
            size={props.circularSize ? Number(props.circularSize) : 48}
          />
        </div>
      )}
    />
  )
}
