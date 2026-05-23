'use client'

import * as React from 'react'
import { Minus, TrendDown, TrendUp } from '@phosphor-icons/react'
import { cn } from '../utils/cn'

export type KpiTrendDirection = 'up' | 'down' | 'neutral'
export type KpiCardLayout = 'auto' | 'default' | 'compact'

const DEFAULT_KPI_COMPACT_AT = 280

function assignRef<T>(ref: React.ForwardedRef<T>, value: T | null) {
  if (typeof ref === 'function') {
    ref(value)
  } else if (ref) {
    ;(ref as React.MutableRefObject<T | null>).current = value
  }
}

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
  layout?: KpiCardLayout
  compactAt?: number
}

const KpiStatCard = React.forwardRef<HTMLDivElement, KpiStatCardProps>(
  (
    {
      className,
      title,
      value,
      subtitle,
      icon,
      change,
      trend = 'neutral',
      sparkline,
      layout = 'auto',
      compactAt = DEFAULT_KPI_COMPACT_AT,
      ...props
    },
    ref
  ) => {
    const cardRef = React.useRef<HTMLDivElement | null>(null)
    const [isAutoCompact, setIsAutoCompact] = React.useState(false)

    React.useEffect(() => {
      if (layout !== 'auto') return
      const node = cardRef.current
      if (!node) return

      const update = (width?: number) => {
        const nextWidth = width ?? node.getBoundingClientRect().width
        setIsAutoCompact(nextWidth <= compactAt)
      }

      update()
      const observer = new ResizeObserver((entries) => {
        const entry = entries[0]
        update(entry?.contentRect.width)
      })
      observer.observe(node)
      return () => observer.disconnect()
    }, [layout, compactAt])

    const isCompact = layout === 'compact' || (layout === 'auto' && isAutoCompact)
    const currencyMatch = value.match(/^([$€£₹])(.+)$/)
    const currencySymbol = currencyMatch?.[1]
    const currencyValue = currencyMatch?.[2]
    const valueNode = currencySymbol && currencyValue ? (
      <div className="mt-[1px] inline-flex h-[25px] items-start">
        <span className="pt-[2px] text-[14px] font-semibold leading-[1.33] tracking-[-0.02em] text-foreground">
          {currencySymbol}
        </span>
        <span className="-translate-y-[0.5px] text-[22px] font-semibold leading-[1.14] tracking-[-0.02em] text-foreground">
          {currencyValue}
        </span>
      </div>
    ) : (
      <div className="mt-[1px] inline-flex h-[25px] items-start">
        <p className="-translate-y-[0.5px] text-[22px] font-semibold leading-[1.14] tracking-[-0.02em] text-foreground">
          {value}
        </p>
      </div>
    )

    return (
      <div
        ref={(node) => {
          cardRef.current = node
          assignRef(ref, node)
        }}
        className={cn(
          'mx-auto flex w-full max-w-[320px] flex-col rounded-[8px] bg-card p-4 text-card-foreground shadow-[0px_0px_1px_0px_rgba(0,0,0,0.25),0px_1px_4px_0px_rgba(0,0,0,0.06)]',
          className
        )}
        {...props}
      >
        <div
          className={cn(
            'gap-3',
            isCompact ? 'flex flex-col items-start' : 'flex items-start justify-between'
          )}
        >
          <div className="inline-flex items-center gap-1">
            <p className="text-[14px] font-semibold leading-[1.5] text-foreground">{title}</p>
            {icon && (
              <span className="inline-flex h-[14px] translate-y-[2px] items-center leading-none text-muted-foreground [&_svg]:block [&_svg]:size-[14px]">
                {icon}
              </span>
            )}
          </div>
          {valueNode}
        </div>

        {(change || subtitle || sparkline) && (
          <div
            className={cn(
              'mt-4 grid gap-0',
              subtitle || sparkline ? 'h-[60px] grid-rows-2' : 'h-[30px] grid-rows-1'
            )}
          >
            <div className="flex h-[30px] items-end">
              {change && <KpiTrendBadge direction={trend}>{change}</KpiTrendBadge>}
            </div>
            {(subtitle || sparkline) && (
              <div className="flex h-[30px] items-center">
                {subtitle && <span className="text-[13px] text-muted-foreground">{subtitle}</span>}
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
  layout?: KpiCardLayout
  compactAt?: number
}

const KpiProgressCard = React.forwardRef<HTMLDivElement, KpiProgressCardProps>(
  (
    {
      className,
      title,
      value,
      subtitle,
      icon,
      progress,
      progressLabel = 'Completion',
      showMeta = false,
      tone = 'primary',
      progressColor,
      progressGradient,
      layout = 'auto',
      compactAt = DEFAULT_KPI_COMPACT_AT,
      ...props
    },
    ref
  ) => {
    const cardRef = React.useRef<HTMLDivElement | null>(null)
    const [isAutoCompact, setIsAutoCompact] = React.useState(false)

    React.useEffect(() => {
      if (layout !== 'auto') return
      const node = cardRef.current
      if (!node) return

      const update = (width?: number) => {
        const nextWidth = width ?? node.getBoundingClientRect().width
        setIsAutoCompact(nextWidth <= compactAt)
      }

      update()
      const observer = new ResizeObserver((entries) => {
        const entry = entries[0]
        update(entry?.contentRect.width)
      })
      observer.observe(node)
      return () => observer.disconnect()
    }, [layout, compactAt])

    const isCompact = layout === 'compact' || (layout === 'auto' && isAutoCompact)
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

    const valueNode = currencySymbol && currencyValue ? (
      <div className="mt-[1px] inline-flex h-[25px] items-start">
        <span className="pt-[2px] text-[14px] font-semibold leading-[1.33] tracking-[-0.02em] text-foreground">
          {currencySymbol}
        </span>
        <span className="-translate-y-[0.5px] text-[22px] font-semibold leading-[1.14] tracking-[-0.02em] text-foreground">
          {currencyValue}
        </span>
      </div>
    ) : (
      <div className="mt-[1px] inline-flex h-[25px] items-start">
        <p className="-translate-y-[0.5px] text-[22px] font-semibold leading-[1.14] tracking-[-0.02em] text-foreground">
          {value}
        </p>
      </div>
    )

    return (
      <div
        ref={(node) => {
          cardRef.current = node
          assignRef(ref, node)
        }}
        className={cn(
          'mx-auto flex w-full max-w-[320px] flex-col rounded-[8px] bg-card p-4 text-card-foreground shadow-[0px_0px_1px_0px_rgba(0,0,0,0.25),0px_1px_4px_0px_rgba(0,0,0,0.06)]',
          className
        )}
        {...props}
      >
        <div
          className={cn(
            'gap-3',
            isCompact ? 'flex flex-col items-start' : 'flex items-start justify-between'
          )}
        >
          <div className="inline-flex items-center gap-1">
            <p className="text-[14px] font-semibold leading-[1.5] text-foreground">{title}</p>
            {icon && (
              <span className="inline-flex h-[14px] translate-y-[2px] items-center leading-none text-muted-foreground [&_svg]:block [&_svg]:size-[14px]">
                {icon}
              </span>
            )}
          </div>
          {valueNode}
        </div>

        <div className="mt-4 flex h-[30px] flex-col gap-[5px]">
          <div className="h-[18px]">
            {subtitle && (
              <p className="truncate text-[13px] leading-[18px] tracking-[0.01em] text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className="flex h-[7px] items-center">
            <div className="h-[7px] w-full overflow-hidden rounded-[100px] bg-[#E0E0E0] dark:bg-muted">
              <div
                className={cn(
                  'h-full rounded-l-[2px] rounded-r-[100px] transition-[width]',
                  !resolvedGradient && !progressColor && toneClass
                )}
                style={fillStyle}
              />
            </div>
          </div>
          {showMeta && (
            <div className="mt-1 flex items-center justify-between text-[13px] text-muted-foreground">
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
        'mx-auto flex w-full max-w-[320px] flex-col rounded-[8px] bg-card p-4 text-card-foreground shadow-[0px_0px_1px_0px_rgba(0,0,0,0.25),0px_1px_4px_0px_rgba(0,0,0,0.06)]',
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

export {
  KpiGrid,
  KpiTrendBadge,
  KpiStatCard,
  KpiProgressCard,
  KpiComparisonCard,
}
