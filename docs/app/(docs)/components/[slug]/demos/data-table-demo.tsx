'use client'

import { useMemo, useState } from 'react'
import {
  DataTable,
  Pill,
  Button,
  TableShell,
  ColumnFilterMenu,
  type DataTableColumn,
  type DataTableSortState,
  type FilterFacet,
} from '@navanta-ai/design-system'
import { CaretRight, PencilSimple, Trash } from '@phosphor-icons/react'
import { ComponentPreview } from '@/app/components/component-preview'
import type { ComponentMeta } from '@/lib/component-registry'

type Order = {
  id: string
  party: string
  status: 'Open' | 'Delayed' | 'Delivered'
  warehouse: string
  qty: number
}

const ROWS: Order[] = [
  { id: 'PO-1001', party: 'Acme Distribution', status: 'Open', warehouse: 'Savannah', qty: 12 },
  { id: 'PO-1002', party: 'Northwind Traders', status: 'Delayed', warehouse: 'Reno', qty: 4 },
  { id: 'PO-1003', party: 'Globex Supply', status: 'Delivered', warehouse: 'Dallas', qty: 23 },
  { id: 'PO-1004', party: 'Initech Parts', status: 'Open', warehouse: 'Memphis', qty: 7 },
  { id: 'PO-1005', party: 'Umbrella Corp', status: 'Delayed', warehouse: 'Phoenix', qty: 9 },
  { id: 'PO-1006', party: 'Stark Industries', status: 'Delivered', warehouse: 'Columbus', qty: 31 },
  { id: 'PO-1007', party: 'Wayne Freight', status: 'Open', warehouse: 'Newark', qty: 5 },
  { id: 'PO-1008', party: 'Wonka Logistics', status: 'Delivered', warehouse: 'Tacoma', qty: 18 },
]

const STATUS_VARIANT: Record<Order['status'], 'info' | 'warning' | 'neutral'> = {
  Open: 'info',
  Delayed: 'warning',
  Delivered: 'neutral',
}

const STATUS_OPTIONS = [
  { value: 'Open', label: 'Open' },
  { value: 'Delayed', label: 'Delayed' },
  { value: 'Delivered', label: 'Delivered' },
]

// 8 distinct values (> 7) — the ColumnFilterMenu auto-adds a search field.
const WAREHOUSE_OPTIONS = [...new Set(ROWS.map((r) => r.warehouse))].map((w) => ({ value: w, label: w }))

/**
 * Column filter/sort menu synced with the TableShell filter band. The Status
 * column header's `ColumnFilterMenu` and the TableShell `toggle-group` facet both
 * bind to the SAME `statusVals` state — so a selection made in the column popover
 * shows as chips in the band above (the existing facet component), and vice versa.
 */
function ColumnFilterExample() {
  const [statusVals, setStatusVals] = useState<string[]>([])
  const [warehouseVals, setWarehouseVals] = useState<string[]>([])
  const [sort, setSort] = useState<DataTableSortState>({ field: null, dir: 'asc' })
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const toggleStatus = (v: string) =>
    setStatusVals((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]))
  const toggleWarehouse = (v: string) =>
    setWarehouseVals((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]))

  const rows = useMemo(() => {
    let out = ROWS.filter(
      (r) =>
        (statusVals.length === 0 || statusVals.includes(r.status)) &&
        (warehouseVals.length === 0 || warehouseVals.includes(r.warehouse)),
    )
    if (sort.field) {
      const dir = sort.dir === 'asc' ? 1 : -1
      const f = sort.field
      out = [...out].sort((a, b) => {
        const av = (a as Record<string, unknown>)[f]
        const bv = (b as Record<string, unknown>)[f]
        if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir
        return String(av).localeCompare(String(bv)) * dir
      })
    }
    return out
  }, [statusVals, warehouseVals, sort])

  // Shared facet — bound to the same statusVals the column menu edits.
  const statusFacet: FilterFacet = {
    kind: 'toggle-group',
    key: 'status',
    label: 'Status',
    promoted: true,
    options: STATUS_OPTIONS,
    value: statusVals,
    onChange: setStatusVals,
  }

  const cols: DataTableColumn<Order>[] = [
    { key: 'id', label: 'Order', width: 120, cell: (r) => r.id },
    { key: 'party', label: 'Ship to', sortable: true, cell: (r) => r.party },
    {
      key: 'status',
      label: 'Status',
      width: 150,
      sortable: false, // the funnel owns sort
      headerCell: (ctx) => (
        <ColumnFilterMenu
          label="Status"
          activeDir={ctx.sort.field === 'status' ? ctx.sort.dir : null}
          options={STATUS_OPTIONS}
          selected={statusVals}
          onSort={(dir) => setSort({ field: 'status', dir })}
          onToggle={toggleStatus}
          onClear={() => setStatusVals([])}
        />
      ),
      cell: (r) => <Pill variant={STATUS_VARIANT[r.status]}>{r.status}</Pill>,
    },
    {
      key: 'warehouse',
      label: 'Warehouse',
      width: 160,
      sortable: false, // the funnel owns sort
      headerCell: (ctx) => (
        <ColumnFilterMenu
          label="Warehouse"
          activeDir={ctx.sort.field === 'warehouse' ? ctx.sort.dir : null}
          options={WAREHOUSE_OPTIONS}
          selected={warehouseVals}
          onSort={(dir) => setSort({ field: 'warehouse', dir })}
          onToggle={toggleWarehouse}
          onClear={() => setWarehouseVals([])}
        />
      ),
      cell: (r) => r.warehouse,
    },
    { key: 'qty', label: 'Qty', align: 'right', width: 80, sortable: true, cell: (r) => r.qty },
  ]

  // Customize is auto-populated from the SAME `cols` — the first column ("Order") is
  // fixed, the rest show/hide + reorder. The shared `visibleKeys` drives both the
  // Customize popover and the DataTable, so there's no second column list to maintain.
  const [visibleKeys, setVisibleKeys] = useState<string[]>(() => cols.map((c) => c.key))

  return (
    <TableShell
      title="Orders"
      totalItems={rows.length}
      currentPage={page}
      onPageChange={setPage}
      pageSize={pageSize}
      onPageSizeChange={setPageSize}
      facets={[statusFacet]}
      columns={cols}
      visibleKeys={visibleKeys}
      onVisibleKeysChange={setVisibleKeys}
    >
      <DataTable<Order>
        columns={cols}
        data={rows}
        visibleKeys={visibleKeys}
        rowKey={(r) => r.id}
        sort={sort}
        onSortChange={setSort}
        emptyState={<span className="block py-8 text-center text-sm text-[var(--text-secondary)]">No orders match.</span>}
      />
    </TableShell>
  )
}

