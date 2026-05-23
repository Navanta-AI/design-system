'use client'

import { useState } from 'react'
import { Tabs } from '@navanta/design-system'
import { Check, CopySimple } from '@phosphor-icons/react'

type ColorMode = 'light' | 'dark'

type ColorToken = {
  label: string
  figmaToken: string
  cssVar: string
  utility: string
  textUtility: string
  utilityLightHex: string
  utilityDarkHex: string
  textLightHex: string
  textDarkHex: string
}

const TOKENS: ColorToken[] = [
  {
    label: 'Background',
    figmaToken: 'Color/Background/Default',
    cssVar: '--background',
    utility: 'bg-background',
    textUtility: 'text-foreground',
    utilityLightHex: '#FFFFFF',
    utilityDarkHex: '#09090B',
    textLightHex: '#09090B',
    textDarkHex: '#FAFAFA',
  },
  {
    label: 'Foreground',
    figmaToken: 'Color/Foreground/Default',
    cssVar: '--foreground',
    utility: 'bg-foreground',
    textUtility: 'text-background',
    utilityLightHex: '#09090B',
    utilityDarkHex: '#FAFAFA',
    textLightHex: '#FFFFFF',
    textDarkHex: '#09090B',
  },
  {
    label: 'Card',
    figmaToken: 'Color/Card/Default',
    cssVar: '--card',
    utility: 'bg-card',
    textUtility: 'text-card-foreground',
    utilityLightHex: '#FFFFFF',
    utilityDarkHex: '#18181B',
    textLightHex: '#09090B',
    textDarkHex: '#FAFAFA',
  },
  {
    label: 'Card Foreground',
    figmaToken: 'Color/Card/Foreground',
    cssVar: '--card-foreground',
    utility: 'bg-card-foreground',
    textUtility: 'text-card',
    utilityLightHex: '#09090B',
    utilityDarkHex: '#FAFAFA',
    textLightHex: '#FFFFFF',
    textDarkHex: '#18181B',
  },
  {
    label: 'Popover',
    figmaToken: 'Color/Popover/Default',
    cssVar: '--popover',
    utility: 'bg-popover',
    textUtility: 'text-popover-foreground',
    utilityLightHex: '#FFFFFF',
    utilityDarkHex: '#18181B',
    textLightHex: '#09090B',
    textDarkHex: '#FAFAFA',
  },
  {
    label: 'Popover Foreground',
    figmaToken: 'Color/Popover/Foreground',
    cssVar: '--popover-foreground',
    utility: 'bg-popover-foreground',
    textUtility: 'text-popover',
    utilityLightHex: '#09090B',
    utilityDarkHex: '#FAFAFA',
    textLightHex: '#FFFFFF',
    textDarkHex: '#18181B',
  },
  {
    label: 'Primary',
    figmaToken: 'Color/Primary/Default',
    cssVar: '--primary',
    utility: 'bg-primary',
    textUtility: 'text-primary-foreground',
    utilityLightHex: '#232122',
    utilityDarkHex: '#FAFAFA',
    textLightHex: '#FFFFFF',
    textDarkHex: '#232122',
  },
  {
    label: 'Primary Foreground',
    figmaToken: 'Color/Primary/Foreground',
    cssVar: '--primary-foreground',
    utility: 'bg-primary-foreground',
    textUtility: 'text-primary',
    utilityLightHex: '#FFFFFF',
    utilityDarkHex: '#232122',
    textLightHex: '#232122',
    textDarkHex: '#FAFAFA',
  },
  {
    label: 'Secondary',
    figmaToken: 'Color/Secondary/Default',
    cssVar: '--secondary',
    utility: 'bg-secondary',
    textUtility: 'text-secondary-foreground',
    utilityLightHex: '#F4F4F5',
    utilityDarkHex: '#27272A',
    textLightHex: '#27272A',
    textDarkHex: '#FAFAFA',
  },
  {
    label: 'Secondary Foreground',
    figmaToken: 'Color/Secondary/Foreground',
    cssVar: '--secondary-foreground',
    utility: 'bg-secondary-foreground',
    textUtility: 'text-secondary',
    utilityLightHex: '#27272A',
    utilityDarkHex: '#FAFAFA',
    textLightHex: '#F4F4F5',
    textDarkHex: '#27272A',
  },
  {
    label: 'Muted',
    figmaToken: 'Color/Muted/Default',
    cssVar: '--muted',
    utility: 'bg-muted',
    textUtility: 'text-muted-foreground',
    utilityLightHex: '#F4F4F5',
    utilityDarkHex: '#27272A',
    textLightHex: '#4B5563',
    textDarkHex: '#A1A1AA',
  },
  {
    label: 'Muted Foreground',
    figmaToken: 'Color/Muted/Foreground',
    cssVar: '--muted-foreground',
    utility: 'bg-muted-foreground',
    textUtility: 'text-muted',
    utilityLightHex: '#4B5563',
    utilityDarkHex: '#A1A1AA',
    textLightHex: '#F4F4F5',
    textDarkHex: '#27272A',
  },
  {
    label: 'Accent',
    figmaToken: 'Color/Accent/Default',
    cssVar: '--accent',
    utility: 'bg-accent',
    textUtility: 'text-accent-foreground',
    utilityLightHex: '#F4F4F5',
    utilityDarkHex: '#27272A',
    textLightHex: '#27272A',
    textDarkHex: '#FAFAFA',
  },
  {
    label: 'Accent Foreground',
    figmaToken: 'Color/Accent/Foreground',
    cssVar: '--accent-foreground',
    utility: 'bg-accent-foreground',
    textUtility: 'text-accent',
    utilityLightHex: '#27272A',
    utilityDarkHex: '#FAFAFA',
    textLightHex: '#F4F4F5',
    textDarkHex: '#27272A',
  },
  {
    label: 'Destructive',
    figmaToken: 'Color/Destructive/Default',
    cssVar: '--destructive',
    utility: 'bg-destructive',
    textUtility: 'text-destructive-foreground',
    utilityLightHex: '#DC2626',
    utilityDarkHex: '#F87171',
    textLightHex: '#FFFFFF',
    textDarkHex: '#09090B',
  },
  {
    label: 'Destructive Foreground',
    figmaToken: 'Color/Destructive/Foreground',
    cssVar: '--destructive-foreground',
    utility: 'bg-destructive-foreground',
    textUtility: 'text-destructive',
    utilityLightHex: '#FFFFFF',
    utilityDarkHex: '#09090B',
    textLightHex: '#DC2626',
    textDarkHex: '#F87171',
  },
  {
    label: 'Success',
    figmaToken: 'Color/Success/Default',
    cssVar: '--success',
    utility: 'bg-success',
    textUtility: 'text-success-foreground',
    utilityLightHex: '#16A34A',
    utilityDarkHex: '#4ADE80',
    textLightHex: '#09090B',
    textDarkHex: '#09090B',
  },
  {
    label: 'Success Foreground',
    figmaToken: 'Color/Success/Foreground',
    cssVar: '--success-foreground',
    utility: 'bg-success-foreground',
    textUtility: 'text-success',
    utilityLightHex: '#09090B',
    utilityDarkHex: '#09090B',
    textLightHex: '#16A34A',
    textDarkHex: '#4ADE80',
  },
  {
    label: 'Warning',
    figmaToken: 'Color/Warning/Default',
    cssVar: '--warning',
    utility: 'bg-warning',
    textUtility: 'text-warning-foreground',
    utilityLightHex: '#F59E0B',
    utilityDarkHex: '#FBBF24',
    textLightHex: '#09090B',
    textDarkHex: '#09090B',
  },
  {
    label: 'Warning Foreground',
    figmaToken: 'Color/Warning/Foreground',
    cssVar: '--warning-foreground',
    utility: 'bg-warning-foreground',
    textUtility: 'text-warning',
    utilityLightHex: '#09090B',
    utilityDarkHex: '#09090B',
    textLightHex: '#F59E0B',
    textDarkHex: '#FBBF24',
  },
  {
    label: 'Info',
    figmaToken: 'Color/Info/Default',
    cssVar: '--info',
    utility: 'bg-info',
    textUtility: 'text-info-foreground',
    utilityLightHex: '#0EA5E9',
    utilityDarkHex: '#38BDF8',
    textLightHex: '#09090B',
    textDarkHex: '#09090B',
  },
  {
    label: 'Info Foreground',
    figmaToken: 'Color/Info/Foreground',
    cssVar: '--info-foreground',
    utility: 'bg-info-foreground',
    textUtility: 'text-info',
    utilityLightHex: '#09090B',
    utilityDarkHex: '#09090B',
    textLightHex: '#0EA5E9',
    textDarkHex: '#38BDF8',
  },
  {
    label: 'Chart 1',
    figmaToken: 'Color/Chart/01',
    cssVar: '--chart-1',
    utility: 'bg-chart-1',
    textUtility: 'text-background',
    utilityLightHex: '#232122',
    utilityDarkHex: '#FAFAFA',
    textLightHex: '#FFFFFF',
    textDarkHex: '#09090B',
  },
  {
    label: 'Chart 2',
    figmaToken: 'Color/Chart/02',
    cssVar: '--chart-2',
    utility: 'bg-chart-2',
    textUtility: 'text-background',
    utilityLightHex: '#3B82F6',
    utilityDarkHex: '#60A5FA',
    textLightHex: '#FFFFFF',
    textDarkHex: '#09090B',
  },
  {
    label: 'Chart 3',
    figmaToken: 'Color/Chart/03',
    cssVar: '--chart-3',
    utility: 'bg-chart-3',
    textUtility: 'text-background',
    utilityLightHex: '#0EA5E9',
    utilityDarkHex: '#38BDF8',
    textLightHex: '#FFFFFF',
    textDarkHex: '#09090B',
  },
  {
    label: 'Chart 4',
    figmaToken: 'Color/Chart/04',
    cssVar: '--chart-4',
    utility: 'bg-chart-4',
    textUtility: 'text-background',
    utilityLightHex: '#16A34A',
    utilityDarkHex: '#4ADE80',
    textLightHex: '#FFFFFF',
    textDarkHex: '#09090B',
  },
  {
    label: 'Chart 5',
    figmaToken: 'Color/Chart/05',
    cssVar: '--chart-5',
    utility: 'bg-chart-5',
    textUtility: 'text-background',
    utilityLightHex: '#F59E0B',
    utilityDarkHex: '#FBBF24',
    textLightHex: '#09090B',
    textDarkHex: '#09090B',
  },
  {
    label: 'Chart 6',
    figmaToken: 'Color/Chart/06',
    cssVar: '--chart-6',
    utility: 'bg-chart-6',
    textUtility: 'text-background',
    utilityLightHex: '#A855F7',
    utilityDarkHex: '#C084FC',
    textLightHex: '#FFFFFF',
    textDarkHex: '#09090B',
  },
  {
    label: 'Chart Positive',
    figmaToken: 'Color/Chart/Positive',
    cssVar: '--chart-positive',
    utility: 'bg-chart-positive',
    textUtility: 'text-success-foreground',
    utilityLightHex: '#16A34A',
    utilityDarkHex: '#4ADE80',
    textLightHex: '#09090B',
    textDarkHex: '#09090B',
  },
  {
    label: 'Chart Negative',
    figmaToken: 'Color/Chart/Negative',
    cssVar: '--chart-negative',
    utility: 'bg-chart-negative',
    textUtility: 'text-destructive-foreground',
    utilityLightHex: '#DC2626',
    utilityDarkHex: '#F87171',
    textLightHex: '#FFFFFF',
    textDarkHex: '#09090B',
  },
  {
    label: 'Chart Neutral',
    figmaToken: 'Color/Chart/Neutral',
    cssVar: '--chart-neutral',
    utility: 'bg-chart-neutral',
    textUtility: 'text-background',
    utilityLightHex: '#4B5563',
    utilityDarkHex: '#A1A1AA',
    textLightHex: '#FFFFFF',
    textDarkHex: '#09090B',
  },
  {
    label: 'Chart Warning',
    figmaToken: 'Color/Chart/Warning',
    cssVar: '--chart-warning',
    utility: 'bg-chart-warning',
    textUtility: 'text-warning-foreground',
    utilityLightHex: '#F59E0B',
    utilityDarkHex: '#FBBF24',
    textLightHex: '#09090B',
    textDarkHex: '#09090B',
  },
  {
    label: 'Chart Info',
    figmaToken: 'Color/Chart/Info',
    cssVar: '--chart-info',
    utility: 'bg-chart-info',
    textUtility: 'text-info-foreground',
    utilityLightHex: '#0EA5E9',
    utilityDarkHex: '#38BDF8',
    textLightHex: '#09090B',
    textDarkHex: '#09090B',
  },
  {
    label: 'Border',
    figmaToken: 'Color/Border/Default',
    cssVar: '--border',
    utility: 'bg-border',
    textUtility: 'text-foreground',
    utilityLightHex: '#E4E4E7',
    utilityDarkHex: '#27272A',
    textLightHex: '#09090B',
    textDarkHex: '#FAFAFA',
  },
  {
    label: 'Input',
    figmaToken: 'Color/Input/Default',
    cssVar: '--input',
    utility: 'bg-input',
    textUtility: 'text-foreground',
    utilityLightHex: '#E4E4E7',
    utilityDarkHex: '#27272A',
    textLightHex: '#09090B',
    textDarkHex: '#FAFAFA',
  },
  {
    label: 'Ring',
    figmaToken: 'Color/Ring/Default',
    cssVar: '--ring',
    utility: 'bg-ring',
    textUtility: 'text-background',
    utilityLightHex: '#C4C4C8',
    utilityDarkHex: '#71717A',
    textLightHex: '#FFFFFF',
    textDarkHex: '#09090B',
  },
]

