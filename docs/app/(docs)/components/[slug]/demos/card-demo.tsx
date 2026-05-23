'use client'

import { Button, Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Input } from '@navanta/design-system'
import { ComponentPreview } from '@/app/components/component-preview'
import type { ComponentMeta } from '@/lib/component-registry'

interface CardDemoProps {
  meta: ComponentMeta
}

export function CardDemo({ meta }: CardDemoProps) {
  return (
    <ComponentPreview
      meta={meta}
      defaultChildren=""
      renderPreview={(props) => {
        const view = (props.view as string) ?? 'form'
        const hoverable = props.hoverable as boolean | undefined

        if (view === 'media') {
          return (
            <Card hoverable={hoverable} className="w-full max-w-[340px] gap-0 overflow-hidden py-0">
              <CardContent className="space-y-4 px-0 pt-0 pb-6">
                <div className="h-[160px] w-full border-b border-border bg-gradient-to-br from-muted/60 via-muted/20 to-background" />
                <div className="space-y-3 px-6">
                  <CardTitle className="text-[16px]">Project Snapshot</CardTitle>
                  <CardDescription>
                    Share a concise update with a supporting visual for quick status review.
                  </CardDescription>
                  <p className="text-[13px] leading-relaxed text-muted-foreground">
                    Use this layout when you need media + description in a compact dashboard card.
                  </p>
                  <Button variant="primary" size="md" fullWidth>Open</Button>
                </div>
              </CardContent>
            </Card>
          )
        }

        return (
          <Card hoverable={hoverable} className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Login to your account</CardTitle>
              <CardDescription>Enter your email below to login to your account</CardDescription>
              <CardAction>
                <Button variant="link" size="md">Sign up</Button>
              </CardAction>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input label="Email" type="email" placeholder="m@example.com" />
              <Input label="Password" type="password" />
            </CardContent>
            <CardFooter className="flex-col gap-2 border-t">
              <Button variant="primary" size="md" fullWidth>
                Login
              </Button>
              <Button variant="outline" size="md" fullWidth>
                Login with Google
              </Button>
            </CardFooter>
          </Card>
        )
      }}
      codeTemplate={(props) => {
        const view = (props.view as string) ?? 'form'
        const hoverableAttr = props.hoverable ? ' hoverable' : ''

        if (view === 'media') {
          return `import { Button, Card, CardContent, CardDescription, CardTitle } from '@navanta/design-system'

<Card${hoverableAttr} className="max-w-[340px] gap-0 overflow-hidden py-0">
  <CardContent className="space-y-4 px-0 pt-0 pb-6">
    <div className="h-[160px] w-full border-b border-border bg-gradient-to-br from-muted/60 via-muted/20 to-background" />
    <div className="space-y-3 px-6">
      <CardTitle className="text-[16px]">Project Snapshot</CardTitle>
      <CardDescription>Share a concise update with a supporting visual for quick status review.</CardDescription>
      <Button fullWidth>Open</Button>
    </div>
  </CardContent>
</Card>`
        }

        return `import { Button, Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Input } from '@navanta/design-system'

<Card${hoverableAttr}>
  <CardHeader>
    <CardTitle>Login to your account</CardTitle>
    <CardDescription>Enter your email below to login to your account</CardDescription>
    <CardAction>
      <Button variant="link">Sign up</Button>
    </CardAction>
  </CardHeader>
  <CardContent className="space-y-3">
    <Input label="Email" type="email" placeholder="m@example.com" />
    <Input label="Password" type="password" />
  </CardContent>
  <CardFooter className="flex-col gap-2 border-t">
    <Button fullWidth>Login</Button>
    <Button variant="outline" fullWidth>Login with Google</Button>
  </CardFooter>
</Card>`
      }}
    />
  )
}
