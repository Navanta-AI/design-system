'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  ArrowUpRight,
  Bell,
  CalendarBlank,
  ChartBar,
  EnvelopeSimple,
  GearSix,
  House,
  MagnifyingGlass,
  Star,
  User,
} from '@phosphor-icons/react'

// ── Color Swatches Card ──────────────────────────────────────────────────────

const swatches = [
  { label: 'Background', var: 'var(--background)', border: true },
  { label: 'Secondary', var: 'var(--secondary)' },
  { label: 'Muted', var: 'var(--muted)' },
  { label: 'Border', var: 'var(--border)' },
  { label: 'Foreground', var: 'var(--foreground)' },
  { label: 'Primary', var: 'var(--primary)' },
  { label: 'Success', var: 'var(--success)' },
  { label: 'Warning', var: 'var(--warning)' },
  { label: 'Destructive', var: 'var(--destructive)' },
  { label: 'Info', var: 'var(--info)' },
]

function ColorSwatchesCard() {
  return (
    <FeatureCard title="Colors" href="/colors" span={2}>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        {swatches.map((s) => (
          <div
            key={s.label}
            title={s.label}
            className="h-9 w-9 rounded-full flex-shrink-0"
            style={{
              backgroundColor: s.var,
              border: s.border ? '1px solid var(--border)' : 'none',
            }}
          />
        ))}
      </div>
      <p className="mt-4 text-[13px] text-muted-foreground leading-relaxed">
        A high contrast, accessible color system.
      </p>
    </FeatureCard>
  )
}

// ── Typography Card ──────────────────────────────────────────────────────────

function TypographyCard() {
  return (
    <FeatureCard title="Typography" href="/typography">
      <div className="mt-4 flex h-[80px] overflow-hidden rounded-md bg-muted/35">
        <div className="flex flex-1 flex-col justify-center px-4">
          <p className="text-[22px] font-semibold leading-none tracking-tight text-foreground">Geist Sans</p>
          <p className="mt-1.5 text-[11px] text-muted-foreground">Sans-serif</p>
        </div>
        <div className="w-px bg-foreground/10" />
        <div className="flex flex-1 flex-col justify-center px-4">
          <p className="font-mono text-[22px] font-semibold leading-none text-foreground">Geist Mono</p>
          <p className="mt-1.5 font-mono text-[11px] text-muted-foreground">Monospace</p>
        </div>
      </div>
      <p className="mt-3 text-[13px] text-muted-foreground leading-relaxed">
        Specifically designed for developers and designers.
      </p>
    </FeatureCard>
  )
}

// ── Install Card ─────────────────────────────────────────────────────────────

function InstallCard() {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText('npm install @navanta-ai/design-system')
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <FeatureCard title="Install" href="/getting-started">
      <button
        onClick={(e) => { e.preventDefault(); copy() }}
        className="mt-4 w-full rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-left font-mono text-[12px] text-foreground hover:bg-muted/60 transition-colors"
      >
        <span className="text-muted-foreground select-none">$ </span>
        npm install @navanta-ai/design-system
      </button>
      <p className="mt-2 text-[11px] text-muted-foreground">
        {copied ? '✓ Copied!' : 'Click to copy'}
      </p>
    </FeatureCard>
  )
}

// ── Icons Card ───────────────────────────────────────────────────────────────

const ICON_COMPONENTS = [
  House,
  Star,
  Bell,
  MagnifyingGlass,
  GearSix,
  User,
  EnvelopeSimple,
  CalendarBlank,
  ChartBar,
]

function IconsCard() {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <FeatureCard title="Icons" href="/iconography">
      <div className="mt-4 grid grid-cols-4 gap-2">
        {ICON_COMPONENTS.map((Icon, i) => (
          <div
            key={i}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className="flex h-9 w-full items-center justify-center rounded-md transition-colors hover:bg-muted/30"
          >
            <Icon
              size={16}
              weight="regular"
              className="transition-colors"
              style={{ color: hovered === i ? 'var(--primary)' : 'var(--foreground)' }}
            />
          </div>
        ))}
      </div>
      <p className="mt-3 text-[13px] text-muted-foreground leading-relaxed">
        Powered by Phosphor Icons.
      </p>
    </FeatureCard>
  )
}

// ── Tokens Card ──────────────────────────────────────────────────────────────

const tokenLines = [
  { name: '--background', value: '#09090b' },
  { name: '--foreground', value: '#fafafa' },
  { name: '--primary', value: '#ffffff' },
  { name: '--muted', value: '#27272a' },
  { name: '--border', value: '#27272a' },
]

