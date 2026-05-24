'use client'

import { useState, useEffect } from 'react'
import { Tabs, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@admin-navanta/design-system'

type ViewportKey = 'desktop' | 'tablet' | 'mobile'
type MarginValue = 'fluid' | '16' | '32' | '48'

type GridConfig = {
  columns: number
  gutter: number
  margin: MarginValue
}

type ViewportPreset = {
  id: ViewportKey
  label: string
  referenceSize: string
  defaultConfig: GridConfig
  marginOptions: Array<{ value: MarginValue; label: string }>
}

const VIEWPORTS: ViewportPreset[] = [
  {
    id: 'desktop',
    label: 'Desktop',
    referenceSize: '1440 × 900',
    defaultConfig: { columns: 12, gutter: 24, margin: 'fluid' },
    marginOptions: [
      { value: 'fluid', label: 'Fluid' },
      { value: '48', label: 'Fixed 48px' },
    ],
  },
  {
    id: 'tablet',
    label: 'Tablet',
    referenceSize: '834 × 1112',
    defaultConfig: { columns: 9, gutter: 24, margin: '32' },
    marginOptions: [
      { value: '32', label: '32px' },
      { value: '48', label: '48px' },
    ],
  },
  {
    id: 'mobile',
    label: 'Mobile',
    referenceSize: '390 × 844',
    defaultConfig: { columns: 4, gutter: 16, margin: '16' },
    marginOptions: [],
  },
]

const COLUMN_OPTIONS = [6, 9, 12]
const GUTTER_OPTIONS = [16, 24, 32]

// ── Device frames ─────────────────────────────────────────────────────────────

function DesktopFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full overflow-hidden rounded-[10px] border border-border bg-background shadow-sm">
      <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-3 py-2">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-border" />
          <div className="h-2.5 w-2.5 rounded-full bg-border" />
          <div className="h-2.5 w-2.5 rounded-full bg-border" />
        </div>
        <div className="mx-2 flex-1 rounded-full border border-border bg-background px-3 py-0.5 text-[11px] text-muted-foreground">
          navanta.design
        </div>
      </div>
      {children}
    </div>
  )
}

function TabletFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-[80%] min-w-[320px] max-w-[540px] overflow-hidden rounded-[20px] border border-border bg-background shadow-sm">
      <div className="flex items-center justify-between border-b border-border bg-muted/20 px-4 py-2">
        <span className="text-[10px] text-muted-foreground">9:41</span>
        <div className="h-2 w-2 rounded-full border border-border bg-muted/60" />
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-3 rounded-full bg-border" />
          <div className="h-1.5 w-1.5 rounded-full bg-border" />
          <div className="h-1.5 w-2 rounded-full bg-border" />
        </div>
      </div>
      {children}
    </div>
  )
}

function MobileFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-[38%] min-w-[190px] max-w-[260px] overflow-hidden rounded-[28px] border border-border bg-background shadow-sm">
      {/* status bar with Dynamic Island */}
      <div className="relative flex items-center justify-between bg-background px-4 pt-2 pb-1">
        <span className="text-[9px] font-medium text-foreground">9:41</span>
        {/* Dynamic Island pill */}
        <div className="absolute left-1/2 top-1.5 -translate-x-1/2 h-3.5 w-14 rounded-full bg-foreground" />
        <div className="flex items-center gap-1">
          <div className="h-1.5 w-2.5 rounded-sm bg-foreground/40" />
          <div className="h-1.5 w-1.5 rounded-full bg-foreground/40" />
          <div className="h-1.5 w-3 rounded-sm bg-foreground/40" />
        </div>
      </div>
      <div className="border-b border-border/40" />
      {children}
      {/* home indicator */}
      <div className="flex justify-center bg-background py-1.5">
        <div className="h-1 w-10 rounded-full bg-foreground/20" />
      </div>
    </div>
  )
}

// ── Device content ────────────────────────────────────────────────────────────

