import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { feeds, mountains, type FeedKind, type MountainId } from './data/feeds'
import { StreamPlayer } from './components/StreamPlayer'

const EARTH_RADIUS_KM = 6371

function Icon({ name }: { name: 'mountain' | 'path' | 'grid' | 'camera' | 'link' | 'pin' | 'view' }) {
  const commonProps = {
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 1.8,
  }

  const paths = {
    mountain: (
      <>
        <path {...commonProps} d="M3.5 17.5 9.2 8.5l3.2 4.4 2-3.1 6.1 7.7H3.5Z" />
        <path {...commonProps} d="m8.1 10.2 1.1-1.7 1.2 1.7" />
      </>
    ),
    path: (
      <>
        <path {...commonProps} d="M6 4.5c4 0 5 2 5 4.2 0 3.7-3 4-3 7.8" />
        <path {...commonProps} d="M8 16.5c0 1.7 1.5 3 4 3s4-1.1 4-3" />
        <circle {...commonProps} cx="6.5" cy="4.5" r="1.5" />
      </>
    ),
    grid: (
      <>
        <rect {...commonProps} x="3.5" y="3.5" width="6" height="6" rx="1.2" />
        <rect {...commonProps} x="14.5" y="3.5" width="6" height="6" rx="1.2" />
        <rect {...commonProps} x="3.5" y="14.5" width="6" height="6" rx="1.2" />
        <rect {...commonProps} x="14.5" y="14.5" width="6" height="6" rx="1.2" />
      </>
    ),
    camera: (
      <>
        <rect {...commonProps} x="3.5" y="7" width="10.5" height="10" rx="2" />
        <path {...commonProps} d="m14 10.2 5-2.7v9l-5-2.7" />
      </>
    ),
    link: (
      <>
        <path {...commonProps} d="M9.2 14.8 14.8 9.2" />
        <path {...commonProps} d="M7 12a3.5 3.5 0 0 1 0-5l2-2a3.5 3.5 0 0 1 5 5l-1 1" />
        <path {...commonProps} d="M17 12a3.5 3.5 0 0 1 0 5l-2 2a3.5 3.5 0 0 1-5-5l1-1" />
      </>
    ),
    pin: (
      <>
        <path {...commonProps} d="M12 20s6-5.4 6-10a6 6 0 1 0-12 0c0 4.6 6 10 6 10Z" />
        <circle {...commonProps} cx="12" cy="10" r="2.2" />
      </>
    ),
    view: (
      <>
        <path {...commonProps} d="M3.5 16.5 8.2 11l3 3.2 2.1-2.7 4.2 5H3.5Z" />
        <path {...commonProps} d="M15.5 7.5h5v5" />
        <path {...commonProps} d="m20.5 7.5-6.2 6.2" />
      </>
    ),
  }

  return (
    <span className="icon-badge" aria-hidden="true">
      <svg viewBox="0 0 24 24">{paths[name]}</svg>
    </span>
  )
}

const toRadians = (value: number) => (value * Math.PI) / 180

const getDistanceKm = (
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number,
) => {
  const deltaLat = toRadians(toLat - fromLat)
  const deltaLng = toRadians(toLng - fromLng)
  const originLat = toRadians(fromLat)
  const targetLat = toRadians(toLat)

  const haversine =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(originLat) * Math.cos(targetLat) * Math.sin(deltaLng / 2) ** 2

  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
}

