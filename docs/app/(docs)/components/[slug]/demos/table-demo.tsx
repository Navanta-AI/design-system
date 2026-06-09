'use client'

import * as React from 'react'
import {
  Table,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  useTableSort,
  TABLE_STATUSES,
} from '@navanta-ai/design-system'
import type { TableStatusKey } from '@navanta-ai/design-system'
import { Package } from '@phosphor-icons/react'
import { DynamicCodeBlock } from '@/app/components/dynamic-code-block'
import type { ComponentMeta } from '@/lib/component-registry'

// Fixed reference time so relative-date subtext is deterministic (no hydration drift).
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

const ORDERS: Order[] = [
  { po: '3096652', party: { initials: 'SS', title: '8119- Scott J. Smith', subtitle: 'C/O THD Store #6346 · Jacksonville, FL' }, status: 'open', ordered: NOW - 5 * MIN, eta: NOW + 2 * DAY, warehouse: 'Savannah', halstead: '20561746', insight: 'High demand — reorder soon' },
  { po: '3096653', party: { initials: 'RD', title: 'RDC #5034', subtitle: 'Breinigsville, PA' }, status: 'in-process', ordered: NOW - 1 * DAY, eta: NOW + 7 * DAY, warehouse: 'Reno', halstead: '20561747', insight: 'On track for ETA' },
  { po: '3096654', party: { initials: 'JR', title: '8119- Jonathan Robles', subtitle: 'Gillette, WY' }, status: 'shipped', ordered: NOW - 3 * DAY, eta: NOW + 14 * DAY, warehouse: 'Savannah', halstead: '20561748', insight: 'Likely to arrive early' },
  { po: '3096655', party: { initials: 'MB', title: '8119- Matthew Brown', subtitle: 'C/O THD Store #4123 · Pittsburgh, PA' }, status: 'delayed', ordered: NOW - 3 * DAY, eta: NOW + 28 * DAY, warehouse: 'Reno', halstead: '20561749', insight: 'At risk — weather delay' },
  { po: '3096656', party: { initials: 'AL', title: '8119- Amy Lee', subtitle: 'Denver, CO' }, status: 'delivered', ordered: NOW - 9 * DAY, eta: NOW - 1 * DAY, warehouse: 'Savannah', halstead: '20561750', insight: 'Delivered on time' },
]

// Stable accessor: maps a column key to a comparable value (module-level = stable identity).
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

const COLUMNS = [
  { key: 'po', label: 'HD PO #' },
  { key: 'party', label: 'Ship to' },
  { key: 'status', label: 'Status' },
  { key: 'ordered', label: 'Order Date' },
  { key: 'eta', label: 'ETA' },
  { key: 'warehouse', label: 'Warehouse' },
  { key: 'halstead', label: 'Halstead Order #' },
]

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'open', label: 'Open' },
  { value: 'in-process', label: 'In Process' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'delayed', label: 'Delayed' },
]

// ─── Shadcn-style pill toggle (matches the Button demo) ───
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

const CODE = `import { Table, useTableSort } from '@navanta-ai/design-system'
import { Package } from '@phosphor-icons/react'

const { sorted, getHeadProps } = useTableSort(orders, (o, key) => {
  if (key === 'ordered') return o.ordered // number / Date sort
  return o[key]
}, { key: 'po' }) // default sort

<Table hoverable>
  <Table.Header>
    <Table.Row>
      {/* spread getHeadProps to wire functioning sort; pass false to disable a column */}
      <Table.HeadCell {...getHeadProps('po')}>HD PO #</Table.HeadCell>
      <Table.HeadCell {...getHeadProps('ordered')}>Order Date</Table.HeadCell>
      <Table.HeadCell {...getHeadProps('warehouse', false)}>Warehouse</Table.HeadCell>
      {/* ai prop: neutral heading + the Christy AI star */}
      <Table.HeadCell ai>Christy Insight</Table.HeadCell>
      <Table.HeadCell align="right">Qty</Table.HeadCell>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {sorted.map((o) => (
      <Table.Row key={o.po}>
        <Table.Cell variant="id" value={o.po} icon={<Package weight="fill" />} href="#" />
        <Table.Cell variant="status" status={o.status} />
        <Table.Cell variant="date" date={o.ordered} />
        <Table.Cell>{o.warehouse}</Table.Cell>
        {/* AI insight — brand-colored text via the --text-accent token */}
        <Table.Cell>
          <span className="font-medium text-[var(--text-accent)]">{o.insight}</span>
        </Table.Cell>
        <Table.Cell align="right" variant="input" value={qty[o.po]} onValueChange={setQty} inputType="number" />
      </Table.Row>
    ))}
  </Table.Body>
</Table>`

