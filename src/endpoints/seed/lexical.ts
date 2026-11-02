// Small builders for Lexical's JSON format, so seed content reads like prose.

type Inline = string | { bold: string } | { link: string; url: string }

const base = { format: '', indent: 0, version: 1, direction: 'ltr' as const }

const textNode = (text: string, bold = false) => ({
  type: 'text',
  text,
  format: bold ? 1 : 0,
  detail: 0,
  mode: 'normal',
  style: '',
  version: 1,
})

const inline = (part: Inline) => {
  if (typeof part === 'string') return textNode(part)
  if ('bold' in part) return textNode(part.bold, true)

  return {
    ...base,
    type: 'link',
    version: 3,
    fields: { linkType: 'custom', url: part.url, newTab: false },
    children: [textNode(part.link)],
  }
}

export const p = (...parts: Inline[]) => ({
  ...base,
  type: 'paragraph',
  textFormat: 0,
  textStyle: '',
  children: parts.map(inline),
})

export const h2 = (text: string) => ({
  ...base,
  type: 'heading',
  tag: 'h2',
  children: [textNode(text)],
})

export const ul = (...items: Inline[][]) => ({
  ...base,
  type: 'list',
  listType: 'bullet',
  tag: 'ul',
  start: 1,
  children: items.map((parts, index) => ({
    ...base,
    type: 'listitem',
    value: index + 1,
    children: parts.map(inline),
  })),
})

export const doc = (...children: object[]) =>
  ({
    root: {
      ...base,
      type: 'root',
      children,
    },
  }) as never
