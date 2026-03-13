import { useEffect, useState } from 'react'

export type WeatherData = {
  humidity: number
  temperature: number
  weatherCode: number
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

export function useWeather(lat: number, lng: number): WeatherData | null {
  const [data, setData] = useState<WeatherData | null>(null)

  useEffect(() => {
    let cancelled = false

    const fetchWeather = async () => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code`
        const res = await fetch(url)
        if (!res.ok) return
        const json = await res.json()
        const c = json.current
        if (!cancelled) {
          setData({
            humidity: c.relative_humidity_2m,
            temperature: Math.round(c.temperature_2m),
            weatherCode: c.weather_code,
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
