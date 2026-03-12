import express from 'express'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const app = express()
const port = Number(process.env.PORT ?? 8787)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distPath = path.resolve(__dirname, '../dist')
const allowedHosts = new Set(['59.8.86.94:8080', '59.30.12.195:1935', 'hallacctv.kr'])
const jejuItsStreamCache = new Map()
const jejuItsUrlCache = new Map()
const ITS_URL_CACHE_TTL_MS = 1000 * 90
const ITS_RELAY_TOKEN = process.env.ITS_RELAY_TOKEN ?? ''
const JEJU_ITS_CCTV_PAGE = 'https://www.jejuits.go.kr/jido/mainView.do?DEVICE_KIND=CCTV'
const JEJU_ITS_STREAM_URL = 'https://www.jejuits.go.kr/jido/streamUrl.do'
const JEJU_ITS_STREAM_TTL_MS = 1000 * 45
const USER_AGENT = 'JejuEye/1.0'
const JEJU_ITS_BROWSER_HEADERS = {
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
  'Cache-Control': 'no-cache',
  Pragma: 'no-cache',
  'Upgrade-Insecure-Requests': '1',
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
}
const corsOrigins = (process.env.CORS_ALLOWED_ORIGINS ?? '*')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

const applyCors = (request, response) => {
  const requestOrigin = request.headers.origin

  if (corsOrigins.includes('*')) {
    response.setHeader('Access-Control-Allow-Origin', '*')
  } else if (requestOrigin && corsOrigins.includes(requestOrigin)) {
    response.setHeader('Access-Control-Allow-Origin', requestOrigin)
    response.setHeader('Vary', 'Origin')
  }

  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range, Authorization')
  response.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS')
}

const isPlaylistResponse = (target, contentType) => {
  const normalizedType = contentType.toLowerCase()

  return (
    normalizedType.includes('mpegurl') ||
    normalizedType.includes('vnd.apple.mpegurl') ||
  target.endsWith('.m3u8')
  )
}

const isAllowedTarget = (target) => {
  try {
    const url = new URL(target)
    const isJejuItsMedia = /^media\d*\.jejuits\.go\.kr:7001$/.test(url.host)
    return ['http:', 'https:'].includes(url.protocol) && (allowedHosts.has(url.host) || isJejuItsMedia)
  } catch {
    return false
  }
}

const getCookieHeader = (headers) => {
  const cookies = typeof headers.getSetCookie === 'function' ? headers.getSetCookie() : []

  if (cookies.length > 0) {
    return cookies.map((cookie) => cookie.split(';', 1)[0]).join('; ')
  }

  const cookie = headers.get('set-cookie')
  return cookie ? cookie.split(';', 1)[0] : ''
}

