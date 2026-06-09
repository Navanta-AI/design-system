import type { Metadata } from 'next'
import { CodeBlock } from '@/app/components/code-block'
import { DocsWithToc } from '@/app/components/docs-with-toc'

export const metadata: Metadata = {
  title: 'Theme - Navanta Design System',
  description: 'Set up and customize Navanta Design System themes with your own global.css tokens.',
}

const QUICK_START_CODE = `// app/layout.tsx
import '@navanta-ai/design-system/styles.css'
`

const THEME_PROVIDER_CODE = `import { ThemeProvider } from 'next-themes'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
`

const CUSTOM_GLOBAL_CSS_CODE = `@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
  --color-info: var(--info);
  --color-info-foreground: var(--info-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-chart-6: var(--chart-6);
  --color-chart-positive: var(--chart-positive);
  --color-chart-negative: var(--chart-negative);
  --color-chart-neutral: var(--chart-neutral);
  --color-chart-warning: var(--chart-warning);
  --color-chart-info: var(--chart-info);
  --radius-sm: calc(var(--radius) * 0.5);
  --radius-md: calc(var(--radius) * 0.75);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.25);
}

:root {
  --radius: 0.5rem;
  --background: #ffffff;
  --foreground: #09090b;
  --card: #ffffff;
  --card-foreground: #09090b;
  --popover: #ffffff;
  --popover-foreground: #09090b;
  --primary: #232122;
  --primary-foreground: #ffffff;
  --secondary: #f4f4f5;
  --secondary-foreground: #27272a;
  --muted: #f4f4f5;
  --muted-foreground: #4b5563;
  --accent: #f4f4f5;
  --accent-foreground: #27272a;
  --destructive: #dc2626;
  --destructive-foreground: #ffffff;
  --success: #16a34a;
  --success-foreground: #09090b;
  --warning: #f59e0b;
  --warning-foreground: #09090b;
  --info: #0ea5e9;
  --info-foreground: #09090b;
  --border: #e4e4e7;
  --input: #e4e4e7;
  --ring: #c4c4c8;
  --chart-1: #232122;
  --chart-2: #3b82f6;
  --chart-3: #0ea5e9;
  --chart-4: #16a34a;
  --chart-5: #f59e0b;
  --chart-6: #a855f7;
  --chart-positive: var(--success);
  --chart-negative: var(--destructive);
  --chart-neutral: var(--muted-foreground);
  --chart-warning: var(--warning);
  --chart-info: var(--info);
}

.dark {
  --background: #09090b;
  --foreground: #fafafa;
  --card: #18181b;
  --card-foreground: #fafafa;
  --popover: #18181b;
  --popover-foreground: #fafafa;
  --primary: #fafafa;
  --primary-foreground: #232122;
  --secondary: #27272a;
  --secondary-foreground: #fafafa;
  --muted: #27272a;
  --muted-foreground: #a1a1aa;
  --accent: #27272a;
  --accent-foreground: #fafafa;
  --destructive: #f87171;
  --destructive-foreground: #09090b;
  --success: #4ade80;
  --success-foreground: #09090b;
  --warning: #fbbf24;
  --warning-foreground: #09090b;
  --info: #38bdf8;
  --info-foreground: #09090b;
  --border: #27272a;
  --input: #27272a;
  --ring: #71717a;
  --chart-1: #fafafa;
  --chart-2: #60a5fa;
  --chart-3: #38bdf8;
  --chart-4: #4ade80;
  --chart-5: #fbbf24;
  --chart-6: #c084fc;
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }

  body {
    @apply bg-background text-foreground;
  }
}
`

const ADD_TOKEN_CODE = `/* 1) Define token values in both modes */
:root {
  --brand-accent: #6440b6;
  --brand-accent-foreground: #ffffff;
}

.dark {
  --brand-accent: #8c66e3;
  --brand-accent-foreground: #09090b;
}

/* 2) Expose token to Tailwind v4 */
@theme inline {
  --color-brand-accent: var(--brand-accent);
  --color-brand-accent-foreground: var(--brand-accent-foreground);
}

/* 3) Use in UI */
.marketing-chip {
  background: var(--brand-accent);
  color: var(--brand-accent-foreground);
}
`

