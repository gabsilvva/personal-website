'use client'

import { OPEN_CONSENT_EVENT } from './Analytics'

/** Reopens the cookie notice so the visitor can change or withdraw consent. */
export default function ConsentButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}
      className="font-normal text-white underline hover:opacity-70"
    >
      {children}
    </button>
  )
}
