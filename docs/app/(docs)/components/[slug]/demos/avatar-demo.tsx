'use client'

import { Avatar } from '@admin-navanta/design-system'
import { ComponentPreview } from '@/app/components/component-preview'
import type { ComponentMeta } from '@/lib/component-registry'

export function AvatarDemo({ meta }: { meta: ComponentMeta }) {
  return (
    <ComponentPreview
      meta={meta}
      renderPreview={(props) => (
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-4">
            <Avatar 
              src="https://i.pravatar.cc/150?u=a042581f4e29026024d" 
              size={props.size as any} 
              shape={props.shape as any}
              status={props.status as any}
            />
            <Avatar 
              initials="JD" 
              size={props.size as any} 
              shape={props.shape as any}
              status={props.status as any}
            />
            <Avatar 
              size={props.size as any} 
              shape={props.shape as any}
              status={props.status as any}
            />
          </div>
          <Avatar.Group max={3} size={props.size as any}>
            <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
            <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
            <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
            <Avatar initials="JD" />
            <Avatar />
          </Avatar.Group>
        </div>
      )}
    />
  )
}
