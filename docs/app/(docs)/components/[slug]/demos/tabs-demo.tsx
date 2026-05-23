'use client'

import { Tabs, TabPanel } from '@navanta/design-system'
import { ComponentPreview } from '@/app/components/component-preview'
import type { ComponentMeta } from '@/lib/component-registry'
import { useState } from 'react'

interface TabsDemoProps {
  meta: ComponentMeta
}

export function TabsDemo({ meta }: TabsDemoProps) {
  const [activeTab, setActiveTab] = useState('tab1')

  return (
    <ComponentPreview
      meta={meta}
      renderPreview={(props) => {
        const tabs = [
          { id: 'tab1', label: 'Account' },
          { id: 'tab2', label: 'Security' },
          { id: 'tab3', label: 'Integrations', badge: 'New' },
          { id: 'tab4', label: 'Billing', disabled: props.disabled as boolean | undefined }
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
    />
  )
}
