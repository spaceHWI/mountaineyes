# MountainEyes Handoff

Last updated: 2026-03-12

## Current Product State

- Production site: `https://mountaineyes.kr`
- Primary app is a Vite/React frontend deployed through the existing Cloudflare worker/static flow.
- `High1` has been added as a domestic mountain option.
- `Jeju ITS` is **not** currently exposed in the UI because it is still blocked in server-side environments.

## Current Deployment Topology

There are now two deploy surfaces:

1. Main site
- Deploy path: `git push` to `main`
- Current script still documented as `npm run build` then `wrangler deploy`
- This deploys the main frontend/site

2. External proxy for difficult streams
- Provider: Render
- Service URL: `https://mountaineyes-proxy.onrender.com`
- Config file: `render.yaml`
- `autoDeploy: true` is enabled, so pushes to `main` should trigger Render auto-deploys too

## Important User Preferences

These must be followed:

- Before publishing, always verify the actual UI with screenshots first.
- When work is done, always send a clear completion notice.
- When possible on this Mac, also trigger a local macOS notification.
- If publishing/deploy workflow changes, update the existing `auto-publish` skill too.

## Files That Matter Most

- Main app entry: `src/App.tsx`
- Feed definitions: `src/data/feeds.ts`
- Player behavior: `src/components/StreamPlayer.tsx`
- UI copy: `src/i18n.ts`
- Main local proxy server: `server/server.js`
- Render config: `render.yaml`
- Env example: `.env.example`
- Notes for proxy deploy: `README.md`

## High1 Status

High1 is the current success case.

- High1 feeds are present in `src/data/feeds.ts`
- They now default to the external Render proxy via:
  - `VITE_PROXY_BASE_URL`
  - fallback default: `https://mountaineyes-proxy.onrender.com`
- The app also supports direct QA opening with:
  - `https://mountaineyes.kr/?mountain=high1`

### High1 Technical Notes

- Original source is `http://59.30.12.195:1935/...`
- This does not work reliably from Cloudflare Worker preview/deploy as a direct worker-side proxy
- It does work through the external Render Node proxy

### High1 UX Notes

- Loading UX was improved in `src/components/StreamPlayer.tsx`
- Loading overlay now stays visible until actual playback starts, not just until `canplay`
- Loading overlay can reappear during waiting/buffering

## Jeju ITS Status

Jeju ITS remains in R&D and is intentionally not exposed in the UI.

### What works

- On the local Mac, the ITS flow works:
  - entry page fetch succeeds
  - cookies are collected
  - `streamUrl.do` returns a session HLS URL
  - playlist fetch succeeds

### What fails

- Cloudflare Worker remote execution fails
- Render remote execution also fails

### Why it fails

The Render diagnostic endpoint showed the real failure:

- entry page: `200`
- cookie count: `0` remotely in Render debug
- `streamUrl.do` response is a web firewall block page
- response mentions:
  - request blocked by web firewall security policies
  - Render/public server IP visible in `x-forward-for`

Interpretation:

- Jeju ITS appears to block data-center/server IP traffic to `streamUrl.do`
- This is not just a bug in our parsing logic
- It is likely an upstream WAF/policy restriction

### Current conclusion on ITS

- Do not re-add ITS to the production UI yet
- If revisiting, likely options are:
  - official allowlist / contact ITS operator
  - user-local / residential-network helper flow
  - simple “open official ITS page” UX rather than embedded playback

## Diagnostic Endpoint

The Render/local proxy currently contains a temporary ITS debug route:

- `GET /api/jejuits/debug?deviceId=<id>`

Purpose:

- Shows which stage fails:
  - entry page
  - stream lookup
  - upstream playlist

Use this before attempting any ITS UI reintegration.

## Render Proxy Server Notes

`server/server.js` now includes:

- `/healthz`
- `/api/proxy`
- `/api/jejuits/stream`
- `/api/jejuits/debug`
- CORS support via `CORS_ALLOWED_ORIGINS`

Expected env on Render:

- `NODE_VERSION=22`
- `CORS_ALLOWED_ORIGINS=https://mountaineyes.kr`

Frontend env:

- `VITE_PROXY_BASE_URL=https://mountaineyes-proxy.onrender.com`

## Auto-Publish Skill

The external skill at:

- `/Users/hwi2/.codex/skills/auto-publish/SKILL.md`

was updated conceptually for this repo:

- pushing `main` can affect both the main site and the Render proxy auto-deploy

If deploy topology changes again, update this skill again.

## Recent Important Commits

- `6767052` Keep loading overlay until video actually starts
- `fdc91bb` Add Jeju ITS diagnostic endpoint
- `2bccf8e` Add clearer loading state for slow video feeds
- `4cab4e6` Enable Render auto deploy for proxy
- `0def95c` Harden Jeju ITS browser-style proxy headers
- `53f0356` Connect High1 feeds to Render proxy
- `e22c554` Prepare Render proxy deployment

## Safe Next Steps

Recommended next work for another AI:

1. Confirm Render has deployed the latest `main` commit.
2. Re-test `https://mountaineyes-proxy.onrender.com/healthz`
3. Re-test High1 playback via:
   - `https://mountaineyes.kr/?mountain=high1`
4. If High1 is stable, leave it in production.
5. Keep ITS out of production unless the debug endpoint proves the upstream block is gone.
6. If the user still wants ITS, build a polished “Open ITS Official Page” UX instead of embedded playback.

## Commands Used Often

From `web/`:

```bash
npm run build
git status -sb
git log --oneline --decorate -n 10
curl https://mountaineyes-proxy.onrender.com/healthz
curl 'https://mountaineyes-proxy.onrender.com/api/proxy?target=http%3A%2F%2F59.30.12.195:1935%2F...'
curl 'https://mountaineyes-proxy.onrender.com/api/jejuits/debug?deviceId=...'
```

## Current Working Tree

Expected status at handoff:

- clean except for `.omx/`

If there are unexpected diffs, inspect before publishing.
