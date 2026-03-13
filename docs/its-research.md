# ITS CCTV Alternative Access Research

Last updated: 2026-03-13
Tested from: Residential Korean IP (LG DACOM, Seoul)

## Problem Statement

The MountainEyes app previously integrated Jeju ITS (jejuits.go.kr) road CCTV feeds. This was removed because:

- **jejuits.go.kr WAF blocks datacenter IPs** (Cloudflare Workers, Render, AWS, etc.)
- Required a Mac relay server with residential IP via Cloudflare Tunnel
- The relay setup was unreliable and complex to maintain

## Summary of Findings

| Source | Stream Format | Works from Datacenter IP? | Auth Required? | Jeju Coverage? |
|--------|--------------|--------------------------|----------------|----------------|
| Jeju Bangjae (vurix) | HLS | **YES** (confirmed via Render proxy) | No | Yes (snow/disaster cameras) |
| jejuits.go.kr streamUrl | HLS | **NO** (WAF blocks) | Session cookie | Yes (278 road cameras) |
| jejuits.go.kr media servers | HLS | **Likely YES** (CORS: *, no WAF) | Auth key from streamUrl | Yes |
| ITS National API (openapi.its.go.kr) | HLS | **YES** (public API) | API key (free) | Limited (expressway only) |
| hallacctv.kr (existing) | HLS | **YES** (already in use) | No | Hallasan only |
| KNPS (live.knps.or.kr) | HLS | **YES** (already in use) | No | National parks only |
| nowjejuplus.co.kr | HLS/MJPEG | **YES** (same as hallacctv.kr) | No | Hallasan + some coastal |
| TOPIS (Seoul) | HLS | Unknown (requires API key) | API key | Seoul only |
| UTIC (National Police) | HLS | Unknown (requires API key) | API key + approval | National |
| Korea Expressway Corp | Unknown | Unknown (requires API key) | API key | Expressways only |

---

## 1. Jeju Bangjae Disaster CCTV (vurix) -- MOST PROMISING

**Source**: http://bangjae.jeju.go.kr/realtimeinfor/cctv/snow.htm

**URL Format**:
```
http://59.8.86.94:8080/media/api/v1/hls/vurix/192871/{CAMERA_ID}/0/0
```

**Test Results** (from residential IP):
- HTTP 200, content-type: `application/x-mpegURL`
- HLS playlist with 1-second segments
- TS segments use relative paths under same server

**Why this is promising**:
- Direct IP access (no domain = no WAF)
- No authentication required
- Already in the proxy's `allowedHosts` set (`59.8.86.94:8080`)
- Simple Vurix VMS API -- stable URL format
- Covers snow monitoring and disaster areas across Jeju

**Available Cameras (Snow Monitoring)**:

| Camera ID | Name | Location |
|-----------|------|----------|
| 100017 | 평화로입구 | Road access |
| 100018 | 해병9여단 | Military area |
| 100016 | 산천단입구 | Mountain access |
| 100216 | 제원목장 | Ranch area |
| 100015 | 비자림 | Forest |
| 100217 | 삼다수공장 | Factory area |
| 100218 | 금악이시돌목장 | Ranch |
| 100219 | 모슬포예비군훈련장 입구 | Training ground |
| 100023 | 영실 | **Hallasan trail** |
| 100220 | 토평감귤유통센터앞 | Distribution center |

**Available Cameras (Disaster/Danger Areas)**:

| Camera ID | Name | Location |
|-----------|------|----------|
| 100003 | 라마다호텔 | Coastal |
| 100001 | 탑동 | Coastal |
| 100009 | 서귀항 | Seogwipo port |
| 100007 | 법환포구 | Coastal |
| 100008 | 법환어촌계 | Coastal |
| 100011 | 온평어촌계 | Coastal |
| 100002 | 구좌읍사무소 | Town office |
| 100005 | 옹포항 | Port |
| 100010 | 중문해수욕장 | Beach |
| 100012 | 산방산 | Mountain |
| 100013 | 평화교 | Bridge |
| 100006 | 남원어촌계 | Coastal |
| 100004 | 신창리포구 | Port |

**Integration Approach**:
These feeds can be proxied through the existing Cloudflare Workers proxy at `functions/api/proxy.ts` since `59.8.86.94:8080` is already in the allowed hosts list. However, the TS segments use relative paths, so the proxy must rewrite the playlist to use absolute proxy URLs (this logic already exists).

**Status**: CONFIRMED WORKING from datacenter IPs (Render proxy, US-based). No IP blocking detected. 5 cameras added to the app (2026-03-13).

---

## 2. Jeju ITS (jejuits.go.kr) -- Split Architecture Approach

**Discovery**: The Jeju ITS system has a split architecture:
1. **Main site** (`www.jejuits.go.kr`) -- WAF-protected, blocks datacenter IPs
2. **Media servers** (`media{N}.jejuits.go.kr:7001`) -- No WAF, CORS: *, publicly accessible

