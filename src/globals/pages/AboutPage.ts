import { highlightText } from '@/fields/highlightText'
import { pageGlobal } from './pageGlobal'

export const AboutPage = pageGlobal({
  slug: 'about-page',
  label: 'Sobre',
  route: 'about',
  tabs: [
    {
      name: 'hero',
      label: 'Hero',
      fields: [
        highlightText('title', 'Título'),
        {
          type: 'row',
          fields: [
            { name: 'subtitle', label: 'Subtítulo', type: 'text' },
            { name: 'image', label: 'Avatar', type: 'upload', relationTo: 'media' },
          ],
        },
        { name: 'text', label: 'Texto', type: 'textarea' },
      ],
    },
    {
      name: 'story',
      label: 'História',
      fields: [
        { name: 'subtitle', label: 'Subtítulo', type: 'text', defaultValue: 'História' },
        {
          name: 'text',
          label: 'Texto',
          type: 'richText',
          admin: { description: 'Negrito aparece em destaque.' },
        },
        {
          name: 'favorites',
          label: 'Favoritos',
          type: 'array',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'label', label: 'Rótulo', type: 'text', required: true },
                { name: 'value', label: 'Valor', type: 'text', required: true },
              ],
            },
          ],
        },
        { name: 'image', label: 'Imagem', type: 'upload', relationTo: 'media' },
        {
          name: 'linksSubtitle',
          label: 'Subtítulo dos links',
          type: 'text',
          defaultValue: 'Links úteis',
          admin: { description: 'Os links vêm de Configurações › Redes sociais.' },
        },
      ],
    },
    {
      name: 'career',
      label: 'Carreira',
      fields: [
        highlightText('title', 'Título'),
        { name: 'text', label: 'Texto', type: 'textarea' },
        {
          name: 'experiences',
          label: 'Experiências',
          type: 'array',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'type',
                  label: 'Tipo',
                  type: 'select',
                  defaultValue: 'work',
                  options: [
                    { label: 'Trabalho', value: 'work' },
                    { label: 'Formação', value: 'education' },
                  ],
                },
                { name: 'company', label: 'Empresa', type: 'text', required: true },
                { name: 'period', label: 'Período', type: 'text' },
              ],
            },
            {
              name: 'roles',
              label: 'Cargos',
              type: 'text',
              hasMany: true,
              admin: { description: 'Do mais antigo para o atual.' },
            },
            { name: 'logo', label: 'Logo', type: 'upload', relationTo: 'media' },
            { name: 'text', label: 'Texto', type: 'textarea' },
            { name: 'tags', label: 'Tags', type: 'text', hasMany: true },
            { name: 'location', label: 'Local', type: 'text' },
          ],
        },
      ],
    },
  ],
})
