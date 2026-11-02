import type { GlobalConfig } from 'payload'

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
              // A page instead of a URL, so the link follows the visitor's language
              name: 'page',
              label: 'Página',
              type: 'select',
              required: true,
              options: [
                { label: 'Home', value: 'home' },
                { label: 'Projetos', value: 'projects' },
                { label: 'Sobre', value: 'about' },
                { label: 'Equipamentos', value: 'uses' },
                { label: 'Artigos', value: 'articles' },
              ],
            },
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
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateGlobal],
  },
}
