'use client'

import { useMemo, useState } from 'react'
import {
  DataTable,
  Pill,
  type DataTableColumn,
  type DataTableSortState,
} from '@navanta-ai/design-system'
import { ComponentPreview } from '@/app/components/component-preview'
import type { ComponentMeta } from '@/lib/component-registry'

type Order = {
  id: string
  party: string
  status: 'Open' | 'Delayed' | 'Delivered'
  qty: number
}

const ROWS: Order[] = [
  { id: 'PO-1001', party: 'Acme Distribution', status: 'Open', qty: 12 },
  { id: 'PO-1002', party: 'Northwind Traders', status: 'Delayed', qty: 4 },
  { id: 'PO-1003', party: 'Globex Supply', status: 'Delivered', qty: 23 },
  { id: 'PO-1004', party: 'Initech Parts', status: 'Open', qty: 7 },
]

const STATUS_VARIANT: Record<Order['status'], 'info' | 'warning' | 'neutral'> = {
  Open: 'info',
  Delayed: 'warning',
  Delivered: 'neutral',
}

export function DataTableDemo({ meta }: { meta: ComponentMeta }) {
  const [sort, setSort] = useState<DataTableSortState>({ field: 'id', dir: 'asc' })
  const [selected, setSelected] = useState<Set<string>>(new Set())

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

  return (
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
  )
}
