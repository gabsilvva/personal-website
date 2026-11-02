import { highlightText } from '@/fields/highlightText'
import { pageGlobal } from './pageGlobal'

export const ProjectsPage = pageGlobal({
  slug: 'projects-page',
  label: 'Projetos',
  route: 'projects',
  tabs: [
    {
      name: 'banner',
      label: 'Conteúdo',
      description: 'A lista mostra todos os projetos publicados, na ordem da coleção Projetos.',
      fields: [
        { name: 'subtitle', label: 'Subtítulo', type: 'text', defaultValue: 'Projetos' },
        highlightText('title', 'Título'),
        { name: 'text', label: 'Texto', type: 'textarea' },
      ],
    },
  ],
})
