import { useEffect, useState } from 'react'
import { feeds, type MountainId } from '../data/feeds'
import { getProxyBaseUrl } from '../utils/proxy'

export type HealthStatus = 'checking' | 'live' | 'offline'

const HEALTH_CHECK_INTERVAL_MS = 60_000
const FETCH_TIMEOUT_MS = 8_000

async function checkViaProxy(url: string): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

    const response = await fetch(url, { signal: controller.signal })
    clearTimeout(timer)

    if (!response.ok) return false

    const text = await response.text()
    return text.includes('#EXTM3U')
  } catch {
    return false
  }
}

async function checkDirectFeed(url: string): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

    const response = await fetch(url, {
      method: 'HEAD',
      mode: 'no-cors',
      signal: controller.signal,
    })

    clearTimeout(timer)
    return response.ok || response.type === 'opaque'
  } catch {
    return false
  }
}

async function checkImageFeed(url: string): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

    const response = await fetch(url, {
      method: 'HEAD',
      mode: 'no-cors',
      signal: controller.signal,
    })

    clearTimeout(timer)
    return response.ok || response.type === 'opaque'
  } catch {
    return false
  }
}

async function checkMountainHealth(
  mountainId: MountainId,
  itsAvailable: boolean,
): Promise<boolean> {
  const mountainFeeds = feeds.filter((f) => f.mountainId === mountainId)

  for (const feed of mountainFeeds) {
    if (feed.sourceType === 'its') {
      if (itsAvailable) return true
      continue
    }

    if (feed.sourceType === 'image') {
      const ok = await checkImageFeed(feed.sourceUrl)
      if (ok) return true
      continue
    }

    // HLS: 프록시 경유 URL은 실제 m3u8 확인, 직접 URL은 HEAD
    const proxyBase = getProxyBaseUrl()
    const isAlreadyProxied = feed.sourceUrl.startsWith(proxyBase)
    const url = feed.sourceUrl.startsWith('http://') && !isAlreadyProxied
      ? `${proxyBase}/api/proxy?target=${encodeURIComponent(feed.sourceUrl)}`
      : feed.sourceUrl
    const useProxy = isAlreadyProxied || url.startsWith(proxyBase)
    const ok = useProxy ? await checkViaProxy(url) : await checkDirectFeed(url)
    if (ok) return true
  }

  return false
}

export function useFeedHealth(
  mountainIds: MountainId[],
  itsAvailable: boolean,
): Record<MountainId, HealthStatus> {
  const [health, setHealth] = useState<Record<string, HealthStatus>>(() => {
    const initial: Record<string, HealthStatus> = {}
    for (const id of mountainIds) {
      initial[id] = 'checking'
    }
    return initial
  })

  useEffect(() => {
    let cancelled = false

    const runChecks = async () => {
      const results = await Promise.all(
        mountainIds.map(async (id) => {
          const ok = await checkMountainHealth(id, itsAvailable)
          return [id, ok ? 'live' : 'offline'] as const
        }),
      )

      if (!cancelled) {
        setHealth(Object.fromEntries(results))
      }
    }

    void runChecks()
    const timer = window.setInterval(runChecks, HEALTH_CHECK_INTERVAL_MS)

    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [mountainIds, itsAvailable])

  return health as Record<MountainId, HealthStatus>
}
