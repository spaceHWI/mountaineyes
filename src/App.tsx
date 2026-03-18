import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { DeerEasterEgg } from './components/DeerEasterEgg'
import { FeedCard } from './components/FeedCard'
import { Icon, PinIcon } from './components/Icon'
import { MountainPicker } from './components/MountainPicker'
import { Sparkline } from './components/Sparkline'
import { feeds, mountains, worldPicks, type MountainId } from './data/feeds'
import { useFeedHealth } from './hooks/useFeedHealth'
import { getSunLabel, useWeather } from './hooks/useWeather'
import { SunIcon, WeatherIcon } from './components/WeatherIcons'
import { appCopy, localize, type Language } from './i18n'
import { setMetaContent } from './utils/dom'
import { getDistanceKm } from './utils/geo'
import { getInitialLanguage, getInitialMountainId, isPinnedOnLoad, LANGUAGE_STORAGE_KEY, PINNED_MOUNTAIN_KEY } from './utils/init'

const LANGUAGE_OPTIONS = ['ko', 'en'] as const

function App() {
  const [language, setLanguage] = useState<Language>(getInitialLanguage)
  const [activeMountainId, setActiveMountainId] = useState<MountainId>(getInitialMountainId)
  const [pinned, setPinned] = useState(isPinnedOnLoad)
  const mountainIds = useMemo(() => mountains.map((m) => m.id), [])
  const feedHealth = useFeedHealth(mountainIds)

  const copy = appCopy[language]
  const activeMountain = mountains.find((mountain) => mountain.id === activeMountainId) ?? mountains[0]

  useEffect(() => {
    document.documentElement.lang = language
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language)

    const mountainName = localize(activeMountain.name, language)
    const title = `${mountainName} CCTV — MountainEyes`
    const desc = language === 'ko'
      ? `${mountainName} 실시간 CCTV 영상과 날씨를 MountainEyes에서 확인하세요.`
      : `Watch live ${mountainName} CCTV feeds and weather on MountainEyes.`
    const url = `https://mountaineyes.kr/?mountain=${activeMountain.id}`

    document.title = title
    setMetaContent('meta[name="description"]', desc)
    setMetaContent('meta[property="og:title"]', title)
    setMetaContent('meta[property="og:description"]', desc)
    setMetaContent('meta[property="og:url"]', url)
    setMetaContent('meta[name="twitter:title"]', title)
    setMetaContent('meta[name="twitter:description"]', desc)
  }, [activeMountain, language])

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

        if (!isPinnedOnLoad()) {
          setActiveMountainId(nearestMountain.mountainId)
        }
      },
      () => {},
      {
        enableHighAccuracy: false,
        maximumAge: 1000 * 60 * 10,
        timeout: 5000,
      },
    )
  }, [])

  const worldMountainIds = useMemo(() => [...new Set(worldPicks.map((f) => f.mountainId))] as MountainId[], [])

  const [activeWorldMountainId, setActiveWorldMountainId] = useState(() => {
    const idx = Math.floor(Math.random() * worldMountainIds.length)
    return worldMountainIds[idx] ?? 'montblanc'
  })

  const activeWorldFeed = useMemo(() => {
    const candidates = worldPicks.filter((f) => f.mountainId === activeWorldMountainId)
    return candidates[Math.floor(Math.random() * candidates.length)] ?? worldPicks[0]
  }, [activeWorldMountainId])

  const weather = useWeather(activeMountain.lat, activeMountain.lng)

  const sunLabel = weather ? getSunLabel(weather.sunrise, weather.sunset) : null

  const visibleFeeds = useMemo(
    () => feeds.filter((feed) => feed.mountainId === activeMountainId),
    [activeMountainId],
  )

  return (
    <div className="app-shell">
      <main className="page">
        <section className="hero">
          <div className="hero-copy">
            <div className="hero-topline">
              <div className="title-row">
                <span className="title-logo" aria-hidden="true">
                  <svg viewBox="0 0 64 64" className="logo-eyes-svg">
                    <path d="M32 6 C26 6 6 40 2 48 Q8 52 14 48 Q20 52 26 48 Q32 52 38 48 Q44 52 50 48 Q56 52 62 48 C58 40 38 6 32 6Z" fill="#1a4a2e"/>
                    <g className="logo-eye-group">
                      <ellipse cx="23" cy="34" rx="7" ry="8" fill="white"/>
                      <ellipse cx="41" cy="34" rx="7" ry="8" fill="white"/>
                      <ellipse cx="25" cy="35" rx="3.5" ry="4.5" fill="#1a4a2e"/>
                      <ellipse cx="43" cy="35" rx="3.5" ry="4.5" fill="#1a4a2e"/>
                    </g>
                  </svg>
                </span>
                <h1>MountainEyes<sup className="version-tag">V1.2</sup></h1>
              </div>
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
            <p className="hero-text">{copy.heroText}</p>
            <span className="soft-badge compact">
              <Icon name="megaphone" />
              {language === 'ko'
                ? '260313 — 22개 산 + 세계 54개 산, 실시간 날씨'
                : '260313 — 22 KR + 54 world mountains, live weather'}
            </span>
          </div>
        </section>

        <section className="toolbar panel">
          <div className="toolbar-stack">
            <div className="mountain-picker-row">
              <MountainPicker
                health={feedHealth}
                language={language}
                mountains={mountains}
                onChange={(id: MountainId) => {
                  setActiveMountainId(id)
                  if (pinned) {
                    window.localStorage.setItem(PINNED_MOUNTAIN_KEY, id)
                  }
                }}
                value={activeMountainId}
              />
              <a className="inline-link" href={activeMountain.officialPage} rel="noreferrer" target="_blank">
                {copy.officialInfo}
              </a>
              <button
                className={`pin-toggle ${pinned ? 'active' : ''}`}
                type="button"
                title={pinned ? (language === 'ko' ? '고정 해제' : 'Unpin') : (language === 'ko' ? '이 산 고정' : 'Pin this mountain')}
                onClick={() => {
                  if (pinned) {
                    window.localStorage.removeItem(PINNED_MOUNTAIN_KEY)
                    setPinned(false)
                  } else {
                    window.localStorage.setItem(PINNED_MOUNTAIN_KEY, activeMountainId)
                    setPinned(true)
                  }
                }}
              >
                <PinIcon active={pinned} />
              </button>
            </div>
            {weather && sunLabel && (
              <span className="weather-badge">
                <span className="weather-icon"><WeatherIcon code={weather.weatherCode} /></span>
                <span className="weather-temp">{weather.temperature}°</span>
                <span className="weather-humidity">{weather.humidity}%</span>
                <span className="weather-wind">{weather.windSpeed}km/h</span>
                <span className="weather-sun"><SunIcon type={sunLabel.type} />{sunLabel.time}</span>
                <Sparkline data={weather.hourly} />
              </span>
            )}
            <p className="mountain-desc">{localize(activeMountain.description, language)}</p>
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
              <select
                className="world-picker-select"
                value={activeWorldMountainId}
                onChange={(e) => setActiveWorldMountainId(e.target.value as MountainId)}
              >
                {worldMountainIds.map((mId) => {
                  const feed = worldPicks.find((f) => f.mountainId === mId)
                  return (
                    <option key={mId} value={mId}>
                      {feed ? localize(feed.region, language) + ' — ' + localize(feed.name, language) : mId}
                    </option>
                  )
                })}
              </select>
            </div>
          </div>
          <div className="world-grid">
            <FeedCard feed={activeWorldFeed} language={language} />
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
