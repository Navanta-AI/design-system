"use client"

import * as React from 'react'
import { cn } from '../utils/cn'

export type ChartDatum = {
  label: string
  value: number
}

export type StackedChartSegment = {
  label: string
  value: number
  color?: string
}

export type StackedChartDatum = {
  label: string
  segments: StackedChartSegment[]
}

type Point = {
  x: number
  y: number
  label: string
  value: number
}

const CHART_WIDTH = 640
const CHART_PADDING = {
  top: 16,
  right: 16,
  bottom: 32,
  left: 40,
} as const

function getSafeData(data: ChartDatum[]) {
  const normalized = data
    .map((item) => ({
      label: String(item.label ?? ''),
      value: Number.isFinite(item.value) ? Math.max(0, item.value) : 0,
    }))
    .filter((item) => item.label.length > 0)

  if (normalized.length > 0) return normalized
  return [{ label: 'N/A', value: 0 }]
}

function createYTicks(maxValue: number, tickCount: number) {
  const safeTickCount = Math.max(2, tickCount)
  return Array.from({ length: safeTickCount }, (_, index) => {
    const ratio = index / (safeTickCount - 1)
    const value = maxValue * (1 - ratio)
    return { ratio, value }
  })
}

function buildLinePath(points: Point[]) {
  if (points.length === 0) return ''
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`

  return points.reduce((acc, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`
    return `${acc} L ${point.x} ${point.y}`
  }, '')
}

