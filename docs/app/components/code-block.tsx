import { codeToHtml } from 'shiki'
import { CopyButton } from './copy-button'

interface CodeBlockProps {
  code: string
  lang?: string
}

/**
 * Server Component — uses Shiki for syntax highlighting.
 * Zero client JS. Use for static code snippets (getting started, etc.)
 */
export async function CodeBlock({ code, lang = 'tsx' }: CodeBlockProps) {
  const lightHtml = await codeToHtml(code, {
    lang,
    theme: 'github-light',
  })
  const darkHtml = await codeToHtml(code, {
    lang,
    theme: 'github-dark-default',
  })

  return (
    <div className="relative group overflow-hidden rounded-[8px] bg-muted/30 dark:bg-muted/20">
      <CopyButton code={code} />
      <div
        dangerouslySetInnerHTML={{ __html: lightHtml }}
        className="dark:hidden [&_pre]:m-0 [&_pre]:!bg-transparent [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:text-sm [&_pre]:leading-relaxed [&_code]:font-mono"
      />
      <div
        dangerouslySetInnerHTML={{ __html: darkHtml }}
        className="hidden dark:block [&_pre]:m-0 [&_pre]:!bg-transparent [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:text-sm [&_pre]:leading-relaxed [&_code]:font-mono"
      />
    </div>
  )
}

// Re-export the client version for convenience — import from here or directly
// from dynamic-code-block.tsx
export { DynamicCodeBlock } from './dynamic-code-block'