function TokensCard() {
  return (
    <FeatureCard title="Tokens" href="/colors">
      <div className="mt-4 rounded-lg bg-muted/45 dark:bg-muted/35 px-3 py-2.5 font-mono text-[11px] leading-5 overflow-hidden">
        <div className="text-muted-foreground">{`:root {`}</div>
        <div className="space-y-0.5 pl-3">
          {tokenLines.map((t) => (
            <div key={t.name} className="truncate">
              <span className="text-sky-700 dark:text-sky-300">{t.name}</span>
              <span className="text-muted-foreground">: </span>
              <span className="text-emerald-700 dark:text-emerald-300">{t.value}</span>
              <span className="text-muted-foreground">;</span>
            </div>
          ))}
        </div>
        <div className="text-muted-foreground">{`}`}</div>
      </div>
    </FeatureCard>
  )
}

// ── Components showcase card ─────────────────────────────────────────────────

function ComponentsCard() {
  return (
    <FeatureCard title="Components" href="/components/button" span={2}>
      <div className="mt-4 flex flex-wrap gap-2">
        {['Button', 'Input', 'Dialog', 'Select', 'Checkbox', 'Toast', 'Tabs', 'Table', 'Bar Chart', 'Line Chart', 'Stacked Bar', 'Tooltip'].map((name) => (
          <span
            key={name}
            className="rounded-full border border-border bg-muted/30 px-2.5 py-1 text-[12px] text-foreground"
          >
            {name}
          </span>
        ))}
      </div>
      <p className="mt-4 text-[13px] text-muted-foreground leading-relaxed">
        27 production-ready components built for dashboards and data-heavy UIs.
      </p>
    </FeatureCard>
  )
}

// ── Grid Card ────────────────────────────────────────────────────────────────

function GridCross() {
  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none">
      <div className="absolute left-1/2 top-0 h-full w-px bg-border" />
      <div className="absolute top-1/2 left-0 w-full h-px bg-border" />
    </div>
  )
}

function GridCard() {
  const cols = 4
  const rows = 3

  return (
    <FeatureCard title="Grid & Layout" href="/grid-layout">
      <div className="relative mt-4 overflow-hidden rounded-md" style={{ aspectRatio: '2 / 1' }}>
        {/* column guides */}
        <div className="absolute inset-0 grid pointer-events-none" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {[...Array(cols)].map((_, i) => (
            <div key={i} className="border-r border-border last:border-r-0 h-full" />
          ))}
        </div>
        {/* row guides */}
        <div className="absolute inset-0 flex flex-col pointer-events-none">
          {[...Array(rows)].map((_, i) => (
            <div key={i} className="border-b border-border last:border-b-0 flex-1" />
          ))}
        </div>
        {/* cross markers at intersections */}
        {[...Array(rows + 1)].map((_, r) =>
          [...Array(cols + 1)].map((_, c) => (
            <div
              key={`${r}-${c}`}
              className="absolute"
              style={{
                left: `${(c / cols) * 100}%`,
                top: `${(r / rows) * 100}%`,
              }}
            >
              <GridCross />
            </div>
          ))
        )}
        {/* highlight cells */}
        <div className="absolute inset-0 grid gap-0 pointer-events-none" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}>
          <div className="bg-muted/40 border-r border-b border-border col-span-2 row-span-1" />
          <div className="bg-muted/20 border-r border-b border-border col-span-1 row-span-2" style={{ gridColumn: 3, gridRow: 2 }} />
          <div className="bg-muted/30 border-b border-border col-span-3 row-span-1" style={{ gridColumn: 1, gridRow: 3 }} />
        </div>
      </div>
    </FeatureCard>
  )
}

// ── Shared wrapper ───────────────────────────────────────────────────────────

function FeatureCard({
  title,
  href,
  span,
  children,
}: {
  title: string
  href: string
  span?: number
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={`group relative flex flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:bg-muted/10${span === 2 ? ' sm:col-span-2' : ''}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wide">
          {title}
        </span>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      {children}
    </Link>
  )
}

// ── Export ───────────────────────────────────────────────────────────────────

export function FeatureCards() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {/* row 1 */}
      <InstallCard />
      <IconsCard />
      <TokensCard />
      {/* row 2 */}
      <ColorSwatchesCard />
      <TypographyCard />
      {/* row 3 */}
      <GridCard />
      <ComponentsCard />
    </div>
  )
}
