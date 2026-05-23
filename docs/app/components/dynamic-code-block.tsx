'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { CopyButton } from './copy-button'
import { codeToHtml } from 'shiki'

interface DynamicCodeBlockProps {
  code: string
  lang?: string
  transparentBg?: boolean
}

/**
 * Client Component — uses Shiki asynchronously.
 * Provides syntax highlighting identical to VS Code for knob-driven live updates.
 */
export function DynamicCodeBlock({ code, lang = 'tsx', transparentBg }: DynamicCodeBlockProps) {
  const [html, setHtml] = useState<string | null>(null)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    let active = true
    const theme = resolvedTheme === 'dark' ? 'github-dark-default' : 'github-light'

    codeToHtml(code, { lang, theme })
      .then((res) => {
        if (active) setHtml(res)
      })
      .catch(console.error)

    return () => {
      active = false
    }
  }, [code, lang, resolvedTheme])

  return (
    <div
      className={`relative group overflow-hidden rounded-[8px] ${
        transparentBg ? '' : 'bg-muted/30 dark:bg-muted/20'
      }`}
    >
      <CopyButton code={code} />
      {html ? (
        <div
          dangerouslySetInnerHTML={{ __html: html }}
          className={`${transparentBg ? '[&_pre]:!bg-transparent' : '[&_pre]:!bg-transparent'} [&_pre]:m-0 [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:text-sm [&_pre]:leading-relaxed [&_code]:font-mono`}
        />
      ) : (
        <pre className={`${transparentBg ? 'bg-transparent' : 'bg-transparent text-foreground'} m-0 overflow-x-auto p-4 text-sm font-mono`}>
          <code>{code}</code>
        </pre>
      )}
    </div>
  )
}
