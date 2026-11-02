import type { TextareaField } from 'payload'

/**
 * Textarea for display titles. The frontend renders `{text}` in gray, `//` as the dim
 * separator and line breaks as they were typed — see `components/interface/highlight`.
 */
export const highlightText = (
  name: string,
  label: string,
  overrides: Partial<TextareaField> = {},
): TextareaField =>
  ({
    name,
    label,
    type: 'textarea',
    ...overrides,
    admin: {
      rows: 3,
      description:
        'Use {texto} para deixar em cinza e // para a barra decorativa. No desktop, quebras de linha e espaços extras são respeitados para posicionar o texto.',
      ...overrides.admin,
    },
  }) as TextareaField
