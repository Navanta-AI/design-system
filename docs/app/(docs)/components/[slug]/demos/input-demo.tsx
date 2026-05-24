'use client'

import { Input } from '@admin-navanta/design-system'
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
          codeTemplate={() => `import { Input } from '@admin-navanta/design-system'\n\nexport default function Example() {\n  return (\n    <Input\n      label="Email address"\n      placeholder="hello@example.com"\n      error="Invalid email format"\n    />\n  )\n}`}
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
          codeTemplate={() => `import { Input } from '@admin-navanta/design-system'\n\nexport default function Example() {\n  return (\n    <Input\n      label="Email address"\n      placeholder="hello@example.com"\n      disabled\n    />\n  )\n}`}
        />
      </div>
    </div>
  )
}
