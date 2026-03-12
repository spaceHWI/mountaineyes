import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { StreamPlayer } from './components/StreamPlayer'
import { feeds, mountains, worldPicks, type FeedKind, type MountainId } from './data/feeds'
import { appCopy, kindLabels, localize, type Language } from './i18n'

const EARTH_RADIUS_KM = 6371
const LANGUAGE_STORAGE_KEY = 'mountaineyes-language'

const getInitialMountainId = (): MountainId => {
  if (typeof window === 'undefined') {
    return 'hallasan'
  }

  const mountainId = new URLSearchParams(window.location.search).get('mountain')
  const isValidMountain = mountains.some((mountain) => mountain.id === mountainId)

  return isValidMountain ? (mountainId as MountainId) : 'hallasan'
}

function Icon({
  name,
}: {
  name: 'mountain' | 'path' | 'grid' | 'camera' | 'link' | 'pin' | 'view' | 'instagram'
}) {
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
    instagram: (
      <>
        <rect {...commonProps} x="4.5" y="4.5" width="15" height="15" rx="4.2" />
        <circle {...commonProps} cx="12" cy="12" r="3.3" />
        <circle {...commonProps} cx="17" cy="7.8" r="0.8" fill="currentColor" stroke="none" />
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

const getInitialLanguage = (): Language => {
  if (typeof window === 'undefined') {
    return 'ko'
  }

  const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
  if (storedLanguage === 'ko' || storedLanguage === 'en') {
    return storedLanguage
  }

  return window.navigator.language.toLowerCase().startsWith('ko') ? 'ko' : 'en'
}

const setMetaContent = (selector: string, value: string) => {
  const element = document.head.querySelector<HTMLMetaElement>(selector)
  if (element) {
    element.content = value
  }
}

const getKindIcon = (kind: FeedKind | 'all') => {
  if (kind === 'all') {
    return 'grid'
  }

  if (kind === 'summit') {
    return 'mountain'
  }

  if (kind === 'view') {
    return 'view'
  }

  return 'path'
}

function App() {
  const [language, setLanguage] = useState<Language>(getInitialLanguage)
  const [activeMountainId, setActiveMountainId] = useState<MountainId>(getInitialMountainId)
  const [activeKind, setActiveKind] = useState<'all' | FeedKind>('all')
  const [nearestMountainId, setNearestMountainId] = useState<MountainId | null>(null)

  const copy = appCopy[language]

  const activateMountain = (mountainId: MountainId) => {
    setActiveMountainId(mountainId)
  }

  useEffect(() => {
    document.documentElement.lang = language
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language)

    document.title = copy.pageTitle
    setMetaContent('meta[name="description"]', copy.pageDescription)
    setMetaContent('meta[property="og:title"]', copy.pageTitle)
    setMetaContent('meta[property="og:description"]', copy.pageDescription)
    setMetaContent('meta[name="twitter:title"]', copy.pageTitle)
    setMetaContent('meta[name="twitter:description"]', copy.twitterDescription)
  }, [copy.pageDescription, copy.pageTitle, copy.twitterDescription, language])

  useEffect(() => {
    if (!navigator.geolocation) {
      return
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const nearestMountain = mountains.reduce((closest, mountain) => {
          const distance = getDistanceKm(coords.latitude, coords.longitude, mountain.lat, mountain.lng)

          if (!closest || distance < closest.distance) {
            return { distance, mountainId: mountain.id }
          }

          return closest
        }, null as null | { distance: number; mountainId: MountainId })

        if (!nearestMountain) {
          return
        }

        activateMountain(nearestMountain.mountainId)
        setNearestMountainId(nearestMountain.mountainId)
      },
      () => {
        setNearestMountainId(null)
      },
      {
        enableHighAccuracy: false,
        maximumAge: 1000 * 60 * 10,
        timeout: 5000,
      },
    )
  }, [])

  const nearestMountainName = nearestMountainId
    ? localize(mountains.find((mountain) => mountain.id === nearestMountainId)?.name ?? mountains[0].name, language)
    : null
  const locationLabel = nearestMountainName
    ? copy.locationWithNearest(nearestMountainName)
    : copy.locationPrompt

  const activeMountain = mountains.find((mountain) => mountain.id === activeMountainId) ?? mountains[0]

  const availableKinds = useMemo(() => {
    const kinds = new Set<FeedKind>()

    feeds.forEach((feed) => {
      if (feed.mountainId === activeMountainId) {
        kinds.add(feed.kind)
      }
    })

    return ['all', ...Array.from(kinds)] as Array<'all' | FeedKind>
  }, [activeMountainId])

  const visibleKind = availableKinds.includes(activeKind) ? activeKind : 'all'

  const visibleFeeds = useMemo(
    () =>
      feeds.filter((feed) => {
        const sameMountain = feed.mountainId === activeMountainId
        const sameKind = visibleKind === 'all' || feed.kind === visibleKind
        return sameMountain && sameKind
      }),
    [activeMountainId, visibleKind],
  )

  return (
    <div className="app-shell">
      <main className="page">
        <section className="hero">
          <div className="hero-copy">
            <div className="hero-topline">
              <p className="eyebrow">{copy.heroEyebrow}</p>
              <div className="language-switch" aria-label={copy.languageLabel} role="group">
                <span className="language-switch-label">{copy.languageLabel}</span>
                {(['ko', 'en'] as const).map((option) => (
                  <button
                    key={option}
                    className={language === option ? 'language-chip active' : 'language-chip'}
                    onClick={() => setLanguage(option)}
                    type="button"
                  >
                    {copy.languageOptions[option]}
                  </button>
                ))}
              </div>
            </div>
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
              <h1>{copy.pageTitle}</h1>
            </div>
            <p className="hero-text">{copy.heroText}</p>
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
              <div className="mountain-picker-row">
                <label className="mountain-select-wrap" htmlFor="mountain-select">
                  <select
                    id="mountain-select"
                    className="mountain-select"
                    onChange={(event) => activateMountain(event.target.value as MountainId)}
                    value={activeMountainId}
                  >
                    {mountains.map((mountain) => (
                      <option key={mountain.id} value={mountain.id}>
                        {localize(mountain.name, language)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <div className="toolbar-block">
              <div className="chip-list preset-chip-list compact">
                {availableKinds.map((preset) => (
                  <button
                    key={preset}
                    className={visibleKind === preset ? 'chip active' : 'chip'}
                    onClick={() => setActiveKind(preset)}
                    type="button"
                  >
                    <Icon name={getKindIcon(preset)} />
                    {preset === 'all' ? copy.allLabel : localize(kindLabels[preset], language)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mountain-summary panel">
          <div className="section-head">
            <div>
              <p className="eyebrow">{copy.liveMountainEyebrow}</p>
              <h2>{localize(activeMountain.name, language)}</h2>
              <p>{localize(activeMountain.description, language)}</p>
            </div>
            <a className="inline-link" href={activeMountain.officialPage} rel="noreferrer" target="_blank">
              {copy.officialInfo}
            </a>
          </div>
        </section>

        <section className="simul-grid">
          {visibleFeeds.map((feed, index) => (
            <article key={feed.id} className="simul-card">
              <div className="card-head">
                <h3>{localize(feed.name, language)}</h3>
                <a className="inline-link" href={feed.officialPage} rel="noreferrer" target="_blank">
                  {copy.officialSource}
                </a>
              </div>
              <p className="card-copy">
                {localize(feed.provider, language)} · {localize(kindLabels[feed.kind], language)}
              </p>
              <StreamPlayer compact feed={feed} language={language} priority={index < 4} />
            </article>
          ))}
        </section>

        <section className="world-block panel">
          <div className="world-head">
            <div>
              <p className="eyebrow">{copy.worldPickEyebrow}</p>
              <h2>{copy.worldPickTitle}</h2>
              <p>{copy.worldPickDescription}</p>
            </div>
          </div>
          <div className="world-grid">
            {worldPicks.map((feed) => (
              <article key={feed.id} className="simul-card">
                <div className="card-head">
                  <h3>{localize(feed.name, language)}</h3>
                  <a className="inline-link" href={feed.officialPage} rel="noreferrer" target="_blank">
                    {copy.officialSource}
                  </a>
                </div>
                <p className="card-copy">{localize(feed.provider, language)}</p>
                <StreamPlayer compact feed={feed} language={language} />
              </article>
            ))}
          </div>
        </section>

        {visibleFeeds.length === 0 ? (
          <section className="panel empty-state">{copy.emptyState}</section>
        ) : null}

        <footer className="site-footer">
          <span>{copy.poweredBy}</span>
          <span className="site-footer-divider" aria-hidden="true">
            |
          </span>
          <a
            className="site-footer-instagram"
            href="https://www.instagram.com/spacehwi/"
            rel="noreferrer"
            target="_blank"
            aria-label={copy.instagramAriaLabel}
            title={copy.instagramTitle}
          >
            <Icon name="instagram" />
            <span>@spacehwi</span>
          </a>
        </footer>
      </main>
    </div>
  )
}

export default App
