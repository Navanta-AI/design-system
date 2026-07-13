'use client'

import { Input } from '@navanta-ai/design-system'
import { MagnifyingGlass, Envelope } from '@phosphor-icons/react'
import { ComponentPreview } from '@/app/components/component-preview'
import type { ComponentMeta } from '@/lib/component-registry'

interface InputDemoProps {
  meta: ComponentMeta
}

export function InputDemo({ meta }: InputDemoProps) {
  return (
    <div className="space-y-12">
      <div>
        <p className="text-sm text-muted-foreground mb-4">Interactive Playground</p>
        <ComponentPreview
          meta={meta}
          defaultChildren=""
          renderPreview={(props) => (
            <div className="w-full max-w-sm">
              <Input
                label={(props.label as string) || undefined}
                placeholder={(props.placeholder as string) || undefined}
                size={(props.size as 'sm' | 'md' | 'lg') || 'md'}
                error={(props.error as string) || undefined}
                disabled={props.disabled as boolean | undefined}
              />
            </div>
          )}
        />
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-lg border-b border-border pb-2">With Error</h3>
        <ComponentPreview
          meta={meta}
          hideKnobs={true}
          defaultChildren=""
          renderPreview={() => (
            <div className="w-full max-w-sm">
              <Input
                label="Email address"
                placeholder="hello@example.com"
                error="Invalid email format"
              />
            </div>
          )}
          codeTemplate={() => `import { Input } from '@navanta-ai/design-system'\n\nexport default function Example() {\n  return (\n    <Input\n      label="Email address"\n      placeholder="hello@example.com"\n      error="Invalid email format"\n    />\n  )\n}`}
        />
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-lg border-b border-border pb-2">With icons (start / end)</h3>
        <ComponentPreview
          meta={meta}
          hideKnobs={true}
          defaultChildren=""
          renderPreview={() => (
            <div className="flex w-full max-w-sm flex-col gap-4">
              <Input
                label="Search"
                placeholder="Search orders"
                iconLeft={<MagnifyingGlass weight="regular" />}
              />
              <Input
                label="Email"
                placeholder="you@example.com"
                iconRight={<Envelope weight="regular" />}
              />
            </div>
          )}
          codeTemplate={() => `import { Input } from '@navanta-ai/design-system'
import { MagnifyingGlass, Envelope } from '@phosphor-icons/react'

export default function Example() {
  return (
    <>
      {/* Icon at the START */}
      <Input
        label="Search"
        placeholder="Search orders"
        iconLeft={<MagnifyingGlass weight="regular" />}
      />

      {/* Icon at the END */}
      <Input
        label="Email"
        placeholder="you@example.com"
        iconRight={<Envelope weight="regular" />}
      />
    </>
  )
}`}
        />
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-lg border-b border-border pb-2">Disabled</h3>
        <ComponentPreview
          meta={meta}
          hideKnobs={true}
          defaultChildren=""
          renderPreview={() => (
            <div className="w-full max-w-sm">
              <Input
                label="Email address"
                placeholder="hello@example.com"
                disabled
              />
            </div>
          )}
          codeTemplate={() => `import { Input } from '@navanta-ai/design-system'\n\nexport default function Example() {\n  return (\n    <Input\n      label="Email address"\n      placeholder="hello@example.com"\n      disabled\n    />\n  )\n}`}
        />
      </div>
    </div>
  )
}