const BORDER_HEX_BY_MODE: Record<ColorMode, string> = {
  light: '#E4E4E7',
  dark: '#27272A',
}

type ColorView = 'semantic' | 'scales'
type TokenGroupId = 'core' | 'feedback' | 'chart' | 'system'

type ColorScale = {
  name: string
  tokenName: string
  shades: Array<{
    step: string
    light: string
    dark: string
  }>
}

const TOKEN_GROUPS: Array<{ id: TokenGroupId; label: string }> = [
  { id: 'core', label: 'Core Tokens' },
  { id: 'feedback', label: 'Feedback Tokens' },
  { id: 'chart', label: 'Chart Tokens' },
  { id: 'system', label: 'System Tokens' },
]

const COLOR_SCALES: ColorScale[] = [
  {
    name: 'Brand',
    tokenName: 'Color/Brand',
    shades: [
      { step: '50', light: '#F6F2FF', dark: '#1B122F' },
      { step: '100', light: '#EEE6FF', dark: '#271B44' },
      { step: '200', light: '#DCCDFF', dark: '#35265D' },
      { step: '300', light: '#C3ACFF', dark: '#46327B' },
      { step: '400', light: '#A585F4', dark: '#5E43A3' },
      { step: '500', light: '#8460DA', dark: '#7858CA' },
      { step: '600', light: '#6440B6', dark: '#8C66E3' },
      { step: '700', light: '#553696', dark: '#A88BE9' },
      { step: '800', light: '#452B79', dark: '#C4B2F0' },
      { step: '900', light: '#37235F', dark: '#E4DCFA' },
    ],
  },
  {
    name: 'Neutral',
    tokenName: 'Color/Neutral',
    shades: [
      { step: '50', light: '#FAFAFA', dark: '#18181B' },
      { step: '100', light: '#F4F4F5', dark: '#27272A' },
      { step: '200', light: '#E4E4E7', dark: '#3F3F46' },
      { step: '300', light: '#D4D4D8', dark: '#52525B' },
      { step: '400', light: '#A1A1AA', dark: '#71717A' },
      { step: '500', light: '#71717A', dark: '#A1A1AA' },
      { step: '600', light: '#52525B', dark: '#D4D4D8' },
      { step: '700', light: '#3F3F46', dark: '#E4E4E7' },
      { step: '800', light: '#27272A', dark: '#F4F4F5' },
      { step: '900', light: '#18181B', dark: '#FAFAFA' },
    ],
  },
  {
    name: 'Success',
    tokenName: 'Color/Success',
    shades: [
      { step: '50', light: '#F0FDF4', dark: '#14532D' },
      { step: '100', light: '#DCFCE7', dark: '#166534' },
      { step: '200', light: '#BBF7D0', dark: '#15803D' },
      { step: '300', light: '#86EFAC', dark: '#16A34A' },
      { step: '400', light: '#4ADE80', dark: '#22C55E' },
      { step: '500', light: '#22C55E', dark: '#4ADE80' },
      { step: '600', light: '#16A34A', dark: '#86EFAC' },
      { step: '700', light: '#15803D', dark: '#BBF7D0' },
      { step: '800', light: '#166534', dark: '#DCFCE7' },
      { step: '900', light: '#14532D', dark: '#F0FDF4' },
    ],
  },
  {
    name: 'Warning',
    tokenName: 'Color/Warning',
    shades: [
      { step: '50', light: '#FFFBEB', dark: '#78350F' },
      { step: '100', light: '#FEF3C7', dark: '#92400E' },
      { step: '200', light: '#FDE68A', dark: '#B45309' },
      { step: '300', light: '#FCD34D', dark: '#D97706' },
      { step: '400', light: '#FBBF24', dark: '#F59E0B' },
      { step: '500', light: '#F59E0B', dark: '#FBBF24' },
      { step: '600', light: '#D97706', dark: '#FCD34D' },
      { step: '700', light: '#B45309', dark: '#FDE68A' },
      { step: '800', light: '#92400E', dark: '#FEF3C7' },
      { step: '900', light: '#78350F', dark: '#FFFBEB' },
    ],
  },
  {
    name: 'Destructive',
    tokenName: 'Color/Destructive',
    shades: [
      { step: '50', light: '#FEF2F2', dark: '#7F1D1D' },
      { step: '100', light: '#FEE2E2', dark: '#991B1B' },
      { step: '200', light: '#FECACA', dark: '#B91C1C' },
      { step: '300', light: '#FCA5A5', dark: '#DC2626' },
      { step: '400', light: '#F87171', dark: '#EF4444' },
      { step: '500', light: '#EF4444', dark: '#F87171' },
      { step: '600', light: '#DC2626', dark: '#FCA5A5' },
      { step: '700', light: '#B91C1C', dark: '#FECACA' },
      { step: '800', light: '#991B1B', dark: '#FEE2E2' },
      { step: '900', light: '#7F1D1D', dark: '#FEF2F2' },
    ],
  },
  {
    name: 'Info',
    tokenName: 'Color/Info',
    shades: [
      { step: '50', light: '#F0F9FF', dark: '#0C4A6E' },
      { step: '100', light: '#E0F2FE', dark: '#075985' },
      { step: '200', light: '#BAE6FD', dark: '#0369A1' },
      { step: '300', light: '#7DD3FC', dark: '#0284C7' },
      { step: '400', light: '#38BDF8', dark: '#0EA5E9' },
      { step: '500', light: '#0EA5E9', dark: '#38BDF8' },
      { step: '600', light: '#0284C7', dark: '#7DD3FC' },
      { step: '700', light: '#0369A1', dark: '#BAE6FD' },
      { step: '800', light: '#075985', dark: '#E0F2FE' },
      { step: '900', light: '#0C4A6E', dark: '#F0F9FF' },
    ],
  },
]

