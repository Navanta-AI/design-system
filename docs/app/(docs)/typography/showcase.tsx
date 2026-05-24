'use client'

import { useState } from 'react'
import { Tabs, TabPanel } from '@admin-navanta/design-system'

type ViewportKey = 'desktop' | 'tablet' | 'mobile'

type TypographyRow = {
  role: string
  token: string
  fontSize: number
  fontWeight: number
  lineHeight: number
  letterSpacing: string
  preview: string
  previewTone?: 'default' | 'link'
}

type TypographyPreset = {
  id: ViewportKey
  label: string
  description: string
  rows: TypographyRow[]
}

const TYPE_SCALES: TypographyPreset[] = [
  {
    id: 'desktop',
    label: 'Desktop',
    description: 'Desktop scale with the largest heading hierarchy and comfortable body rhythm.',
    rows: [
      {
        role: 'Heading 1',
        token: 'typography.heading.h1.desktop',
        fontSize: 32,
        fontWeight: 600,
        lineHeight: 40,
        letterSpacing: '-0.02em',
        preview: 'Design system heading 1',
      },
      {
        role: 'Heading 2',
        token: 'typography.heading.h2.desktop',
        fontSize: 24,
        fontWeight: 600,
        lineHeight: 32,
        letterSpacing: '-0.01em',
        preview: 'Design system heading 2',
      },
      {
        role: 'Heading 3',
        token: 'typography.heading.h3.desktop',
        fontSize: 20,
        fontWeight: 600,
        lineHeight: 28,
        letterSpacing: '-0.005em',
        preview: 'Design system heading 3',
      },
      {
        role: 'Table heading',
        token: 'typography.table.heading.desktop',
        fontSize: 13,
        fontWeight: 600,
        lineHeight: 18,
        letterSpacing: '0em',
        preview: 'Column header',
      },
      {
        role: 'Body',
        token: 'typography.body.default.desktop',
        fontSize: 14,
        fontWeight: 400,
        lineHeight: 22,
        letterSpacing: '0em',
        preview: 'Body text for longer paragraphs and descriptions.',
      },
      {
        role: 'Body strong',
        token: 'typography.body.strong.desktop',
        fontSize: 14,
        fontWeight: 600,
        lineHeight: 22,
        letterSpacing: '0em',
        preview: 'Body strong emphasizes important content.',
      },
      {
        role: 'Link',
        token: 'typography.link.default.desktop',
        fontSize: 14,
        fontWeight: 500,
        lineHeight: 22,
        letterSpacing: '0em',
        preview: 'Open linked content',
        previewTone: 'link',
      },
      {
        role: 'Button',
        token: 'typography.button.default.desktop',
        fontSize: 14,
        fontWeight: 600,
        lineHeight: 20,
        letterSpacing: '0.01em',
        preview: 'Primary action',
      },
      {
        role: 'Caption / label / helper text',
        token: 'typography.caption.default.desktop',
        fontSize: 12,
        fontWeight: 400,
        lineHeight: 18,
        letterSpacing: '0.01em',
        preview: 'Helper text under a form field.',
      },
      {
        role: 'Foot notes',
        token: 'typography.footnote.default.desktop',
        fontSize: 11,
        fontWeight: 400,
        lineHeight: 16,
        letterSpacing: '0.01em',
        preview: 'Legal or secondary reference note.',
      },
    ],
  },
  {
    id: 'tablet',
    label: 'Tablet',
    description: 'Tablet scale reduces heading sizes while maintaining body legibility.',
    rows: [
      {
        role: 'Heading 1',
        token: 'typography.heading.h1.tablet',
        fontSize: 28,
        fontWeight: 600,
        lineHeight: 36,
        letterSpacing: '-0.02em',
        preview: 'Design system heading 1',
      },
      {
        role: 'Heading 2',
        token: 'typography.heading.h2.tablet',
        fontSize: 22,
        fontWeight: 600,
        lineHeight: 30,
        letterSpacing: '-0.01em',
        preview: 'Design system heading 2',
      },
      {
        role: 'Heading 3',
        token: 'typography.heading.h3.tablet',
        fontSize: 18,
        fontWeight: 600,
        lineHeight: 26,
        letterSpacing: '-0.005em',
        preview: 'Design system heading 3',
      },
      {
        role: 'Table heading',
        token: 'typography.table.heading.tablet',
        fontSize: 13,
        fontWeight: 600,
        lineHeight: 18,
        letterSpacing: '0em',
        preview: 'Column header',
      },
      {
        role: 'Body',
        token: 'typography.body.default.tablet',
        fontSize: 14,
        fontWeight: 400,
        lineHeight: 22,
        letterSpacing: '0em',
        preview: 'Body text for longer paragraphs and descriptions.',
      },
      {
        role: 'Body strong',
        token: 'typography.body.strong.tablet',
        fontSize: 14,
        fontWeight: 600,
        lineHeight: 22,
        letterSpacing: '0em',
        preview: 'Body strong emphasizes important content.',
      },
      {
        role: 'Link',
        token: 'typography.link.default.tablet',
        fontSize: 14,
        fontWeight: 500,
        lineHeight: 22,
        letterSpacing: '0em',
        preview: 'Open linked content',
        previewTone: 'link',
      },
      {
        role: 'Button',
        token: 'typography.button.default.tablet',
        fontSize: 14,
        fontWeight: 600,
        lineHeight: 20,
        letterSpacing: '0.01em',
        preview: 'Primary action',
      },
      {
        role: 'Caption / label / helper text',
        token: 'typography.caption.default.tablet',
        fontSize: 12,
        fontWeight: 400,
        lineHeight: 18,
        letterSpacing: '0.01em',
        preview: 'Helper text under a form field.',
      },
      {
        role: 'Foot notes',
        token: 'typography.footnote.default.tablet',
        fontSize: 11,
        fontWeight: 400,
        lineHeight: 16,
        letterSpacing: '0.01em',
        preview: 'Legal or secondary reference note.',
      },
    ],
  },
  {
    id: 'mobile',
    label: 'Mobile',
    description: 'Mobile scale for compact layouts and short-scanning reading patterns.',
    rows: [
      {
        role: 'Heading 1',
        token: 'typography.heading.h1.mobile',
        fontSize: 24,
        fontWeight: 600,
        lineHeight: 32,
        letterSpacing: '-0.015em',
        preview: 'Design system heading 1',
      },
      {
        role: 'Heading 2',
        token: 'typography.heading.h2.mobile',
        fontSize: 20,
        fontWeight: 600,
        lineHeight: 28,
        letterSpacing: '-0.01em',
        preview: 'Design system heading 2',
      },
      {
        role: 'Heading 3',
        token: 'typography.heading.h3.mobile',
        fontSize: 16,
        fontWeight: 600,
        lineHeight: 24,
        letterSpacing: '-0.005em',
        preview: 'Design system heading 3',
      },
      {
        role: 'Table heading',
        token: 'typography.table.heading.mobile',
        fontSize: 12,
        fontWeight: 600,
        lineHeight: 16,
        letterSpacing: '0.01em',
        preview: 'Column header',
      },
      {
        role: 'Body',
        token: 'typography.body.default.mobile',
        fontSize: 14,
        fontWeight: 400,
        lineHeight: 22,
        letterSpacing: '0em',
        preview: 'Body text for longer paragraphs and descriptions.',
      },
      {
        role: 'Body strong',
        token: 'typography.body.strong.mobile',
        fontSize: 14,
        fontWeight: 600,
        lineHeight: 22,
        letterSpacing: '0em',
        preview: 'Body strong emphasizes important content.',
      },
      {
        role: 'Link',
        token: 'typography.link.default.mobile',
        fontSize: 14,
        fontWeight: 500,
        lineHeight: 22,
        letterSpacing: '0em',
        preview: 'Open linked content',
        previewTone: 'link',
      },
      {
        role: 'Button',
        token: 'typography.button.default.mobile',
        fontSize: 13,
        fontWeight: 600,
        lineHeight: 18,
        letterSpacing: '0.01em',
        preview: 'Primary action',
      },
      {
        role: 'Caption / label / helper text',
        token: 'typography.caption.default.mobile',
        fontSize: 12,
        fontWeight: 400,
        lineHeight: 18,
        letterSpacing: '0.01em',
        preview: 'Helper text under a form field.',
      },
      {
        role: 'Foot notes',
        token: 'typography.footnote.default.mobile',
        fontSize: 11,
        fontWeight: 400,
        lineHeight: 16,
        letterSpacing: '0.01em',
        preview: 'Legal or secondary reference note.',
      },
    ],
  },
]

