'use client'

import * as React from 'react'
import { Info, Minus, TrendDown, TrendUp } from '@phosphor-icons/react'
import { cn } from '../utils/cn'
import { Tooltip } from './Tooltip'

export type KpiTrendDirection = 'up' | 'down' | 'neutral'
/** @deprecated Layout switching was removed — KPI cards are always the vertical stack. */
export type KpiCardLayout = 'auto' | 'default' | 'compact'

export interface KpiGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3 | 4
}

const KpiGrid = React.forwardRef<HTMLDivElement, KpiGridProps>(
  ({ className, columns = 4, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'grid gap-3',
        columns === 1 && 'grid-cols-1',
        columns === 2 && 'grid-cols-1 sm:grid-cols-2',
        columns === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        columns === 4 && 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4',
        className
      )}
      {...props}
    />
  )
)
KpiGrid.displayName = 'KpiGrid'

export interface KpiTrendBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  direction?: KpiTrendDirection
}

const KpiTrendBadge = React.forwardRef<HTMLSpanElement, KpiTrendBadgeProps>(
  ({ className, direction = 'neutral', children, ...props }, ref) => {
    const toneClass =
      direction === 'up'
        ? 'bg-[#E0F6EFCC] text-[#18181B] dark:bg-success/20 dark:text-foreground'
        : direction === 'down'
          ? 'bg-destructive/15 text-[#18181B] dark:bg-destructive/20 dark:text-foreground'
          : 'bg-muted text-muted-foreground'
    const iconClass =
      direction === 'up'
        ? 'text-[#14984A] dark:text-success'
        : direction === 'down'
          ? 'text-destructive'
          : 'text-muted-foreground'
    const DirectionIcon = direction === 'up' ? TrendUp : direction === 'down' ? TrendDown : Minus

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex h-[30px] items-center gap-1 rounded-[8px] px-3 py-1 text-[14px] font-normal leading-[1.5]',
          toneClass,
          className
        )}
        {...props}
      >
        <DirectionIcon aria-hidden="true" className={cn('size-4 shrink-0', iconClass)} weight="bold" />
        {children}
      </span>
    )
  }
)
KpiTrendBadge.displayName = 'KpiTrendBadge'

type KpiCardBaseProps = React.HTMLAttributes<HTMLDivElement> & {
  title: string
  value: string
  subtitle?: string
  icon?: React.ReactNode
}

export interface KpiStatCardProps extends KpiCardBaseProps {
  change?: string
  trend?: KpiTrendDirection
  sparkline?: React.ReactNode
  /**
   * Show the standard info icon beside the title. Pass a string to attach a tooltip.
   * The icon is always the standard `Info` glyph and cannot be replaced (same contract
   * as the breakdown/progress cards). Prefer this over the legacy freeform `icon` slot.
   */
  info?: boolean | string
  /** @deprecated The card is now always the breakdown-style vertical stack. */
  layout?: KpiCardLayout
  /** @deprecated No longer used — the card no longer switches layout by width. */
  compactAt?: number
}

/**
 * KpiStatCard — the breakdown-card composition (title + optional standard info icon,
 * HERO value hugging the title, token frame) with the up/down/neutral trend badge
 * kept intact, bottom-pinned where the other variants put their detail block.
 */
