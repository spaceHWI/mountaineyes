import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { DeerEasterEgg } from './components/DeerEasterEgg'
import { FeedCard } from './components/FeedCard'
import { Icon } from './components/Icon'
import { feeds, mountains, worldPicks, type FeedKind, type MountainId } from './data/feeds'
import { useItsAvailable } from './hooks/useItsUrls'
import { appCopy, kindLabels, localize, type Language } from './i18n'
import { setMetaContent } from './utils/dom'
import { getDistanceKm } from './utils/geo'
import { getInitialLanguage, getInitialMountainId, LANGUAGE_STORAGE_KEY } from './utils/init'

const LANGUAGE_OPTIONS = ['ko', 'en'] as const

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
  const itsAvailable = useItsAvailable()

  const copy = appCopy[language]

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

        setActiveMountainId(nearestMountain.mountainId)
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
        if (feed.sourceType === 'its' && !itsAvailable) return false
        const sameMountain = feed.mountainId === activeMountainId
        const sameKind = visibleKind === 'all' || feed.kind === visibleKind
        return sameMountain && sameKind
      }),
    [activeMountainId, itsAvailable, visibleKind],
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
                {LANGUAGE_OPTIONS.map((option) => (
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
                    onChange={(event) => setActiveMountainId(event.target.value as MountainId)}
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
            <FeedCard
              key={feed.id}
              feed={feed}
              language={language}
              priority={index < 4}
              showKind
            />
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
              <FeedCard key={feed.id} feed={feed} language={language} />
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
      <DeerEasterEgg />
    </div>
  )
}

export default App
