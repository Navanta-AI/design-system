'use client'

import * as React from 'react'
import {
  TableShell,
  Table,
  Button,
  EmptyState,
  Switch,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  useTableSort,
  TABLE_STATUSES,
} from '@admin-navanta/design-system'
import type { TableStatusKey } from '@admin-navanta/design-system'
import { Package, Star, MagnifyingGlass, DotsSixVertical } from '@phosphor-icons/react'
import { DynamicCodeBlock } from '@/app/components/dynamic-code-block'

const NOW = new Date('2026-03-03T12:00:00Z').getTime()
const MIN = 60_000
const DAY = 86_400_000

interface Order {
  po: string
  party: { initials: string; title: string; subtitle: string }
  status: TableStatusKey
  ordered: number
  eta: number
  warehouse: string
  halstead: string
  insight: string
}

const ALL_ORDERS: Order[] = [
  { po: '3096652', party: { initials: 'SS', title: '8119- Scott J. Smith', subtitle: 'C/O THD Store #6346 · Jacksonville, FL' }, status: 'open', ordered: NOW - 5 * MIN, eta: NOW + 2 * DAY, warehouse: 'Savannah', halstead: '20561746', insight: 'High demand — reorder soon' },
  { po: '3096653', party: { initials: 'RD', title: 'RDC #5034', subtitle: 'Breinigsville, PA' }, status: 'in-process', ordered: NOW - 1 * DAY, eta: NOW + 7 * DAY, warehouse: 'Reno', halstead: '20561747', insight: 'On track for ETA' },
  { po: '3096654', party: { initials: 'JR', title: '8119- Jonathan Robles', subtitle: 'Gillette, WY' }, status: 'shipped', ordered: NOW - 3 * DAY, eta: NOW + 14 * DAY, warehouse: 'Savannah', halstead: '20561748', insight: 'Likely to arrive early' },
  { po: '3096655', party: { initials: 'MB', title: '8119- Matthew Brown', subtitle: 'C/O THD Store #4123 · Pittsburgh, PA' }, status: 'delayed', ordered: NOW - 3 * DAY, eta: NOW + 28 * DAY, warehouse: 'Reno', halstead: '20561749', insight: 'At risk — weather delay' },
]

