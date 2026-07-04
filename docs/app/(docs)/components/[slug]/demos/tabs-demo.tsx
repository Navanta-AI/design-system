'use client'

import { Tabs, TabPanel } from '@navanta-ai/design-system'
import { ComponentPreview } from '@/app/components/component-preview'
import type { ComponentMeta } from '@/lib/component-registry'
import { useState } from 'react'
import { User, Lock, PlugsConnected, CreditCard } from '@phosphor-icons/react'

interface TabsDemoProps {
  meta: ComponentMeta
}

export function TabsDemo({ meta }: TabsDemoProps) {
  const [activeTab, setActiveTab] = useState('tab1')
  const [iconTab, setIconTab] = useState('account')

  // Any tab can carry an `icon` alongside its `label` — the icon renders leading
  // the title, in every variant.
  const iconTabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'integrations', label: 'Integrations', icon: PlugsConnected, badge: 'New' },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ]

  return (
    <div className="flex w-full flex-col gap-10">
      <ComponentPreview
        meta={meta}
        renderPreview={(props) => {
          const withIcons = props.icons as boolean | undefined
          const tabs = [
            { id: 'tab1', label: 'Account', icon: withIcons ? User : undefined },
            { id: 'tab2', label: 'Security', icon: withIcons ? Lock : undefined },
            { id: 'tab3', label: 'Integrations', badge: 'New', icon: withIcons ? PlugsConnected : undefined },
            { id: 'tab4', label: 'Billing', disabled: props.disabled as boolean | undefined, icon: withIcons ? CreditCard : undefined }
          ]

          return (
            <div className="w-full max-w-lg mx-auto">
              <Tabs
                tabs={tabs}
                activeTab={activeTab}
                onChange={(id) => setActiveTab(id)}
                variant={props.variant as 'underline' | 'pills' | 'bordered' | undefined}
                size={props.size as 'sm' | 'md' | 'lg' | undefined}
                fullWidth={props.fullWidth as boolean | undefined}
              />
              <div className="p-4 mt-2 border border-border rounded-lg bg-card text-card-foreground">
                <TabPanel activeTab={activeTab} tabId="tab1">
                  Make changes to your account here. Click save when you're done.
                </TabPanel>
                <TabPanel activeTab={activeTab} tabId="tab2">
                  Change your password and secure your account here.
                </TabPanel>
                <TabPanel activeTab={activeTab} tabId="tab3">
                  Connect your account to third-party integrations.
                </TabPanel>
              </div>
            </div>
          )
        }}
        codeTemplate={(props) => {
          const icons = props.icons as boolean | undefined
          const variant = (props.variant as string) ?? 'underline'
          const size = (props.size as string) ?? 'md'
          const iconImport = icons ? `\nimport { User, Lock } from '@phosphor-icons/react'` : ''
          const attrs = [
            variant !== 'underline' ? `\n  variant="${variant}"` : '',
            size !== 'md' ? `\n  size="${size}"` : '',
            props.fullWidth ? `\n  fullWidth` : '',
          ].join('')
          return `import { Tabs } from '@navanta-ai/design-system'${iconImport}

<Tabs${attrs}
  tabs={[
    { id: 'account', label: 'Account'${icons ? ', icon: User' : ''} },
    { id: 'security', label: 'Security'${icons ? ', icon: Lock' : ''} },
  ]}
/>`
        }}
      />

      {/* Icon + text — a leading icon per tab, works in every variant */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Icon + text
        </span>
        <div className="w-full max-w-lg">
          <Tabs tabs={iconTabs} activeTab={iconTab} onChange={setIconTab} variant="underline" />
        </div>
      </div>
    </div>
  )
}
