import type { Setting } from '@/payload-types'

export type HireLink = { label: string; href: string; blank: boolean }

/** WhatsApp chat link with the message already typed. */
export const whatsappLink = (number?: string | null, message?: string | null) => {
  const digits = number?.replace(/\D/g, '') ?? ''
  const query = message ? `?text=${encodeURIComponent(message)}` : ''

  return `https://wa.me/${digits}${query}`
}

/** Every "Quero contratar" button opens the WhatsApp chat set in Configurações. */
export function hireLink(settings: Setting): HireLink {
  return {
    label: settings.hire?.label || 'Quero contratar',
    href: whatsappLink(settings.whatsapp?.number, settings.whatsapp?.message),
    blank: true,
  }
}

export const isExternal = (href: string) => /^(https?:|mailto:|tel:)/.test(href)