const STATE_USAGE_CODE = `<button
  className="
    rounded-md
    bg-primary text-primary-foreground
    hover:bg-accent hover:text-accent-foreground
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
    disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed
  "
>
  Save changes
</button>
`

const CHART_USAGE_CODE = `const seriesColors = {
  revenue: "var(--chart-1)",
  cost: "var(--chart-2)",
  margin: "var(--chart-3)",
  positive: "var(--chart-positive)",
  negative: "var(--chart-negative)",
}
`

const MIGRATION_CODE = `/* Before */
.cta {
  background: #232122;
  color: #ffffff;
  border: 1px solid #e4e4e7;
}

/* After */
.cta {
  background: var(--primary);
  color: var(--primary-foreground);
  border: 1px solid var(--border);
}
`

const TOKEN_CONVENTIONS = [
  { token: 'background / foreground', usage: 'App canvas and default text.' },
  { token: 'card / card-foreground', usage: 'Elevated surfaces and text inside cards.' },
  { token: 'popover / popover-foreground', usage: 'Menus, dialogs, and overlays.' },
  { token: 'primary / primary-foreground', usage: 'Primary actions and high-attention CTAs.' },
  { token: 'secondary / secondary-foreground', usage: 'Secondary actions and subtle controls.' },
  { token: 'muted / muted-foreground', usage: 'Low-emphasis surfaces and supporting text.' },
  { token: 'destructive / destructive-foreground', usage: 'Errors, dangerous actions, delete flows.' },
  { token: 'success / warning / info', usage: 'Status semantics, never brand replacements.' },
  { token: 'border / input / ring', usage: 'Structure, form fields, and focus visibility.' },
]

const sectionLinks = [
  { id: 'overview', label: 'Overview' },
  { id: 'quick-start', label: 'Quick Start' },
  { id: 'dark-mode-setup', label: 'Dark Mode Setup' },
  { id: 'custom-theme', label: 'Custom global.css Theme' },
  { id: 'token-convention', label: 'Token Convention' },
  { id: 'theme-guardrails', label: 'Theme Guardrails' },
  { id: 'add-token', label: 'Add New Token' },
  { id: 'state-tokens', label: 'Component State Tokens' },
  { id: 'chart-theming', label: 'Chart Theming' },
  { id: 'accessibility-checklist', label: 'Accessibility Checklist' },
  { id: 'troubleshooting', label: 'Troubleshooting' },
  { id: 'migration-from-hex', label: 'Migration from Hex' },
]

