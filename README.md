# Jeju Eye

한라산 등산 관련 공식 공개 CCTV를 한 페이지에서 동시에 볼 수 있도록 만든 대시보드입니다.

## 현재 데모 구성

- 한라산 공식 CCTV 5개
- 백록담, 왕관릉, 윗세오름, 어승생악, 1100고지
- 정적 빌드로도 재생 가능해서 VS Code `Go Live` 데모에 적합

## 실행

```bash
npm install
npm run dev
```

개발 서버

- 프런트엔드: `http://localhost:5173`
- 선택적 프록시 서버: `http://localhost:8787`

프로덕션 빌드 후 실행

```bash
npm run build
npm run start
```

## 방문자 수 보기

Cloudflare Web Analytics를 쓰면 봇이 아닌 실제 방문자와 페이지뷰를 볼 수 있습니다.

현재는 Cloudflare에서 발급한 Web Analytics JS snippet을 `index.html`에 직접 넣는 방식으로 연결되어 있습니다.

1. Cloudflare 대시보드에서 `Web Analytics`를 엽니다.
2. `Enable with JS Snippet installation`을 선택합니다.
3. 발급된 snippet의 `data-cf-beacon` token 값을 확인합니다.
4. 사이트를 다시 배포합니다.

방문 데이터는 보통 반영까지 몇 분 정도 걸릴 수 있습니다.

## Render Proxy Deploy

Cloudflare에서 직접 되지 않는 스트림은 별도 Node 프록시로 분리하는 편이 더 현실적입니다.

Render에서 프록시를 붙이는 순서는 아래와 같습니다.

1. Render에서 `Blueprint` 또는 `New Web Service`로 이 저장소를 연결합니다.
2. 루트 디렉터리는 현재 저장소 루트 그대로 사용합니다.
3. `render.yaml` 기준으로 `mountaineyes-proxy` 서비스를 생성합니다.
4. 배포가 끝나면 Render 서비스 URL을 확인합니다.
5. 프런트엔드 빌드 시 `VITE_PROXY_BASE_URL`에 그 URL을 넣습니다.
6. 메인 사이트를 다시 빌드/배포합니다.

프런트엔드에서 프록시 URL을 쓰려면:

```bash
VITE_PROXY_BASE_URL=https://your-render-service.onrender.com
```

예시:

```bash
VITE_PROXY_BASE_URL=https://mountaineyes-proxy.onrender.com
```

프록시 서버는 `/healthz` 헬스체크를 지원하고, `CORS_ALLOWED_ORIGINS`로 허용 도메인을 제어합니다.

기본 Blueprint 설정은 `render.yaml`에 들어 있습니다.

## 참고

- 현재 메인 데모는 한라산 공식 `https` 스트림만 사용합니다.
- `http` 기반 스트림을 다시 포함하고 싶으면 `/api/proxy` 서버를 함께 사용하면 됩니다.
