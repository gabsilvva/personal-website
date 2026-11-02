import type { DefaultNodeTypes, SerializedLinkNode } from '@payloadcms/richtext-lexical'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import {
  type JSXConvertersFunction,
  LinkJSXConverter,
  RichText as LexicalRichText,
} from '@payloadcms/richtext-lexical/react'

import { defaultLocale, type Locale } from '@/i18n/config'
import { pagePath, projectPath } from '@/i18n/routes'
import { cn } from '@/utilities/ui'

// Internal links point to the page in the language being read
const convertersFor =
  (locale: Locale): JSXConvertersFunction<DefaultNodeTypes> =>
  ({ defaultConverters }) => ({
    ...defaultConverters,
    ...LinkJSXConverter({
      internalDocToHref: ({ linkNode }: { linkNode: SerializedLinkNode }) => {
        const { value, relationTo } = linkNode.fields.doc!
        if (typeof value !== 'object') throw new Error('Expected the linked document to be populated')

        const slug = value.slug as string
        return relationTo === 'projects' ? projectPath(locale, slug) : pagePath(locale, slug)
      },
    }),
  })

type Props = {
  data?: SerializedEditorState | null
  locale?: Locale
  /** `wysiwyg` for long text, `emphasis` when bold marks the words that stand out. */
  variant?: 'wysiwyg' | 'emphasis'
  className?: string
}

export default function RichText({ data, locale = defaultLocale, variant = 'wysiwyg', className }: Props) {
  if (!data) return null

  return (
    <LexicalRichText
      data={data}
      converters={convertersFor(locale)}
      disableContainer={false}
      className={cn(variant, className)}
    />
  )
}
