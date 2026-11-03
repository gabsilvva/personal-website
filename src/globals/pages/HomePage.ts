import { highlightText } from '@/fields/highlightText'
import { cryptoCoins, serviceIcons } from '@/fields/icons'
import { linkGroup } from '@/fields/link'
import { pageGlobal } from './pageGlobal'

export const HomePage = pageGlobal({
  slug: 'home-page',
  label: 'Home',
  route: 'home',
  tabs: [
    {
      name: 'hero',
      label: 'Hero',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'greeting', label: 'Saudação', type: 'text', defaultValue: 'Olá!' },
            { name: 'title', label: 'Título', type: 'text' },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'rolesLeft',
              label: 'Papéis (esquerda)',
              type: 'textarea',
              admin: { rows: 2, description: 'Um por linha.' },
            },
            { name: 'rolesLabel', label: 'Texto do meio', type: 'text', defaultValue: 'e também sou' },
            {
              name: 'rolesRight',
              label: 'Papéis (direita)',
              type: 'textarea',
              admin: { rows: 2, description: 'Um por linha.' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'image', label: 'Foto', type: 'upload', relationTo: 'media' },
            { name: 'avatar', label: 'Avatar', type: 'upload', relationTo: 'media' },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'ctaLabel', label: 'CTA – rótulo', type: 'text', defaultValue: 'Eu quero' },
            { name: 'ctaTitle', label: 'CTA – título', type: 'text', defaultValue: 'Contratar' },
          ],
        },
        { name: 'text', label: 'Texto', type: 'textarea' },
      ],
    },
    {
      name: 'beliefs',
      label: 'No que eu acredito',
      fields: [
        highlightText('title', 'Título'),
        {
          name: 'items',
          label: 'Itens',
          type: 'array',
          fields: [
            { name: 'title', label: 'Título', type: 'text', required: true },
            { name: 'text', label: 'Texto', type: 'textarea' },
          ],
        },
      ],
    },
    {
      name: 'projects',
      label: 'Projetos',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'subtitle', label: 'Subtítulo', type: 'text', defaultValue: 'Projetos' },
            { name: 'buttonLabel', label: 'Texto do link', type: 'text', defaultValue: 'Ver todos' },
          ],
        },
        highlightText('title', 'Título'),
        { name: 'text', label: 'Texto', type: 'textarea' },
        {
          name: 'items',
          label: 'Projetos em destaque',
          type: 'relationship',
          relationTo: 'projects',
          hasMany: true,
        },
        linkGroup('button', 'Destino do link', { defaultPage: 'projects' }),
      ],
    },
    {
      name: 'cta',
      label: 'Chamada',
      fields: [
        highlightText('title', 'Título'),
        { name: 'image', label: 'Imagem', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      label: 'Serviços',
      fields: [
        {
          name: 'services',
          label: 'Serviços',
          type: 'array',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'title', label: 'Título', type: 'text', required: true },
                { name: 'icon', label: 'Ícone', type: 'select', options: [...serviceIcons] },
              ],
            },
            { name: 'tagline', label: 'Chamada', type: 'text' },
            { name: 'text', label: 'Texto', type: 'textarea' },
            { name: 'tags', label: 'Tags', type: 'text', hasMany: true },
            { name: 'case', label: 'Case', type: 'relationship', relationTo: 'projects' },
          ],
        },
      ],
    },
    {
      name: 'about',
      label: 'Sobre',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'subtitle', label: 'Subtítulo', type: 'text', defaultValue: 'Sobre' },
            {
              name: 'linkLabel',
              label: 'Texto do link',
              type: 'text',
              defaultValue: 'Saiba mais',
            },
          ],
        },
        linkGroup('link', 'Destino do link', { defaultPage: 'about' }),
        { name: 'title', label: 'Título', type: 'text' },
        {
          name: 'text',
          label: 'Texto',
          type: 'richText',
          admin: { description: 'Negrito aparece em destaque.' },
        },
        { name: 'image', label: 'Foto', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'process',
      label: 'Processo',
      fields: [
        highlightText('title', 'Título'),
        {
          name: 'steps',
          label: 'Etapas',
          type: 'array',
          fields: [
            { name: 'title', label: 'Título', type: 'text', required: true },
            { name: 'text', label: 'Texto', type: 'textarea' },
          ],
        },
      ],
    },
    {
      name: 'payment',
      label: 'Pagamento',
      fields: [
        { name: 'subtitle', label: 'Subtítulo', type: 'text', defaultValue: 'Praticidade' },
        highlightText('title', 'Título'),
        {
          name: 'coins',
          label: 'Moedas aceitas',
          type: 'select',
          hasMany: true,
          options: [...cryptoCoins],
        },
      ],
    },
  ],
})
