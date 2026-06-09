'use client'

import * as React from 'react'
import {
  TableShell,
  Table,
  Checkbox,
  Pill,
  EmptyState,
  Button,
  useTableSort,
} from '@navanta-ai/design-system'
import type { FilterFacet, TableColumn } from '@navanta-ai/design-system'
import {
  Storefront,
  WarningCircle,
  Warning,
  Truck,
  ArrowRight,
  DiamondsFour,
  Warehouse,
  Package,
  MagnifyingGlass,
} from '@phosphor-icons/react'

/* ─────────────────────────────────────────────
 *  Product Catalog — a full-page TEMPLATE composed entirely from DS components
 *  (Figma: Iris-Shareable, node 449-4163). Shows the unified TableShell filter
 *  bar (search + Critical/High/Transfers toggle chips + an "All time" select),
 *  saved-view tabs, the `pill` cell variant (Source route/CT, Exception), an
 *  id cell with a product-name subtitle, and a brand-tinted "Iris Insight"
 *  (Christy/AI) column.
 * ───────────────────────────────────────────── */

type Queue = 'review' | 'onhold' | 'rejected' | 'approved'
type Source = { kind: 'route'; to: string } | { kind: 'code'; code: string }

interface Product {
  id: string
  sku: string
  name: string
  branch: string
  cls: string
  onHand: number
  incoming: number
  leadTime: number | null
  value: number
  source: Source
  exception: 'critical' | 'high'
  orderTitle: string
  orderSub: string
  orderUrgent?: boolean
  iris: string
  queue: Queue
}

