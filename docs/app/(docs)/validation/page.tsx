import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { Checkbox, Input, Textarea } from '@navanta-ai/design-system'
import { DocsWithToc } from '@/app/components/docs-with-toc'

export const metadata: Metadata = {
  title: 'Validation - Navanta Design System',
  description: 'Validation rules, messaging hierarchy, and accessibility guidance for forms.',
}

const messageLevels = [
  {
    label: 'Helper',
    token: 'text-muted-foreground',
    guidance: 'Use before interaction to clarify what users should enter.',
  },
  {
    label: 'Success',
    token: 'text-success',
    guidance: 'Use after criteria are met and confirmation improves confidence.',
  },
  {
    label: 'Warning',
    token: 'text-warning',
    guidance: 'Use for non-blocking risk where users can still continue.',
  },
  {
    label: 'Error',
    token: 'text-destructive',
    guidance: 'Use for blocking issues and include the exact next action.',
  },
]

const timingRules = [
  {
    title: 'On blur',
    detail: 'Default for most fields. Validate after users leave a field.',
  },
  {
    title: 'On submit',
    detail: 'Show form-level summary and focus the first invalid field.',
  },
  {
    title: 'Live validation',
    detail: 'Use only for high-risk or format-critical inputs.',
  },
]

const relatedComponents = [
  { name: 'Input', href: '/components/input' },
  { name: 'Textarea', href: '/components/textarea' },
  { name: 'Select', href: '/components/select' },
  { name: 'Checkbox', href: '/components/checkbox' },
  { name: 'Radio', href: '/components/radio' },
]

const sectionLinks = [
  { id: 'overview', label: 'Overview' },
  { id: 'core-principles', label: 'Core Principles' },
  { id: 'recommended-pattern', label: 'Recommended Pattern' },
  { id: 'state-matrix', label: 'Field State Matrix' },
  { id: 'message-hierarchy', label: 'Message Hierarchy' },
  { id: 'content-quality', label: 'Content Quality' },
  { id: 'when-to-validate', label: 'When to Validate' },
  { id: 'accessibility-checklist', label: 'Accessibility Checklist' },
  { id: 'related-components', label: 'Related Components' },
]

function MatrixHeader({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[8px] border border-border bg-muted/30 px-3 py-2 text-[12px] font-medium text-foreground">
      {children}
    </div>
  )
}

function MatrixCell({ children }: { children: ReactNode }) {
  return <div className="rounded-[8px] border border-border bg-background p-3">{children}</div>
}