export function TableDemo({ meta: _ }: { meta: ComponentMeta }) {
  const [search, setSearch] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [striped, setStriped] = React.useState(false)
  const [hoverable, setHoverable] = React.useState(true)
  const [compact, setCompact] = React.useState(false)
  const [sortable, setSortable] = React.useState<Record<string, boolean>>(
    () => Object.fromEntries(COLUMNS.map((c) => [c.key, true])),
  )
  const [qty, setQty] = React.useState<Record<string, string>>(
    () => Object.fromEntries(ORDERS.map((o) => [o.po, String((Number(o.halstead) % 40) + 1)])),
  )

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase()
    return ORDERS.filter((o) => {
      const matchesSearch =
        !q ||
        o.po.toLowerCase().includes(q) ||
        o.party.title.toLowerCase().includes(q) ||
        o.halstead.toLowerCase().includes(q)
      const matchesStatus = statusFilter === 'all' || o.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [search, statusFilter])

  const { sorted, getHeadProps } = useTableSort<Order>(filtered, getValue, { key: 'po' })

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-xl border border-[#e4e4e7] dark:border-border">
        {/* Controls bar — matches the Button demo */}
        <div className="grid grid-cols-1 gap-4 px-4 py-3 border-b border-[#e4e4e7] dark:border-border bg-[#fafafa] dark:bg-muted/10 md:grid-cols-3">
          <div className="flex w-full flex-col items-start gap-1.5">
            <ControlLabel>Search</ControlLabel>
            <Input
              className="w-full"
              placeholder="PO #, ship-to, Halstead #…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              clearable
              onClear={() => setSearch('')}
            />
          </div>

          <div className="flex w-full flex-col items-start gap-1.5">
            <ControlLabel>Status</ControlLabel>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger size="md" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_FILTERS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex w-full flex-col items-start gap-1.5">
            <ControlLabel>Density</ControlLabel>
            <div className="inline-flex flex-wrap items-center gap-0.5 rounded-lg bg-[#f4f4f5] dark:bg-muted p-1">
              <PillOption label="Striped" checked={striped} onChange={() => setStriped((v) => !v)} />
              <PillOption label="Hoverable" checked={hoverable} onChange={() => setHoverable((v) => !v)} />
              <PillOption label="Compact" checked={compact} onChange={() => setCompact((v) => !v)} />
            </div>
          </div>

          <div className="flex w-full flex-col items-start gap-1.5 md:col-span-3">
            <ControlLabel>Sortable columns — click to toggle</ControlLabel>
            <div className="inline-flex flex-wrap items-center gap-0.5 rounded-lg bg-[#f4f4f5] dark:bg-muted p-1">
              {COLUMNS.map((c) => (
                <PillOption
                  key={c.key}
                  label={c.label}
                  checked={sortable[c.key]}
                  onChange={() => setSortable((prev) => ({ ...prev, [c.key]: !prev[c.key] }))}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Live preview */}
        <div className="min-h-[280px] overflow-x-auto bg-white dark:bg-background p-6">
          <Table striped={striped} hoverable={hoverable} compact={compact}>
            <Table.Header>
              <Table.Row>
                {COLUMNS.map((c) => (
                  <Table.HeadCell key={c.key} {...getHeadProps(c.key, sortable[c.key])}>
                    {c.label}
                  </Table.HeadCell>
                ))}
                <Table.HeadCell ai>Christy Insight</Table.HeadCell>
                <Table.HeadCell align="right">Qty</Table.HeadCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {sorted.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={COLUMNS.length + 2} className="py-8 text-center text-muted-foreground">
                    No orders match your filters.
                  </Table.Cell>
                </Table.Row>
              ) : (
                sorted.map((o) => (
                  <Table.Row key={o.po}>
                    <Table.Cell variant="id" value={o.po} icon={<Package weight="fill" />} href="#" data-label="HD PO #" />
                    <Table.Cell variant="party" avatar={{ initials: o.party.initials }} title={o.party.title} subtitle={o.party.subtitle} data-label="Ship to" />
                    <Table.Cell variant="status" status={o.status} data-label="Status" />
                    <Table.Cell variant="date" date={o.ordered} now={NOW} data-label="Order Date" />
                    <Table.Cell variant="date" date={o.eta} now={NOW} data-label="ETA" />
                    <Table.Cell data-label="Warehouse">
                      <span className="text-[var(--text-primary)]">{o.warehouse}</span>
                    </Table.Cell>
                    <Table.Cell variant="id" value={o.halstead} data-label="Halstead Order #" />
                    <Table.Cell data-label="Christy Insight">
                      <span className="font-medium text-[var(--text-accent)]">{o.insight}</span>
                    </Table.Cell>
                    <Table.Cell
                      align="right"
                      variant="input"
                      value={qty[o.po]}
                      onValueChange={(v) => setQty((prev) => ({ ...prev, [o.po]: v }))}
                      inputType="number"
                      data-label="Qty"
                    />
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table>
        </div>

        {/* Code */}
        <div className="relative border-t border-[#e4e4e7] dark:border-border">
          <DynamicCodeBlock code={CODE} />
        </div>
      </div>
    </div>
  )
}
