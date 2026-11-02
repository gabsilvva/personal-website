'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

type Props = {
  city?: string | null
  utc?: string | null
  timezone?: string | null
}

const format = (timezone: string) =>
  new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: timezone }).format(
    new Date(),
  )

/** "RIO, BRASIL · UTC−3 14:34" with the live local time. */
export default function Location({ city, utc, timezone }: Props) {
  // Rendered only after hydration, so the server and client clocks never disagree
  const [time, setTime] = useState<string | null>(null)

  useEffect(() => {
    if (!timezone) return

    const tick = () => setTime(format(timezone))
    const timeout = setTimeout(tick, 0)
    const interval = setInterval(tick, 30_000)

    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [timezone])

  return (
    <div className="flex items-center gap-4">
      <Image src="/svg/christ.svg" alt="" width={41} height={48} />
      {/* The online dot sits on the first line, at the right end of the block */}
      <div className="relative pr-7 text-[13px] leading-[1.4]">
        {city && <p className="text-[13px] leading-[1.4] font-medium text-white uppercase">{city}</p>}
        <p className="text-[13px] leading-[1.4] font-light text-gray">
          {utc} {time && <span className="ml-1">{time}</span>}
        </p>
        <span className="absolute top-[3px] right-0 size-3">
          <span className="absolute inset-0 rounded-full bg-online motion-safe:animate-[pulse-ring_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
          <Image src="/svg/online-dot.svg" alt="" width={12} height={12} className="relative" />
        </span>
      </div>
    </div>
  )
}