**Flow**:
```
1. GET https://www.jejuits.go.kr/jido/mainView.do?DEVICE_KIND=CCTV  (blocked by WAF from DC)
2. Extract JSESSIONID cookie
3. POST https://www.jejuits.go.kr/jido/streamUrl.do  (blocked by WAF from DC)
   Body: DEVICE_ID={uuid}
   Returns: https://media6.jejuits.go.kr:7001/hls/{uuid}.m3u8?authKey=...
4. Fetch HLS playlist from media server  (NOT blocked -- CORS: *)
```

**The Problem**: Steps 1-3 require residential IP. Step 4 works from anywhere.

**Potential Solution**:
- Use a **lightweight scheduled worker** (cron) running from a residential IP to:
  - Fetch stream URLs for all 278 cameras every 45 seconds (token TTL)
  - Push the resolved `media*.jejuits.go.kr` URLs to a KV store or API
- The web app fetches pre-resolved URLs and proxies the media streams directly

**Available Data**: 278 unique device IDs covering all Jeju roads
**Auth Key TTL**: ~45 seconds (tokens expire and need refresh)
**Media Server Response**: HLS with 2-second segments, `Access-Control-Allow-Origin: *`

**Existing Implementation**: `functions/api/jejuits/stream.ts` already implements this flow but fails from Cloudflare Workers because steps 1-3 are WAF-blocked.

---

## 3. ITS National API (openapi.its.go.kr)

**Endpoint**: `https://openapi.its.go.kr:9443/cctvInfo`

**Parameters**:
| Parameter | Description | Values |
|-----------|-------------|--------|
| apiKey | Authentication key | Register at its.go.kr |
| type | Road type | `ex` (expressway), `its` (national road) |
| cctvType | Camera type | `1` (real-time video), `2` (static image) |
| minX, maxX | Longitude range | e.g., 126.1 ~ 126.9 |
| minY, maxY | Latitude range | e.g., 33.1 ~ 33.6 |
| getType | Response format | `json` or `xml` |

**Response Format** (XML):
```xml
<response>
  <datacount>20</datacount>
  <data>
    <cctvname>[수도권제1순환선] 성남</cctvname>
    <cctvurl>http://cctvsec.ktict.co.kr/2/...</cctvurl>
    <cctvformat>HLS</cctvformat>
    <coordx>127.12361</coordx>
    <coordy>37.42889</coordy>
  </data>
</response>
```

**Test Results**:
- API endpoint responds with HTTP 200 from any IP
- Test key `test` returns sample data (always same 20 records regardless of coordinates)
- Real API key required for actual coordinate-based queries
- HLS URLs via `cctvsec.ktict.co.kr` return HTTP 401 without valid API key

**How to Get API Key**:
1. Go to https://www.its.go.kr and click 회원가입 (Sign Up)
2. Complete registration with name, email, phone number
3. Log in, navigate to 마이페이지 (My Page) -> 인증키 발급 (Authentication Key Issuance)
4. Fill in the usage purpose (e.g., "산악 CCTV 서비스 개발" / Mountain CCTV service development)
5. Submit the request -- key is issued for free but requires admin approval (typically 1-3 business days)
6. Alternative: Register at https://www.data.go.kr/data/15058481/openapi.do for the same API via the national open data portal

**Limitations**:
- Only covers **expressways** and **national roads** (not local Jeju roads)
- HLS stream URLs (`cctvsec.ktict.co.kr`) likely time-limited tokens
- Need to confirm if `cctvsec.ktict.co.kr` works from datacenter IPs

**Alternative Endpoint** (older):
```
http://openapi.its.go.kr/api/NCCTVInfo?key={key}&ReqType=2&MinX=...&MaxX=...&MinY=...&MaxY=...&type=ex
```
Returns "미승인 공개키" (unapproved public key) with test key.

---

## 4. TOPIS - Seoul Traffic CCTV

**Portal**: https://topis.seoul.go.kr/refRoom/openRefRoom_4.do

**Access**: Requires registration at Seoul Open Data Plaza (data.seoul.go.kr)

**Relevance**: Seoul only -- not useful for Jeju/mountain coverage. Could be useful for future expansion to Seoul area mountains.

**Status**: Not tested (requires API key registration)

---

## 5. UTIC - National Police CCTV

**Portal**: https://www.data.go.kr/data/15148511/openapi.do

**Access**:
- Register at UTIC website
- Provide purpose of use, organization details
- Receive authentication key after approval
- Must credit "National Police Agency" as source

**Coverage**: National traffic management CCTVs
**Available since**: 2016
**Format**: URL-based (likely HLS)

**Status**: Not tested (requires formal application and approval)

---

## 6. Jeju Snow/Disaster CCTV API (data.go.kr)

**Portal**: https://www.data.go.kr/data/15109172/openapi.do

**Data**: Jeju City snow monitoring CCTV inquiry service
**Fields**: Data code, point classification, point name, CCTV URL, latitude, longitude, operational status

