import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import RichText from '@/components/interface/rich-text/RichText'
import Subtitle from '@/components/interface/subtitle/Subtitle'
import Container from '@/components/layout/container/Container'

type Props = {
  title: string
  description?: SerializedEditorState | null
  rows: Array<{ label: string; value?: string | null }>
}

export default function Specs({ title, description, rows }: Props) {
  const filled = rows.filter((row) => row.value)
  if (!description && !filled.length) return null

  return (
    <section className="mt-between border-y border-light-black max-sm:mt-between-mob">
      <Container>
        <div className="grid grid-cols-[1fr_1fr] max-sm:grid-cols-1">
          <div className="py-10 pr-16 max-sm:pr-0">
            <Subtitle className="text-sm">{title}</Subtitle>
            <RichText data={description} className="mt-8 max-w-[480px]" />
          </div>
          {/* Edge to edge on both sides on mobile, so the striped rows read as a table */}
          <dl className="-mr-pd border-l border-light-black max-sm:-mx-pm max-sm:border-t max-sm:border-l-0">
            {filled.map((row, index) => (
              <div
                key={row.label}
                className={`flex h-[70px] items-center justify-between gap-6 border-b border-light-black px-6 last:border-b-0 max-sm:h-16 max-sm:px-pm ${index % 2 === 1 ? 'bg-dark-gray' : ''}`}
              >
                <dt className="text-[13px] text-gray">{row.label}</dt>
                <dd className="font-display text-right text-xl leading-none text-white">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  )
}
