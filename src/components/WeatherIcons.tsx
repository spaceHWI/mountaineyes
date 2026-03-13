const C = '#2f6a53'
const S = { width: '1em', height: '1em', verticalAlign: '-0.1em' }

function Svg({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={C} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={S}>
      {children}
    </svg>
  )
}

export function IconSun() {
  return (
    <Svg>
      <circle cx="12" cy="12" r="4" fill={C} stroke="none" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </Svg>
  )
}

export function IconPartlyCloudy() {
  return (
    <Svg>
      <circle cx="9" cy="9" r="3" fill={C} stroke="none" />
      <path d="M9 3v1M9 14v1M4.22 4.22l.7.7M13.07 13.07l.7.7M3 9h1M14 9h1M4.22 13.78l.7-.7M13.07 4.93l.7-.7" />
      <path d="M17.5 19a4.5 4.5 0 100-9 4.5 4.5 0 000 9z" fill="none" stroke={C} />
      <path d="M8 19h9.5M8 19a3 3 0 010-6h.5" />
    </Svg>
  )
}

export function IconCloudy() {
  return (
    <Svg>
      <path d="M18 10a4 4 0 00-7.46-2A3.5 3.5 0 006 11.5 3.5 3.5 0 009.5 15h8a3 3 0 001-5.83" fill="none" />
    </Svg>
  )
}

export function IconFog() {
  return (
    <Svg>
      <path d="M4 8h16M4 12h16M4 16h12" />
    </Svg>
  )
}

export function IconDrizzle() {
  return (
    <Svg>
      <path d="M18 10a4 4 0 00-7.46-2A3.5 3.5 0 006 11.5 3.5 3.5 0 009.5 15h8a3 3 0 001-5.83" fill="none" />
      <path d="M8 19v1M12 19v1M16 19v1" />
    </Svg>
  )
}

export function IconRain() {
  return (
    <Svg>
      <path d="M18 10a4 4 0 00-7.46-2A3.5 3.5 0 006 11.5 3.5 3.5 0 009.5 15h8a3 3 0 001-5.83" fill="none" />
      <path d="M8 19v2M12 19v2M16 19v2" />
    </Svg>
  )
}

export function IconSnow() {
  return (
    <Svg>
      <path d="M18 10a4 4 0 00-7.46-2A3.5 3.5 0 006 11.5 3.5 3.5 0 009.5 15h8a3 3 0 001-5.83" fill="none" />
      <circle cx="8" cy="19" r="0.8" fill={C} stroke="none" />
      <circle cx="12" cy="19" r="0.8" fill={C} stroke="none" />
      <circle cx="16" cy="19" r="0.8" fill={C} stroke="none" />
      <circle cx="10" cy="21" r="0.8" fill={C} stroke="none" />
      <circle cx="14" cy="21" r="0.8" fill={C} stroke="none" />
    </Svg>
  )
}

export function IconThunder() {
  return (
    <Svg>
      <path d="M18 10a4 4 0 00-7.46-2A3.5 3.5 0 006 11.5 3.5 3.5 0 009.5 15h8a3 3 0 001-5.83" fill="none" />
      <path d="M13 16l-2 4h3l-2 4" />
    </Svg>
  )
}

export function IconSunrise() {
  return (
    <Svg>
      <path d="M12 2v4M4.93 7.93l1.41 1.41M20 12h-2M4 12H2M17.66 9.34l1.41-1.41" />
      <path d="M16 16a4 4 0 10-8 0" />
      <path d="M2 20h20" />
    </Svg>
  )
}

export function IconSunset() {
  return (
    <Svg>
      <path d="M12 8v-4M4.93 11.93l1.41-1.41M20 16h-2M4 16H2M17.66 10.34l1.41 1.41" />
      <path d="M16 20a4 4 0 10-8 0" />
      <path d="M2 24h20" />
    </Svg>
  )
}

export function IconThermometer() {
  return (
    <Svg>
      <path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z" />
    </Svg>
  )
}

type WmoIconComponent = () => React.JSX.Element

const WMO_MAP: Record<number, WmoIconComponent> = {
  0: IconSun,
  1: IconPartlyCloudy, 2: IconPartlyCloudy,
  3: IconCloudy,
  45: IconFog, 48: IconFog,
  51: IconDrizzle, 53: IconDrizzle, 55: IconRain,
  61: IconRain, 63: IconRain, 65: IconRain,
  66: IconRain, 67: IconRain,
  71: IconSnow, 73: IconSnow, 75: IconSnow, 77: IconSnow,
  80: IconDrizzle, 81: IconRain, 82: IconRain,
  85: IconSnow, 86: IconSnow,
  95: IconThunder, 96: IconThunder, 99: IconThunder,
}

export function WeatherIcon({ code }: { code: number }) {
  const Icon = WMO_MAP[code] ?? IconThermometer
  return <Icon />
}

export function SunIcon({ type }: { type: 'sunrise' | 'sunset' }) {
  return type === 'sunrise' ? <IconSunrise /> : <IconSunset />
}