export default function ThemePage() {
  return (
    <DocsWithToc links={sectionLinks}>
      <section id="overview" className="scroll-mt-24">
        <h1 className="text-[20px] font-semibold text-[#161616] dark:text-foreground">Theme</h1>
        <p className="mt-2 text-[14px] text-[#535353] dark:text-muted-foreground">
          Configure light and dark themes with semantic tokens. You can use Navanta defaults or define your own
          token contract in a project-level <code>global.css</code>.
        </p>
      </section>

      <section id="quick-start" className="scroll-mt-24 space-y-4 border-t border-border pt-6">
        <h2 className="text-[16px] font-semibold text-[#161616] dark:text-foreground">Quick Start</h2>
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          Use Navanta&apos;s default token set by importing one stylesheet.
        </p>
        <CodeBlock code={QUICK_START_CODE} lang="tsx" />
      </section>

      <section id="dark-mode-setup" className="scroll-mt-24 space-y-4 border-t border-border pt-6">
        <h2 className="text-[16px] font-semibold text-[#161616] dark:text-foreground">Dark Mode Setup</h2>
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          Add <code>next-themes</code> so the <code>.dark</code> class can switch your token values.
        </p>
        <CodeBlock code={THEME_PROVIDER_CODE} lang="tsx" />
      </section>

      <section id="custom-theme" className="scroll-mt-24 space-y-4 border-t border-border pt-6">
        <h2 className="text-[16px] font-semibold text-[#161616] dark:text-foreground">Custom global.css Theme</h2>
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          For full control, define tokens in your own <code>global.css</code>. Keep semantic names unchanged so all
          Navanta components continue working.
        </p>
        <CodeBlock code={CUSTOM_GLOBAL_CSS_CODE} lang="css" />
      </section>

      <section id="token-convention" className="scroll-mt-24 space-y-4 border-t border-border pt-6">
        <h2 className="text-[16px] font-semibold text-[#161616] dark:text-foreground">Token Convention</h2>
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          Keep semantic names stable and map your brand/colors into these slots.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {TOKEN_CONVENTIONS.map((item) => (
            <div key={item.token} className="rounded-[8px] border border-border bg-background px-3 py-2.5">
              <p className="text-[12px] font-medium text-foreground">{item.token}</p>
              <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{item.usage}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="theme-guardrails" className="scroll-mt-24 space-y-4 border-t border-border pt-6">
        <h2 className="text-[16px] font-semibold text-[#161616] dark:text-foreground">Theme Guardrails</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[10px] border border-border bg-background p-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.2px] text-green-600">Themeable</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-[13px] text-muted-foreground">
              <li>Surface, text, border, focus, and semantic feedback tokens.</li>
              <li>Brand accent for primary CTA, selected, and focus moments.</li>
              <li>Chart palette and chart semantic aliases.</li>
            </ul>
          </div>
          <div className="rounded-[10px] border border-border bg-background p-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.2px] text-red-600">Avoid</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-[13px] text-muted-foreground">
              <li>Hardcoded hex inside component files.</li>
              <li>Using destructive/success colors as decorative brand colors.</li>
              <li>Changing semantic token names across apps.</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="add-token" className="scroll-mt-24 space-y-4 border-t border-border pt-6">
        <h2 className="text-[16px] font-semibold text-[#161616] dark:text-foreground">Add New Token</h2>
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          Add the token in <code>:root</code> and <code>.dark</code>, then map it inside <code>@theme inline</code>.
        </p>
        <CodeBlock code={ADD_TOKEN_CODE} lang="css" />
      </section>

      <section id="state-tokens" className="scroll-mt-24 space-y-4 border-t border-border pt-6">
        <h2 className="text-[16px] font-semibold text-[#161616] dark:text-foreground">Component State Tokens</h2>
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          Keep interaction states semantic and consistent across components.
        </p>
        <CodeBlock code={STATE_USAGE_CODE} lang="tsx" />
      </section>

      <section id="chart-theming" className="scroll-mt-24 space-y-4 border-t border-border pt-6">
        <h2 className="text-[16px] font-semibold text-[#161616] dark:text-foreground">Chart Theming</h2>
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          Prefer chart aliases for status intent and chart scale tokens for multi-series data.
        </p>
        <CodeBlock code={CHART_USAGE_CODE} lang="tsx" />
      </section>

      <section id="accessibility-checklist" className="scroll-mt-24 space-y-4 border-t border-border pt-6">
        <h2 className="text-[16px] font-semibold text-[#161616] dark:text-foreground">Accessibility Checklist</h2>
        <ul className="list-disc space-y-1 pl-4 text-[13px] leading-relaxed text-muted-foreground">
          <li>Ensure text pairs meet WCAG contrast (minimum 4.5:1 for body text).</li>
          <li>Never remove focus ring; map it to <code>--ring</code>.</li>
          <li>Validate light and dark variants for all status tokens.</li>
          <li>Use semantic tokens for disabled states and preserve readability.</li>
        </ul>
      </section>

      <section id="troubleshooting" className="scroll-mt-24 space-y-4 border-t border-border pt-6">
        <h2 className="text-[16px] font-semibold text-[#161616] dark:text-foreground">Troubleshooting</h2>
        <div className="space-y-2 text-[13px] text-muted-foreground">
          <p><span className="font-medium text-foreground">Dark mode not changing:</span> ensure <code>ThemeProvider</code> uses <code>attribute="class"</code> and your root gets <code>.dark</code>.</p>
          <p><span className="font-medium text-foreground">Token has no effect:</span> check it exists in both <code>:root</code> and <code>.dark</code> and is mapped in <code>@theme inline</code>.</p>
          <p><span className="font-medium text-foreground">Component looks off-brand:</span> replace hardcoded hex with semantic tokens or utilities.</p>
        </div>
      </section>

      <section id="migration-from-hex" className="scroll-mt-24 space-y-4 border-t border-border pt-6">
        <h2 className="text-[16px] font-semibold text-[#161616] dark:text-foreground">Migration from Hex</h2>
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          Move custom CSS from fixed hex values to semantic tokens to keep themes portable.
        </p>
        <CodeBlock code={MIGRATION_CODE} lang="css" />
      </section>
    </DocsWithToc>
  )
}
