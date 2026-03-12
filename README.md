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

## 참고

- 현재 메인 데모는 한라산 공식 `https` 스트림만 사용합니다.
- `http` 기반 스트림을 다시 포함하고 싶으면 `/api/proxy` 서버를 함께 사용하면 됩니다.
