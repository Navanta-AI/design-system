import type { Metadata } from 'next'
import Link from 'next/link'
import { Button, Checkbox, Input, Textarea } from '@navanta-ai/design-system'
import { DocsWithToc } from '@/app/components/docs-with-toc'

export const metadata: Metadata = {
  title: 'Accessibility - Navanta Design System',
  description: 'Accessibility standards, interaction contracts, and testing guidance for Navanta.',
}

const wcagChecks = [
  {
    pillar: 'Perceivable',
    guidance: 'Text contrast, non-color indicators, and readable content hierarchy.',
    checks: ['Contrast ratio meets WCAG AA', 'State is not conveyed by color only'],
  },
  {
    pillar: 'Operable',
    guidance: 'Full keyboard support and visible focus across all controls.',
    checks: ['Tab order is logical', 'Focus ring is always visible'],
  },
  {
    pillar: 'Understandable',
    guidance: 'Clear labels, instructions, and error recovery messages.',
    checks: ['Fields have labels', 'Errors are specific and actionable'],
  },
  {
    pillar: 'Robust',
    guidance: 'Semantic HTML and ARIA patterns compatible with assistive tech.',
    checks: ['Proper input semantics', 'ARIA attributes wired correctly'],
  },
]

const keyboardRows = [
  {
    element: 'Text input / textarea',
    key: 'Tab / Shift+Tab',
    expected: 'Moves focus in and out in logical order.',
  },
  {
    element: 'Checkbox / radio',
    key: 'Space',
    expected: 'Toggles selected state while focus remains visible.',
  },
  {
    element: 'Select / menu trigger',
    key: 'Enter / Space',
    expected: 'Opens list; arrow keys navigate options.',
  },
  {
    element: 'Dialog',
    key: 'Esc',
    expected: 'Closes dialog and returns focus to trigger.',
  },
  {
    element: 'Form submit with errors',
    key: 'Enter',
    expected: 'Shows summary + inline errors and focuses first invalid field.',
  },
]

const srContract = [
  {
    label: 'Field labels',
    detail: 'Every form control has a visible label linked via `htmlFor`/`id`.',
  },
  {
    label: 'Described by',
    detail: 'Helper and error text are connected with `aria-describedby`.',
  },
  {
    label: 'Invalid state',
    detail: 'Invalid controls set `aria-invalid="true"` when validation fails.',
  },
  {
    label: 'Error summary region',
    detail: 'Form-level error summary uses alert semantics for announcement.',
  },
]

const workflow = [
  {
    title: '1. Keyboard pass',
    detail: 'Navigate every control with Tab, Shift+Tab, Enter, Space, and Esc.',
  },
  {
    title: '2. Screen reader spot-check',
    detail: 'Verify labels, helper text, and error announcements are spoken correctly.',
  },
  {
    title: '3. Contrast checks',
    detail: 'Validate text and state pair contrast in both light and dark themes.',
  },
  {
    title: '4. Regression coverage',
    detail: 'Keep automated checks and visual snapshots for core flows.',
  },
]

const wcagExampleRows = [
  {
    criterion: '1.4.3 Contrast (Minimum)',
    scenario: 'Body text on card surface',
    howToTest: 'Check contrast ratio for text vs background in light and dark.',
    passExample: 'Ratio is >= 4.5:1 for normal text.',
    failExample: 'Muted text drops below 4.5:1.',
  },
  {
    criterion: '2.4.7 Focus Visible',
    scenario: 'Tab through input and checkbox fields',
    howToTest: 'Use keyboard only and verify a visible focus indicator always appears.',
    passExample: 'Ring/border clearly visible on every focusable element.',
    failExample: 'Focus style removed or too subtle to detect.',
  },
  {
    criterion: '3.3.1 Error Identification',
    scenario: 'Submit form with invalid email and unchecked terms',
    howToTest: 'Trigger validation and inspect inline + summary feedback.',
    passExample: 'Summary + inline text errors appear with `aria-invalid`.',
    failExample: 'Only red border shown, no message.',
  },
  {
    criterion: '3.3.2 Labels or Instructions',
    scenario: 'Review all form controls',
    howToTest: 'Ensure each field has a visible label and clear instruction when needed.',
    passExample: 'Label and helper text are programmatically associated.',
    failExample: 'Placeholder-only field without label.',
  },
]

const manualChecklist = [
  'Tab through the entire page and confirm visible focus on every interactive element.',
  'Verify labels and helper/error text are announced by a screen reader.',
  'Submit with invalid form values and verify summary + inline errors both appear.',
  'Check contrast in light and dark mode for text, borders, and focus rings.',
  'Zoom to 200% and verify layout remains usable without hidden critical content.',
  'Disable pointer input and confirm keyboard-only completion of critical flows.',
]

const sectionLinks = [
  { id: 'how-to-use', label: 'How To Use This Page' },
  { id: 'wcag-target', label: 'WCAG AA Target' },
  { id: 'keyboard-contract', label: 'Keyboard Contract' },
  { id: 'form-pattern', label: 'Accessible Form Pattern' },
  { id: 'screen-reader-contract', label: 'Screen Reader Contract' },
  { id: 'manual-checklist', label: 'Manual Test Checklist' },
  { id: 'wcag-example', label: 'WCAG Testing Example' },
  { id: 'testing-workflow', label: 'Testing Workflow' },
  { id: 'common-failures', label: 'Common Failures' },
  { id: 'related-guides', label: 'Related Guides' },
]

