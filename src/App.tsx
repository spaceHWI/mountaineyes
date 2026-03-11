import { useMemo, useState } from 'react'
import './App.css'
import { feeds } from './data/feeds'
import { StreamPlayer } from './components/StreamPlayer'

const summitIds = new Set(['halla-baengnokdam', 'halla-wanggwanneung', 'halla-witseoreum'])
const accessIds = new Set(['halla-eoseungsaengak', 'halla-1100'])

function Icon({ name }: { name: 'mountain' | 'path' | 'search' | 'grid' | 'camera' | 'link' }) {
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
    search: (
      <>
        <circle {...commonProps} cx="10" cy="10" r="5" />
        <path {...commonProps} d="m14.2 14.2 4.3 4.3" />
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
  }

  return (
    <span className="icon-badge" aria-hidden="true">
      <svg viewBox="0 0 24 24">{paths[name]}</svg>
    </span>
  )
}

function App() {
  const [activePreset, setActivePreset] = useState<'전체' | '산 정상' | '진입부'>('전체')

  const hikingFeeds = useMemo(
    () => feeds.filter((feed) => feed.category === '한라산'),
    [],
  )

  const visibleFeeds = useMemo(() => {
    return hikingFeeds.filter((feed) => {
      const matchesPreset =
        activePreset === '전체' ||
        (activePreset === '산 정상' && summitIds.has(feed.id)) ||
        (activePreset === '진입부' && accessIds.has(feed.id))

      return matchesPreset
    })
  }, [activePreset, hikingFeeds])

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
              <h1>Halla Eyes V1.0</h1>
            </div>
            <p className="hero-text">
              한라산 CCTV를 한눈에 보고 한손에 캡쳐하세요.
              <br />
              다른 산들도 업데이트 예정입니다.
            </p>
          </div>
        </section>

        <section className="toolbar panel">
          <div className="toolbar-row">
            <div className="chip-list preset-chip-list">
              {(['전체', '산 정상', '진입부'] as const).map((preset) => (
                <button
                  key={preset}
                  className={activePreset === preset ? 'chip active' : 'chip'}
                  onClick={() => setActivePreset(preset)}
                  type="button"
                >
                  <Icon
                    name={
                      preset === '전체'
                        ? 'grid'
                        : preset === '산 정상'
                          ? 'mountain'
                          : 'path'
                    }
                  />
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="simul-grid">
          {visibleFeeds.map((feed, index) => (
            <article key={feed.id} className="simul-card">
              <div className="card-head">
                <h3>{feed.name}</h3>
              </div>
              <p className="card-copy">{feed.description}</p>
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
