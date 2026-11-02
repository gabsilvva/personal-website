import type { GlobalConfig } from 'payload'

import { localizeTextFields } from '@/fields/localize'
import { revalidateGlobal } from './hooks/revalidateGlobal'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Rodapé',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Site',
  },
  fields: localizeTextFields([
    {
      name: 'contact',
      label: 'Bloco de contato',
      type: 'group',
      fields: [
        { name: 'subtitle', label: 'Subtítulo', type: 'text', defaultValue: 'Quero contratar' },
        {
          name: 'title',
          label: 'Título',
          type: 'textarea',
          defaultValue: 'Tem uma ideia?\nVamos colocar no ar.',
          admin: { rows: 2 },
        },
      ],
    },
    {
      name: 'legalText',
      label: 'Texto legal',
      type: 'text',
      admin: { description: 'Use {ano} (ou {year}) para o ano atual.' },
    },
    {
      name: 'legalLinks',
      label: 'Links legais',
      type: 'relationship',
      relationTo: 'pages',
      hasMany: true,
    },
  ]),
  hooks: {
    afterChange: [revalidateGlobal],
  },
}