export default function AccessibilityPage() {
  return (
    <DocsWithToc links={sectionLinks}>
      <div className="space-y-8">
        <h1 className="text-[20px] font-semibold text-[#161616] dark:text-foreground">Accessibility</h1>
        <p className="mt-2 text-[14px] text-[#535353] dark:text-muted-foreground">
          Build inclusive interfaces by default with semantic markup, keyboard support, and clear validation behavior.
        </p>

        <section id="how-to-use" className="scroll-mt-24 space-y-3 border-t border-border pt-6">
          <h2 className="text-[16px] font-semibold text-[#161616] dark:text-foreground">How To Use This Page</h2>
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            Follow this three-step flow when reviewing accessibility for a new screen or release candidate.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { step: '1', title: 'Foundations', desc: 'Confirm WCAG AA targets and interaction contracts.' },
              { step: '2', title: 'Patterns', desc: 'Review interaction and screen reader contracts before implementation.' },
              { step: '3', title: 'Test Checklist', desc: 'Run manual checks before release and attach results to QA.' },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-[12px] border border-border bg-gradient-to-b from-background to-muted/20 p-4"
              >
                <div className="mb-3 flex items-center gap-2">
                  <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full border border-border bg-background px-2 text-[11px] font-semibold text-foreground">
                    {item.step}
                  </span>
                  <span className="h-px flex-1 bg-border" />
                </div>
                <p className="text-[13px] font-semibold text-foreground">{item.title}</p>
                <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="wcag-target" className="scroll-mt-24 space-y-3 border-t border-border pt-6">
          <h2 className="text-[16px] font-semibold text-[#161616] dark:text-foreground">WCAG AA Target</h2>
          <p className="text-[13px] leading-relaxed text-muted-foreground">Navanta Design System targets WCAG 2.1 Level AA across all components and interaction patterns.</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {wcagChecks.map((item) => (
              <div key={item.pillar} className="rounded-[10px] border border-border bg-background p-4">
                <p className="text-[13px] font-medium text-foreground">{item.pillar}</p>
                <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{item.guidance}</p>
                <ul className="mt-3 space-y-1.5">
                  {item.checks.map((check) => (
                    <li key={check} className="flex items-start gap-2 text-[12px] text-muted-foreground">
                      <span className="mt-0.5 shrink-0 text-green-600">✓</span>
                      {check}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="keyboard-contract" className="scroll-mt-24 space-y-3 border-t border-border pt-6">
          <h2 className="text-[16px] font-semibold text-[#161616] dark:text-foreground">Keyboard Interaction Contract</h2>
          <p className="text-[13px] leading-relaxed text-muted-foreground">Every interactive component must be fully operable via keyboard alone.</p>
          <div className="overflow-x-auto rounded-[10px] border border-border bg-background">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr className="bg-muted/30">
                  <th className="border-b border-border px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2px] text-muted-foreground">Element</th>
                  <th className="border-b border-border px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2px] text-muted-foreground">Key</th>
                  <th className="border-b border-border px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2px] text-muted-foreground">Expected Behavior</th>
                </tr>
              </thead>
              <tbody>
                {keyboardRows.map((row) => (
                  <tr key={`${row.element}-${row.key}`} className="border-b border-border last:border-b-0">
                    <td className="px-4 py-3 text-[13px] text-foreground">{row.element}</td>
                    <td className="px-4 py-3 text-[13px]">
                      <code className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-foreground">{row.key}</code>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-muted-foreground">{row.expected}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="form-pattern" className="scroll-mt-24 space-y-3 border-t border-border pt-6">
          <h2 className="text-[16px] font-semibold text-[#161616] dark:text-foreground">Accessible Form Pattern</h2>
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            On submit failures, show a form-level summary plus inline field messages.
          </p>
          <div className="space-y-3 rounded-[10px] border border-border bg-background p-4">
            <div role="alert" aria-live="assertive" className="rounded-[8px] border border-destructive/40 bg-destructive/5 p-3">
              <p className="text-[13px] font-semibold text-destructive">There is a problem</p>
              <ul className="mt-2 space-y-1 pl-1 text-[12px] text-destructive">
                <li className="flex items-start gap-1.5"><span>—</span><a href="#a11y-email" className="underline">Enter an email address in the correct format</a></li>
                <li className="flex items-start gap-1.5"><span>—</span><a href="#a11y-terms" className="underline">Accept terms to continue</a></li>
              </ul>
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
              <Input id="a11y-email" label="Email" defaultValue="john@" error="Enter an email address in the correct format" />
              <Input id="a11y-name" label="Full name" helperText="Use your legal name as on ID." defaultValue="John Carter" />
            </div>
            <Textarea id="a11y-details" label="Issue details" helperText="Include what happened and when it started." placeholder="Describe the issue" />
            <Checkbox id="a11y-terms" label="I accept terms and conditions" error="Accept terms to continue" />
            <div className="flex justify-end">
              <Button type="button" size="md">Submit</Button>
            </div>
          </div>
        </section>

        <section id="screen-reader-contract" className="scroll-mt-24 space-y-3 border-t border-border pt-6">
          <h2 className="text-[16px] font-semibold text-[#161616] dark:text-foreground">Screen Reader Contract</h2>
          <div className="overflow-hidden rounded-[10px] border border-border bg-background">
            <ul className="divide-y divide-border">
              {srContract.map((item) => (
                <li key={item.label} className="flex flex-col gap-1.5 px-4 py-3 sm:flex-row sm:items-start sm:gap-4">
                  <span className="text-[13px] font-medium text-foreground sm:w-36 sm:shrink-0">{item.label}</span>
                  <span className="text-[13px] text-muted-foreground">{item.detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="manual-checklist" className="scroll-mt-24 space-y-3 border-t border-border pt-6">
          <h2 className="text-[16px] font-semibold text-[#161616] dark:text-foreground">Manual Test Checklist</h2>
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            Run these checks in product context, not only in isolation.
          </p>
          <div className="overflow-hidden rounded-[10px] border border-border bg-background">
            <ul className="divide-y divide-border">
              {manualChecklist.map((item, index) => (
                <li key={item} className="flex items-start gap-3 px-4 py-3">
                  <span className="mt-0.5 shrink-0 text-[11px] font-semibold tabular-nums text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
                  <span className="text-[13px] leading-relaxed text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="wcag-example" className="scroll-mt-24 space-y-3 border-t border-border pt-6">
          <h2 className="text-[16px] font-semibold text-[#161616] dark:text-foreground">WCAG Testing Example</h2>
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            Example manual test pass for a form flow. Use this structure in QA tickets and release checks.
          </p>
          <div className="overflow-x-auto rounded-[10px] border border-border bg-background">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <thead>
                <tr className="bg-muted/30">
                  {['WCAG Criterion', 'Scenario', 'How To Test', 'Pass', 'Fail'].map((h) => (
                    <th key={h} className="border-b border-border px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2px] text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {wcagExampleRows.map((row) => (
                  <tr key={row.criterion} className="border-b border-border last:border-b-0 align-top">
                    <td className="px-4 py-3 text-[13px] font-medium text-foreground">{row.criterion}</td>
                    <td className="px-4 py-3 text-[13px] text-muted-foreground">{row.scenario}</td>
                    <td className="px-4 py-3 text-[13px] text-muted-foreground">{row.howToTest}</td>
                    <td className="px-4 py-3 text-[13px] text-green-700 dark:text-green-400">{row.passExample}</td>
                    <td className="px-4 py-3 text-[13px] text-destructive">{row.failExample}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="testing-workflow" className="scroll-mt-24 space-y-3 border-t border-border pt-6">
          <h2 className="text-[16px] font-semibold text-[#161616] dark:text-foreground">Testing Workflow</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {workflow.map((step) => (
              <div key={step.title} className="rounded-[10px] border border-border bg-background p-4">
                <p className="text-[13px] font-medium text-foreground">{step.title}</p>
                <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{step.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="common-failures" className="scroll-mt-24 space-y-3 border-t border-border pt-6">
          <h2 className="text-[16px] font-semibold text-[#161616] dark:text-foreground">Common Failures</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[10px] border border-border bg-background p-4">
              <p className="text-[12px] font-semibold uppercase tracking-[0.2px] text-muted-foreground">Common Problems</p>
              <ul className="mt-2 list-disc space-y-1.5 pl-4 marker:text-muted-foreground">
                {['Missing visible labels or relying on placeholder text only.', 'Removing focus styles for visual polish.', 'Using color as the only state indicator.', 'Showing generic errors without recovery guidance.'].map((item) => (
                  <li key={item} className="text-[13px] text-muted-foreground">{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-[10px] border border-border bg-background p-4">
              <p className="text-[12px] font-semibold uppercase tracking-[0.2px] text-muted-foreground">Preferred Outcome</p>
              <ul className="mt-2 list-disc space-y-1.5 pl-4 marker:text-muted-foreground">
                {['Every control has clear labels and helper/error mapping.', 'Keyboard-only users can complete full flows.', 'Errors are visible inline and in summary on submit.', 'All states remain readable in both light and dark themes.'].map((item) => (
                  <li key={item} className="text-[13px] text-muted-foreground">{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="related-guides" className="scroll-mt-24 space-y-3 border-t border-border pt-6">
          <h2 className="text-[16px] font-semibold text-[#161616] dark:text-foreground">Related Guides</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              { href: '/validation', label: 'Validation' },
              { href: '/theme', label: 'Theme' },
              { href: '/components/input', label: 'Input Component' },
              { href: '/components/dialog', label: 'Dialog Component' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between rounded-[10px] border border-border bg-background px-4 py-3 text-[13px] text-foreground transition-colors hover:bg-muted/30"
              >
                {link.label}
                <span className="text-muted-foreground">→</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </DocsWithToc>
  )
}
