const allowedHosts = new Set(['59.8.86.94:8080', '59.30.12.195:1935', 'hallacctv.kr'])
const USER_AGENT = 'JejuEye/1.0'

const isPlaylistResponse = (target: string, contentType: string) => {
  const normalizedType = contentType.toLowerCase()

  return (
    normalizedType.includes('mpegurl') ||
    normalizedType.includes('vnd.apple.mpegurl') ||
    target.endsWith('.m3u8')
  )
}

const isAllowedTarget = (target: string) => {
  try {
    const url = new URL(target)
    const isJejuItsMedia = /^media\d*\.jejuits\.go\.kr:7001$/.test(url.host)
    return ['http:', 'https:'].includes(url.protocol) && (allowedHosts.has(url.host) || isJejuItsMedia)
  } catch {
    return false
  }
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

      if (!isAllowedTarget(resolved)) {
        return '# blocked-by-proxy'
      }

      return `/api/proxy?target=${encodeURIComponent(resolved)}`
    })
    .join('\n')

const jsonResponse = (message: string, status = 400) =>
  new Response(JSON.stringify({ message }), {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json; charset=utf-8',
    },
    status,
  })

export const onRequestGet = async ({ request }: { request: Request }) => {
  const url = new URL(request.url)
  const target = url.searchParams.get('target')

  if (!target || !isAllowedTarget(target)) {
    return jsonResponse('허용되지 않은 스트림 주소입니다.', 400)
  }

  try {
    const upstream = await fetch(target, {
      headers: {
        'user-agent': USER_AGENT,
      },
    })

    if (!upstream.ok) {
      return jsonResponse('공식 스트림을 가져오지 못했습니다.', upstream.status)
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
    console.error('proxy_error', error)
    return jsonResponse('스트림 프록시 처리 중 오류가 발생했습니다.', 502)
  }
}

export const onRequestHead = onRequestGet