export function DataTableDemo({ meta }: { meta: ComponentMeta }) {
  const [sort, setSort] = useState<DataTableSortState>({ field: 'id', dir: 'asc' })
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [picked, setPicked] = useState<Set<string>>(new Set())

  const columns = useMemo<DataTableColumn<Order>[]>(
    () => [
      { key: 'id', label: 'Order', sortable: true, width: 120, cell: (r) => r.id },
      { key: 'party', label: 'Ship to', sortable: true, cell: (r) => r.party },
      {
        key: 'status',
        label: 'Status',
        width: 130,
        cell: (r) => <Pill variant={STATUS_VARIANT[r.status]}>{r.status}</Pill>,
      },
      { key: 'qty', label: 'Qty', align: 'right', sortable: true, width: 80, cell: (r) => r.qty },
    ],
    [],
  )

  const togglePicked = (id: string) =>
    setPicked((s) => {
      const n = new Set(s)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })

  return (
    <div className="flex w-full flex-col gap-10">
    <ComponentPreview
      meta={meta}
      codeTemplate={(props) => {
        const selectable = props.selectable === true
        const headerVariant = (props.headerVariant as string) || 'default'
        return `import { DataTable, Pill, type DataTableColumn } from '@navanta-ai/design-system'
import { useState } from 'react'

type Order = { id: string; party: string; status: string; qty: number }

const columns: DataTableColumn<Order>[] = [
  { key: 'id', label: 'Order', sortable: true, width: 120, cell: (r) => r.id },
  { key: 'party', label: 'Ship to', sortable: true, cell: (r) => r.party },
  { key: 'status', label: 'Status', width: 130, cell: (r) => <Pill variant="info">{r.status}</Pill> },
  { key: 'qty', label: 'Qty', align: 'right', sortable: true, width: 80, cell: (r) => r.qty },
]

export default function Example() {
  const [sort, setSort] = useState({ field: 'id', dir: 'asc' as const })${selectable ? '\n  const [selected, setSelected] = useState(new Set<string>())' : ''}
  return (
    <DataTable
      columns={columns}
      data={rows}
      rowKey={(r) => r.id}
      sort={sort}
      onSortChange={setSort}
      sortMode="client"${headerVariant !== 'default' ? `\n      headerVariant="${headerVariant}"` : ''}${
        selectable
          ? `\n      selection={{
        selected,
        onToggleRow: (id) => setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n }),
        onToggleAll: () => setSelected((s) => s.size ? new Set() : new Set(rows.map((r) => r.id))),
      }}`
          : ''
      }
    />
  )
}`
      }}
      renderPreview={(props) => {
        const selectable = props.selectable === true
        const loading = props.loading === true
        const headerVariant = (props.headerVariant as 'default' | 'filled' | 'capsule') || 'default'
        return (
          <div className="w-full overflow-x-auto rounded-lg border border-border bg-white p-4 dark:bg-background">
            <DataTable<Order>
              columns={columns}
              data={ROWS}
              rowKey={(r) => r.id}
              sort={sort}
              onSortChange={setSort}
              sortMode="client"
              headerVariant={headerVariant}
              isLoading={loading}
              selection={
                selectable
                  ? {
                      selected,
                      onToggleRow: (id) =>
                        setSelected((s) => {
                          const n = new Set(s)
                          if (n.has(id)) n.delete(id)
                          else n.add(id)
                          return n
                        }),
                      onToggleAll: () =>
                        setSelected((s) => (s.size ? new Set() : new Set(ROWS.map((r) => r.id)))),
                    }
                  : undefined
              }
            />
          </div>
        )
      }}
    />

    {/* Expandable rows · hover row-actions · sticky bulk bar */}
    <div className="flex flex-col gap-3">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Expandable rows · hover actions · bulk bar
      </span>
      <div className="w-full overflow-x-auto rounded-lg border border-border bg-white p-4 dark:bg-background">
        <DataTable<Order>
          columns={columns}
          data={ROWS}
          rowKey={(r) => r.id}
          selection={{
            selected: picked,
            onToggleRow: togglePicked,
            onToggleAll: () =>
              setPicked((s) => (s.size ? new Set() : new Set(ROWS.map((r) => r.id)))),
          }}
          renderBulkBar={(rows) => (
            <div className="mb-2 flex items-center gap-3 rounded-md border border-border bg-muted px-3 py-2 text-sm text-[var(--text-primary)]">
              <span className="font-medium">{rows.length} selected</span>
              <div className="ml-auto flex items-center gap-2">
                <Button size="sm" variant="ghost" onClick={() => setPicked(new Set())}>Clear</Button>
                <Button size="sm" variant="outline">Decline</Button>
                <Button size="sm" variant="primary">Approve</Button>
              </div>
            </div>
          )}
          isRowExpanded={(r) => r.id === expandedId}
          renderNestedRow={(r) => (
            <div className="bg-[var(--surface-sunken,#f4f4f5)] px-4 py-3 text-sm text-[var(--text-secondary)]">
              Inline editor for <span className="font-medium text-[var(--text-primary)]">{r.id}</span> — {r.party}. Any
              content can go here (override / hold / reject forms).
            </div>
          )}
          trailingSlots={[
            {
              id: 'expand',
              width: 44,
              cell: (r) => (
                <button
                  aria-label={expandedId === r.id ? 'Collapse row' : 'Expand row'}
                  className="flex size-6 items-center justify-center rounded text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
                  onClick={() => setExpandedId((cur) => (cur === r.id ? null : r.id))}
                >
                  <CaretRight
                    size={14}
                    weight="bold"
                    className="transition-transform"
                    style={{ transform: expandedId === r.id ? 'rotate(90deg)' : 'none' }}
                  />
                </button>
              ),
            },
          ]}
          rowActions={() => (
            <>
              <Button size="sm" variant="outline" iconLeft={<PencilSimple size={14} />}>Edit</Button>
              <Button size="sm" variant="outline" iconLeft={<Trash size={14} />}>Delete</Button>
            </>
          )}
        />
      </div>
    </div>

    {/* Grouped · per-group empty state */}
    <div className="flex flex-col gap-3">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Grouped · per-group empty state
      </span>
      <div className="w-full overflow-x-auto rounded-lg border border-border bg-white p-4 dark:bg-background">
        <DataTable<Order>
          columns={columns}
          rowKey={(r) => r.id}
          groups={[
            {
              key: 'open',
              header: <span className="block py-2 text-xs font-semibold uppercase text-[var(--text-secondary)]">Needs review</span>,
              rows: ROWS.filter((r) => r.status === 'Open'),
              emptyState: <span className="block py-3 text-sm text-[var(--text-secondary)]">No products need review.</span>,
            },
            {
              key: 'cleared',
              header: <span className="block py-2 text-xs font-semibold uppercase text-[var(--text-secondary)]">Pre-cleared</span>,
              rows: [],
              emptyState: <span className="block py-3 text-sm text-[var(--text-secondary)]">No pre-cleared products.</span>,
            },
          ]}
        />
      </div>
    </div>

    {/* Column filter/sort menu synced with the TableShell filter band */}
    <div className="flex flex-col gap-3">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Column filter/sort menu · syncs with the TableShell band
      </span>
      <p className="text-sm text-[var(--text-secondary)]">
        Open the funnel in the <strong>Status</strong> header — sorting and the filter checkboxes there
        drive the same state as the <strong>Status</strong> chips in the band above the table.
      </p>
      <ColumnFilterExample />
    </div>
    </div>
  )
}
