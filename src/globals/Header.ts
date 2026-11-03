import type { GlobalConfig } from 'payload'

import { linkFields } from '@/fields/link'
import { revalidateGlobal } from './hooks/revalidateGlobal'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Menu',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Site',
  },
  fields: [
    {
      name: 'navItems',
      label: 'Itens',
      type: 'array',
      maxRows: 6,
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', label: 'Texto', type: 'text', required: true, localized: true },
            {
              name: 'soon',
              label: 'Em breve',
              type: 'checkbox',
              admin: {
                style: { alignSelf: 'flex-end' },
                description: 'Mostra o selo "Soon" e desativa o link.',
              },
            },
          ],
        },
        ...linkFields(),
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateGlobal],
  },
}
