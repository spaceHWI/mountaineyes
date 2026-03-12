const JEJU_ITS_CCTV_PAGE = 'https://www.jejuits.go.kr/jido/mainView.do?DEVICE_KIND=CCTV'
const JEJU_ITS_STREAM_URL = 'https://www.jejuits.go.kr/jido/streamUrl.do'
const JEJU_ITS_STREAM_TTL_MS = 1000 * 45
const USER_AGENT = 'JejuEye/1.0'

const jejuItsStreamCache = new Map<string, { expiresAt: number; url: string }>()

const isPlaylistResponse = (target: string, contentType: string) => {
  const normalizedType = contentType.toLowerCase()

  return (
    normalizedType.includes('mpegurl') ||
    normalizedType.includes('vnd.apple.mpegurl') ||
    target.endsWith('.m3u8')
  )
}

const rewritePlaylist = (text: string, target: string) =>
  text
    .split('\n')
    .map((line) => {
      const trimmed = line.trim()

      if (trimmed.length === 0 || trimmed.startsWith('#')) {
        return line
      }

      const resolved = new URL(trimmed, target).toString()
      return `/api/proxy?target=${encodeURIComponent(resolved)}`
    })
    .join('\n')

const getCookieHeader = (headers: Headers) => {
  const cookie = headers.get('set-cookie')
  return cookie ? cookie.split(';', 1)[0] : ''
}

const jsonResponse = (message: string, status = 400) =>
  new Response(JSON.stringify({ message }), {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json; charset=utf-8',
    },
    status,
  })

const getJejuItsStreamUrl = async (deviceId: string, forceRefresh = false) => {
  if (!forceRefresh) {
    const cachedStream = jejuItsStreamCache.get(deviceId)
    if (cachedStream && cachedStream.expiresAt > Date.now()) {
      return cachedStream.url
    }
  }

  const entryPage = await fetch(JEJU_ITS_CCTV_PAGE, {
    headers: {
      'user-agent': USER_AGENT,
    },
  })

  if (!entryPage.ok) {
    throw new Error(`jeju_its_entry_${entryPage.status}`)
  }

  const cookieHeader = getCookieHeader(entryPage.headers)

  const streamResponse = await fetch(JEJU_ITS_STREAM_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      origin: 'https://www.jejuits.go.kr',
      referer: JEJU_ITS_CCTV_PAGE,
      'user-agent': USER_AGENT,
      'x-requested-with': 'XMLHttpRequest',
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
    },
    body: new URLSearchParams({ DEVICE_ID: deviceId }).toString(),
  })

  if (!streamResponse.ok) {
    throw new Error(`jeju_its_stream_${streamResponse.status}`)
  }

  const rawValue = (await streamResponse.text()).trim()
  const parsedValue = rawValue.startsWith('"') ? JSON.parse(rawValue) : rawValue

  if (!parsedValue || parsedValue === 'error' || parsedValue === 'read_error') {
    return null
  }

  jejuItsStreamCache.set(deviceId, {
    expiresAt: Date.now() + JEJU_ITS_STREAM_TTL_MS,
    url: parsedValue,
  })

  return parsedValue
}

export const onRequestGet = async ({ request }: { request: Request }) => {
  const url = new URL(request.url)
  const deviceId = url.searchParams.get('deviceId')

  if (!deviceId || !/^[a-f0-9-]{36}$/i.test(deviceId)) {
    return jsonResponse('유효하지 않은 제주 ITS CCTV ID입니다.', 400)
  }

  try {
    let target = await getJejuItsStreamUrl(deviceId)

    if (!target) {
      return jsonResponse('제주 ITS 스트림을 불러오지 못했습니다.', 502)
    }

    let upstream = await fetch(target, {
      headers: {
        referer: JEJU_ITS_CCTV_PAGE,
        'user-agent': USER_AGENT,
      },
    })

    if (!upstream.ok) {
      target = await getJejuItsStreamUrl(deviceId, true)

      if (!target) {
        return jsonResponse('제주 ITS 스트림을 새로 고치지 못했습니다.', 502)
      }

      upstream = await fetch(target, {
        headers: {
          referer: JEJU_ITS_CCTV_PAGE,
          'user-agent': USER_AGENT,
        },
      })
    }

    if (!upstream.ok) {
      return jsonResponse('제주 ITS 스트림에 연결하지 못했습니다.', upstream.status)
    }

    const contentType = upstream.headers.get('content-type') ?? 'application/octet-stream'

    if (isPlaylistResponse(target, contentType)) {
      const text = await upstream.text()
      return new Response(rewritePlaylist(text, target), {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=5',
          'Content-Type': 'application/x-mpegURL; charset=utf-8',
        },
      })
    }

    const headers = new Headers(upstream.headers)
    headers.set('Access-Control-Allow-Origin', '*')
    headers.set('Cache-Control', 'public, max-age=5')
    return new Response(upstream.body, {
      headers,
      status: upstream.status,
      statusText: upstream.statusText,
    })
  } catch (error) {
    console.error('jeju_its_proxy_error', error)
    return jsonResponse('제주 ITS 프록시 처리 중 오류가 발생했습니다.', 502)
  }
}

export const onRequestHead = onRequestGet