function buildSmoothPath(points: Point[]) {
  if (points.length === 0) return ''
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`

  return points.reduce((acc, point, index, arr) => {
    if (index === 0) return `M ${point.x} ${point.y}`
    const prev = arr[index - 1]
    const deltaX = point.x - prev.x
    const cp1x = prev.x + deltaX / 3
    const cp2x = prev.x + (2 * deltaX) / 3
    return `${acc} C ${cp1x} ${prev.y}, ${cp2x} ${point.y}, ${point.x} ${point.y}`
  }, '')
}

function buildAreaPath(linePath: string, points: Point[], baselineY: number) {
  if (!linePath || points.length === 0) return ''
  const first = points[0]
  const last = points[points.length - 1]
  return `${linePath} L ${last.x} ${baselineY} L ${first.x} ${baselineY} Z`
}

export interface BarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: ChartDatum[]
  height?: number
  maxValue?: number
  showGrid?: boolean
  showXAxisLabels?: boolean
  showYAxisLabels?: boolean
  showValueLabels?: boolean
  yTickCount?: number
  color?: string
  barRadius?: number
  accessibilityMode?: 'default' | 'colorblind-safe'
  formatValue?: (value: number) => string
}

export const BarChart = React.forwardRef<HTMLDivElement, BarChartProps>(
  (
    {
      className,
      data,
      height = 220,
      maxValue,
      showGrid = true,
      showXAxisLabels = true,
      showYAxisLabels = true,
      showValueLabels = false,
      yTickCount = 5,
      color = 'var(--chart-2)',
      barRadius = 6,
      accessibilityMode = 'default',
      formatValue = (value) => value.toString(),
      ...props
    },
    ref
  ) => {
    const patternBaseId = React.useId().replace(/:/g, '')
    const isColorblindSafe = accessibilityMode === 'colorblind-safe'
    const safeData = getSafeData(data)
    const computedMax = Math.max(1, maxValue ?? Math.max(...safeData.map((item) => item.value), 0))
    const plotWidth = CHART_WIDTH - CHART_PADDING.left - CHART_PADDING.right
    const plotHeight = Math.max(72, height - CHART_PADDING.top - CHART_PADDING.bottom)
    const slotWidth = plotWidth / safeData.length
    const barWidth = Math.max(10, slotWidth * 0.62)
    const ticks = createYTicks(computedMax, yTickCount)

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        <svg
          className="h-full w-full overflow-visible"
          style={{ height }}
          viewBox={`0 0 ${CHART_WIDTH} ${height}`}
          role="img"
          aria-label="Bar chart"
        >
          {isColorblindSafe && (
            <defs>
              <pattern id={`bar-pattern-a-${patternBaseId}`} width="6" height="6" patternUnits="userSpaceOnUse">
                <path d="M0 0 L6 6" stroke="var(--foreground)" strokeWidth="0.8" opacity="0.35" />
              </pattern>
              <pattern id={`bar-pattern-b-${patternBaseId}`} width="6" height="6" patternUnits="userSpaceOnUse">
                <path d="M6 0 L0 6" stroke="var(--foreground)" strokeWidth="0.8" opacity="0.35" />
              </pattern>
              <pattern id={`bar-pattern-c-${patternBaseId}`} width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M0 4 L8 4" stroke="var(--foreground)" strokeWidth="0.9" opacity="0.4" />
              </pattern>
              <pattern id={`bar-pattern-d-${patternBaseId}`} width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M4 0 L4 8" stroke="var(--foreground)" strokeWidth="0.9" opacity="0.4" />
              </pattern>
            </defs>
          )}

          {showGrid &&
            ticks.map((tick) => {
              const y = CHART_PADDING.top + plotHeight * tick.ratio
              return (
                <g key={tick.ratio}>
                  <line
                    x1={CHART_PADDING.left}
                    x2={CHART_WIDTH - CHART_PADDING.right}
                    y1={y}
                    y2={y}
                    stroke="var(--border)"
                    strokeWidth={1}
                  />
                  {showYAxisLabels && (
                    <text
                      x={CHART_PADDING.left - 8}
                      y={y + 4}
                      textAnchor="end"
                      fontSize={11}
                      fill="var(--muted-foreground)"
                    >
                      {formatValue(Math.round(tick.value))}
                    </text>
                  )}
                </g>
              )
            })}

          {safeData.map((item, index) => {
            const x = CHART_PADDING.left + index * slotWidth + (slotWidth - barWidth) / 2
            const ratio = item.value / computedMax
            const barHeight = ratio * plotHeight
            const y = CHART_PADDING.top + (plotHeight - barHeight)
            const barTopRadius = Math.min(barRadius, barWidth / 2, barHeight / 2)
            const barPath = `M ${x} ${y + barTopRadius}
              Q ${x} ${y} ${x + barTopRadius} ${y}
              L ${x + barWidth - barTopRadius} ${y}
              Q ${x + barWidth} ${y} ${x + barWidth} ${y + barTopRadius}
              L ${x + barWidth} ${CHART_PADDING.top + plotHeight}
              L ${x} ${CHART_PADDING.top + plotHeight}
              Z`
            const patternIndex = index % 4
            const patternId =
              patternIndex === 0
                ? `bar-pattern-a-${patternBaseId}`
                : patternIndex === 1
                  ? `bar-pattern-b-${patternBaseId}`
                  : patternIndex === 2
                    ? `bar-pattern-c-${patternBaseId}`
                    : `bar-pattern-d-${patternBaseId}`

            return (
              <g key={`${item.label}-${index}`}>
                <path
                  d={barPath}
                  fill={color}
                />
                {isColorblindSafe && (
                  <>
                    <path d={barPath} fill={`url(#${patternId})`} />
                    <path d={barPath} fill="none" stroke="var(--foreground)" strokeOpacity="0.45" strokeWidth={1} />
                  </>
                )}

                {showValueLabels && (
                  <text
                    x={x + barWidth / 2}
                    y={Math.max(CHART_PADDING.top + 10, y - 6)}
                    textAnchor="middle"
                    fontSize={11}
                    fill="var(--foreground)"
                  >
                    {formatValue(item.value)}
                  </text>
                )}

                {showXAxisLabels && (
                  <text
                    x={x + barWidth / 2}
                    y={CHART_PADDING.top + plotHeight + 18}
                    textAnchor="middle"
                    fontSize={11}
                    fill="var(--muted-foreground)"
                  >
                    {item.label}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>
    )
  }
)

BarChart.displayName = 'BarChart'

export interface StackedBarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: StackedChartDatum[]
  height?: number
  maxValue?: number
  showGrid?: boolean
  showXAxisLabels?: boolean
  showYAxisLabels?: boolean
  showTotals?: boolean
  showLegend?: boolean
  yTickCount?: number
  barRadius?: number
  accessibilityMode?: 'default' | 'colorblind-safe'
  formatValue?: (value: number) => string
}

const DEFAULT_STACK_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--chart-6)',
]

