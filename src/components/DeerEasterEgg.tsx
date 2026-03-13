import { useEffect, useState } from 'react'

const DeerSvg = () => (
  <svg className="deer-svg" viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* antlers */}
    <path d="M22 12 L18 4 L16 8 M22 12 L20 3 L24 7" stroke="#8B6914" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M30 12 L34 4 L36 8 M30 12 L32 3 L28 7" stroke="#8B6914" strokeWidth="1.5" strokeLinecap="round" />
    {/* head */}
    <ellipse cx="26" cy="16" rx="6" ry="5" fill="#C4884D" />
    {/* ears */}
    <ellipse cx="19" cy="13" rx="2" ry="3" fill="#C4884D" transform="rotate(-20 19 13)" />
    <ellipse cx="33" cy="13" rx="2" ry="3" fill="#C4884D" transform="rotate(20 33 13)" />
    {/* eyes */}
    <circle cx="23.5" cy="15" r="1" fill="#2a1a00" />
    <circle cx="28.5" cy="15" r="1" fill="#2a1a00" />
    {/* nose */}
    <ellipse cx="26" cy="19" rx="1.5" ry="1" fill="#1a0a00" />
    {/* body */}
    <ellipse cx="26" cy="30" rx="10" ry="8" fill="#C4884D" />
    {/* white belly */}
    <ellipse cx="26" cy="33" rx="5" ry="4" fill="#F5E6D0" />
    {/* legs */}
    <line x1="20" y1="36" x2="18" y2="46" stroke="#A0703A" strokeWidth="2" strokeLinecap="round" />
    <line x1="24" y1="37" x2="22" y2="46" stroke="#A0703A" strokeWidth="2" strokeLinecap="round" />
    <line x1="28" y1="37" x2="30" y2="46" stroke="#A0703A" strokeWidth="2" strokeLinecap="round" />
    <line x1="32" y1="36" x2="34" y2="46" stroke="#A0703A" strokeWidth="2" strokeLinecap="round" />
    {/* tail */}
    <ellipse cx="36" cy="27" rx="2" ry="1.5" fill="#F5E6D0" />
  </svg>
)

const MIN_INTERVAL_MS = 120_000
const MAX_INTERVAL_MS = 360_000

export function DeerEasterEgg() {
  const [run, setRun] = useState<{ key: number; fromLeft: boolean } | null>(null)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>

    const scheduleNext = () => {
      const delay = MIN_INTERVAL_MS + Math.random() * (MAX_INTERVAL_MS - MIN_INTERVAL_MS)
      timer = setTimeout(() => {
        setRun({ key: Date.now(), fromLeft: Math.random() > 0.5 })
        setTimeout(() => setRun(null), 5000)
        scheduleNext()
      }, delay)
    }

    scheduleNext()
    return () => clearTimeout(timer)
  }, [])

  if (!run) return null

  return (
    <div
      key={run.key}
      className={`deer-runner ${run.fromLeft ? 'deer-from-left' : 'deer-from-right'}`}
      aria-hidden="true"
    >
      <DeerSvg />
    </div>
  )
}