**Status**: Not tested (requires API key from data.go.kr)
**Potential**: May provide the same vurix URLs found on bangjae.jeju.go.kr in a more stable/official API format.

---

## 7. Korea Expressway Corporation

**Portal**: https://data.ex.co.kr/openapi/intro/introduce02

**Available Data**:
- Highway mainline CCTV locations (file data)
- Tunnel CCTV locations (file data)
- Various expressway traffic APIs

**Status**: API portal returned HTTP 400. Requires investigation.
**Relevance**: Expressway cameras only -- useful for road conditions but not mountain coverage.

---

## Session 2 Test Results (2026-03-13)

### Vurix feeds via Render proxy: CONFIRMED WORKING

All tested cameras return HTTP 200 through `https://mountaineyes-proxy.onrender.com/api/proxy`:
- **100017** (평화로입구): HTTP 200, HLS playlist with rewritten segment URLs
- **100023** (영실/Hallasan trail): HTTP 200, working
- **100016** (산천단입구): HTTP 200, working
- **100015** (비자림): HTTP 200, working
- **100012** (산방산): HTTP 200, working
- **100010** (중문해수욕장): HTTP 200, working
- **100003** (라마다호텔): HTTP 200, working
- **100001** (탑동): HTTP 200, working

TS segments also work (fetched immediately after playlist -- segments expire quickly as expected for live streams).

Playlist rewriting works correctly: relative segment paths like `../ts/HASH_SEQ` are rewritten to `/api/proxy?target=http%3A%2F%2F59.8.86.94%3A8080%2Fmedia%2Fapi%2Fv1%2Fts%2FHASH_SEQ`.

### Cloudflare Workers proxy (mountaineyes.kr): NOT WORKING

The Cloudflare Pages function at `mountaineyes.kr/api/proxy` returns `text/html` (the SPA's index.html), suggesting the Pages function is not deployed or not routing correctly.

### Feeds Added to App

5 Vurix cameras added to `src/data/feeds.ts` under Hallasan:
- **hallasan-yeongsil** (영실) - Hallasan trail snow monitoring
- **hallasan-sancheondan** (산천단입구) - Mountain access snow monitoring
- **hallasan-pyeonghwaro** (평화로입구) - Road access snow monitoring
- **hallasan-bijarim** (비자림) - Forest snow monitoring
- **hallasan-sanbangsan** (산방산) - Mountain disaster monitoring

---

## Remaining Actions (Priority Order)

### 1. Register for ITS National API key (MEDIUM PRIORITY)

Even with a test key, the API endpoint works from anywhere. With a real key:
- Get actual expressway CCTV feeds near mountains
- Potentially bypass the `cctvsec.ktict.co.kr` auth issues
- Good for showing road conditions on mountain access routes

**Action**: Register at https://www.its.go.kr and request API key.

### 2. Register for Jeju Snow CCTV API (MEDIUM PRIORITY)

The data.go.kr API (15109172) may provide the same vurix URLs through an official channel, giving more stability and potentially additional cameras.

**Action**: Register at data.go.kr and apply for API access.

### 3. Fix Cloudflare Pages proxy deployment (LOW PRIORITY)

The `functions/api/proxy.ts` Cloudflare Pages function is not routing correctly at `mountaineyes.kr`. The Render proxy works fine, so this is not blocking.

### 4. Consider a lightweight token relay for jejuits.go.kr (LOW PRIORITY)

If more coverage is needed beyond the vurix cameras:
- Run a minimal cron job from residential IP
- Resolve stream tokens every 45 seconds
- Store in Cloudflare KV or similar
- Web app reads pre-resolved URLs

---

## Feeds Already Working (No Changes Needed)

These feeds work from any IP and are already in the app:

| Feed | Server | Status |
|------|--------|--------|
| hallacctv.kr (Hallasan 5 cameras) | 119.65.216.155:1935 | Working |
| live.knps.or.kr (National Parks) | KNPS CDN | Working |
| live.yongpyong.co.kr (Balwangsan) | Yongpyong CDN | Working |

---

## Technical Notes

### IP Types Tested
- **This test environment**: Residential Korean IP (LG DACOM, Seoul, 106.251.x.x)
- **Cloudflare Workers**: Datacenter IP (typically blocked by Korean government WAFs)
- **Render**: Datacenter IP (US-based, blocked)

### WAF Behavior
The jejuits.go.kr WAF blocks based on IP reputation:
- Residential Korean IPs: Allowed
- Commercial datacenter IPs: Blocked (403 or connection reset)
- The WAF is on the main domain only; media servers (`media*.jejuits.go.kr:7001`) appear unprotected

### Proxy Architecture
The existing proxy at `functions/api/proxy.ts` already supports:
- `59.8.86.94:8080` (vurix/bangjae)
- `59.30.12.195:1935` (High1 Resort)
- `hallacctv.kr`
- `media*.jejuits.go.kr:7001` (via regex pattern)

HLS playlist rewriting (converting relative segment URLs to proxied absolute URLs) is already implemented.