const STACK_PATTERN_IDS = ['a', 'b', 'c', 'd', 'e', 'f'] as const
const LEGEND_PATTERN_BACKGROUNDS = [
  'repeating-linear-gradient(45deg, color-mix(in srgb, var(--foreground) 45%, transparent) 0 1px, transparent 1px 4px)',
  'repeating-linear-gradient(-45deg, color-mix(in srgb, var(--foreground) 45%, transparent) 0 1px, transparent 1px 4px)',
  'repeating-linear-gradient(0deg, color-mix(in srgb, var(--foreground) 45%, transparent) 0 1px, transparent 1px 4px)',
  'repeating-linear-gradient(90deg, color-mix(in srgb, var(--foreground) 45%, transparent) 0 1px, transparent 1px 4px)',
  'repeating-linear-gradient(0deg, color-mix(in srgb, var(--foreground) 35%, transparent) 0 1px, transparent 1px 5px)',
  'repeating-linear-gradient(90deg, color-mix(in srgb, var(--foreground) 35%, transparent) 0 1px, transparent 1px 5px)',
]

export const StackedBarChart = React.forwardRef<HTMLDivElement, StackedBarChartProps>(
  (
    {
      className,
      data,
      height = 240,
      maxValue,
      showGrid = true,
      showXAxisLabels = true,
      showYAxisLabels = true,
      showTotals = false,
      showLegend = true,
      yTickCount = 5,
      barRadius = 6,
      accessibilityMode = 'default',
      formatValue = (value) => value.toString(),
      ...props
    },
    ref
  ) => {
    const patternBaseId = React.useId().replace(/:/g, '')
    const isColorblindSafe = accessibilityMode === 'colorblind-safe'
    const safeData = data.length > 0 ? data : [{ label: 'N/A', segments: [{ label: 'Total', value: 0 }] }]
    const totals = safeData.map((item) =>
      item.segments.reduce((acc, segment) => acc + Math.max(0, Number.isFinite(segment.value) ? segment.value : 0), 0)
    )
    const computedMax = Math.max(1, maxValue ?? Math.max(...totals, 0))
    const plotWidth = CHART_WIDTH - CHART_PADDING.left - CHART_PADDING.right
    const plotHeight = Math.max(84, height - CHART_PADDING.top - CHART_PADDING.bottom)
    const slotWidth = plotWidth / safeData.length
    const barWidth = Math.max(14, slotWidth * 0.62)
    const ticks = createYTicks(computedMax, yTickCount)

    const legendMap = new Map<string, string>()
    safeData.forEach((item) => {
      item.segments.forEach((segment, segmentIndex) => {
        if (!legendMap.has(segment.label)) {
          legendMap.set(segment.label, segment.color ?? DEFAULT_STACK_COLORS[segmentIndex % DEFAULT_STACK_COLORS.length])
        }
      })
    })
    const legendEntries = Array.from(legendMap.entries())

    return (
      <div ref={ref} className={cn('w-full space-y-2', className)} {...props}>
        <svg
          className="h-full w-full overflow-visible"
          style={{ height }}
          viewBox={`0 0 ${CHART_WIDTH} ${height}`}
          role="img"
          aria-label="Stacked bar chart"
        >
          {isColorblindSafe && (
            <defs>
              <pattern id={`stack-pattern-a-${patternBaseId}`} width="6" height="6" patternUnits="userSpaceOnUse">
                <path d="M0 0 L6 6" stroke="var(--foreground)" strokeWidth="0.8" opacity="0.35" />
              </pattern>
              <pattern id={`stack-pattern-b-${patternBaseId}`} width="6" height="6" patternUnits="userSpaceOnUse">
                <path d="M6 0 L0 6" stroke="var(--foreground)" strokeWidth="0.8" opacity="0.35" />
              </pattern>
              <pattern id={`stack-pattern-c-${patternBaseId}`} width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M0 4 L8 4" stroke="var(--foreground)" strokeWidth="0.9" opacity="0.4" />
              </pattern>
              <pattern id={`stack-pattern-d-${patternBaseId}`} width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M4 0 L4 8" stroke="var(--foreground)" strokeWidth="0.9" opacity="0.4" />
              </pattern>
              <pattern id={`stack-pattern-e-${patternBaseId}`} width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M0 0 L10 0 M0 5 L10 5" stroke="var(--foreground)" strokeWidth="0.8" opacity="0.35" />
              </pattern>
              <pattern id={`stack-pattern-f-${patternBaseId}`} width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M0 0 L0 10 M5 0 L5 10" stroke="var(--foreground)" strokeWidth="0.8" opacity="0.35" />
              </pattern>
            </defs>
          )}

          {showGrid &&
            ticks.map((tick) => {
              const y = CHART_PADDING.top + plotHeight * tick.ratio
              return (
                <g key={tick.ratio}>
                  <line
                    x1={CHART_PADDING.left}
                    x2={CHART_WIDTH - CHART_PADDING.right}
                    y1={y}
                    y2={y}
                    stroke="var(--border)"
                    strokeWidth={1}
                  />
                  {showYAxisLabels && (
                    <text
                      x={CHART_PADDING.left - 8}
                      y={y + 4}
                      textAnchor="end"
                      fontSize={11}
                      fill="var(--muted-foreground)"
                    >
                      {formatValue(Math.round(tick.value))}
                    </text>
                  )}
                </g>
              )
            })}

          {safeData.map((item, barIndex) => {
            const x = CHART_PADDING.left + barIndex * slotWidth + (slotWidth - barWidth) / 2
            let consumedHeight = 0
            const total = totals[barIndex]

            return (
              <g key={`${item.label}-${barIndex}`}>
                {item.segments.map((segment, segmentIndex) => {
                  const safeValue = Math.max(0, Number.isFinite(segment.value) ? segment.value : 0)
                  const segmentHeight = (safeValue / computedMax) * plotHeight
                  const yBottom = CHART_PADDING.top + plotHeight - consumedHeight
                  const y = yBottom - segmentHeight
                  const color = segment.color ?? DEFAULT_STACK_COLORS[segmentIndex % DEFAULT_STACK_COLORS.length]
                  const isTopVisibleSegment =
                    segmentIndex === item.segments.length - 1 || item.segments.slice(segmentIndex + 1).every((next) => next.value <= 0)
                  const topRadius = isTopVisibleSegment ? Math.min(barRadius, barWidth / 2, segmentHeight / 2) : 0
                  const path = `M ${x} ${y + topRadius}
                    Q ${x} ${y} ${x + topRadius} ${y}
                    L ${x + barWidth - topRadius} ${y}
                    Q ${x + barWidth} ${y} ${x + barWidth} ${y + topRadius}
                    L ${x + barWidth} ${yBottom}
                    L ${x} ${yBottom}
                    Z`

                  consumedHeight += segmentHeight
                  const patternKey = STACK_PATTERN_IDS[segmentIndex % STACK_PATTERN_IDS.length]
                  const patternId = `stack-pattern-${patternKey}-${patternBaseId}`

                  return (
                    <g key={`${item.label}-${segment.label}-${segmentIndex}`}>
                      <path d={path} fill={color} />
                      {isColorblindSafe && (
                        <>
                          <path d={path} fill={`url(#${patternId})`} />
                          <path d={path} fill="none" stroke="var(--foreground)" strokeOpacity="0.4" strokeWidth={0.9} />
                        </>
                      )}
                    </g>
                  )
                })}

                {showTotals && (
                  <text
                    x={x + barWidth / 2}
                    y={Math.max(CHART_PADDING.top + 10, CHART_PADDING.top + plotHeight - consumedHeight - 6)}
                    textAnchor="middle"
                    fontSize={11}
                    fill="var(--foreground)"
                  >
                    {formatValue(total)}
                  </text>
                )}

                {showXAxisLabels && (
                  <text
                    x={x + barWidth / 2}
                    y={CHART_PADDING.top + plotHeight + 18}
                    textAnchor="middle"
                    fontSize={11}
                    fill="var(--muted-foreground)"
                  >
                    {item.label}
                  </text>
                )}
              </g>
            )
          })}
        </svg>

        {showLegend && legendEntries.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            {legendEntries.map(([label, swatch], index) => {
              const legendPattern = LEGEND_PATTERN_BACKGROUNDS[index % LEGEND_PATTERN_BACKGROUNDS.length]
              return (
                <div key={label} className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span className="relative inline-flex size-3 rounded-[2px] border border-border" style={{ backgroundColor: swatch }}>
                    {isColorblindSafe && (
                      <span className="absolute inset-0 rounded-[2px]" style={{ backgroundImage: legendPattern }} />
                    )}
                  </span>
                  <span>{label}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }
)

StackedBarChart.displayName = 'StackedBarChart'

export interface LineChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: ChartDatum[]
  height?: number
  maxValue?: number
  showGrid?: boolean
  showXAxisLabels?: boolean
  showYAxisLabels?: boolean
  showPoints?: boolean
  showArea?: boolean
  smooth?: boolean
  yTickCount?: number
  lineColor?: string
  areaColor?: string
  formatValue?: (value: number) => string
}

export const LineChart = React.forwardRef<HTMLDivElement, LineChartProps>(
  (
    {
      className,
      data,
      height = 220,
      maxValue,
      showGrid = true,
      showXAxisLabels = true,
      showYAxisLabels = true,
      showPoints = true,
      showArea = true,
      smooth = true,
      yTickCount = 5,
      lineColor = 'var(--chart-3)',
      areaColor = 'var(--chart-3)',
      formatValue = (value) => value.toString(),
      ...props
    },
    ref
  ) => {
    const gradientId = React.useId().replace(/:/g, '')
    const safeData = getSafeData(data)
    const computedMax = Math.max(1, maxValue ?? Math.max(...safeData.map((item) => item.value), 0))
    const plotWidth = CHART_WIDTH - CHART_PADDING.left - CHART_PADDING.right
    const plotHeight = Math.max(72, height - CHART_PADDING.top - CHART_PADDING.bottom)
    const ticks = createYTicks(computedMax, yTickCount)

    const points: Point[] = safeData.map((item, index) => {
      const x =
        safeData.length === 1
          ? CHART_PADDING.left + plotWidth / 2
          : CHART_PADDING.left + (index / (safeData.length - 1)) * plotWidth
      const y = CHART_PADDING.top + (1 - item.value / computedMax) * plotHeight
      return { x, y, label: item.label, value: item.value }
    })

    const linePath = smooth ? buildSmoothPath(points) : buildLinePath(points)
    const baselineY = CHART_PADDING.top + plotHeight
    const areaPath = buildAreaPath(linePath, points, baselineY)

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        <svg
          className="h-full w-full overflow-visible"
          style={{ height }}
          viewBox={`0 0 ${CHART_WIDTH} ${height}`}
          role="img"
          aria-label="Line chart"
        >
          <defs>
            <linearGradient id={`line-area-${gradientId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={areaColor} stopOpacity={0.24} />
              <stop offset="100%" stopColor={areaColor} stopOpacity={0.02} />
            </linearGradient>
          </defs>

          {showGrid &&
            ticks.map((tick) => {
              const y = CHART_PADDING.top + plotHeight * tick.ratio
              return (
                <g key={tick.ratio}>
                  <line
                    x1={CHART_PADDING.left}
                    x2={CHART_WIDTH - CHART_PADDING.right}
                    y1={y}
                    y2={y}
                    stroke="var(--border)"
                    strokeWidth={1}
                  />
                  {showYAxisLabels && (
                    <text
                      x={CHART_PADDING.left - 8}
                      y={y + 4}
                      textAnchor="end"
                      fontSize={11}
                      fill="var(--muted-foreground)"
                    >
                      {formatValue(Math.round(tick.value))}
                    </text>
                  )}
                </g>
              )
            })}

          {showArea && areaPath && <path d={areaPath} fill={`url(#line-area-${gradientId})`} />}

          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke={lineColor}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {showPoints &&
            points.map((point) => (
              <g key={`${point.label}-${point.x}`}>
                <circle cx={point.x} cy={point.y} r={4} fill="var(--background)" stroke={lineColor} strokeWidth={2} />
              </g>
            ))}

          {showXAxisLabels &&
            points.map((point) => (
              <text
                key={`label-${point.label}-${point.x}`}
                x={point.x}
                y={CHART_PADDING.top + plotHeight + 18}
                textAnchor="middle"
                fontSize={11}
                fill="var(--muted-foreground)"
              >
                {point.label}
              </text>
            ))}
        </svg>
      </div>
    )
  }
)

LineChart.displayName = 'LineChart'
