import type { GlobalConfig } from 'payload'

import { socialIcons } from '@/fields/icons'
import { revalidateGlobal } from './hooks/revalidateGlobal'

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Configurações',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Site',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'seo',
          label: 'SEO',
          description:
            'Padrão do site: usado na Home e em qualquer página cuja aba SEO esteja vazia.',
          fields: [
            {
              name: 'title',
              label: 'Título do site',
              type: 'text',
              localized: true,
              admin: { description: 'Título da Home nos buscadores e ao compartilhar.' },
            },
            {
              name: 'description',
              label: 'Descrição padrão',
              type: 'textarea',
              localized: true,
              admin: { rows: 3, description: 'Entre 120 e 160 caracteres.' },
            },
            {
              name: 'image',
              label: 'Imagem de compartilhamento padrão',
              type: 'upload',
              relationTo: 'media',
              admin: { description: '1200 × 630 px. Aparece ao compartilhar o link em redes e apps.' },
            },
          ],
        },
        {
          label: 'Contato',
          fields: [
            { name: 'email', label: 'E-mail', type: 'email', required: true },
            {
              name: 'whatsapp',
              label: 'WhatsApp',
              type: 'group',
              admin: { description: 'Todos os botões de contratação do site abrem esta conversa.' },
              fields: [
                {
                  name: 'number',
                  label: 'Número',
                  type: 'text',
                  admin: {
                    placeholder: '5521999999999',
                    description: 'Com DDI e DDD, só números.',
                  },
                },
                {
                  name: 'message',
                  label: 'Mensagem inicial',
                  type: 'textarea',
                  localized: true,
                  admin: { rows: 2, description: 'Texto que já aparece digitado na conversa.' },
                },
              ],
            },
            {
              name: 'hire',
              label: 'Botão "Quero contratar"',
              type: 'group',
              fields: [
                {
                  name: 'label',
                  label: 'Texto',
                  type: 'text',
                  localized: true,
                  defaultValue: 'Quero contratar',
                },
              ],
            },
            {
              name: 'location',
              label: 'Localização',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'city',
                      label: 'Cidade',
                      type: 'text',
                      localized: true,
                      defaultValue: 'Rio, Brasil',
                    },
                    { name: 'utc', label: 'Fuso (texto)', type: 'text', defaultValue: 'UTC−3' },
                    {
                      name: 'timezone',
                      label: 'Fuso (IANA)',
                      type: 'text',
                      defaultValue: 'America/Sao_Paulo',
                      admin: { description: 'Usado para mostrar a hora local.' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Redes sociais',
          fields: [
            {
              name: 'socials',
              label: 'Links',
              type: 'array',
              admin: {
                initCollapsed: true,
                description: 'Todos aparecem em "Links úteis" na página Sobre.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', label: 'Nome', type: 'text', required: true, localized: true },
                    {
                      name: 'url',
                      label: 'Link',
                      type: 'text',
                      required: true,
                      localized: true,
                      admin: {
                        description:
                          'Pode ser diferente por idioma (ex.: /equipamentos e /en/uses).',
                      },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'icon',
                      label: 'Ícone',
                      type: 'select',
                      options: [...socialIcons],
                    },
                    {
                      name: 'showInFooter',
                      label: 'Mostrar no rodapé',
                      type: 'checkbox',
                      admin: { style: { alignSelf: 'flex-end' } },
                    },
                    {
                      name: 'highlight',
                      label: 'Destacar',
                      type: 'checkbox',
                      admin: { style: { alignSelf: 'flex-end' } },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Números',
          fields: [
            {
              name: 'stats',
              label: 'Números',
              type: 'array',
              maxRows: 4,
              admin: { description: 'Aparecem na Home e na página Sobre.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'value', label: 'Valor', type: 'text', required: true },
                    {
                      name: 'label',
                      label: 'Descrição',
                      type: 'text',
                      required: true,
                      localized: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Stack',
          fields: [
            {
              name: 'stack',
              label: 'Grupos',
              type: 'array',
              maxRows: 3,
              admin: { description: 'Aparece na Home e na página Sobre.' },
              fields: [
                { name: 'title', label: 'Título', type: 'text', required: true, localized: true },
                {
                  name: 'items',
                  label: 'Tecnologias',
                  type: 'array',
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'name',
                          label: 'Nome',
                          type: 'text',
                          required: true,
                          admin: { description: 'Separe várias com " / ".' },
                        },
                        {
                          name: 'years',
                          label: 'Tempo',
                          type: 'text',
                          admin: { placeholder: '4y' },
                        },
                      ],
                    },
                  ],
                },
              ],
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