const PRODUCTS: Product[] = [
  { id: 'p1', sku: '30-60049-20PK24', name: 'Carrier 90 Series evaporator coil', branch: 'DAL', cls: 'AY', onHand: 14, incoming: 14, leadTime: null, value: 9000, source: { kind: 'route', to: 'HOU' }, exception: 'critical', orderTitle: 'Release 6', orderSub: 'Pending HOU review', iris: 'Slow in DAL, fast in HOU (AY); recover $9k', queue: 'review' },
  { id: 'p2', sku: '24-91188-04', name: 'Goodman condenser fan motor', branch: 'DAL', cls: 'AY', onHand: 14, incoming: 14, leadTime: 7, value: 9000, source: { kind: 'code', code: 'CT' }, exception: 'critical', orderTitle: 'Order 6', orderSub: 'Now', orderUrgent: true, iris: 'Stockout in 4 days at current usage', queue: 'review' },
  { id: 'p3', sku: '11-40233-19', name: 'Rheem 80% AFUE gas valve', branch: 'DAL', cls: 'AY', onHand: 14, incoming: 14, leadTime: 7, value: 7000, source: { kind: 'code', code: 'CT' }, exception: 'high', orderTitle: 'Hold', orderSub: "Don't re-order", iris: 'Below SS — vendor LT slipped 2.8 days', queue: 'review' },
  { id: 'p4', sku: '50-77821-06PK12', name: 'Lennox blower wheel assembly', branch: 'HOU', cls: 'AY', onHand: 8, incoming: 0, leadTime: 7, value: 5000, source: { kind: 'code', code: 'CT' }, exception: 'critical', orderTitle: 'Bump DOS', orderSub: 'to 45 days', iris: 'Carrier allocation cut, wait for restock', queue: 'review' },
  { id: 'p5', sku: '30-60049-20PK24', name: 'Carrier 90 Series evaporator coil', branch: 'RNO', cls: 'CZ', onHand: 22, incoming: 14, leadTime: 7, value: 5000, source: { kind: 'route', to: 'DAL' }, exception: 'critical', orderTitle: 'Bump DOS', orderSub: 'to 45 days', iris: 'Carrier allocation cut, wait for restock', queue: 'review' },
  { id: 'p6', sku: '63-22910-31', name: 'Trane TXV bi-flow valve', branch: 'DAL', cls: 'BX', onHand: 31, incoming: 6, leadTime: 12, value: 12000, source: { kind: 'code', code: 'PO' }, exception: 'high', orderTitle: 'Review', orderSub: 'vendor quote', iris: 'Price up 8% QoQ — consider alt vendor', queue: 'review' },
  { id: 'p7', sku: '82-11045-02PK6', name: 'York defrost control board', branch: 'HOU', cls: 'AY', onHand: 4, incoming: 0, leadTime: 21, value: 3000, source: { kind: 'route', to: 'RNO' }, exception: 'high', orderTitle: 'Expedite', orderSub: 'air freight', iris: 'Demand spike in RNO; rebalance from HOU', queue: 'review' },
  { id: 'p8', sku: '17-55302-88', name: 'Daikin inverter PCB', branch: 'DAL', cls: 'BX', onHand: 2, incoming: 10, leadTime: 30, value: 18000, source: { kind: 'code', code: 'BL' }, exception: 'high', orderTitle: 'On hold', orderSub: 'awaiting QA', iris: 'Backordered — ETA slipped to next month', queue: 'onhold' },
  { id: 'p9', sku: '44-90021-13PK8', name: 'Bryant inducer motor', branch: 'RNO', cls: 'CZ', onHand: 16, incoming: 8, leadTime: 9, value: 6000, source: { kind: 'code', code: 'CT' }, exception: 'high', orderTitle: 'Approved', orderSub: 'PO #4821', iris: 'Healthy cover — no action needed', queue: 'approved' },
  { id: 'p10', sku: '30-60049-20PK24', name: 'Carrier 90 Series evaporator coil', branch: 'HOU', cls: 'AY', onHand: 19, incoming: 14, leadTime: 7, value: 9000, source: { kind: 'route', to: 'DAL' }, exception: 'high', orderTitle: 'Approved', orderSub: 'PO #4822', iris: 'Rebalanced; cover restored to 38 days', queue: 'approved' },
  { id: 'p11', sku: '24-91188-04', name: 'Goodman condenser fan motor', branch: 'DAL', cls: 'AY', onHand: 27, incoming: 0, leadTime: 7, value: 4000, source: { kind: 'code', code: 'CT' }, exception: 'high', orderTitle: 'Approved', orderSub: 'PO #4823', iris: 'Steady demand; on target', queue: 'approved' },
  { id: 'p12', sku: '11-40233-19', name: 'Rheem 80% AFUE gas valve', branch: 'RNO', cls: 'CZ', onHand: 33, incoming: 12, leadTime: 7, value: 4500, source: { kind: 'code', code: 'CT' }, exception: 'high', orderTitle: 'Approved', orderSub: 'PO #4824', iris: 'Seasonal uptick expected in Q3', queue: 'approved' },
  { id: 'p13', sku: '63-22910-31', name: 'Trane TXV bi-flow valve', branch: 'HOU', cls: 'BX', onHand: 41, incoming: 6, leadTime: 10, value: 8000, source: { kind: 'route', to: 'DAL' }, exception: 'high', orderTitle: 'Approved', orderSub: 'PO #4825', iris: 'Surplus in HOU; transfer to DAL', queue: 'approved' },
]

const QUEUES: { id: Queue; label: string }[] = [
  { id: 'review', label: 'Review Queue' },
  { id: 'onhold', label: 'On Hold Queue' },
  { id: 'rejected', label: 'Rejected & Returned' },
  { id: 'approved', label: 'Approved' },
]

const fmtUSD = (n: number) => `$${n.toLocaleString('en-US')}`

/** How long ago each row was last touched — drives the "All time" window filter. */
const AGE_DAYS: Record<string, number> = {
  p1: 1, p2: 2, p3: 5, p4: 9, p5: 14, p6: 25, p7: 40,
  p8: 3, p9: 60, p10: 7, p11: 20, p12: 75, p13: 50,
}
const timeWindowDays: Record<string, number> = { '7d': 7, '30d': 30, q: 90 }

