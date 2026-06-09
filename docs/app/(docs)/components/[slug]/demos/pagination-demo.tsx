'use client'

import { Pagination } from '@navanta-ai/design-system'
import { ComponentPreview } from '@/app/components/component-preview'
import type { ComponentMeta } from '@/lib/component-registry'
import { useState } from 'react'

export function PaginationDemo({ meta }: { meta: ComponentMeta }) {
  const [page, setPage] = useState(1)

  return (
    <ComponentPreview
      meta={meta}
      renderPreview={(props) => (
        <div className="flex justify-center w-full">
          <Pagination 
            total={props.total ? Number(props.total) : 100}
            page={page}
            onChange={setPage}
            pageSize={10}
            siblingCount={props.siblingCount ? Number(props.siblingCount) : 1}
            size={props.size as 'sm' | 'md' | 'lg' | undefined}
            showEdges={props.showEdges !== false}
          />
        </div>
      )}
    />
  )
}
