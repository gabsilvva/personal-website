import { Fragment } from 'react'

type Props = {
  text?: string | null
  /** Swap the colors: plain text is muted and `{text}` stands out. */
  inverse?: boolean
}

const TOKEN = /(\{[^}]*\}|\/\/)/g

/**
 * Renders the markup used by display titles in the CMS:
 * `{text}` is muted (or highlighted when `inverse`), `//` is the dim separator.
 * On desktop, line breaks and runs of spaces are kept, as the design uses them to offset lines
 * (e.g. leaving room for an image). On small screens the text flows freely, since breaks and
 * offsets tuned for 1440px leave orphan words.
 */
export default function Highlight({ text, inverse }: Props) {
  if (!text) return null

  const lines = text.split(/\r?\n/)

  return (
    <span className="whitespace-break-spaces max-sm:whitespace-normal">
      {lines.map((line, lineIndex) => (
        <Fragment key={lineIndex}>
          {line.split(TOKEN).map((part, index) => {
            if (!part) return null

            if (part === '//') {
              return (
                <span key={index} className="text-light-black">
                  {'//'}
                </span>
              )
            }

            if (part.startsWith('{') && part.endsWith('}')) {
              return (
                <span key={index} className={inverse ? 'text-white' : 'text-gray'}>
                  {part.slice(1, -1)}
                </span>
              )
            }

            return <Fragment key={index}>{part}</Fragment>
          })}
          {lineIndex < lines.length - 1 && (
            <>
              {/* Joins the lines on mobile; on desktop it would shift centered lines */}
              <span className="sm:hidden"> </span>
              <br className="max-sm:hidden" />
            </>
          )}
        </Fragment>
      ))}
    </span>
  )
}
