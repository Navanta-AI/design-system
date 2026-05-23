'use client'

import { Table } from '@navanta/design-system'
import { ComponentPreview } from '@/app/components/component-preview'
import type { ComponentMeta } from '@/lib/component-registry'

export function TableDemo({ meta }: { meta: ComponentMeta }) {
  return (
    <ComponentPreview
      meta={meta}
      renderPreview={(props) => (
        <div className="w-full">
          <Table 
            striped={props.striped as boolean | undefined} 
            hoverable={props.hoverable as boolean | undefined}
            compact={props.compact as boolean | undefined}
          >
            <Table.Header>
              <Table.Row>
                <Table.HeadCell>Invoice</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Method</Table.HeadCell>
                <Table.HeadCell align="right">Amount</Table.HeadCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell mono data-label="Invoice">INV001</Table.Cell>
                <Table.Cell data-label="Status">Paid</Table.Cell>
                <Table.Cell data-label="Method">Credit Card</Table.Cell>
                <Table.Cell align="right" data-label="Amount">$250.00</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell mono data-label="Invoice">INV002</Table.Cell>
                <Table.Cell data-label="Status">Pending</Table.Cell>
                <Table.Cell data-label="Method">PayPal</Table.Cell>
                <Table.Cell align="right" data-label="Amount">$150.00</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell mono data-label="Invoice">INV003</Table.Cell>
                <Table.Cell data-label="Status">Unpaid</Table.Cell>
                <Table.Cell data-label="Method">Bank Transfer</Table.Cell>
                <Table.Cell align="right" data-label="Amount">$350.00</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>
      )}
    />
  )
}