const getJejuItsStreamUrl = async (deviceId, forceRefresh = false) => {
  if (!forceRefresh) {
    const cachedStream = jejuItsStreamCache.get(deviceId)
    if (cachedStream && cachedStream.expiresAt > Date.now()) {
      return cachedStream.url
    }
  }

  const entryPage = await fetch(JEJU_ITS_CCTV_PAGE, {
    headers: JEJU_ITS_BROWSER_HEADERS,
  })

  if (!entryPage.ok) {
    throw new Error(`jeju_its_entry_${entryPage.status}`)
  }

  const cookieHeader = getCookieHeader(entryPage.headers)

  const streamResponse = await fetch(JEJU_ITS_STREAM_URL, {
    method: 'POST',
    headers: {
      accept: '*/*',
      'accept-language': JEJU_ITS_BROWSER_HEADERS['Accept-Language'],
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      origin: 'https://www.jejuits.go.kr',
      referer: JEJU_ITS_CCTV_PAGE,
      'user-agent': JEJU_ITS_BROWSER_HEADERS['User-Agent'],
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

const rewritePlaylist = (text, target) =>
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

const maskUrl = (value) => {
  if (!value) {
    return value
  }

  try {
    const url = new URL(value)

    if (url.searchParams.has('authKey')) {
      url.searchParams.set('authKey', '***')
    }

    if (url.searchParams.has('sessionID')) {
      url.searchParams.set('sessionID', '***')
    }

    return url.toString()
  } catch {
    return value
  }
}

app.use('/api', (request, response, next) => {
  applyCors(request, response)

  if (request.method === 'OPTIONS') {
    response.status(204).end()
    return
  }

  next()
})

app.get('/healthz', (_, response) => {
  response.json({
    ok: true,
    service: 'mountaineyes-proxy',
    timestamp: new Date().toISOString(),
  })
})

app.get('/api/jejuits/health', (_, response) => {
  response.json({
    ok: true,
    service: 'jejuits-local-proxy',
    timestamp: new Date().toISOString(),
  })
})

app.get('/api/proxy', async (request, response) => {
  const target = request.query.target

  if (typeof target !== 'string' || !isAllowedTarget(target)) {
    response.status(400).json({ message: '허용되지 않은 스트림 주소입니다.' })
    return
  }

  try {
    const upstream = await fetch(target, {
      headers: {
        'user-agent': USER_AGENT,
      },
    })

    if (!upstream.ok) {
      response.status(upstream.status).json({ message: '공식 스트림을 가져오지 못했습니다.' })
      return
    }

    const contentType = upstream.headers.get('content-type') ?? 'application/octet-stream'
    const buffer = Buffer.from(await upstream.arrayBuffer())

    if (isPlaylistResponse(target, contentType)) {
      response.setHeader('Cache-Control', 'public, max-age=5')
      response.type('application/x-mpegURL').send(rewritePlaylist(buffer.toString('utf-8'), target))
      return
    }

    response.setHeader('Content-Type', contentType)
    response.setHeader('Cache-Control', 'public, max-age=5')
    response.send(buffer)
  } catch (error) {
    console.error('proxy_error', error)
    response.status(502).json({ message: '스트림 프록시 처리 중 오류가 발생했습니다.' })
  }
})

app.get('/api/jejuits/stream', async (request, response) => {
  const deviceId = request.query.deviceId

  if (typeof deviceId !== 'string' || !/^[a-f0-9-]{36}$/i.test(deviceId)) {
    response.status(400).json({ message: '유효하지 않은 제주 ITS CCTV ID입니다.' })
    return
  }

  try {
    let target = await getJejuItsStreamUrl(deviceId)

    if (!target) {
      response.status(502).json({ message: '제주 ITS 스트림을 불러오지 못했습니다.' })
      return
    }

    let upstream = await fetch(target, {
      headers: {
        accept: '*/*',
        'accept-language': JEJU_ITS_BROWSER_HEADERS['Accept-Language'],
        referer: JEJU_ITS_CCTV_PAGE,
        'user-agent': JEJU_ITS_BROWSER_HEADERS['User-Agent'],
      },
    })

    if (!upstream.ok) {
      target = await getJejuItsStreamUrl(deviceId, true)

      if (!target) {
        response.status(502).json({ message: '제주 ITS 스트림을 새로 고치지 못했습니다.' })
        return
      }

      upstream = await fetch(target, {
        headers: {
          accept: '*/*',
          'accept-language': JEJU_ITS_BROWSER_HEADERS['Accept-Language'],
          referer: JEJU_ITS_CCTV_PAGE,
          'user-agent': JEJU_ITS_BROWSER_HEADERS['User-Agent'],
        },
      })
    }

    if (!upstream.ok) {
      response.status(upstream.status).json({ message: '제주 ITS 스트림에 연결하지 못했습니다.' })
      return
    }

    const contentType = upstream.headers.get('content-type') ?? 'application/octet-stream'
    const buffer = Buffer.from(await upstream.arrayBuffer())

    if (isPlaylistResponse(target, contentType)) {
      response.setHeader('Cache-Control', 'public, max-age=5')
      response.type('application/x-mpegURL').send(rewritePlaylist(buffer.toString('utf-8'), target))
      return
    }

    response.setHeader('Content-Type', contentType)
    response.setHeader('Cache-Control', 'public, max-age=5')
    response.send(buffer)
  } catch (error) {
    console.error('jeju_its_proxy_error', error)
    response.status(502).json({ message: '제주 ITS 프록시 처리 중 오류가 발생했습니다.' })
  }
})

app.get('/api/jejuits/debug', async (request, response) => {
  const deviceId = request.query.deviceId

  if (typeof deviceId !== 'string' || !/^[a-f0-9-]{36}$/i.test(deviceId)) {
    response.status(400).json({ message: '유효하지 않은 제주 ITS CCTV ID입니다.' })
    return
  }

  const debug = {
    deviceId,
    entry: null,
    streamLookup: null,
    upstreamPlaylist: null,
  }

  try {
    const entryPage = await fetch(JEJU_ITS_CCTV_PAGE, {
      headers: JEJU_ITS_BROWSER_HEADERS,
    })

    const cookieHeader = getCookieHeader(entryPage.headers)

    debug.entry = {
      cookieCount: cookieHeader ? cookieHeader.split('; ').length : 0,
      ok: entryPage.ok,
      status: entryPage.status,
    }

    const streamResponse = await fetch(JEJU_ITS_STREAM_URL, {
      method: 'POST',
      headers: {
        accept: '*/*',
        'accept-language': JEJU_ITS_BROWSER_HEADERS['Accept-Language'],
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        origin: 'https://www.jejuits.go.kr',
        referer: JEJU_ITS_CCTV_PAGE,
        'user-agent': JEJU_ITS_BROWSER_HEADERS['User-Agent'],
        'x-requested-with': 'XMLHttpRequest',
        ...(cookieHeader ? { cookie: cookieHeader } : {}),
      },
      body: new URLSearchParams({ DEVICE_ID: deviceId }).toString(),
    })

    const rawValue = (await streamResponse.text()).trim()
    const parsedValue = rawValue.startsWith('"') ? JSON.parse(rawValue) : rawValue

    debug.streamLookup = {
      ok: streamResponse.ok,
      rawValue,
      status: streamResponse.status,
      streamUrl: maskUrl(parsedValue),
    }

    if (streamResponse.ok && parsedValue && parsedValue !== 'error' && parsedValue !== 'read_error') {
      const upstream = await fetch(parsedValue, {
        headers: {
          accept: '*/*',
          'accept-language': JEJU_ITS_BROWSER_HEADERS['Accept-Language'],
          referer: JEJU_ITS_CCTV_PAGE,
          'user-agent': JEJU_ITS_BROWSER_HEADERS['User-Agent'],
        },
      })

      const playlistBody = await upstream.text()

      debug.upstreamPlaylist = {
        bodyPreview: playlistBody.slice(0, 240),
        ok: upstream.ok,
        status: upstream.status,
      }
    }

    response.json(debug)
  } catch (error) {
    response.status(500).json({
      ...debug,
      error: error instanceof Error ? error.message : String(error),
    })
  }
})

app.use('/api/jejuits/push-urls', express.json())

app.post('/api/jejuits/push-urls', (request, response) => {
  if (!ITS_RELAY_TOKEN) {
    response.status(503).json({ message: 'ITS relay가 설정되지 않았습니다.' })
    return
  }

  const auth = request.headers.authorization
  if (auth !== `Bearer ${ITS_RELAY_TOKEN}`) {
    response.status(401).json({ message: '인증 실패' })
    return
  }

  const urls = request.body
  if (!urls || typeof urls !== 'object' || Array.isArray(urls)) {
    response.status(400).json({ message: '유효하지 않은 요청입니다.' })
    return
  }

  const now = Date.now()
  let count = 0
  for (const [deviceId, streamUrl] of Object.entries(urls)) {
    if (typeof streamUrl === 'string' && streamUrl.startsWith('https://media')) {
      jejuItsUrlCache.set(deviceId, { url: streamUrl, expiresAt: now + ITS_URL_CACHE_TTL_MS })
      count++
    }
  }

  console.log(`its_relay: cached ${count} stream URLs`)
  response.json({ ok: true, cached: count })
})

app.get('/api/jejuits/urls', (_, response) => {
  const now = Date.now()
  const result = {}
  for (const [deviceId, entry] of jejuItsUrlCache) {
    if (entry.expiresAt > now) {
      result[deviceId] = entry.url
    } else {
      jejuItsUrlCache.delete(deviceId)
    }
  }
  response.setHeader('Cache-Control', 'public, max-age=10')
  response.json(result)
})

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath))

  app.get(/.*/, (_, response) => {
    response.sendFile(path.join(distPath, 'index.html'))
  })
} else {
  app.get('/', (_, response) => {
    response.send('Jeju Eye API 서버가 실행 중입니다. 개발 중에는 Vite 클라이언트를 함께 실행하세요.')
  })
}

app.listen(port, () => {
  console.log(`Jeju Eye server listening on http://localhost:${port}`)
})
