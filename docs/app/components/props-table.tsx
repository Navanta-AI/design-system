import { Table } from '@admin-navanta/design-system'
import type { PropDef } from '@/lib/component-registry'

interface PropsTableProps {
  props: PropDef[]
}

export function PropsTable({ props }: PropsTableProps) {
  return (
    <Table compact className="w-full">
      <Table.Header>
        <Table.Row>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Type</Table.HeadCell>
          <Table.HeadCell>Default</Table.HeadCell>
          <Table.HeadCell>Description</Table.HeadCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {props.map((prop) => (
          <Table.Row key={prop.name}>
            <Table.Cell mono data-label="Name">
              <code className="text-primary">{prop.name}</code>
            </Table.Cell>
            <Table.Cell mono data-label="Type">
              <code className="text-muted-foreground">
                {prop.type}
              </code>
            </Table.Cell>
            <Table.Cell mono data-label="Default">
              <code>{prop.default ?? '—'}</code>
            </Table.Cell>
            <Table.Cell data-label="Description">{prop.description}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}
