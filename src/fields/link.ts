import type { Field, GroupField } from 'payload'

import type { RouteKey } from '@/i18n/routes'

type LinkType = 'page' | 'document' | 'custom'

/** The site's fixed pages. A page instead of a URL, so the link follows the visitor's language. */
export const sitePages: Array<{ label: string; value: RouteKey }> = [
  { label: 'Home', value: 'home' },
  { label: 'Projetos', value: 'projects' },
  { label: 'Sobre', value: 'about' },
  { label: 'Vida', value: 'uses' },
]

type Options = {
  defaultType?: LinkType
  defaultPage?: RouteKey
}

const when = (type: LinkType) => (_: unknown, siblingData: { type?: LinkType } | undefined) =>
  (siblingData?.type ?? 'page') === type

/**
 * Where a link goes: one of the fixed pages, a text page (privacy, terms...) or any URL.
 * External URLs open in a new tab. Spread into an array item or a group.
 */
export const linkFields = ({ defaultType = 'page', defaultPage }: Options = {}): Field[] => [
  {
    name: 'type',
    label: 'Destino',
    type: 'radio',
    defaultValue: defaultType,
    options: [
      { label: 'Página do site', value: 'page' },
      { label: 'Página de texto', value: 'document' },
      { label: 'Link externo', value: 'custom' },
    ],
    admin: { layout: 'horizontal' },
  },
  {
    name: 'page',
    label: 'Página',
    type: 'select',
    options: sitePages,
    defaultValue: defaultPage,
    validate: (value: unknown, { siblingData }: { siblingData: { type?: LinkType } }) =>
      (siblingData?.type ?? 'page') !== 'page' || !!value || 'Escolha a página.',
    admin: { condition: when('page') },
  },
  {
    name: 'document',
    label: 'Página de texto',
    type: 'relationship',
    relationTo: 'pages',
    validate: (value: unknown, { siblingData }: { siblingData: { type?: LinkType } }) =>
      siblingData?.type !== 'document' || !!value || 'Escolha a página.',
    admin: { condition: when('document') },
  },
  {
    name: 'url',
    label: 'URL',
    type: 'text',
    localized: true,
    validate: (value: unknown, { siblingData }: { siblingData: { type?: LinkType } }) =>
      siblingData?.type !== 'custom' || !!value || 'Informe o link.',
    admin: {
      condition: when('custom'),
      placeholder: 'https://',
      description: 'Links para outros sites abrem em nova aba. Pode ser diferente por idioma.',
    },
  },
]

/** `linkFields` inside a group, for a single link of a section. */
export const linkGroup = (name: string, label: string, options?: Options): GroupField => ({
  name,
  label,
  type: 'group',
  fields: linkFields(options),
})
