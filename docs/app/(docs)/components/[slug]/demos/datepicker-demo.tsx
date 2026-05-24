'use client'

import { DatePicker } from '@admin-navanta/design-system'
import { ComponentPreview } from '@/app/components/component-preview'
import type { ComponentMeta } from '@/lib/component-registry'
import { useState } from 'react'

export function DatePickerDemo({ meta }: { meta: ComponentMeta }) {
  const [date, setDate] = useState<Date | null>(null)

  return (
    <ComponentPreview
      meta={meta}
      renderPreview={(props) => (
        <div className="w-full max-w-sm mx-auto">
          <DatePicker 
            label="Booking Date"
            placeholder="Pick a date"
            value={date}
            onChange={setDate}
            disabled={props.disabled === true}
            error={props.error ? 'This date is unavailable.' : undefined}
            helperText={props.helperText ? 'Please select your preferred arrival date.' : undefined}
            size={props.size as 'sm' | 'md' | 'lg' | undefined}
          />
        </div>
      )}
    />
  )
}
