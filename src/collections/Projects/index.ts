import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { highlightText } from '@/fields/highlightText'
import { localizeTextFields } from '@/fields/localize'
import { seoTab } from '@/fields/seoTab'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateProject, revalidateProjectDelete } from './hooks/revalidateProject'

export const Projects: CollectionConfig<'projects'> = {
  slug: 'projects',
  labels: {
    singular: 'Projeto',
    plural: 'Projetos',
  },
  // Drag-and-drop order in the admin list, used by every project listing
  orderable: true,
  access: {
    create: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
    delete: authenticated,
  },
  // Everything a project card needs, so relationships render without an extra query
  defaultPopulate: {
    title: true,
    slug: true,
    client: true,
    year: true,
    soon: true,
    url: true,
    thumbnail: true,
    technologies: true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', 'year', 'updatedAt'],
    group: 'Conteúdo',
    description: 'Trabalhos mostrados na Home e na página de Projetos.',
    livePreview: {
      url: ({ data, locale, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'projects',
          locale,
          req,
        }),
    },
    preview: (data, { locale, req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'projects',
        locale,
        req,
      }),
  },
  fields: [
    // Texts are translated; client, year, technologies and the link are shared
    ...localizeTextFields(
      [
        {
          type: 'row',
          fields: [
            { name: 'title', label: 'Título', type: 'text', required: true },
            { name: 'client', label: 'Cliente', type: 'text' },
          ],
        },
        {
          type: 'tabs',
          tabs: [
            {
              label: 'Card',
              fields: [
                {
                  name: 'thumbnail',
                  label: 'Imagem do card',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'year', label: 'Ano', type: 'text' },
                    {
                      name: 'categories',
                      label: 'Categorias',
                      type: 'select',
                      hasMany: true,
                      options: [
                        { label: 'Code', value: 'code' },
                        { label: 'Design', value: 'design' },
                      ],
                    },
                    {
                      name: 'soon',
                      label: 'Em breve',
                      type: 'checkbox',
                      admin: { style: { alignSelf: 'flex-end' } },
                    },
                  ],
                },
                { name: 'technologies', label: 'Tecnologias', type: 'text', hasMany: true },
              ],
            },
            {
              label: 'Página',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'logo', label: 'Logo do cliente', type: 'upload', relationTo: 'media' },
                    { name: 'url', label: 'Link do projeto', type: 'text' },
                  ],
                },
                { name: 'summary', label: 'Resumo', type: 'textarea' },
                { name: 'cover', label: 'Imagem principal', type: 'upload', relationTo: 'media' },
                highlightText('intro', 'Frase de abertura', {
                  admin: {
                    description: 'O texto fica em cinza; use {texto} para destacar em branco.',
                  },
                }),
                {
                  name: 'description',
                  label: 'Descrição',
                  type: 'richText',
                },
                {
                  name: 'specs',
                  label: 'Especificações',
                  type: 'group',
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'service', label: 'Serviço', type: 'text' },
                        { name: 'solution', label: 'Solução', type: 'text' },
                      ],
                    },
                    {
                      type: 'row',
                      fields: [
                        { name: 'industry', label: 'Indústria', type: 'text' },
                        { name: 'technology', label: 'Tecnologia', type: 'text' },
                      ],
                    },
                  ],
                },
              ],
            },
            seoTab(),
          ],
        },
      ],
      ['client', 'year', 'technologies', 'url'],
    ),
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidateProject],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateProjectDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // Optimal for live preview
      },
    },
    maxPerDoc: 50,
  },
}
