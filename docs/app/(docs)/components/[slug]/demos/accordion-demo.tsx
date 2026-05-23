'use client'

import { Accordion } from '@navanta/design-system'
import { ComponentPreview } from '@/app/components/component-preview'
import type { ComponentMeta } from '@/lib/component-registry'

interface AccordionDemoProps {
  meta: ComponentMeta
}

export function AccordionDemo({ meta }: AccordionDemoProps) {
  return (
    <ComponentPreview
      meta={meta}
      renderPreview={(props) => {
        const items = [
          { 
            title: "Is the Navanta Design System fully typed?",
            content: "Yes! Every component is written in strict TypeScript and exports precise interfaces for your application." 
          },
          { 
            title: "Is it accessible?", 
            content: "Yes. Keyboard navigation, ARIA attributes, and screen reader announcements are handled natively." 
          },
          { 
            title: "Can I use it out of the box?", 
            content: "Absolutely. Drop it directly into your App Router RSC or Client boundary architectures.",
            disabled: props.disabled as boolean | undefined
          }
        ]

        return (
          <div className="w-full max-w-lg">
            <Accordion 
              items={items} 
              variant={props.variant as 'default' | 'bordered' | 'separated' | undefined} 
              multiple={props.multiple as boolean | undefined} 
            />
          </div>
        )
      }}
    />
  )
}