function DeviceContent({
  viewport,
  config,
}: {
  viewport: ViewportPreset
  config: GridConfig
}) {
  const isMobile = viewport.id === 'mobile'
  const isTablet = viewport.id === 'tablet'
  const contentHeight = isMobile ? 420 : isTablet ? 280 : 320

  // resolve actual margin px value
  const inlinePadding = config.margin === 'fluid' ? 24 : Number(config.margin)

  // content takes ~2/3 of columns, sidebar takes ~1/3 — snap to whole columns
  const sidebarCols = Math.max(1, Math.round(config.columns / 3))
  const contentCols = config.columns - sidebarCols

  // scale real values down for preview frame — ratio preserved, visually distinguishable
  const gutterScale: Record<number, number> = { 16: 4, 24: 7, 32: 12 }
  const marginScale: Record<number, number> = { 16: 6, 24: 8, 32: 10, 48: 16 }
  const previewGutter = gutterScale[config.gutter] ?? config.gutter / 3
  const previewMargin = config.margin === 'fluid' ? 8 : (marginScale[inlinePadding] ?? 12)

  const navH = 24
  const footerH = 24
  const rowGap = 6
  const paddingY = 8

  // single shared grid definition — both overlay and wireframe use this exactly
  const gridStyle = {
    gridTemplateColumns: `repeat(${config.columns}, minmax(0, 1fr))`,
    paddingInline: `${previewMargin}px`,
    columnGap: `${previewGutter}px`,
  }

  return (
    <div className="relative bg-background" style={{ height: `${contentHeight}px` }}>
      {/* grid column overlay — same grid, full available height */}
      <div
        className="absolute pointer-events-none z-10"
        style={{
          top: `${paddingY}px`,
          bottom: `${paddingY}px`,
          left: 0,
          right: 0,
          display: 'grid',
          ...gridStyle,
        }}
      >
        {Array.from({ length: config.columns }).map((_, i) => (
          <div
            key={i}
            className="rounded-[3px] border border-primary/30 bg-primary/10 opacity-80 dark:border-primary/45 dark:bg-primary/20"
          />
        ))}
      </div>

      {/* wireframe — same grid, same padding, rows via gridTemplateRows */}
      <div
        className="absolute inset-0 z-20 grid"
        style={{
          ...gridStyle,
          paddingTop: `${paddingY}px`,
          paddingBottom: `${paddingY}px`,
          rowGap: `${rowGap}px`,
          gridTemplateRows: `${navH}px 1fr ${footerH}px`,
        }}
      >
        {/* nav — full width */}
        <div
          className="rounded-[4px] border border-border bg-muted/70 px-2 text-[10px] text-muted-foreground flex items-center"
          style={{ gridColumn: '1 / -1' }}
        >
          Navigation
        </div>

        {/* content — spans contentCols */}
        <div
          className="rounded-[4px] border border-border bg-muted/40 px-2 py-1 text-[10px] text-muted-foreground"
          style={{ gridColumn: `1 / span ${contentCols}`, gridRow: 2 }}
        >
          Content
        </div>

        {/* sidebar — spans sidebarCols */}
        {!isMobile && (
          <div
            className="rounded-[4px] border border-border bg-muted/50 px-2 py-1 text-[10px] text-muted-foreground"
            style={{ gridColumn: `${contentCols + 1} / -1`, gridRow: 2 }}
          >
            Sidebar
          </div>
        )}

        {/* footer — full width */}
        <div
          className="rounded-[4px] border border-border bg-muted/40 px-2 text-[10px] text-muted-foreground flex items-center"
          style={{ gridColumn: '1 / -1', gridRow: 3 }}
        >
          Footer
        </div>
      </div>
    </div>
  )
}

// ── Main showcase ─────────────────────────────────────────────────────────────