const COLOR_SCALE_DISPLAY_ORDER = [
  'Neutral',
  'Success',
  'Warning',
  'Destructive',
  'Info',
  'Brand',
] as const

const COLOR_SCALE_ORDER_INDEX: ReadonlyMap<string, number> = new Map(
  COLOR_SCALE_DISPLAY_ORDER.map((name, index) => [name, index])
)

function getTokenGroup(token: ColorToken): TokenGroupId {
  if (token.figmaToken.startsWith('Color/Chart/')) return 'chart'
  if (
    token.figmaToken.startsWith('Color/Border/') ||
    token.figmaToken.startsWith('Color/Input/') ||
    token.figmaToken.startsWith('Color/Ring/')
  ) {
    return 'system'
  }
  if (
    token.figmaToken.startsWith('Color/Destructive/') ||
    token.figmaToken.startsWith('Color/Success/') ||
    token.figmaToken.startsWith('Color/Warning/') ||
    token.figmaToken.startsWith('Color/Info/')
  ) {
    return 'feedback'
  }

  return 'core'
}

function MetaField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] uppercase tracking-[0.2px] text-muted-foreground">{label}</p>
      <p className="mt-0.5 truncate text-[13px] text-foreground" title={value}>
        {value}
      </p>
    </div>
  )
}

