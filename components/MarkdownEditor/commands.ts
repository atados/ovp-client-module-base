import { Editor, Range } from 'slate'

export function wrapLink(editor: Editor, href: string) {
  editor.wrapInline({ type: 'link', data: { href } })
}

export function unwrapLink(editor: Editor) {
  editor.unwrapInline('link')
}

export function insertImage(editor: Editor, src: string, target: Range) {
  if (target) {
    editor.select(target)
  }

  editor.insertBlock({
    type: 'image',
    data: { src },
  })
}
