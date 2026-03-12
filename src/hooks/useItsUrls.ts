import { useEffect, useState } from 'react'
import { getProxyBaseUrl } from '../utils/proxy'

let sharedUrls: Record<string, string> = {}
let lastFetchTime = 0
const POLL_MS = 20_000

async function refreshCache(): Promise<Record<string, string>> {
  const now = Date.now()
  if (now - lastFetchTime < POLL_MS && Object.keys(sharedUrls).length > 0) {
    return sharedUrls
  }

  try {
    const response = await fetch(`${getProxyBaseUrl()}/api/jejuits/urls`)
    if (response.ok) {
      sharedUrls = await response.json()
      lastFetchTime = Date.now()
    } else {
      sharedUrls = {}
    }
  } catch {
    sharedUrls = {}
  }

  return sharedUrls
}

export function useItsStreamUrl(deviceId: string | undefined): string | null {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!deviceId) {
      return
    }

    let cancelled = false

    const poll = async () => {
      const urls = await refreshCache()
      if (!cancelled) {
        setUrl(urls[deviceId] ?? null)
      }
    }

    void poll()
    const timer = window.setInterval(poll, POLL_MS)

    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [deviceId])

  return deviceId ? url : null
}

export function useItsAvailable(): boolean {
  const [available, setAvailable] = useState(false)

  useEffect(() => {
    let cancelled = false

    const check = async () => {
      const urls = await refreshCache()
      if (!cancelled) {
        setAvailable(Object.keys(urls).length > 0)
      }
    }

    void check()
    const timer = window.setInterval(check, POLL_MS)

    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [])

  return available
}
