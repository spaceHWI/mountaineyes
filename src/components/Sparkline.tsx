import type { HourlyPoint } from '../hooks/useWeather'

export function Sparkline({ data }: { data: HourlyPoint[] }) {
  if (data.length < 2) return null

  const w = 64
  const h = 24
  const pad = 2

  const temps = data.map((d) => d.temp)
  const winds = data.map((d) => d.wind)
  const tMin = Math.min(...temps)
  const tMax = Math.max(...temps)
  const wMin = Math.min(...winds)
  const wMax = Math.max(...winds)

  const toPath = (values: number[], min: number, max: number) => {
    const range = max - min || 1
    return values
      .map((v, i) => {
        const x = pad + (i / (values.length - 1)) * (w - pad * 2)
        const y = h - pad - ((v - min) / range) * (h - pad * 2)
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
      })
      .join(' ')
  }

  return (
    <span className="sparkline-wrap" aria-hidden="true">
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        <path d={toPath(temps, tMin, tMax)} fill="none" stroke="#e07850" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
        <path d={toPath(winds, wMin, wMax)} fill="none" stroke="#5090c0" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" strokeDasharray="2 2" />
      </svg>
    </span>
  )
}