function App() {
  const [activeMountainId, setActiveMountainId] = useState<MountainId>('hallasan')
  const [activeKind, setActiveKind] = useState<'전체' | FeedKind>('전체')
  const [locationLabel, setLocationLabel] = useState('전국 대표 산부터 보여드리고 있어요')

  useEffect(() => {
    if (!navigator.geolocation) {
      return
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const nearestMountain = mountains.reduce((closest, mountain) => {
          const distance = getDistanceKm(coords.latitude, coords.longitude, mountain.lat, mountain.lng)

          if (!closest || distance < closest.distance) {
            return { distance, mountainId: mountain.id, mountainName: mountain.name }
          }

          return closest
        }, null as null | { distance: number; mountainId: MountainId; mountainName: string })

        if (!nearestMountain) {
          return
        }

        setActiveMountainId(nearestMountain.mountainId)
        setLocationLabel(`지금 위치에서 가까운 ${nearestMountain.mountainName}부터 보여드려요`)
      },
      () => {
        setLocationLabel('위치를 허용하면 가까운 산부터 먼저 보여드려요')
      },
      {
        enableHighAccuracy: false,
        maximumAge: 1000 * 60 * 10,
        timeout: 5000,
      },
    )
  }, [])

  const activeMountain = mountains.find((mountain) => mountain.id === activeMountainId) ?? mountains[0]

  const availableKinds = useMemo(() => {
    const kinds = new Set<FeedKind>()

    feeds.forEach((feed) => {
      if (feed.mountainId === activeMountainId) {
        kinds.add(feed.kind)
      }
    })

    return ['전체', ...Array.from(kinds)] as Array<'전체' | FeedKind>
  }, [activeMountainId])

  const visibleKind = availableKinds.includes(activeKind) ? activeKind : '전체'

  const visibleFeeds = useMemo(
    () =>
      feeds.filter((feed) => {
        const sameMountain = feed.mountainId === activeMountainId
        const sameKind = visibleKind === '전체' || feed.kind === visibleKind
        return sameMountain && sameKind
      }),
    [activeMountainId, visibleKind],
  )

  return (
    <div className="app-shell">
      <main className="page">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">Live Cam</p>
            <div className="title-row">
              <span className="title-logo" aria-hidden="true">
                <svg viewBox="0 0 48 48">
                  <defs>
                    <linearGradient id="hallasanPeak" x1="0%" x2="100%" y1="0%" y2="100%">
                      <stop offset="0%" stopColor="#7fc18f" />
                      <stop offset="100%" stopColor="#2f6a53" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M7 35.5 19.2 17l6.4 9.2 4.8-7.2L41 35.5H7Z"
                    fill="url(#hallasanPeak)"
                  />
                  <path
                    d="m17.2 20.2 2.4-3.6 2.6 3.6"
                    fill="none"
                    stroke="#f6fffa"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                  <path
                    d="M12 35.5c3.5-3 7.3-4.5 11.3-4.5 4.2 0 7.9 1.5 12.7 4.5"
                    fill="none"
                    stroke="#d8f2de"
                    strokeLinecap="round"
                    strokeWidth="2"
                  />
                </svg>
              </span>
              <h1>MountainEyes V1.0</h1>
            </div>
            <p className="hero-text">
              전국 산 CCTV를 한눈에 보고 한손에 캡쳐하세요.
              <br />
              가까운 산이 먼저 보이고, 다른 산들도 계속 업데이트됩니다.
            </p>
            <div className="hero-badges">
              <span className="soft-badge compact">
                <Icon name="pin" />
                {locationLabel}
              </span>
            </div>
          </div>
        </section>

        <section className="toolbar panel">
          <div className="toolbar-stack">
            <div className="toolbar-block">
              <p className="toolbar-label">산 종류</p>
              <label className="mountain-select-wrap" htmlFor="mountain-select">
                <select
                  id="mountain-select"
                  className="mountain-select"
                  onChange={(event) => setActiveMountainId(event.target.value as MountainId)}
                  value={activeMountainId}
                >
                  {mountains.map((mountain) => (
                    <option key={mountain.id} value={mountain.id}>
                      {mountain.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="toolbar-block">
              <p className="toolbar-label">CCTV 구분</p>
              <div className="chip-list preset-chip-list compact">
                {availableKinds.map((preset) => (
                  <button
                    key={preset}
                    className={visibleKind === preset ? 'chip active' : 'chip'}
                    onClick={() => setActiveKind(preset)}
                    type="button"
                  >
                    <Icon
                      name={
                        preset === '전체'
                          ? 'grid'
                          : preset === '정상'
                            ? 'mountain'
                            : preset === '풍경'
                              ? 'view'
                              : 'path'
                      }
                    />
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mountain-summary panel">
          <div>
            <p className="eyebrow">Live Mountain</p>
            <h2>{activeMountain.name}</h2>
            <p>{activeMountain.description}</p>
          </div>
          <a className="action tertiary" href={activeMountain.officialPage} rel="noreferrer" target="_blank">
            <Icon name="link" />
            공식 정보
          </a>
        </section>

        <section className="simul-grid">
          {visibleFeeds.map((feed, index) => (
            <article key={feed.id} className="simul-card">
              <div className="card-head">
                <h3>{feed.name}</h3>
              </div>
              <p className="card-copy">
                {feed.provider} · {feed.kind}
              </p>
              <StreamPlayer compact feed={feed} priority={index < 4} />
              <div className="card-actions">
                <a
                  className="action tertiary"
                  href={feed.officialPage}
                  rel="noreferrer"
                  target="_blank"
                >
                  <Icon name="link" />
                  공식 원본
                </a>
              </div>
            </article>
          ))}
        </section>

        {visibleFeeds.length === 0 ? (
          <section className="panel empty-state">지금 보여줄 CCTV가 없어요.</section>
        ) : null}

        <footer className="site-footer">
          <span>Powered by HWI</span>
          <a href="https://www.instagram.com/spacehwi/" rel="noreferrer" target="_blank">
            @spacehwi
          </a>
        </footer>
      </main>
    </div>
  )
}

export default App