function MetaFieldWithHex({
  label,
  hex,
  mode,
}: {
  label: string
  hex: string
  mode: ColorMode
}) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] uppercase tracking-[0.2px] text-muted-foreground">{label}</p>
      <div className="mt-0.5">
        <CopyHexButton mode={mode} value={hex} />
      </div>
    </div>
  )
}

function CopyHexButton({ value, mode }: { value: string; mode: ColorMode }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-1.5 py-0.5 text-[12px] hover:bg-muted/30"
      aria-label={`Copy ${mode} hex ${value}`}
      title={`Copy ${mode} hex ${value}`}
    >
      {copied ? <Check size={12} className="text-foreground" /> : <CopySimple size={12} className="text-muted-foreground" />}
      <span className="font-mono text-foreground">{copied ? 'Copied' : value}</span>
    </button>
  )
}

function ShadeSwatch({
  label,
  mode,
  value,
}: {
  label: string
  mode: ColorMode
  value: string
}) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="group flex flex-col text-left hover:brightness-95 transition-all"
      aria-label={`Copy ${mode} ${label} hex ${value}`}
      title={`Copy ${mode} ${label} hex ${value}`}
    >
      <div
        className="h-10 w-full border-r border-border last:border-r-0"
        style={{ backgroundColor: value }}
      />
      <div className="border-t border-r border-border last:border-r-0 px-2 py-1.5">
        <span className="font-mono text-[11px] text-muted-foreground">{label}</span>
        <p className="truncate font-mono text-[10px] text-foreground">
          {copied ? 'Copied!' : value}
        </p>
      </div>
    </button>
  )
}

