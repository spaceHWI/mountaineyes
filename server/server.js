import express from 'express'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const app = express()
const port = Number(process.env.PORT ?? 8787)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distPath = path.resolve(__dirname, '../dist')
const allowedHosts = new Set([
  '59.8.86.94:8080',
  '59.30.12.195:1935',
  'hallacctv.kr',
  'live.yongpyong.co.kr',
  'live.knps.or.kr',
  'live.wellihillipark.com',
  'cctv-oak9.ktcdn.co.kr',
  'streaming.phoenixhnr.co.kr',
])
const USER_AGENT = 'JejuEye/1.0'
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
    return ['http:', 'https:'].includes(url.protocol) && allowedHosts.has(url.host)
  } catch {
    return false
  }
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