function MetaField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] uppercase tracking-[0.2px] text-muted-foreground">{label}</p>
      <p className="mt-0.5 truncate text-[13px] text-foreground" title={value}>
        {value}
      </p>
    </div>
  )
}

export function TypographyShowcase() {
  const [activeTab, setActiveTab] = useState<ViewportKey>('desktop')

  return (
    <div className="space-y-4">
      <Tabs
        tabs={TYPE_SCALES.map((scale) => ({ id: scale.id, label: scale.label }))}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as ViewportKey)}
        variant="pills"
        size="sm"
      />

      {TYPE_SCALES.map((scale) => (
        <TabPanel key={scale.id} activeTab={activeTab} tabId={scale.id} className="pt-0">
          <div className="space-y-4">
            <p className="text-[13px] leading-relaxed text-muted-foreground">{scale.description}</p>
            <p className="text-[12px] leading-relaxed text-muted-foreground">
              Switch tabs to compare typography sizes across breakpoints.
            </p>
            <div className="divide-y divide-border border-y border-border">
              {scale.rows.map((row) => (
                <div key={`${scale.id}-${row.token}`} className="py-4">
                  <div className="pb-3">
                    <span
                      className={row.previewTone === 'link' ? 'text-primary underline' : 'text-foreground'}
                      style={{
                        fontSize: `${row.fontSize}px`,
                        fontWeight: row.fontWeight,
                        lineHeight: `${row.lineHeight}px`,
                        letterSpacing: row.letterSpacing,
                      }}
                    >
                      {row.preview}
                    </span>
                  </div>
                  <div className="grid gap-x-4 gap-y-2 sm:grid-cols-2 lg:grid-cols-5">
                    <MetaField label="Type" value={row.role} />
                    <MetaField label="Font size" value={`${row.fontSize}px`} />
                    <MetaField label="Font weight" value={`${row.fontWeight}`} />
                    <MetaField label="Line height" value={`${row.lineHeight}px`} />
                    <MetaField label="Letter spacing" value={row.letterSpacing} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabPanel>
      ))}
    </div>
  )
}
