import { useEffect, useState } from 'react'
import { feeds, type MountainId } from '../data/feeds'
import { getProxyBaseUrl } from '../utils/proxy'

export type HealthStatus = 'checking' | 'live' | 'offline'

const HEALTH_CHECK_INTERVAL_MS = 60_000
const FETCH_TIMEOUT_MS = 8_000

async function checkHlsFeed(url: string): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

    const response = await fetch(url, {
      method: 'HEAD',
      mode: 'no-cors',
      signal: controller.signal,
    })

    clearTimeout(timer)
    // no-cors returns opaque response (status 0) which still means reachable
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

    // HLS
    const url = feed.sourceUrl.startsWith('http://')
      ? `${getProxyBaseUrl()}/api/proxy?target=${encodeURIComponent(feed.sourceUrl)}`
      : feed.sourceUrl
    const ok = await checkHlsFeed(url)
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
