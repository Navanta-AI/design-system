'use client'

import * as React from 'react'
import {
  TableShell,
  Table,
  Button,
  EmptyState,
  useTableSort,
  TABLE_STATUSES,
} from '@navanta-ai/design-system'
import type { TableStatusKey, FilterFacet, TableColumn } from '@navanta-ai/design-system'
import { Package, Star, MagnifyingGlass, WarningCircle, Info, Warning, Tag, Lightning, CalendarBlank } from '@phosphor-icons/react'
import { DynamicCodeBlock } from '@/app/components/dynamic-code-block'

const NOW = new Date('2026-03-03T12:00:00Z').getTime()
const MIN = 60_000
const DAY = 86_400_000

// Priority pill presets — semantic Pill variant + label + duotone icon.
const PRIORITY = {
  critical: { variant: 'danger', label: 'Critical', Icon: WarningCircle },
  'on-track': { variant: 'info', label: 'On Track', Icon: Info },
  'on-hold': { variant: 'warning', label: 'On Hold', Icon: Warning },
  standard: { variant: 'neutral', label: 'Standard', Icon: Tag },
} as const
type PriorityKey = keyof typeof PRIORITY

interface Order {
  po: string
  party: { initials: string; title: string; subtitle: string }
  status: TableStatusKey
  priority: PriorityKey
  ordered: number
  eta: number
  warehouse: string
  halstead: string
  insight: string
}

const ALL_ORDERS: Order[] = [
  { po: '3096652', party: { initials: 'SS', title: '8119- Scott J. Smith', subtitle: 'C/O THD Store #6346 · Jacksonville, FL' }, status: 'open', priority: 'critical', ordered: NOW - 5 * MIN, eta: NOW + 2 * DAY, warehouse: 'Savannah', halstead: '20561746', insight: 'High demand — reorder soon' },
  { po: '3096653', party: { initials: 'RD', title: 'RDC #5034', subtitle: 'Breinigsville, PA' }, status: 'in-process', priority: 'on-track', ordered: NOW - 1 * DAY, eta: NOW + 7 * DAY, warehouse: 'Reno', halstead: '20561747', insight: 'On track for ETA' },
  { po: '3096654', party: { initials: 'JR', title: '8119- Jonathan Robles', subtitle: 'Gillette, WY' }, status: 'shipped', priority: 'standard', ordered: NOW - 3 * DAY, eta: NOW + 14 * DAY, warehouse: 'Savannah', halstead: '20561748', insight: 'Likely to arrive early' },
  { po: '3096655', party: { initials: 'MB', title: '8119- Matthew Brown', subtitle: 'C/O THD Store #4123 · Pittsburgh, PA' }, status: 'delayed', priority: 'on-hold', ordered: NOW - 3 * DAY, eta: NOW + 28 * DAY, warehouse: 'Reno', halstead: '20561749', insight: 'At risk — weather delay' },
]

// Insight predicates — the "top ways" a user slices the data (extensible facets).
const isHighDemand = (o: Order) => o.insight.toLowerCase().includes('high demand')
const isThisWeek = (o: Order) => o.eta >= NOW && o.eta <= NOW + 7 * DAY
const isAtRisk = (o: Order) => o.insight.toLowerCase().includes('risk')

function getValue(o: Order, key: string): string | number | undefined {
  switch (key) {
    case 'po': return o.po
    case 'party': return o.party.title
    case 'status': return TABLE_STATUSES[o.status].completed
    case 'priority': return PRIORITY[o.priority].label
    case 'ordered': return o.ordered
    case 'eta': return o.eta
    case 'warehouse': return o.warehouse
    case 'halstead': return o.halstead
    default: return undefined
  }
}

const OPTIONAL_COLUMNS = [
  { key: 'party', label: 'Ship to' },
  { key: 'status', label: 'Status' },
  { key: 'priority', label: 'Priority' },
  { key: 'ordered', label: 'Order Date' },
  { key: 'eta', label: 'ETA' },
  { key: 'warehouse', label: 'Warehouse' },
  { key: 'halstead', label: 'Halstead Order #' },
  { key: 'insight', label: 'Christy Insight' },
  { key: 'qty', label: 'Qty' },
]

type OptionalColumn = (typeof OPTIONAL_COLUMNS)[number]
const OPTIONAL_BY_KEY: Record<string, OptionalColumn> = Object.fromEntries(
  OPTIONAL_COLUMNS.map((c) => [c.key, c]),
)


