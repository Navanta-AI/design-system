'use client'

import { Slider } from '@admin-navanta/design-system'
import { ComponentPreview } from '@/app/components/component-preview'
import type { ComponentMeta } from '@/lib/component-registry'
import { useState } from 'react'

export function SliderDemo({ meta }: { meta: ComponentMeta }) {
  const [singleValue, setSingleValue] = useState([50])
  const [rangeValue, setRangeValue] = useState([20, 80])

  return (
    <ComponentPreview
      meta={meta}
      codeTemplate={(props) => {
        const circleMode = (props.circle as string) || 'single'
        const isRange = circleMode === 'range'
        const step = props.step ? Number(props.step) : 1
        const showValue = props.showValue !== false
        const disabled = props.disabled === true

        const lines: string[] = [
          `import { Slider } from '@admin-navanta/design-system'`,
          '',
          'export default function Example() {',
          '  return (',
          '    <Slider',
          `      label="${isRange ? 'Price Range' : 'Volume Control'}"`,
          `      defaultValue={${isRange ? '[20, 80]' : '[50]'}}`,
        ]

        if (step !== 1) lines.push(`      step={${step}}`)
        if (!showValue) lines.push('      showValue={false}')
        if (disabled) lines.push('      disabled')

        lines.push('    />', '  )', '}')
        return lines.join('\n')
      }}
      renderPreview={(props) => (
        <div className="w-full max-w-sm mx-auto">
          {(props.circle as string) === 'range' ? (
            <Slider
              label="Price Range"
              value={rangeValue}
              onChange={setRangeValue}
              showValue={props.showValue !== false}
              disabled={props.disabled === true}
              step={props.step ? Number(props.step) : 1}
            />
          ) : (
            <Slider
              label="Volume Control"
              value={singleValue}
              onChange={setSingleValue}
              showValue={props.showValue !== false}
              disabled={props.disabled === true}
              step={props.step ? Number(props.step) : 1}
            />
          )}
        </div>
      )}
    />
  )
}
