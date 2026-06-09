'use client'

import { Dropzone, dropzoneUid, type DropzoneFile } from '@navanta-ai/design-system'
import { ComponentPreview } from '@/app/components/component-preview'
import type { ComponentMeta } from '@/lib/component-registry'
import { useState } from 'react'

export function DropzoneDemo({ meta }: { meta: ComponentMeta }) {
  const [files, setFiles] = useState<DropzoneFile[]>([])

  const handleAdded = (newFiles: File[]) => {
    const fresh = newFiles.map((f) => ({ file: f, id: dropzoneUid() }))
    setFiles((prev) => [...prev, ...fresh])
  }

  const handleRemove = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  return (
    <ComponentPreview
      meta={meta}
      renderPreview={(props) => (
        <div className="w-full max-w-sm mx-auto">
          <Dropzone 
            onFilesAdded={handleAdded}
            files={files}
            onFileRemove={handleRemove}
            label="Upload documents"
            description="PDF, DOCX, or Images up to 5MB"
            maxSize={props.maxSize ? Number(props.maxSize) : 5 * 1024 * 1024}
            multiple={props.multiple !== false}
            disabled={props.disabled === true}
          />
        </div>
      )}
    />
  )
}
