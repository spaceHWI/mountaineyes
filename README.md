# MountainEyes

실시간 산 CCTV 대시보드 — [mountaineyes.kr](https://mountaineyes.kr)

## 구조

```
Cloudflare Workers (mountaineyes.kr)     ← 프론트엔드 (프로덕션)
Render (mountaineyes-proxy.onrender.com) ← API 프록시 + 프론트엔드 (스테이징)
Mac (Cloudflare Tunnel → localhost:3847) ← ITS CCTV 전용 프록시
```

## 개발

```bash
npm install
npm run dev
```

- 프론트엔드: `http://localhost:5173`
- API 서버: `http://localhost:8787`

## 배포

```bash
# 1. 코드 push → Render 스테이징 자동 배포
git push origin main

# 2. 스테이징 확인
#    https://mountaineyes-proxy.onrender.com

# 3. 프로덕션 배포
npm run deploy   # = npm run build && wrangler deploy
```

## 환경변수

| 변수 | 위치 | 설명 |
|---|---|---|
| `VITE_PROXY_BASE_URL` | `.env` (빌드타임) | Render 프록시 URL |
| `VITE_ITS_PROXY_URL` | `.env` (빌드타임) | Mac ITS 터널 URL |
| `CORS_ALLOWED_ORIGINS` | Render | 허용 도메인 (쉼표 구분) |
| `ITS_RELAY_TOKEN` | Render + Mac | ITS URL push 인증 토큰 |
| `NODE_VERSION` | Render | Node.js 버전 (22) |

## 주요 파일

| 파일 | 역할 |
|---|---|
| `src/App.tsx` | 메인 앱 |
| `src/data/feeds.ts` | 피드 정의 (산, 카메라) |
| `src/components/StreamPlayer.tsx` | HLS/이미지 플레이어 |
| `src/i18n.ts` | 다국어 텍스트 (한/영) |
| `server/server.js` | API 프록시 + 정적 파일 서빙 |
| `render.yaml` | Render 배포 설정 |
| `wrangler.jsonc` | Cloudflare Workers 설정 |

## ITS CCTV

ITS WAF가 데이터센터 IP를 차단하므로 Mac(주거용 IP)을 프록시로 사용합니다.

```
브라우저 → Cloudflare Tunnel → Mac(its-proxy.js:3847) → ITS 미디어서버
```

Mac에서 ITS 프록시 자동시작:

```bash
launchctl load ~/Library/LaunchAgents/com.spacehwi.mountaineyes.its-relay.plist
```

## 디버깅

```bash
# 헬스체크
curl https://mountaineyes-proxy.onrender.com/healthz

# ITS 진단
curl 'https://mountaineyes-proxy.onrender.com/api/jejuits/debug?deviceId=<id>'
```

## 방문자 분석

Cloudflare Web Analytics 사용. `index.html`의 `data-cf-beacon` snippet으로 연결.
