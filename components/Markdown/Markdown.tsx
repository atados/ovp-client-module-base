import baseMarked from 'marked'
import * as React from 'react'
import TurndownService from 'turndown'

// For security reasons i'm using marked and showdown
// marked does not provide a html-to-markdown convertion
// and showdown is vulnerable to XSS

interface MarkdownProps {
  readonly value: string
  readonly className?: string
}

export const turndownService = new TurndownService()

export const markdownToHtml = baseMarked.setOptions({
  breaks: true,
  sanitize: true,
})

const Markdown: React.SFC<MarkdownProps> = ({ className, value }) => (
  <div
    className={className}
    dangerouslySetInnerHTML={{ __html: markdownToHtml(value) }}
  />
)

Markdown.displayName = 'Markdown'

export default Markdown
