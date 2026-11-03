/**
 * Utility functions for UI components automatically added by ShadCN and used in a few of our frontend components and blocks.
 *
 * Other functions may be exported from here in the future or by installing other shadcn components.
 */

import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// The spacing tokens from globals.css (px-pd, mt-between, h-nav...), so an override such as
// `max-sm:px-0` replaces a component's `max-sm:px-pm` instead of both being kept
const twMerge = extendTailwindMerge({
  extend: { theme: { spacing: ['nav', 'nav-mob', 'pd', 'pm', 'between', 'between-mob'] } },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
