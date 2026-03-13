import { useEffect, useState } from 'react'

export type HourlyPoint = { temp: number; wind: number }

export type WeatherData = {
  hourly: HourlyPoint[]
  humidity: number
  sunrise: string
  sunset: string
  temperature: number
  weatherCode: number
  windSpeed: number
}

const WEATHER_REFRESH_MS = 10 * 60_000 // 10분

const WMO_ICONS: Record<number, string> = {
  0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
  45: '🌫️', 48: '🌫️',
  51: '🌦️', 53: '🌦️', 55: '🌧️',
  61: '🌧️', 63: '🌧️', 65: '🌧️',
  66: '🌧️', 67: '🌧️',
  71: '🌨️', 73: '🌨️', 75: '🌨️', 77: '🌨️',
  80: '🌦️', 81: '🌧️', 82: '🌧️',
  85: '🌨️', 86: '🌨️',
  95: '⛈️', 96: '⛈️', 99: '⛈️',
}

export function getWeatherIcon(code: number): string {
  return WMO_ICONS[code] ?? '🌡️'
}

export function getSunLabel(sunrise: string, sunset: string): { icon: string; time: string } {
  const now = new Date()
  const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  if (hhmm < sunrise) return { icon: '🌅', time: sunrise }
  if (hhmm < sunset) return { icon: '🌇', time: sunset }
  return { icon: '🌅', time: sunrise }
}

export function useWeather(lat: number, lng: number): WeatherData | null {
  const [data, setData] = useState<WeatherData | null>(null)

  useEffect(() => {
    let cancelled = false

    const fetchWeather = async () => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=sunrise,sunset&hourly=temperature_2m,wind_speed_10m&timezone=auto&forecast_days=1`
        const res = await fetch(url)
        if (!res.ok) return
        const json = await res.json()
        const c = json.current
        if (!cancelled) {
          const d = json.daily
          const h = json.hourly
          const currentHour = new Date().getHours()
          const hourly: HourlyPoint[] = []
          for (let i = Math.max(0, currentHour - 3); i <= Math.min(23, currentHour + 3); i++) {
            hourly.push({ temp: Math.round(h.temperature_2m[i]), wind: Math.round(h.wind_speed_10m[i]) })
          }
          setData({
            hourly,
            humidity: c.relative_humidity_2m,
            sunrise: d.sunrise[0].slice(11, 16),
            sunset: d.sunset[0].slice(11, 16),
            temperature: Math.round(c.temperature_2m),
            weatherCode: c.weather_code,
            windSpeed: Math.round(c.wind_speed_10m),
          })
        }
      } catch {
        // 실패 시 무시
      }
    }

    void fetchWeather()
    const timer = setInterval(fetchWeather, WEATHER_REFRESH_MS)
    return () => { cancelled = true; clearInterval(timer) }
  }, [lat, lng])

  return data
}
