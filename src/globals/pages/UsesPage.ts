import { highlightText } from '@/fields/highlightText'
import { usesIcons } from '@/fields/icons'
import { pageGlobal } from './pageGlobal'

export const UsesPage = pageGlobal({
  slug: 'uses-page',
  label: 'Equipamentos',
  route: 'uses',
  tabs: [
    {
      label: 'Conteúdo',
      fields: [
        { name: 'subtitle', label: 'Subtítulo', type: 'text', defaultValue: 'Equipamentos' },
        highlightText('title', 'Título'),
        {
          name: 'categories',
          label: 'Categorias',
          type: 'array',
          admin: { initCollapsed: true },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'title', label: 'Título', type: 'text', required: true },
                { name: 'icon', label: 'Ícone', type: 'select', options: [...usesIcons] },
              ],
            },
            {
              name: 'items',
              label: 'Itens',
              type: 'array',
              admin: { initCollapsed: true },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'name', label: 'Nome', type: 'text', required: true },
                    { name: 'description', label: 'Descrição', type: 'text' },
                    { name: 'url', label: 'Link', type: 'text' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
})
