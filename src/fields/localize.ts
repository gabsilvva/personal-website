import type { Field, Tab } from 'payload'

const translatable = new Set(['text', 'textarea', 'richText'])

/**
 * Marks every text, textarea and rich text field as `localized`, at any depth. Arrays and groups
 * stay shared between locales, so images, icons, links and order are edited only once.
 * Fields named in `except` (URLs, numbers...) are left alone.
 */
export const localizeTextFields = <T extends Field>(fields: T[], except: string[] = []): T[] =>
  fields.map((field) => {
    if ('name' in field && except.includes(field.name)) return field

    if (translatable.has(field.type)) return { ...field, localized: true } as T

    if ('fields' in field && Array.isArray(field.fields)) {
      return { ...field, fields: localizeTextFields(field.fields, except) } as T
    }

    if (field.type === 'tabs') {
      return { ...field, tabs: localizeTabs(field.tabs, except) } as T
    }

    return field
  })

export const localizeTabs = (tabs: Tab[], except: string[] = []): Tab[] =>
  tabs.map((tab) => ({ ...tab, fields: localizeTextFields(tab.fields, except) }))
