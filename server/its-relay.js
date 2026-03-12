#!/usr/bin/env node
/**
 * ITS Token Relay – Mac에서 30초마다 실행되어
 * 제주 ITS CCTV 스트림 URL을 가져와 Render 프록시에 push합니다.
 *
 * 환경변수:
 *   ITS_RELAY_TOKEN   – Render 프록시 인증 토큰 (필수)
 *   ITS_RELAY_TARGET  – push 대상 URL (기본: https://mountaineyes-proxy.onrender.com)
 *   ITS_RELAY_INTERVAL – 갱신 주기 ms (기본: 30000)
 */

const ENTRY_URL = 'https://www.jejuits.go.kr/jido/mainView.do?DEVICE_KIND=CCTV'
const STREAM_URL = 'https://www.jejuits.go.kr/jido/streamUrl.do'
const BROWSER_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36'

const HALLASAN_DEVICES = {
  '0ce6ae92-c6d2-78ed-cf34-f0c6f119bdca': '1100고지',
  'dba35405-c791-7689-0ea9-2890225acd53': '1100고지2',
  'fc4a8973-eda7-7c81-bd51-851cf452ac86': '성판악',
  'ecf0c5c5-6cc2-ab81-9e05-62a4cf11c95c': '성판악(남)',
  '01cfdc49-bb43-c5f1-925e-a10842d52b4e': '성판악(북)',
  '9261f807-613e-5feb-e772-4b36d255fe27': '어리목입구',
  '30326b0b-606b-f9ea-f1a0-c121a26eab96': '돈내코입구',
  'e5b35556-dfba-01d8-598d-79c8b4f497f4': '돈내코(북)',
  '549855ee-ee60-7c21-20ac-377385832c4f': '산록남로',
}

const RELAY_TOKEN = process.env.ITS_RELAY_TOKEN
const RELAY_TARGET = (process.env.ITS_RELAY_TARGET ?? 'https://mountaineyes-proxy.onrender.com').replace(/\/$/, '')
const INTERVAL = Number(process.env.ITS_RELAY_INTERVAL ?? 30000)

if (!RELAY_TOKEN) {
  console.error('ITS_RELAY_TOKEN 환경변수가 필요합니다.')
  process.exit(1)
}

const getCookies = (headers) => {
  const cookies = typeof headers.getSetCookie === 'function' ? headers.getSetCookie() : []
  if (cookies.length > 0) return cookies.map((c) => c.split(';', 1)[0]).join('; ')
  const cookie = headers.get('set-cookie')
  return cookie ? cookie.split(';', 1)[0] : ''
}

const fetchStreamUrl = async (deviceId, cookieHeader) => {
  const res = await fetch(STREAM_URL, {
    method: 'POST',
    headers: {
      accept: '*/*',
      'accept-language': 'ko-KR,ko;q=0.9',
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      origin: 'https://www.jejuits.go.kr',
      referer: ENTRY_URL,
      'user-agent': BROWSER_UA,
      'x-requested-with': 'XMLHttpRequest',
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
    },
    body: `DEVICE_ID=${deviceId}`,
  })
  const raw = (await res.text()).trim()
  const parsed = raw.startsWith('"') ? JSON.parse(raw) : raw
  if (!parsed || parsed === 'error' || parsed === 'read_error') return null
  return parsed
}

const refresh = async () => {
  const timestamp = new Date().toLocaleTimeString('ko-KR')
  try {
    const entry = await fetch(ENTRY_URL, {
      headers: { 'User-Agent': BROWSER_UA, 'Accept-Language': 'ko-KR,ko;q=0.9' },
    })
    const cookieHeader = getCookies(entry.headers)

    const urls = {}
    const ids = Object.keys(HALLASAN_DEVICES)

    for (const id of ids) {
      const url = await fetchStreamUrl(id, cookieHeader)
      if (url) urls[id] = url
    }

    const count = Object.keys(urls).length
    if (count === 0) {
      console.log(`[${timestamp}] 스트림 URL 0개 - 건너뜀`)
      return
    }

    const pushRes = await fetch(`${RELAY_TARGET}/api/jejuits/push-urls`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RELAY_TOKEN}`,
      },
      body: JSON.stringify(urls),
    })

    const result = await pushRes.json()
    console.log(`[${timestamp}] ${count}/${ids.length}개 push 완료 →`, result)
  } catch (err) {
    console.error(`[${timestamp}] relay 오류:`, err.message)
  }
}

console.log(`ITS Relay 시작 (${INTERVAL / 1000}초 간격) → ${RELAY_TARGET}`)
refresh()
setInterval(refresh, INTERVAL)