export function ColorsShowcase() {
  const [mode, setMode] = useState<ColorMode>('light')
  const [view, setView] = useState<ColorView>('semantic')
  const orderedColorScales = [...COLOR_SCALES].sort((a, b) => {
    const aIndex = COLOR_SCALE_ORDER_INDEX.get(a.name) ?? Number.MAX_SAFE_INTEGER
    const bIndex = COLOR_SCALE_ORDER_INDEX.get(b.name) ?? Number.MAX_SAFE_INTEGER
    return aIndex - bIndex
  })

  return (
    <div className="space-y-3">
      <p className="text-[13px] leading-relaxed text-muted-foreground">
        Use semantic token names in UI specs and code. Hex values below are copyable for Figma and
        design audits.
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="max-w-[260px]">
          <Tabs
            tabs={[
              { id: 'semantic', label: 'Semantic Tokens' },
              { id: 'scales', label: '10 Shade Scales' },
            ]}
            activeTab={view}
            onChange={(id) => setView(id as ColorView)}
            variant="pills"
            size="sm"
            fullWidth
          />
        </div>
        <div className="max-w-[220px] sm:justify-self-end">
          <Tabs
            tabs={[
              { id: 'light', label: 'Light' },
              { id: 'dark', label: 'Dark' },
            ]}
            activeTab={mode}
            onChange={(id) => setMode(id as ColorMode)}
            variant="pills"
            size="sm"
            fullWidth
          />
        </div>
      </div>

      {view === 'semantic' ? (
        <div className="space-y-5">
          {TOKEN_GROUPS.map((group) => {
            const groupTokens = TOKENS.filter((token) => getTokenGroup(token) === group.id)
            if (groupTokens.length === 0) return null

            return (
              <section key={group.id} className="space-y-2.5">
                <h3 className="text-[13px] font-medium text-foreground">{group.label}</h3>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {groupTokens.map((token) => {
                    const utilityHex =
                      mode === 'light' ? token.utilityLightHex : token.utilityDarkHex
                    const textHex = mode === 'light' ? token.textLightHex : token.textDarkHex

                    return (
                      <div
                        key={token.figmaToken}
                        className="rounded-[10px] border border-border bg-background overflow-hidden"
                      >
                        <div
                          className="flex h-12 items-center px-3"
                          style={{
                            backgroundColor: utilityHex,
                            borderBottom: `1px solid ${BORDER_HEX_BY_MODE[mode]}`,
                          }}
                        >
                          <span className="text-[13px] font-medium" style={{ color: textHex }}>
                            {token.label}
                          </span>
                        </div>

                        <div className="space-y-2.5 p-3">
                          <MetaField label="CSS var" value={token.cssVar} />
                          <div className="grid gap-x-4 gap-y-2 sm:grid-cols-2">
                            <MetaFieldWithHex
                              label="Background"
                              hex={utilityHex}
                              mode={mode}
                            />
                            <MetaFieldWithHex
                              label="Text pair"
                              hex={textHex}
                              mode={mode}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            Ten-shade color scales for design exploration. Click any swatch to copy its hex code.
          </p>
          <div className="space-y-3">
            {orderedColorScales.map((scale) => (
              <div key={scale.name} className="rounded-[10px] border border-border bg-background overflow-hidden">
                <div className="px-3 pt-3 pb-2.5">
                  <p className="text-[13px] font-medium text-foreground">{scale.name}</p>
                  <p className="text-[12px] text-muted-foreground">{scale.tokenName}</p>
                </div>
                <div className="grid grid-cols-2 gap-0 sm:grid-cols-5 xl:grid-cols-10">
                  {scale.shades.map((shade) => (
                    <ShadeSwatch
                      key={shade.step}
                      label={shade.step}
                      mode={mode}
                      value={mode === 'light' ? shade.light : shade.dark}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