export default function ValidationPage() {
  return (
    <DocsWithToc links={sectionLinks}>
      <section id="overview" className="scroll-mt-24">
        <h1 className="text-[20px] font-semibold text-[#161616] dark:text-foreground">Validation</h1>
        <p className="mt-2 text-[14px] text-[#535353] dark:text-muted-foreground">
          Build clear, consistent form feedback that helps users recover quickly and complete tasks.
        </p>
      </section>

      <section id="core-principles" className="scroll-mt-24 space-y-3 border-t border-border pt-6">
        <h2 className="text-[16px] font-semibold text-[#161616] dark:text-foreground">Core Principles</h2>
        <ul className="list-disc space-y-1 pl-4 text-[13px] leading-relaxed text-muted-foreground">
          <li>Always pair inline field errors with a form-level error summary on submit.</li>
          <li>Show errors after interaction, not on first render.</li>
          <li>Use specific error text that tells users what to change.</li>
          <li>Do not clear entered values when validation fails.</li>
        </ul>
      </section>

      <section id="recommended-pattern" className="scroll-mt-24 space-y-3 border-t border-border pt-6">
        <h2 className="text-[16px] font-semibold text-[#161616] dark:text-foreground">Recommended Pattern</h2>
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          Combine form-level summary with inline field messages to improve scanability and recovery.
        </p>

        <div className="space-y-3 rounded-[10px] border border-border bg-background p-4">
          <div role="alert" aria-live="polite" className="rounded-[8px] border border-destructive/40 bg-destructive/5 p-3">
            <p className="text-[13px] font-semibold text-destructive">There is a problem</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-[12px] text-destructive">
              <li><a href="#validation-email" className="underline">Enter an email address in the correct format</a></li>
              <li><a href="#validation-terms" className="underline">Accept the terms to continue</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <Input
              id="validation-email"
              label="Email"
              defaultValue="hello@"
              error="Enter an email address in the correct format"
            />
            <Input
              id="validation-name"
              label="Full name"
              helperText="Use your legal name as on ID."
              defaultValue="John Carter"
            />
            <Textarea
              id="validation-notes"
              label="Issue details"
              helperText="Include when this started and how often it happens."
              defaultValue=""
              placeholder="Describe the issue"
            />
            <Checkbox
              id="validation-terms"
              label="I accept terms and conditions"
              error="Accept the terms to continue"
            />
          </div>
        </div>
      </section>

      <section id="state-matrix" className="scroll-mt-24 space-y-3 border-t border-border pt-6">
        <h2 className="text-[16px] font-semibold text-[#161616] dark:text-foreground">Field State Matrix</h2>
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          All fields should explicitly define these states: <code>Default</code>, <code>Error Found</code>, and{' '}
          <code>Disabled</code>.
        </p>

        <div className="overflow-x-auto">
          <div className="min-w-[980px] space-y-2">
            <div className="grid grid-cols-[120px_repeat(3,minmax(0,1fr))] gap-2">
              <div />
              <MatrixHeader>Default</MatrixHeader>
              <MatrixHeader>Error Found</MatrixHeader>
              <MatrixHeader>Disabled</MatrixHeader>
            </div>

            <div className="grid grid-cols-[120px_repeat(3,minmax(0,1fr))] gap-2 items-start">
              <p className="px-2 pt-2 text-[12px] font-medium text-muted-foreground">Input</p>
              <MatrixCell>
                <Input label="Full name" helperText="As shown on ID." defaultValue="" placeholder="John Carter" />
              </MatrixCell>
              <MatrixCell>
                <Input label="Email" defaultValue="invalid-email" error="Enter an email address in the correct format" />
              </MatrixCell>
              <MatrixCell>
                <Input label="Company" defaultValue="Navanta Labs" helperText="Optional" disabled />
              </MatrixCell>
            </div>

            <div className="grid grid-cols-[120px_repeat(3,minmax(0,1fr))] gap-2 items-start">
              <p className="px-2 pt-2 text-[12px] font-medium text-muted-foreground">Textarea</p>
              <MatrixCell>
                <Textarea label="Issue summary" helperText="Keep this concise." placeholder="Describe the issue" />
              </MatrixCell>
              <MatrixCell>
                <Textarea label="Reproduction steps" defaultValue="1." error="Add at least 2 clear steps" />
              </MatrixCell>
              <MatrixCell>
                <Textarea label="Internal notes" defaultValue="Locked after submit." helperText="Read only in this step." disabled />
              </MatrixCell>
            </div>

            <div className="grid grid-cols-[120px_repeat(3,minmax(0,1fr))] gap-2 items-start">
              <p className="px-2 pt-2 text-[12px] font-medium text-muted-foreground">Checkbox</p>
              <MatrixCell>
                <Checkbox label="I confirm this information is accurate" helperText="Required before submission." />
              </MatrixCell>
              <MatrixCell>
                <Checkbox label="I agree to data processing terms" error="You must accept the terms to continue." />
              </MatrixCell>
              <MatrixCell>
                <Checkbox label="Compliance verified" helperText="Managed automatically by the system." defaultChecked disabled />
              </MatrixCell>
            </div>
          </div>
        </div>
      </section>

      <section id="message-hierarchy" className="scroll-mt-24 space-y-3 border-t border-border pt-6">
        <h2 className="text-[16px] font-semibold text-[#161616] dark:text-foreground">Message Hierarchy</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {messageLevels.map((item) => (
            <div key={item.label} className="rounded-[8px] border border-border bg-background px-3 py-2.5">
              <p className="text-[13px] font-medium text-foreground">{item.label}</p>
              <p className="mt-1 text-[12px] text-muted-foreground">
                Token: <code>{item.token}</code>
              </p>
              <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{item.guidance}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="content-quality" className="scroll-mt-24 space-y-3 border-t border-border pt-6">
        <h2 className="text-[16px] font-semibold text-[#161616] dark:text-foreground">Content Quality</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[10px] border border-border bg-background p-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.2px] text-green-600">Do</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-[13px] text-muted-foreground">
              <li>Start with an action: “Enter your email address”.</li>
              <li>Match wording to the field label.</li>
              <li>Use specific errors (format, length, missing value).</li>
            </ul>
          </div>
          <div className="rounded-[10px] border border-border bg-background p-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.2px] text-red-600">Avoid</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-[13px] text-muted-foreground">
              <li>Generic text like “An error occurred”.</li>
              <li>Blameful language (“you forgot”, “invalid user”).</li>
              <li>Reliance on color alone without text cues.</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="when-to-validate" className="scroll-mt-24 space-y-3 border-t border-border pt-6">
        <h2 className="text-[16px] font-semibold text-[#161616] dark:text-foreground">When to Validate</h2>
        <div className="grid gap-2 sm:grid-cols-3">
          {timingRules.map((rule) => (
            <div key={rule.title} className="rounded-[8px] border border-border bg-background px-3 py-2.5">
              <p className="text-[13px] font-medium text-foreground">{rule.title}</p>
              <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{rule.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="accessibility-checklist" className="scroll-mt-24 space-y-3 border-t border-border pt-6">
        <h2 className="text-[16px] font-semibold text-[#161616] dark:text-foreground">Accessibility Checklist</h2>
        <ul className="list-disc space-y-1 pl-4 text-[13px] leading-relaxed text-muted-foreground">
          <li>Link helper/error text to fields using <code>aria-describedby</code>.</li>
          <li>Set <code>aria-invalid=&quot;true&quot;</code> when a field fails validation.</li>
          <li>Add a visible and programmatic error indicator (for example, “Error:” prefix).</li>
          <li>Use a form-level alert region for submit-time summaries.</li>
        </ul>
      </section>

      <section id="related-components" className="scroll-mt-24 space-y-3 border-t border-border pt-6">
        <h2 className="text-[16px] font-semibold text-[#161616] dark:text-foreground">Related Components</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {relatedComponents.map((component) => (
            <Link
              key={component.href}
              href={component.href}
              className="rounded-[8px] border border-border bg-background px-3 py-2 text-[13px] text-foreground hover:bg-muted/30 transition-colors"
            >
              {component.name}
            </Link>
          ))}
        </div>
      </section>
    </DocsWithToc>
  )
}