function getValue(p: Product, key: string): string | number | undefined {
  switch (key) {
    case 'sku': return p.sku
    case 'value': return p.value
    case 'source': return p.source.kind === 'route' ? `0-${p.source.to}` : `1-${p.source.code}`
    case 'exception': return p.exception === 'critical' ? 0 : 1
    default: return undefined
  }
}

// Customizable columns (the leading selection checkbox is structural, always shown).
const DEFAULT_COLUMNS: TableColumn[] = [
  { key: 'sku', label: 'Product SKUs', hideable: false },
  { key: 'branch', label: 'Branch & Class.' },
  { key: 'onHand', label: 'On Hand' },
  { key: 'incoming', label: 'Incoming' },
  { key: 'leadTime', label: 'Lead Time' },
  { key: 'value', label: 'Value' },
  { key: 'source', label: 'Source' },
  { key: 'exception', label: 'Exception' },
  { key: 'orderInsight', label: 'Order Insight' },
  { key: 'irisInsight', label: 'Iris Insight' },
]

/** Tiny neutral "branch · class" pills (Pill sm with a duotone glyph). */
function BranchClass({ branch, cls }: { branch: string; cls: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[var(--text-secondary)]">
      <Pill variant="neutral" size="sm" icon={<Warehouse weight="duotone" />}>{branch}</Pill>
      <span aria-hidden="true">·</span>
      <Pill variant="neutral" size="sm" icon={<DiamondsFour weight="duotone" />}>{cls}</Pill>
    </span>
  )
}

