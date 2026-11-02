import { notFound } from 'next/navigation'

// Any deeper path that no route matches renders the localized 404 inside the site layout
export default function CatchAll() {
  notFound()
}