function getValue(o: Order, key: string): string | number | undefined {
  switch (key) {
    case 'po': return o.po
    case 'party': return o.party.title
    case 'status': return TABLE_STATUSES[o.status].completed
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

const sameOrder = (a: string[], b: string[]) => a.length === b.length && a.every((k, i) => k === b[i])

// Live reorder: drop the dragged key before/after the hovered key depending on
// which half of the row the pointer is over, so the list rearranges live under
// the cursor (every position, including the ends, is reachable).
function reorderList(order: string[], dragKey: string, overKey: string, placeAfter: boolean): string[] {
  if (dragKey === overKey) return order
  const next = order.filter((k) => k !== dragKey)
  const overIdx = next.indexOf(overKey)
  if (overIdx === -1) return order
  next.splice(placeAfter ? overIdx + 1 : overIdx, 0, dragKey)
  return next
}

// useLayoutEffect on the client, useEffect on the server (avoids the SSR warning).
const useIsoLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect

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

const CODE = `import { TableShell, Table, EmptyState, Button, useTableSort } from '@admin-navanta/design-system'
import { Package } from '@phosphor-icons/react'

const { sorted, getHeadProps } = useTableSort(filtered, getValue, { key: 'po' })

<TableShell
  title="Orders"
  icon={Package}
  totalItems={filtered.length}
  currentPage={page} onPageChange={setPage}
  pageSize={pageSize} onPageSizeChange={setPageSize}
  searchValue={search} onSearchChange={setSearch}
  searchPlaceholder="Search by any HD PO #, Halstead Order #"
  filters={<><Select…/* Due Date *//><Select…/* Status *//></>}
  tabs={[{ id: 'recent', label: 'Recently Viewed', badge: 4 }, { id: 'watchlist', label: 'Watchlist', badge: 1 }]}
  activeTab={tab} onTabChange={setTab}
  onCustomize={() => setCustomizeOpen(true)}
>
  <Table hoverable>
    <Table.Header>{/* visible columns */}</Table.Header>
    <Table.Body>
      {rows.length === 0 ? (
        <Table.Empty colSpan={visibleColCount}>
          <EmptyState icon={<Package weight="duotone" />} title="No orders yet" description="…" action={<Button size="sm">New order</Button>} />
        </Table.Empty>
      ) : (
        rows.map((o) => <Table.Row key={o.po}>{/* cells */}</Table.Row>)
      )}
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
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [due, setDue] = React.useState('any')
  const [tab, setTab] = React.useState('recent')
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)

  const [visibleCols, setVisibleCols] = React.useState<Record<string, boolean>>(
    () => Object.fromEntries(OPTIONAL_COLUMNS.map((c) => [c.key, true])),
  )
  const [colOrder, setColOrder] = React.useState<string[]>(() => OPTIONAL_COLUMNS.map((c) => c.key))
  const [draggingKey, setDraggingKey] = React.useState<string | null>(null)
  const rowRefs = React.useRef<Record<string, HTMLDivElement | null>>({})
  const prevRects = React.useRef<Record<string, DOMRect>>({})
  const popoverRef = React.useRef<HTMLDivElement | null>(null)
  const [customizeOpen, setCustomizeOpen] = React.useState(false)
  const [qty, setQty] = React.useState<Record<string, string>>(
    () => Object.fromEntries(ALL_ORDERS.map((o) => [o.po, String((Number(o.halstead) % 40) + 1)])),
  )

  // FLIP: when a drag-reorder changes colOrder, slide each row from its previous
  // position to its new one so the list animates instead of snapping. Only runs
  // during an active drag; on open it just records baseline positions.
  useIsoLayoutEffect(() => {
    const animate = draggingKey != null
    for (const key of colOrder) {
      const el = rowRefs.current[key]
      if (!el) continue
      const next = el.getBoundingClientRect()
      const prev = prevRects.current[key]
      if (animate && prev) {
        const dy = prev.top - next.top
        if (Math.abs(dy) > 0.5) {
          el.animate(
            [{ transform: `translateY(${dy}px)` }, { transform: 'translateY(0px)' }],
            { duration: 160, easing: 'cubic-bezier(0.2, 0, 0, 1)' },
          )
        }
      }
      prevRects.current[key] = next
    }
  }, [colOrder, draggingKey, customizeOpen])

  // Subtle scale/fade entrance so the Customize panel opens like a real dropdown.
  // (The repo has no tailwindcss-animate plugin, so Select's animate-in classes are
  // currently no-ops; this gives the panel a working open animation via WAAPI.)
  useIsoLayoutEffect(() => {
    if (customizeOpen && popoverRef.current) {
      popoverRef.current.animate(
        [
          { opacity: 0, transform: 'scale(0.96)' },
          { opacity: 1, transform: 'scale(1)' },
        ],
        { duration: 120, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
      )
    }
  }, [customizeOpen])

  const onWatchlist = showTabs && tab === 'watchlist'

  const filtered = React.useMemo(() => {
    if (simulateEmpty || onWatchlist) return [] as Order[]
    const q = search.trim().toLowerCase()
    return ALL_ORDERS.filter((o) => {
      const matchesSearch = !q || o.po.toLowerCase().includes(q) || o.party.title.toLowerCase().includes(q) || o.halstead.toLowerCase().includes(q)
      const matchesStatus = statusFilter === 'all' || o.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [search, statusFilter, simulateEmpty, onWatchlist])

  const { sorted, getHeadProps } = useTableSort<Order>(filtered, getValue, { key: 'po' })
  const safePage = Math.min(page, Math.max(1, Math.ceil(sorted.length / pageSize)))
  const rows = sorted.slice((safePage - 1) * pageSize, (safePage - 1) * pageSize + pageSize)

  const cols = colOrder
    .map((k) => OPTIONAL_BY_KEY[k])
    .filter((c): c is OptionalColumn => Boolean(c) && visibleCols[c.key])
  const visibleColCount = 1 + cols.length
  const isFiltered = Boolean(search.trim()) || statusFilter !== 'all'

  const emptyContent = onWatchlist ? (
    <EmptyState
      icon={<Star weight="duotone" />}
      title="Your watchlist is empty"
      description="Star an order to track it here for quick access."
      link={{ label: 'search the order you want to track.', onClick: () => setTab('recent') }}
    />
  ) : isFiltered ? (
    <EmptyState
      icon={<MagnifyingGlass weight="duotone" />}
      title="No matching results"
      description="Try adjusting your search or filters."
      action={
        <Button variant="outline" size="sm" onClick={() => { setSearch(''); setStatusFilter('all') }}>
          Clear search & filters
        </Button>
      }
    />
  ) : (
    <EmptyState
      icon={<Package weight="duotone" />}
      title="No orders yet"
      description="When orders come in, they'll appear here."
      action={<Button size="sm">New order</Button>}
    />
  )

  const filtersSlot = showFilters ? (
    <>
      <Select value={due} onValueChange={setDue}>
        <SelectTrigger size="md" className="w-[140px]"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="any">Any date</SelectItem>
          <SelectItem value="week">This week</SelectItem>
          <SelectItem value="month">This month</SelectItem>
        </SelectContent>
      </Select>
      <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1) }}>
        <SelectTrigger size="md" className="w-[140px]"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="open">Open</SelectItem>
          <SelectItem value="in-process">In Process</SelectItem>
          <SelectItem value="shipped">Shipped</SelectItem>
          <SelectItem value="delayed">Delayed</SelectItem>
        </SelectContent>
      </Select>
    </>
  ) : undefined

  return (
    <div className="overflow-hidden rounded-xl border border-[#e4e4e7] dark:border-border">
      {/* Controls */}
      <div className="flex flex-col gap-3 px-4 py-3 border-b border-[#e4e4e7] dark:border-border bg-[#fafafa] dark:bg-muted/10">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <ControlLabel>Chrome</ControlLabel>
          <div className="inline-flex flex-wrap items-center gap-0.5 rounded-lg bg-[#f4f4f5] dark:bg-muted p-1">
            <PillOption label="Search" checked={showSearch} onChange={() => setShowSearch((v) => !v)} />
            <PillOption label="Filters" checked={showFilters} onChange={() => setShowFilters((v) => !v)} />
            <PillOption label="Tabs" checked={showTabs} onChange={() => setShowTabs((v) => !v)} />
            <PillOption label="Customize" checked={showCustomize} onChange={() => setShowCustomize((v) => !v)} />
          </div>
          <PillOption label="Simulate empty data" checked={simulateEmpty} onChange={() => { setSimulateEmpty((v) => !v); setSearch(''); setStatusFilter('all'); setPage(1) }} />
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
          filters={filtersSlot}
          tabs={showTabs ? [
            { id: 'recent', label: 'Recently Viewed', badge: ALL_ORDERS.length },
            { id: 'watchlist', label: 'Watchlist', badge: 1 },
          ] : undefined}
          activeTab={tab}
          onTabChange={setTab}
          onCustomize={showCustomize ? () => setCustomizeOpen((o) => !o) : undefined}
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
              {rows.length === 0 ? (
                <Table.Empty colSpan={visibleColCount}>{emptyContent}</Table.Empty>
              ) : (
                rows.map((o) => (
                  <Table.Row key={o.po}>
                    <Table.Cell variant="id" value={o.po} icon={<Package weight="regular" />} href="#" data-label="HD PO #" />
                    {cols.map((c) => {
                      switch (c.key) {
                        case 'party':
                          return <Table.Cell key={c.key} variant="party" avatar={{ initials: o.party.initials }} title={o.party.title} subtitle={o.party.subtitle} data-label="Ship to" />
                        case 'status':
                          return <Table.Cell key={c.key} variant="status" status={o.status} data-label="Status" />
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
                ))
              )}
            </Table.Body>
          </Table>
        </TableShell>

        {/* Customize popover — drag to reorder, toggle to show/hide */}
        {customizeOpen && showCustomize && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setCustomizeOpen(false)} />
            <div
              ref={popoverRef}
              role="dialog"
              aria-label="Customize columns"
              className="absolute right-7 top-[64px] z-20 w-[260px] origin-top-right overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
            >
              <div className="px-1.5 pt-0.5 pb-1.5">
                <p className="text-xs font-semibold text-foreground">Customize columns</p>
                <p className="text-[11px] text-muted-foreground">Drag to reorder · toggle to show or hide</p>
              </div>
              <div className="flex flex-col">
                {colOrder.map((key) => {
                  const c = OPTIONAL_BY_KEY[key]
                  if (!c) return null
                  const isDragging = draggingKey === key
                  return (
                    <div
                      key={key}
                      ref={(el) => {
                        if (el) rowRefs.current[key] = el
                        else delete rowRefs.current[key]
                      }}
                      onDragOver={(e) => {
                        if (!draggingKey) return
                        e.preventDefault()
                        e.dataTransfer.dropEffect = 'move'
                        if (draggingKey === key) return
                        const rect = e.currentTarget.getBoundingClientRect()
                        const placeAfter = e.clientY > rect.top + rect.height / 2
                        setColOrder((prev) => {
                          const next = reorderList(prev, draggingKey, key, placeAfter)
                          return sameOrder(prev, next) ? prev : next
                        })
                      }}
                      onDrop={(e) => {
                        e.preventDefault()
                        setDraggingKey(null)
                      }}
                      className={`flex min-h-[32px] items-center gap-2 rounded-md px-1.5 transition-[background-color,opacity] ${
                        isDragging ? 'bg-muted/60 opacity-60' : 'hover:bg-muted/40'
                      }`}
                    >
                      <span
                        draggable
                        role="button"
                        aria-label={`Drag to reorder ${c.label}`}
                        onDragStart={(e) => {
                          setDraggingKey(key)
                          e.dataTransfer.effectAllowed = 'move'
                          e.dataTransfer.setData('text/plain', key)
                          const row = rowRefs.current[key]
                          if (row) e.dataTransfer.setDragImage(row, 12, 16)
                        }}
                        onDragEnd={() => setDraggingKey(null)}
                        className="flex shrink-0 cursor-grab items-center text-muted-foreground transition-colors hover:text-foreground active:cursor-grabbing"
                      >
                        <DotsSixVertical size={16} weight="bold" aria-hidden="true" />
                      </span>
                      <span className="flex-1 truncate text-sm text-foreground">{c.label}</span>
                      <Switch
                        checked={visibleCols[key]}
                        onCheckedChange={(v) => setVisibleCols((prev) => ({ ...prev, [key]: v }))}
                        aria-label={`Show ${c.label}`}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}
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
