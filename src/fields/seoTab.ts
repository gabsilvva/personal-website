import type { Tab } from 'payload'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

/**
 * SEO fields. `generate` enables the plugin's "auto-generate" buttons, which rely on the
 * document title, so it is turned off for the page globals.
 */
export const seoTab = ({ generate = true }: { generate?: boolean } = {}): Tab => ({
  name: 'meta',
  label: 'SEO',
  fields: [
    OverviewField({
      titlePath: 'meta.title',
      descriptionPath: 'meta.description',
      imagePath: 'meta.image',
    }),
    MetaTitleField({
      hasGenerateFn: generate,
    }),
    MetaImageField({
      relationTo: 'media',
    }),
    MetaDescriptionField({}),
    PreviewField({
      hasGenerateFn: generate,
      titlePath: 'meta.title',
      descriptionPath: 'meta.description',
    }),
  ],
})
