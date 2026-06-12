'use client'

import { useState } from 'react'
import { SideNav, type SideNavSection } from '@navanta-ai/design-system'
import {
  SquaresFour,
  Package,
  Tag,
  ClipboardText,
  ChatsCircle,
  Cardholder,
  Gift,
  Briefcase,
} from '@phosphor-icons/react'
import { ComponentPreview } from '@/app/components/component-preview'
import type { ComponentMeta } from '@/lib/component-registry'

// Mirrors the HMTX portal nav: grouped sections, Phosphor icon components
// (bold at rest, fill when active).
const SECTIONS: SideNavSection[] = [
  {
    label: 'Core Operations',
    items: [
      { key: 'dashboard', label: 'Dashboard', icon: SquaresFour },
      { key: 'orders', label: 'Order Tracking', icon: Package },
      { key: 'inventory', label: 'Price & Inventory', icon: Tag },
    ],
  },
  {
    label: 'Service & Finance',
    items: [
      { key: 'claims', label: 'Claims & RMA', icon: ClipboardText },
      { key: 'cases', label: 'Case Management', icon: ChatsCircle },
      { key: 'credit', label: 'Credit', icon: Cardholder },
    ],
  },
  {
    label: 'Value-Add',
    items: [
      { key: 'loyalty', label: 'Loyalty Program', icon: Gift },
      { key: 'parts', label: 'Parts & Lookup', icon: Briefcase },
    ],
  },
]

const USER = { name: 'John Smith', description: 'Portal Admin', initials: 'JS', color: '#2b58a1' }

// Navanta brand assets (docs/public). Full wordmark in the expanded panel
// (portal scale: 40px tall), monogram on the collapsed rail (28px).
function Logo() {
  return <img src="/navanta-logo.png" alt="Navanta" className="h-10 w-auto px-2" />
}

function Monogram() {
  return <img src="/navanta-monogram.png" alt="Navanta" className="size-7" />
}

export function SideNavDemo({ meta }: { meta: ComponentMeta }) {
  const [activeKey, setActiveKey] = useState('dashboard')

  return (
    <div className="flex w-full flex-col gap-10">
      <ComponentPreview
        meta={meta}
        renderPreview={(props) => (
          // overlayIn="container" keeps the expanded panel + backdrop inside this box.
          <div className="relative flex h-[560px] w-full overflow-hidden rounded-lg border border-border bg-[var(--surface-base)]">
            <SideNav
              key={String(props.expanded)}
              sections={SECTIONS}
              activeKey={activeKey}
              onNavigate={(item) => setActiveKey(item.key)}
              defaultExpanded={Boolean(props.expanded)}
              logo={<Logo />}
              logoCollapsed={<Monogram />}
              user={props.user === false ? undefined : USER}
              onSettingsClick={props.settings === false ? undefined : () => {}}
              overlayIn="container"
            />
            <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
              Hover the rail for tooltips — items navigate, the avatar and gear are wired.
            </div>
          </div>
        )}
        codeTemplate={(props) => `import { SideNav } from '@navanta-ai/design-system'
import { SquaresFour, Package, Tag } from '@phosphor-icons/react'

const sections = [
  {
    label: 'Core Operations',
    items: [
      { key: 'dashboard', label: 'Dashboard', icon: SquaresFour },
      { key: 'orders', label: 'Order Tracking', icon: Package },
      { key: 'inventory', label: 'Price & Inventory', icon: Tag },
    ],
  },
]

<SideNav
  sections={sections}
  activeKey={activeKey}
  onNavigate={(item) => setActiveKey(item.key)}${props.expanded ? '\n  defaultExpanded' : ''}
  logo={<FullLogo />}
  logoCollapsed={<Monogram />}${props.user === false ? '' : `
  user={{ name: 'John Smith', description: 'Portal Admin', initials: 'JS' }}
  onUserClick={(anchor) => {/* open profile dropdown */}}`}${props.settings === false ? '' : `
  onSettingsClick={() => {/* go to account settings */}}`}
/>`}
      />
    </div>
  )
}