function PillOption({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
        checked
          ? 'bg-white dark:bg-background text-[#09090b] dark:text-foreground shadow-sm'
          : 'bg-transparent text-[#71717a] dark:text-muted-foreground hover:text-[#09090b] dark:hover:text-foreground'
      }`}
    >
      {label}
    </button>
  )
}

function ControlLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-xs font-medium text-[#71717a] dark:text-muted-foreground">{children}</span>
}

const CODE = `import { TableShell, Table, EmptyState, Button, useTableSort } from '@navanta-ai/design-system'
import type { FilterFacet } from '@navanta-ai/design-system'
import { Package, Lightning, CalendarBlank, WarningCircle } from '@phosphor-icons/react'

const { sorted, getHeadProps } = useTableSort(filtered, getValue, { key: 'po' })

// One unified vocabulary: dropdowns, multi-select chips, and boolean insights.
// promoted → shown inline; the rest auto-collapse into "More filters".
const facets: FilterFacet[] = [
  { kind: 'select', key: 'status', label: 'Status', promoted: true, placeholder: 'All statuses',
    value: status, onChange: setStatus, options: [{ value: 'open', label: 'Open' }, /* … */] },
  { kind: 'toggle-group', key: 'priority', label: 'Priority', promoted: true,
    value: priorities, onChange: setPriorities,
    options: [{ value: 'critical', label: 'Critical', variant: 'danger', icon: <WarningCircle weight="duotone" />, count: 1 }, /* … */] },
  // arbitrary INSIGHT filters — one object each, zero component changes:
  { kind: 'toggle', key: 'high-demand', label: 'High demand', promoted: true, group: 'Insights',
    icon: <Lightning weight="duotone" />, variant: 'warning', count: 12, active: hi, onToggle: toggleHi },
  { kind: 'toggle', key: 'this-week', label: 'This week', promoted: true, group: 'Insights',
    icon: <CalendarBlank weight="duotone" />, count: 4, active: tw, onToggle: toggleTw },
]

<TableShell
  title="Orders"
  icon={Package}
  totalItems={filtered.length}
  currentPage={page} onPageChange={setPage}
  pageSize={pageSize} onPageSizeChange={setPageSize}
  searchValue={search} onSearchChange={setSearch}
  searchPlaceholder="Search by any HD PO #, Halstead Order #"
  facets={facets}                /* unified filter bar — search + dropdowns + chips + insights */
  tabs={[{ id: 'recent', label: 'Recently Viewed', badge: 4 }, { id: 'watchlist', label: 'Watchlist', badge: 1 }]}
  activeTab={tab} onTabChange={setTab}
  columns={columns} onColumnsChange={setColumns}  /* built-in Customize popover: show/hide + reorder */
  isFiltered={isFiltered}        /* integral empty handling — headers stay visible */
  emptyState={<EmptyState icon={<Package weight="duotone" />} title="No orders yet" description="…" action={<Button size="sm">New order</Button>} />}
  noResultsState={<EmptyState icon={<MagnifyingGlass weight="duotone" />} title="No matching results" description="Try adjusting your search or filters." />}
>
  <Table hoverable>
    <Table.Header>{/* visible columns */}</Table.Header>
    <Table.Body>
      {/* Just render rows — no rows ⇒ TableShell paints emptyState/noResultsState. */}
      {rows.map((o) => <Table.Row key={o.po}>{/* cells */}</Table.Row>)}
    </Table.Body>
  </Table>
</TableShell>`

export function TableShellPlayground({ showCode = true }: { showCode?: boolean }) {
  const [showSearch, setShowSearch] = React.useState(true)
  const [showFilters, setShowFilters] = React.useState(true)
  const [showTabs, setShowTabs] = React.useState(true)
  const [showCustomize, setShowCustomize] = React.useState(true)
  const [simulateEmpty, setSimulateEmpty] = React.useState(false)

  const [search, setSearch] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<string | null>(null)
  const [due, setDue] = React.useState<string | null>(null)
  const [tab, setTab] = React.useState('recent')
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)
  const [priorityFilter, setPriorityFilter] = React.useState<Set<PriorityKey>>(() => new Set())
  const [warehouseFilter, setWarehouseFilter] = React.useState<string | null>(null)
  const [hiDemand, setHiDemand] = React.useState(false)
  const [thisWeek, setThisWeek] = React.useState(false)
  const [atRisk, setAtRisk] = React.useState(false)

  const [visibleCols, setVisibleCols] = React.useState<Record<string, boolean>>(
    () => Object.fromEntries(OPTIONAL_COLUMNS.map((c) => [c.key, true])),
  )
  const [colOrder, setColOrder] = React.useState<string[]>(() => OPTIONAL_COLUMNS.map((c) => c.key))
  const [qty, setQty] = React.useState<Record<string, string>>(
    () => Object.fromEntries(ALL_ORDERS.map((o) => [o.po, String((Number(o.halstead) % 40) + 1)])),
  )

  const onWatchlist = showTabs && tab === 'watchlist'

  const filtered = React.useMemo(() => {
    if (simulateEmpty || onWatchlist) return [] as Order[]
    const q = search.trim().toLowerCase()
    return ALL_ORDERS.filter((o) => {
      const matchesSearch = !q || o.po.toLowerCase().includes(q) || o.party.title.toLowerCase().includes(q) || o.halstead.toLowerCase().includes(q)
      const matchesStatus = !statusFilter || o.status === statusFilter
      const matchesPriority = priorityFilter.size === 0 || priorityFilter.has(o.priority)
      const matchesWarehouse = !warehouseFilter || o.warehouse === warehouseFilter
      const matchesDue = !due || (due === 'week' ? o.eta >= NOW && o.eta <= NOW + 7 * DAY : o.eta <= NOW + 30 * DAY)
      const matchesHiDemand = !hiDemand || isHighDemand(o)
      const matchesThisWeek = !thisWeek || isThisWeek(o)
      const matchesAtRisk = !atRisk || isAtRisk(o)
      return matchesSearch && matchesStatus && matchesPriority && matchesWarehouse && matchesDue && matchesHiDemand && matchesThisWeek && matchesAtRisk
    })
  }, [search, statusFilter, due, priorityFilter, warehouseFilter, hiDemand, thisWeek, atRisk, simulateEmpty, onWatchlist])

  // Reset every filter dimension at once (used by empty-state + simulate-empty).
  const clearAllFilters = () => {
    setSearch('')
    setStatusFilter(null)
    setDue(null)
    setPriorityFilter(new Set())
    setWarehouseFilter(null)
    setHiDemand(false)
    setThisWeek(false)
    setAtRisk(false)
    setPage(1)
  }

  // Unified filter facets — search + dropdowns + chips + insights as ONE list.
  // Array order = layout order; `promoted` surfaces inline, the rest go to "More".
  const facets: FilterFacet[] = [
    {
      kind: 'select', key: 'status', group: 'Status', label: 'Status', promoted: true,
      placeholder: 'All statuses', value: statusFilter,
      onChange: (v) => { setStatusFilter(v); setPage(1) },
      options: [
        { value: 'open', label: 'Open' },
        { value: 'in-process', label: 'In Process' },
        { value: 'shipped', label: 'Shipped' },
        { value: 'delayed', label: 'Delayed' },
      ],
    },
    {
      kind: 'select', key: 'due', group: 'Due date', label: 'Due date', promoted: true,
      placeholder: 'Any date', value: due,
      onChange: (v) => { setDue(v); setPage(1) },
      options: [
        { value: 'week', label: 'This week' },
        { value: 'month', label: 'This month' },
      ],
    },
    {
      // Demoted into "More filters": a multi-select group would otherwise spend 4 of
      // the 5 inline control slots on its own (the cap counts each option).
      kind: 'toggle-group', key: 'priority', group: 'Priority', label: 'Priority',
      value: [...priorityFilter],
      onChange: (next) => { setPriorityFilter(new Set(next as PriorityKey[])); setPage(1) },
      options: (Object.keys(PRIORITY) as PriorityKey[]).map((key) => {
        const p = PRIORITY[key]
        const PIcon = p.Icon
        return { value: key, label: p.label, variant: p.variant, icon: <PIcon weight="duotone" />, count: ALL_ORDERS.filter((o) => o.priority === key).length }
      }),
    },
    {
      kind: 'toggle', key: 'high-demand', group: 'Insights', label: 'High demand', promoted: true,
      icon: <Lightning weight="duotone" />, variant: 'warning',
      count: ALL_ORDERS.filter(isHighDemand).length, active: hiDemand,
      onToggle: () => { setHiDemand((v) => !v); setPage(1) },
    },
    {
      kind: 'toggle', key: 'this-week', group: 'Insights', label: 'This week', promoted: true,
      icon: <CalendarBlank weight="duotone" />,
      count: ALL_ORDERS.filter(isThisWeek).length, active: thisWeek,
      onToggle: () => { setThisWeek((v) => !v); setPage(1) },
    },
    // Demoted facets — live inside the "More filters" popover.
    {
      kind: 'toggle', key: 'at-risk', group: 'Insights', label: 'At risk',
      icon: <Warning weight="duotone" />, variant: 'danger',
      count: ALL_ORDERS.filter(isAtRisk).length, active: atRisk,
      onToggle: () => { setAtRisk((v) => !v); setPage(1) },
    },
    {
      kind: 'select', key: 'warehouse', group: 'Warehouse', label: 'Warehouse',
      placeholder: 'All warehouses', value: warehouseFilter,
      onChange: (v) => { setWarehouseFilter(v); setPage(1) },
      options: [
        { value: 'Savannah', label: 'Savannah' },
        { value: 'Reno', label: 'Reno' },
      ],
    },
  ]

  const { sorted, getHeadProps } = useTableSort<Order>(filtered, getValue, { key: 'po' })
  const safePage = Math.min(page, Math.max(1, Math.ceil(sorted.length / pageSize)))
  const rows = sorted.slice((safePage - 1) * pageSize, (safePage - 1) * pageSize + pageSize)

  const cols = colOrder
    .map((k) => OPTIONAL_BY_KEY[k])
    .filter((c): c is OptionalColumn => Boolean(c) && visibleCols[c.key])
  // Bridge the column state to TableShell's built-in Customize popover.
  const customizeColumns: TableColumn[] = colOrder.map((key) => ({
    key,
    label: OPTIONAL_BY_KEY[key].label,
    hidden: !visibleCols[key],
  }))
  const applyColumns = (next: TableColumn[]) => {
    setColOrder(next.map((c) => c.key))
    setVisibleCols(Object.fromEntries(next.map((c) => [c.key, !c.hidden])))
  }
  const isFiltered =
    Boolean(search.trim()) || !!statusFilter || !!due || priorityFilter.size > 0 ||
    !!warehouseFilter || hiDemand || thisWeek || atRisk

  // Integral empty screens — handed to TableShell, which renders them centered with
  // the column headers still visible. `isFiltered` picks no-results over no-data.
  const emptyState = onWatchlist ? (
    <EmptyState
      icon={<Star weight="duotone" />}
      title="Your watchlist is empty"
      description="Star an order to track it here for quick access."
      link={{ label: 'search the order you want to track.', onClick: () => setTab('recent') }}
    />
  ) : (
    <EmptyState
      icon={<Package weight="duotone" />}
      title="No orders yet"
      description="When orders come in, they'll appear here."
      action={<Button size="sm">New order</Button>}
    />
  )
  const noResultsState = (
    <EmptyState
      icon={<MagnifyingGlass weight="duotone" />}
      title="No matching results"
      description="Try adjusting your search or filters."
      action={
        <Button variant="outline" size="sm" onClick={clearAllFilters}>
          Clear search & filters
        </Button>
      }
    />
  )

  return (
    <div className="overflow-hidden rounded-xl border border-[#e4e4e7] dark:border-border">
      {/* Controls */}
      <div className="flex flex-col gap-3 px-4 py-3 border-b border-[#e4e4e7] dark:border-border bg-[#fafafa] dark:bg-muted/10">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <ControlLabel>Chrome</ControlLabel>
          <div className="inline-flex flex-wrap items-center gap-0.5 rounded-lg bg-[#f4f4f5] dark:bg-muted p-1">
            <PillOption label="Search" checked={showSearch} onChange={() => setShowSearch((v) => !v)} />
            <PillOption label="Filter bar" checked={showFilters} onChange={() => setShowFilters((v) => !v)} />
            <PillOption label="Tabs" checked={showTabs} onChange={() => setShowTabs((v) => !v)} />
            <PillOption label="Customize" checked={showCustomize} onChange={() => setShowCustomize((v) => !v)} />
          </div>
          <PillOption label="Simulate empty data" checked={simulateEmpty} onChange={() => { setSimulateEmpty((v) => !v); clearAllFilters() }} />
        </div>
        <p className="text-xs text-muted-foreground">
          Toggle chrome above. For the <strong>no-results</strong> screen, search a non-matching term or pick a filter; the
          <strong> Watchlist</strong> tab and <strong>Simulate empty data</strong> show the other empty states — all stay centered with headers + footer intact.
        </p>
      </div>

      {/* Live preview */}
      <div className="relative bg-white dark:bg-background p-6">
        <TableShell
          title="Orders"
          icon={Package}
          totalItems={filtered.length}
          currentPage={safePage}
          onPageChange={setPage}
          pageSize={pageSize}
          onPageSizeChange={(size) => { setPageSize(size); setPage(1) }}
          searchValue={showSearch ? search : undefined}
          onSearchChange={showSearch ? (v) => { setSearch(v); setPage(1) } : undefined}
          searchPlaceholder="Search by any HD PO #, Halstead Order #"
          facets={showFilters ? facets : undefined}
          tabs={showTabs ? [
            { id: 'recent', label: 'Recently Viewed', badge: ALL_ORDERS.length },
            { id: 'watchlist', label: 'Watchlist', badge: 1 },
          ] : undefined}
          activeTab={tab}
          onTabChange={setTab}
          customize={showCustomize}
          columns={customizeColumns}
          onColumnsChange={applyColumns}
          emptyState={emptyState}
          noResultsState={noResultsState}
          isFiltered={!onWatchlist && isFiltered}
        >
          <Table hoverable>
            <Table.Header>
              <Table.Row>
                <Table.HeadCell {...getHeadProps('po')}>HD PO #</Table.HeadCell>
                {cols.map((c) =>
                  c.key === 'insight' ? (
                    <Table.HeadCell key={c.key} ai>{c.label}</Table.HeadCell>
                  ) : c.key === 'qty' ? (
                    <Table.HeadCell key={c.key}>{c.label}</Table.HeadCell>
                  ) : (
                    <Table.HeadCell key={c.key} {...getHeadProps(c.key)}>{c.label}</Table.HeadCell>
                  ),
                )}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {rows.map((o) => (
                <Table.Row key={o.po}>
                    <Table.Cell variant="id" value={o.po} icon={<Package weight="regular" />} href="#" data-label="HD PO #" />
                    {cols.map((c) => {
                      switch (c.key) {
                        case 'party':
                          return <Table.Cell key={c.key} variant="party" avatar={{ initials: o.party.initials }} title={o.party.title} subtitle={o.party.subtitle} data-label="Ship to" />
                        case 'status':
                          return <Table.Cell key={c.key} variant="status" status={o.status} data-label="Status" />
                        case 'priority': {
                          const p = PRIORITY[o.priority]
                          const PIcon = p.Icon
                          return <Table.Cell key={c.key} variant="pill" pillVariant={p.variant} label={p.label} icon={<PIcon weight="duotone" />} data-label="Priority" />
                        }
                        case 'ordered':
                          return <Table.Cell key={c.key} variant="date" date={o.ordered} now={NOW} data-label="Order Date" />
                        case 'eta':
                          return <Table.Cell key={c.key} variant="date" date={o.eta} now={NOW} data-label="ETA" />
                        case 'warehouse':
                          return <Table.Cell key={c.key} data-label="Warehouse"><span className="text-[var(--text-primary)]">{o.warehouse}</span></Table.Cell>
                        case 'halstead':
                          return <Table.Cell key={c.key} variant="id" value={o.halstead} data-label="Halstead Order #" />
                        case 'insight':
                          return <Table.Cell key={c.key} data-label="Christy Insight"><span className="font-normal text-[var(--text-accent)]">{o.insight}</span></Table.Cell>
                        case 'qty':
                          return <Table.Cell key={c.key} variant="input" value={qty[o.po]} onValueChange={(v) => setQty((prev) => ({ ...prev, [o.po]: v }))} inputType="number" data-label="Qty" />
                        default:
                          return null
                      }
                    })}
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </TableShell>
      </div>

      {/* Code */}
      {showCode && (
        <div className="relative border-t border-[#e4e4e7] dark:border-border">
          <DynamicCodeBlock code={CODE} />
        </div>
      )}
    </div>
  )
}