export function GridLayoutShowcase() {
  const [activeViewport, setActiveViewport] = useState<ViewportKey>('desktop')

  useEffect(() => {
    if (window.innerWidth < 768) setActiveViewport('mobile')
  }, [])

  const [configs, setConfigs] = useState<Record<ViewportKey, GridConfig>>({
    desktop: VIEWPORTS[0].defaultConfig,
    tablet: VIEWPORTS[1].defaultConfig,
    mobile: VIEWPORTS[2].defaultConfig,
  })

  const viewport = VIEWPORTS.find((v) => v.id === activeViewport)!
  const config = configs[activeViewport]

  function updateConfig(key: keyof GridConfig, value: number | MarginValue) {
    setConfigs((prev) => ({ ...prev, [activeViewport]: { ...prev[activeViewport], [key]: value } }))
  }

  function reset() {
    setConfigs((prev) => ({ ...prev, [activeViewport]: viewport.defaultConfig }))
  }

  return (
    <div className="overflow-hidden rounded-[10px] border border-border bg-background">
      {/* tab switcher row */}
      <div className="bg-muted/30 px-4 py-2.5 border-b border-border">
        <Tabs
          tabs={VIEWPORTS.map((v) => ({ id: v.id, label: v.label }))}
          activeTab={activeViewport}
          onChange={(id) => setActiveViewport(id as ViewportKey)}
          variant="pills"
          size="sm"
        />
      </div>
      {/* dropdowns row */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/30 px-4 py-2.5">
          <div className="flex flex-wrap items-center gap-2">
          {/* columns */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-muted-foreground">Columns</span>
            <Select value={String(config.columns)} onValueChange={(v) => updateConfig('columns', Number(v))} disabled={activeViewport === 'mobile'}>
              <SelectTrigger className="h-7 w-16 text-[12px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {activeViewport === 'mobile'
                  ? <SelectItem value="4">4</SelectItem>
                  : COLUMN_OPTIONS.map((c) => (
                      <SelectItem key={c} value={String(c)}>{c}</SelectItem>
                    ))
                }
              </SelectContent>
            </Select>
          </div>

          {/* gutter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-muted-foreground">Gutter</span>
            <Select value={String(config.gutter)} onValueChange={(v) => updateConfig('gutter', Number(v))} disabled={activeViewport === 'mobile'}>
              <SelectTrigger className="h-7 w-20 text-[12px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {activeViewport === 'mobile'
                  ? <SelectItem value="16">16px</SelectItem>
                  : GUTTER_OPTIONS.map((g) => (
                      <SelectItem key={g} value={String(g)}>{g}px</SelectItem>
                    ))
                }
              </SelectContent>
            </Select>
          </div>

          {/* margin */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-muted-foreground">Margin</span>
            <Select value={activeViewport === 'mobile' ? '16' : config.margin} onValueChange={(v) => updateConfig('margin', v as MarginValue)} disabled={activeViewport === 'mobile'}>
              <SelectTrigger className="h-7 w-28 text-[12px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {activeViewport === 'mobile'
                  ? <SelectItem value="16">16px</SelectItem>
                  : viewport.marginOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))
                }
              </SelectContent>
            </Select>
          </div>
        </div>
        {activeViewport !== 'mobile' && (
          <button
            onClick={reset}
            className="rounded-md border border-border px-2.5 py-1 text-[11px] text-muted-foreground hover:bg-muted/30 transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      {/* preview area */}
      <div className="bg-background p-6">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-medium text-foreground">{viewport.label}</span>
            <span className="text-[11px] text-muted-foreground">{viewport.referenceSize}</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span>{config.columns} cols</span>
            <span>{config.gutter}px gutter</span>
            <span>{config.margin === 'fluid' ? 'fluid margin' : `${config.margin}px margin`}</span>
          </div>
        </div>

        {activeViewport === 'desktop' && (
          <DesktopFrame><DeviceContent viewport={viewport} config={config} /></DesktopFrame>
        )}
        {activeViewport === 'tablet' && (
          <TabletFrame><DeviceContent viewport={viewport} config={config} /></TabletFrame>
        )}
        {activeViewport === 'mobile' && (
          <MobileFrame><DeviceContent viewport={viewport} config={config} /></MobileFrame>
        )}
      </div>
    </div>
  )
}