const KpiStatCard = React.forwardRef<HTMLDivElement, KpiStatCardProps>(
  (
    {
      className,
      title,
      value,
      subtitle,
      icon,
      info,
      change,
      trend = 'neutral',
      sparkline,
      layout: _layout,
      compactAt: _compactAt,
      ...props
    },
    ref
  ) => {
    const currencyMatch = value.match(/^([$€£₹])(.+)$/)
    const currencySymbol = currencyMatch?.[1]
    const currencyValue = currencyMatch?.[2]
    // HERO value in the breakdown card's style (28px, currency symbol raised at 16px).
    const valueNode = currencySymbol && currencyValue ? (
      <div className="inline-flex items-start">
        <span className="pt-[3px] text-[16px] font-semibold leading-[1.33] tracking-[-0.02em] text-foreground">
          {currencySymbol}
        </span>
        <span className="text-[28px] font-semibold leading-[1.14] tracking-[-0.02em] text-foreground">
          {currencyValue}
        </span>
      </div>
    ) : (
      <p className="text-[28px] font-semibold leading-[1.14] tracking-[-0.02em] text-foreground">
        {value}
      </p>
    )

    return (
      <div
        ref={ref}
        className={cn(
          'flex min-h-[var(--kpi-card-min-h,128px)] w-full flex-col items-start rounded-[8px] bg-card p-[var(--kpi-card-pad,16px)] text-card-foreground shadow-[0px_0px_1px_0px_rgba(0,0,0,0.25),0px_1px_4px_0px_rgba(0,0,0,0.06)]',
          className
        )}
        {...props}
      >
        <div className="flex w-full items-center gap-1">
          <p className="min-w-0 truncate text-[14px] font-semibold leading-[22px] text-foreground">{title}</p>
          {info != null && info !== false && (
            <KpiInfoIcon tooltip={typeof info === 'string' ? info : undefined} />
          )}
          {icon && (
            <span className="inline-flex h-[14px] shrink-0 translate-y-[2px] items-center leading-none text-muted-foreground [&_svg]:block [&_svg]:size-[14px]">
              {icon}
            </span>
          )}
        </div>
        {/* HERO value hugs the title (--text-stack-gap) — same top cluster as the
            breakdown/progress cards. */}
        <div className="mt-[var(--text-stack-gap,4px)]">{valueNode}</div>
        {/* Trend badge (up/down growth style intact) bottom-pinned in the same zone
            the other variants use for their detail block; the badge's 30px height
            matches the progress card's detail+bar block exactly. */}
        {(change || subtitle || sparkline) && (
          // items-start so the badge HUGS its text (a flex column stretches children
          // full-width by default).
          <div className="mt-auto flex w-full flex-col items-start gap-[5px]">
            {change && <KpiTrendBadge direction={trend}>{change}</KpiTrendBadge>}
            {(subtitle || sparkline) && (
              <div className="flex w-full items-center gap-2">
                {subtitle && (
                  <span className="text-[12px] leading-[18px] text-muted-foreground">{subtitle}</span>
                )}
                {sparkline}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
)
KpiStatCard.displayName = 'KpiStatCard'

export interface KpiProgressCardProps extends KpiCardBaseProps {
  progress: number
  progressLabel?: string
  showMeta?: boolean
  tone?: 'primary' | 'success' | 'warning' | 'destructive'
  progressColor?: string
  progressGradient?: string
  /**
   * Show the standard info icon beside the title. Pass a string to attach a tooltip.
   * The icon is always the standard `Info` glyph and cannot be replaced (same contract
   * as `KpiBreakdownCard`). Prefer this over the legacy freeform `icon` slot.
   */
  info?: boolean | string
  /** @deprecated The card is now always the breakdown-style vertical stack. */
  layout?: KpiCardLayout
  /** @deprecated No longer used — the card no longer switches layout by width. */
  compactAt?: number
}

/**
 * KpiProgressCard — the breakdown-card layout (vertical stack of title + optional
 * standard info icon, big value, single-line detail) with a progress bar kept as the
 * bottom row. Shares the token-defined frame (`--kpi-card-pad`, `--kpi-card-min-h`,
 * `--kpi-stack-gap`) so it sits flush next to `KpiBreakdownCard` in a `KpiGrid`.
 */
const KpiProgressCard = React.forwardRef<HTMLDivElement, KpiProgressCardProps>(
  (
    {
      className,
      title,
      value,
      subtitle,
      icon,
      info,
      progress,
      progressLabel = 'Completion',
      showMeta = false,
      tone = 'primary',
      progressColor,
      progressGradient,
      layout: _layout,
      compactAt: _compactAt,
      ...props
    },
    ref
  ) => {
    const clamped = Math.min(100, Math.max(0, progress))
    const currencyMatch = value.match(/^([$€£₹])(.+)$/)
    const currencySymbol = currencyMatch?.[1]
    const currencyValue = currencyMatch?.[2]
    const toneClass =
      tone === 'success'
        ? 'bg-success'
        : tone === 'warning'
          ? 'bg-warning'
          : tone === 'destructive'
            ? ''
            : 'bg-primary'
    const figmaDestructiveGradient =
      'linear-gradient(to left, #DE1010 0%, rgba(222,16,16,0.4) 17.788%, rgba(222,16,16,0.4) 100%)'
    const resolvedGradient = progressGradient ?? (tone === 'destructive' ? figmaDestructiveGradient : undefined)
    const fillStyle: React.CSSProperties = {
      width: `${clamped}%`,
      ...(resolvedGradient ? { backgroundImage: resolvedGradient } : {}),
      ...(progressColor ? { backgroundColor: progressColor } : {}),
    }

    // HERO value in the breakdown card's style (28px, currency symbol raised at 16px).
    const valueNode = currencySymbol && currencyValue ? (
      <div className="inline-flex items-start">
        <span className="pt-[3px] text-[16px] font-semibold leading-[1.33] tracking-[-0.02em] text-foreground">
          {currencySymbol}
        </span>
        <span className="text-[28px] font-semibold leading-[1.14] tracking-[-0.02em] text-foreground">
          {currencyValue}
        </span>
      </div>
    ) : (
      <p className="text-[28px] font-semibold leading-[1.14] tracking-[-0.02em] text-foreground">
        {value}
      </p>
    )

    return (
      <div
        ref={ref}
        className={cn(
          // No parent gap — explicit margins keep the TOTAL height at the standard
          // token footprint (`--kpi-card-min-h`), identical to KpiBreakdownCard: a
          // third 16px gap before the bar block would push the card past it.
          'flex min-h-[var(--kpi-card-min-h,128px)] w-full flex-col items-start rounded-[8px] bg-card p-[var(--kpi-card-pad,16px)] text-card-foreground shadow-[0px_0px_1px_0px_rgba(0,0,0,0.25),0px_1px_4px_0px_rgba(0,0,0,0.06)]',
          className
        )}
        {...props}
      >
        <div className="flex w-full items-center gap-1">
          <p className="min-w-0 truncate text-[14px] font-semibold leading-[22px] text-foreground">{title}</p>
          {info != null && info !== false && (
            <KpiInfoIcon tooltip={typeof info === 'string' ? info : undefined} />
          )}
          {icon && (
            <span className="inline-flex h-[14px] shrink-0 translate-y-[2px] items-center leading-none text-muted-foreground [&_svg]:block [&_svg]:size-[14px]">
              {icon}
            </span>
          )}
        </div>
        {/* Value hugs the title (the standard --text-stack-gap body↔label spacing) so
            the top reads as ONE cluster; the freed space flows to the bottom block. */}
        <div className="mt-[var(--text-stack-gap,4px)]">{valueNode}</div>
        {/* Detail line + bar read as ONE block (tight 5px gap), PINNED to the card's
            bottom (`mt-auto`) — the card holds the token height instead of growing. */}
        <div className="mt-auto flex w-full flex-col gap-[5px]">
          {subtitle && (
            <p className="w-full truncate text-[12px] leading-[18px] text-muted-foreground" title={subtitle}>
              {subtitle}
            </p>
          )}
          <div className="h-[7px] w-full overflow-hidden rounded-[100px] bg-[#E0E0E0] dark:bg-muted">
            <div
              className={cn(
                'h-full rounded-l-[2px] rounded-r-[100px] transition-[width]',
                !resolvedGradient && !progressColor && toneClass
              )}
              style={fillStyle}
            />
          </div>
          {showMeta && (
            <div className="mt-1 flex w-full items-center justify-between text-[13px] text-muted-foreground">
              <span>{progressLabel}</span>
              <span>{Math.round(clamped)}%</span>
            </div>
          )}
        </div>
      </div>
    )
  }
)
KpiProgressCard.displayName = 'KpiProgressCard'

export interface KpiComparisonCardProps extends KpiCardBaseProps {
  currentLabel?: string
  previousLabel?: string
  previousValue: string
  change?: string
  trend?: KpiTrendDirection
}

const KpiComparisonCard = React.forwardRef<HTMLDivElement, KpiComparisonCardProps>(
  (
    {
      className,
      title,
      value,
      subtitle,
      icon,
      currentLabel = 'Current',
      previousLabel = 'Previous',
      previousValue,
      change,
      trend = 'neutral',
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        'flex w-full flex-col rounded-[8px] bg-card p-4 text-card-foreground shadow-[0px_0px_1px_0px_rgba(0,0,0,0.25),0px_1px_4px_0px_rgba(0,0,0,0.06)]',
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="inline-flex items-center gap-1">
          <p className="text-[14px] font-semibold leading-[1.5] text-foreground">{title}</p>
          {icon && (
            <span className="inline-flex h-[14px] translate-y-[2px] items-center leading-none text-muted-foreground [&_svg]:size-[14px]">
              {icon}
            </span>
          )}
        </div>
        <div className="mt-[1px] inline-flex h-[25px] items-start">
          <p className="text-[22px] font-semibold leading-[1.14] tracking-[-0.02em] text-foreground">{value}</p>
        </div>
      </div>

      <div className="mt-4 grid h-[60px] grid-rows-2 gap-0">
        <div className="flex h-[30px] items-end">
          {change ? (
            <KpiTrendBadge direction={trend}>{change}</KpiTrendBadge>
          ) : (
            <span className="text-[13px] leading-[1.42] tracking-[0.01em] text-muted-foreground">
              {currentLabel}
            </span>
          )}
        </div>
        <div className="flex h-[30px] items-center justify-between text-[13px] leading-[1.42] tracking-[0.01em]">
          <span className="text-muted-foreground">{previousLabel}</span>
          <span className="font-medium text-foreground">{previousValue}</span>
        </div>
      </div>

      {subtitle && (
        <div className="mt-1">
          <span className="text-[13px] leading-[1.42] tracking-[0.01em] text-muted-foreground">{subtitle}</span>
        </div>
      )}
    </div>
  )
)
KpiComparisonCard.displayName = 'KpiComparisonCard'

/**
 * KpiInfoIcon — the standard KPI info affordance. Always the Phosphor `Info` glyph at
 * 14px (it is intentionally NOT a freeform icon slot — the info icon must stay standard
 * and is not swappable). Pass a string to wrap it in a tooltip.
 */
function KpiInfoIcon({ tooltip }: { tooltip?: string }) {
  const glyph = (
    <span className="inline-flex h-[14px] shrink-0 translate-y-[2px] items-center leading-none text-muted-foreground [&_svg]:block [&_svg]:size-[14px]">
      <Info size={14} weight="regular" aria-hidden={tooltip ? undefined : true} aria-label={tooltip} />
    </span>
  )
  return tooltip ? <Tooltip content={tooltip}>{glyph}</Tooltip> : glyph
}

export interface KpiBreakdownCardProps extends Omit<KpiCardBaseProps, 'icon'> {
  /**
   * Breakdown/detail line under the value (e.g. "32 DOS · 12 SS · 3 service level").
   * Clamped to a single line — keep it short; overflow is truncated with an ellipsis.
   */
  subtitle?: string
  /**
   * Show the standard info icon beside the title. Pass a string to attach a tooltip.
   * The icon is always the standard `Info` glyph and cannot be replaced.
   */
  info?: boolean | string
}

/**
 * KpiBreakdownCard — the simplest KPI: a vertical stack of title (+ optional standard
 * info icon), the big value, and a single-line breakdown/detail line in primary text
 * (e.g. "32 DOS · 12 SS · 3 service level"). No trend badge or progress bar.
 * (Figma: Iris-Shareable, node 321-4023.) The breakdown line is `subtitle`.
 *
 * Spacing/height are token-defined (`--kpi-card-pad`, `--kpi-card-min-h`,
 * `--kpi-stack-gap`) so the card keeps a consistent footprint in a `KpiGrid`; the
 * single-line title + breakdown keep the height stable regardless of content length.
 */
const KpiBreakdownCard = React.forwardRef<HTMLDivElement, KpiBreakdownCardProps>(
  ({ className, title, value, subtitle, info, ...props }, ref) => {
    const currencyMatch = value.match(/^([$€£₹])(.+)$/)
    const currencySymbol = currencyMatch?.[1]
    const currencyValue = currencyMatch?.[2]
    const valueNode = currencySymbol && currencyValue ? (
      <div className="inline-flex items-start">
        <span className="pt-[3px] text-[16px] font-semibold leading-[1.33] tracking-[-0.02em] text-foreground">
          {currencySymbol}
        </span>
        <span className="text-[28px] font-semibold leading-[1.14] tracking-[-0.02em] text-foreground">
          {currencyValue}
        </span>
      </div>
    ) : (
      <p className="text-[28px] font-semibold leading-[1.14] tracking-[-0.02em] text-foreground">
        {value}
      </p>
    )

    return (
      <div
        ref={ref}
        className={cn(
          // No parent gap — title→value uses the stack-gap token, and the detail line is
          // PINNED to the bottom (`mt-auto`), so the card clamps to EXACTLY the
          // `--kpi-card-min-h` footprint (fixed gaps overshot it by ~1px and made the
          // card 1px taller than the progress card).
          'flex min-h-[var(--kpi-card-min-h,128px)] w-full flex-col items-start rounded-[8px] bg-card p-[var(--kpi-card-pad,16px)] text-card-foreground shadow-[0px_0px_1px_0px_rgba(0,0,0,0.25),0px_1px_4px_0px_rgba(0,0,0,0.06)]',
          className
        )}
        {...props}
      >
        <div className="flex w-full items-center gap-1">
          <p className="min-w-0 truncate text-[14px] font-semibold leading-[22px] text-foreground">{title}</p>
          {info != null && info !== false && (
            <KpiInfoIcon tooltip={typeof info === 'string' ? info : undefined} />
          )}
        </div>
        {/* HERO value hugs the title (--text-stack-gap): the 28px number carries the
            card's vertical mass so the breakdown never reads as empty space. */}
        <div className="mt-[var(--text-stack-gap,4px)]">{valueNode}</div>
        {/* Detail line sits FLUSH at the card bottom (only the card pad below it) in
            muted secondary text — no reserved bar zone, no phantom gap under the line. */}
        {subtitle && (
          <p
            className="mt-auto w-full truncate text-[12px] leading-[18px] text-muted-foreground"
            title={subtitle}
          >
            {subtitle}
          </p>
        )}
      </div>
    )
  }
)
KpiBreakdownCard.displayName = 'KpiBreakdownCard'

export {
  KpiGrid,
  KpiTrendBadge,
  KpiStatCard,
  KpiProgressCard,
  KpiComparisonCard,
  KpiBreakdownCard,
}
