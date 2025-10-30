import { useState, type ComponentProps, useEffect } from 'react'
import { codeToHtml } from 'shiki'
import { cn } from '../../lib/utils'

interface CodeBlockProps extends ComponentProps<'div'> {
  code: string
  language?: string
}

export function CodeBlock({
  className,
  code,
  language = 'json',
  ...props
}: CodeBlockProps) {
  const [parsedCode, setParsedCode] = useState('')

  useEffect(() => {
    if (code) {
      codeToHtml(code, { lang: language, theme: 'vesper' }).then((parsed) =>
        setParsedCode(parsed),
      )
    }
  }, [code, language])

  return (
    <div
      className={cn(
        'relative rounded-lg border border-zinc-700 overflow-x-auto',
        className,
      )}
      {...props}
    >
      <div
        className="[&_pre]:p-4 [&_pre]:text-sm [&_pre]:font-mono [&_pre]:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: parsedCode }}
      />
    </div>
  )
}