export function ProductCatalogTemplate() {
  const [columns, setColumns] = React.useState<TableColumn[]>(DEFAULT_COLUMNS)
  const [search, setSearch] = React.useState('')
  const [tab, setTab] = React.useState<Queue>('review')
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)
  const [selected, setSelected] = React.useState<Set<string>>(() => new Set())
  const [excFilter, setExcFilter] = React.useState<Set<'critical' | 'high'>>(() => new Set())
  const [transfersOn, setTransfersOn] = React.useState(false)
  const [time, setTime] = React.useState<string | null>(null)

  const tabRows = React.useMemo(() => PRODUCTS.filter((p) => p.queue === tab), [tab])

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase()
    return tabRows.filter((p) => {
      const matchesSearch = !q || p.sku.toLowerCase().includes(q) || p.name.toLowerCase().includes(q)
      const matchesExc = excFilter.size === 0 || excFilter.has(p.exception)
      const matchesTransfers = !transfersOn || p.source.kind === 'route'
      const matchesTime = !time || (AGE_DAYS[p.id] ?? Infinity) <= timeWindowDays[time]
      return matchesSearch && matchesExc && matchesTransfers && matchesTime
    })
  }, [tabRows, search, excFilter, transfersOn, time])

  const { sorted, getHeadProps } = useTableSort<Product>(filtered, getValue, { key: 'sku' })
  const safePage = Math.min(page, Math.max(1, Math.ceil(sorted.length / pageSize)))
  const rows = sorted.slice((safePage - 1) * pageSize, (safePage - 1) * pageSize + pageSize)

  const toggleExc = (key: 'critical' | 'high') => {
    setExcFilter((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
    setPage(1)
  }

  const facets: FilterFacet[] = [
    {
      kind: 'toggle', key: 'critical', label: 'Critical', promoted: true, variant: 'danger',
      icon: <WarningCircle weight="duotone" />, count: tabRows.filter((p) => p.exception === 'critical').length,
      active: excFilter.has('critical'), onToggle: () => toggleExc('critical'),
    },
    {
      kind: 'toggle', key: 'high', label: 'High', promoted: true, variant: 'warning',
      icon: <Warning weight="duotone" />, count: tabRows.filter((p) => p.exception === 'high').length,
      active: excFilter.has('high'), onToggle: () => toggleExc('high'),
    },
    {
      kind: 'toggle', key: 'transfers', label: 'Transfers', promoted: true, variant: 'neutral',
      icon: <Truck weight="duotone" />, count: tabRows.filter((p) => p.source.kind === 'route').length,
      active: transfersOn, onToggle: () => { setTransfersOn((v) => !v); setPage(1) },
    },
    {
      kind: 'select', key: 'time', label: 'Time window', promoted: true, placeholder: 'All time',
      value: time, onChange: (v) => { setTime(v); setPage(1) },
      options: [
        { value: '7d', label: 'Last 7 days' },
        { value: '30d', label: 'Last 30 days' },
        { value: 'q', label: 'This quarter' },
      ],
    },
  ]

  const pageIds = rows.map((r) => r.id)
  const allOnPageSelected = pageIds.length > 0 && pageIds.every((id) => selected.has(id))
  const someOnPageSelected = pageIds.some((id) => selected.has(id))
  const toggleAll = () =>
    setSelected((prev) => {
      const next = new Set(prev)
      if (allOnPageSelected) pageIds.forEach((id) => next.delete(id))
      else pageIds.forEach((id) => next.add(id))
      return next
    })
  const toggleOne = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  // Integral empty handling — TableShell renders these centered, headers intact.
  const isFiltered = Boolean(search.trim()) || excFilter.size > 0 || transfersOn || !!time
  const clearFilters = () => {
    setSearch('')
    setExcFilter(new Set())
    setTransfersOn(false)
    setTime(null)
    setPage(1)
  }
  const emptyState = (
    <EmptyState
      icon={<Package weight="duotone" />}
      title="No products in this view"
      description="When products land in this queue, they'll show up here."
    />
  )
  const noResultsState = (
    <EmptyState
      icon={<MagnifyingGlass weight="duotone" />}
      title="No matching products"
      description="Try adjusting your search or filters."
      action={<Button variant="outline" size="sm" onClick={clearFilters}>Clear filters</Button>}
    />
  )

  const visibleColumns = columns.filter((c) => !c.hidden)

  return (
    <TableShell
      title="Product Catalog"
      icon={Storefront}
      totalItems={sorted.length}
      currentPage={safePage}
      onPageChange={setPage}
      pageSize={pageSize}
      onPageSizeChange={(s) => { setPageSize(s); setPage(1) }}
      searchValue={search}
      onSearchChange={(v) => { setSearch(v); setPage(1) }}
      searchPlaceholder="Search by any SKU"
      facets={facets}
      tabs={QUEUES.map((qd) => ({ id: qd.id, label: qd.label, badge: PRODUCTS.filter((p) => p.queue === qd.id).length }))}
      activeTab={tab}
      onTabChange={(id) => { setTab(id as Queue); setPage(1) }}
      columns={columns}
      onColumnsChange={setColumns}
      isFiltered={isFiltered}
      emptyState={emptyState}
      noResultsState={noResultsState}
    >
      <Table hoverable>
        <Table.Header>
          <Table.Row>
            <Table.HeadCell className="w-[44px]">
              <Checkbox aria-label="Select all rows" checked={allOnPageSelected} indeterminate={someOnPageSelected && !allOnPageSelected} onChange={toggleAll} />
            </Table.HeadCell>
            {visibleColumns.map((col) => {
              switch (col.key) {
                case 'sku': return <Table.HeadCell key={col.key} {...getHeadProps('sku')}>Product SKUs</Table.HeadCell>
                case 'value': return <Table.HeadCell key={col.key} {...getHeadProps('value')}>Value</Table.HeadCell>
                case 'source': return <Table.HeadCell key={col.key} {...getHeadProps('source')}>Source</Table.HeadCell>
                case 'exception': return <Table.HeadCell key={col.key} {...getHeadProps('exception')}>Exception</Table.HeadCell>
                case 'orderInsight': return <Table.HeadCell key={col.key} ai>Order Insight</Table.HeadCell>
                case 'irisInsight': return <Table.HeadCell key={col.key} ai>Iris Insight</Table.HeadCell>
                default: return <Table.HeadCell key={col.key}>{col.label}</Table.HeadCell>
              }
            })}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows.map((p) => (
            <Table.Row key={p.id} selected={selected.has(p.id)}>
              <Table.Cell data-label="">
                <Checkbox aria-label={`Select ${p.sku}`} checked={selected.has(p.id)} onChange={() => toggleOne(p.id)} />
              </Table.Cell>
              {visibleColumns.map((col) => {
                switch (col.key) {
                  case 'sku':
                    return <Table.Cell key={col.key} variant="id" value={p.sku} subtitle={p.name} data-label="Product SKUs" />
                  case 'branch':
                    return <Table.Cell key={col.key} data-label="Branch & Class."><BranchClass branch={p.branch} cls={p.cls} /></Table.Cell>
                  case 'onHand':
                    return <Table.Cell key={col.key} data-label="On Hand"><span className="text-[14px] text-[var(--text-primary)]">{p.onHand} <span className="text-[var(--text-secondary)]">units</span></span></Table.Cell>
                  case 'incoming':
                    return <Table.Cell key={col.key} data-label="Incoming"><span className="text-[14px] text-[var(--text-primary)]">{p.incoming} <span className="text-[var(--text-secondary)]">units</span></span></Table.Cell>
                  case 'leadTime':
                    return (
                      <Table.Cell key={col.key} data-label="Lead Time">
                        {p.leadTime == null ? (
                          <span className="text-[14px] text-[var(--text-neutral)]">NA</span>
                        ) : (
                          <span className="text-[14px] text-[var(--text-primary)]">{p.leadTime} <span className="text-[var(--text-secondary)]">days</span></span>
                        )}
                      </Table.Cell>
                    )
                  case 'value':
                    return <Table.Cell key={col.key} data-label="Value"><span className="text-[14px] text-[var(--text-primary)]">{fmtUSD(p.value)}</span></Table.Cell>
                  case 'source':
                    return (
                      <Table.Cell
                        key={col.key}
                        variant="pill"
                        data-label="Source"
                        pillVariant={p.source.kind === 'route' ? 'neutral' : 'info'}
                        label={p.source.kind === 'route' ? p.source.to : p.source.code}
                        icon={p.source.kind === 'route' ? (<><Truck weight="duotone" /><ArrowRight size={8} weight="duotone" /></>) : undefined}
                      />
                    )
                  case 'exception':
                    return (
                      <Table.Cell
                        key={col.key}
                        variant="pill"
                        data-label="Exception"
                        pillVariant={p.exception === 'critical' ? 'danger' : 'warning'}
                        label={p.exception === 'critical' ? 'Critical' : 'High'}
                        icon={p.exception === 'critical' ? <WarningCircle weight="duotone" /> : <Warning weight="duotone" />}
                      />
                    )
                  case 'orderInsight':
                    return (
                      <Table.Cell key={col.key} data-label="Order Insight">
                        <span className="flex flex-col">
                          <span className="text-[14px] leading-[22px] text-[var(--text-primary)] whitespace-nowrap">{p.orderTitle}</span>
                          <span className={`text-[12px] leading-[18px] whitespace-nowrap ${p.orderUrgent ? 'text-[var(--destructive)]' : 'text-[var(--text-secondary)]'}`}>{p.orderSub}</span>
                        </span>
                      </Table.Cell>
                    )
                  case 'irisInsight':
                    return <Table.Cell key={col.key} data-label="Iris Insight"><span className="text-[13px] leading-[18px] text-[var(--text-accent)]">{p.iris}</span></Table.Cell>
                  default:
                    return null
                }
              })}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </TableShell>
  )
}
