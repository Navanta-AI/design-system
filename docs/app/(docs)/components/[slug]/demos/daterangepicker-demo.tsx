'use client'

import { DateRangePicker } from '@navanta-ai/design-system'
import { ComponentPreview } from '@/app/components/component-preview'
import type { ComponentMeta } from '@/lib/component-registry'
import { useState } from 'react'

export function DateRangePickerDemo({ meta }: { meta: ComponentMeta }) {
  const [range, setRange] = useState({ start: '', end: '' })

  // A fixed floor rather than `new Date()` so the demo renders the same on the
  // server and the client.
  const floor = new Date(2026, 0, 1)

  return (
    <ComponentPreview
      meta={meta}
      renderPreview={(props) => (
        <div className="w-full max-w-sm mx-auto">
          <DateRangePicker
            startDate={range.start}
            endDate={range.end}
            onChange={(start, end) => setRange({ start, end })}
            startLocked={props.startLocked === true && range.start !== ''}
            minDate={props.minDate === true ? floor : undefined}
            disabled={props.disabled === true}
          />
        </div>
      )}
    />
  )
}
