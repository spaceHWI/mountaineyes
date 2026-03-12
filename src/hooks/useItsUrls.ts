import { useEffect, useState } from 'react'

const envBase = import.meta.env.VITE_PROXY_BASE_URL as string | undefined
const proxyBaseUrl = envBase ? envBase.replace(/\/$/, '') : ''

let sharedUrls: Record<string, string> = {}
let lastFetchTime = 0
const POLL_MS = 20_000

async function refreshCache(): Promise<Record<string, string>> {
  const now = Date.now()
  if (now - lastFetchTime < POLL_MS && Object.keys(sharedUrls).length > 0) {
    return sharedUrls
  }

  try {
    const res = await fetch(`${proxyBaseUrl}/api/jejuits/urls`)
    if (res.ok) {
      sharedUrls = await res.json()
      lastFetchTime = Date.now()
    }
  } catch {
    /* network error – keep stale cache */
  }

  return sharedUrls
}

export function useItsStreamUrl(deviceId: string | undefined): string | null {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!deviceId) return

    let cancelled = false

    const poll = async () => {
      const urls = await refreshCache()
      if (!cancelled) setUrl(urls[deviceId] ?? null)
    }

    void poll()
    const timer = setInterval(poll, POLL_MS)
    return () => {
      cancelled = true
      clearInterval(timer)
    }
  }, [deviceId])

  return url
}

export function useItsAvailable(): boolean {
  const [available, setAvailable] = useState(false)

  useEffect(() => {
    let cancelled = false

    const check = async () => {
      const urls = await refreshCache()
      if (!cancelled) setAvailable(Object.keys(urls).length > 0)
    }

    void check()
    const timer = setInterval(check, POLL_MS)
    return () => {
      cancelled = true
      clearInterval(timer)
    }
  }, [])

  return available
}
