import { useEffect, useState } from 'react'

const DEER_COLOR = '#2f6a53'

const DEER_SVG = (
  <svg viewBox="0 0 64 48" fill="none" className="deer-svg">
    {/* antler L */}
    <path d="M44 12 L41 5 L39 8 M41 5 L43 3" stroke={DEER_COLOR} strokeWidth="1.8" strokeLinecap="round" />
    {/* antler R */}
    <path d="M50 12 L53 5 L55 8 M53 5 L51 3" stroke={DEER_COLOR} strokeWidth="1.8" strokeLinecap="round" />
    {/* head */}
    <ellipse cx="47" cy="18" rx="5.5" ry="5" fill={DEER_COLOR} />
    {/* ear L */}
    <ellipse cx="43" cy="12" rx="1.8" ry="3.5" fill={DEER_COLOR} transform="rotate(-15 43 12)" />
    {/* ear R */}
    <ellipse cx="51" cy="12" rx="1.8" ry="3.5" fill={DEER_COLOR} transform="rotate(15 51 12)" />
    {/* eye */}
    <circle cx="49" cy="17" r="1" fill="#fff" />
    {/* neck */}
    <path d="M42 22 Q38 26 36 28" stroke={DEER_COLOR} strokeWidth="5" strokeLinecap="round" />
    {/* body */}
    <ellipse cx="28" cy="30" rx="14" ry="8" fill={DEER_COLOR} />
    {/* tail */}
    <path d="M14 26 Q10 22 12 20" stroke={DEER_COLOR} strokeWidth="2" strokeLinecap="round" />
    {/* legs */}
    <line x1="20" y1="36" x2="18" y2="46" stroke={DEER_COLOR} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="26" y1="37" x2="25" y2="46" stroke={DEER_COLOR} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="32" y1="37" x2="33" y2="46" stroke={DEER_COLOR} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="38" y1="36" x2="40" y2="46" stroke={DEER_COLOR} strokeWidth="2.5" strokeLinecap="round" />
  </svg>
)

const FIRST_DELAY_MS = 3_000
const HIDE_DELAY_MS = 4_500
const MIN_INTERVAL_MS = 30_000
const MAX_INTERVAL_MS = 120_000

export function DeerEasterEgg() {
  const [visible, setVisible] = useState(false)
  const [fromRight, setFromRight] = useState(false)

  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout>
    let hideTimerId: ReturnType<typeof setTimeout>

    const show = () => {
      setFromRight(Math.random() > 0.5)
      setVisible(true)
      hideTimerId = setTimeout(() => setVisible(false), HIDE_DELAY_MS)
    }

    const scheduleNext = () => {
      const delay = MIN_INTERVAL_MS + Math.random() * (MAX_INTERVAL_MS - MIN_INTERVAL_MS)
      timerId = setTimeout(() => {
        show()
        scheduleNext()
      }, delay)
    }

    timerId = setTimeout(() => {
      show()
      scheduleNext()
    }, FIRST_DELAY_MS)

    return () => {
      clearTimeout(timerId)
      clearTimeout(hideTimerId)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      className={`deer-runner ${fromRight ? 'deer-from-right' : 'deer-from-left'}`}
      aria-hidden="true"
    >
      {DEER_SVG}
    </div>
  )
}
