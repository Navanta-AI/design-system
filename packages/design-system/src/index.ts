// Utilities
export { cn } from './utils/cn'
export { cva, type VariantProps } from 'class-variance-authority'

// Types (re-export for consumers)
export type { ClassValue } from 'clsx'

// Components
export { Button, buttonVariants, type ButtonProps } from './components/Button'
export { Pill, pillVariants, type PillProps } from './components/Pill'
export { Input, type InputProps } from './components/Input'
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
  type CardProps,
} from './components/Card'
export { Textarea, type TextareaProps } from './components/Textarea'
export { Checkbox, type CheckboxProps } from './components/Checkbox'
export { Radio, type RadioProps } from './components/Radio'
export { Switch, type SwitchProps } from './components/Switch'
export { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem, SelectSeparator, type SelectProps, type SelectTriggerProps, type SelectContentProps, type SelectGroupProps, type SelectLabelProps, type SelectItemProps, type SelectSeparatorProps, type SelectValueProps } from './components/Select'
export { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogIcon, DialogBody, DialogFooter, type DialogProps } from './components/Dialog'
export { Toast, KToastContainer, Toaster, type ToastProps, type ToastContainerProps, type ToastType } from './components/Toast'
export { Accordion, type AccordionProps, type AccordionItem } from './components/Accordion'
export { Tabs, TabPanel, type TabsProps, type TabPanelProps, type TabItem } from './components/Tabs'
export { Table, type TableProps, type TableHeaderProps, type TableBodyProps, type TableRowProps, type TableHeadCellProps, type TableCellProps, type TableCellVariant } from './components/Table'
export { TABLE_STATUSES, statusToneColor, formatTableDate, formatRelativeTime, type TableStatusKey, type TableStatusTone, type TableStatusDef } from './components/table-cell-utils'
export { useTableSort, type SortDirection, type TableSortState, type UseTableSortResult } from './components/use-table-sort'
export { Breadcrumbs, type BreadcrumbsProps, type BreadcrumbItem } from './components/Breadcrumbs'
export { Tooltip, type TooltipProps } from './components/Tooltip'
export { Avatar, type AvatarProps, type AvatarGroupProps } from './components/Avatar'
export { Skeleton, type SkeletonProps } from './components/Skeleton'
export { Progress, CircularProgress, type ProgressProps, type CircularProgressProps } from './components/Progress'
export { Pagination, type PaginationProps } from './components/Pagination'
// Declarative DataTable (columns[] + data[], appearance props, grouping).
// Coexists with the compound `Table`; types are prefixed to avoid clashes
// (e.g. the existing `SortDirection` from use-table-sort).
export {
  DataTable,
  CELL_LAYOUTS as DATA_TABLE_CELL_LAYOUTS,
  DEFAULT_CELL_LAYOUT as DATA_TABLE_DEFAULT_CELL_LAYOUT,
  DATA_TABLE_DEFAULTS,
} from './components/data-table'
export type {
  DataTableProps,
  Column as DataTableColumn,
  SlotColumn as DataTableSlotColumn,
  SelectionConfig as DataTableSelection,
  SortState as DataTableSortState,
  CellContext as DataTableCellContext,
  GroupConfig as DataTableGroup,
  DataTableAppearance,
  CellLayout as DataTableCellLayout,
} from './components/data-table'
export { KpiGrid, KpiTrendBadge, KpiStatCard, KpiProgressCard, KpiComparisonCard, type KpiGridProps, type KpiTrendBadgeProps, type KpiStatCardProps, type KpiProgressCardProps, type KpiComparisonCardProps, type KpiTrendDirection, type KpiCardLayout } from './components/KPI'
export {
  BarChart,
  LineChart,
  StackedBarChart,
  type BarChartProps,
  type LineChartProps,
  type StackedBarChartProps,
  type ChartDatum,
  type StackedChartDatum,
  type StackedChartSegment,
} from './components/Charts'
export { Slider, type SliderProps } from './components/Slider'
export { DatePicker, type DatePickerProps } from './components/DatePicker'
export { Dropzone, dropzoneUid, type DropzoneProps, type DropzoneFile } from './components/Dropzone'

// UI Components (Navanta/Christy)
export * from './components/ui'
export * from './components/ui/panel'

// Contexts
export { ToastProvider, useToast } from './context/ToastContext'
export type { ToastItem, AddToastOptions, ToastPosition } from './context/ToastContext'
