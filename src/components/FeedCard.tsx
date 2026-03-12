import type { Feed } from '../data/feeds'
import { appCopy, kindLabels, localize, type Language } from '../i18n'
import { StreamPlayer } from './StreamPlayer'

type FeedCardProps = {
  feed: Feed
  isItsActive?: boolean
  language: Language
  onItsPlaybackChange?: (nextActive: boolean) => void
  priority?: boolean
  showKind?: boolean
}

export function FeedCard({
  feed,
  isItsActive = false,
  language,
  onItsPlaybackChange,
  priority = false,
  showKind = false,
}: FeedCardProps) {
  const copy = appCopy[language]

  return (
    <article className="simul-card">
      <div className="card-head">
        <div className="card-title-row">
          <h3>{localize(feed.name, language)}</h3>
          {feed.sourceType === 'its' ? <span className="feed-badge its">ITS</span> : null}
        </div>
        <a className="inline-link" href={feed.officialPage} rel="noreferrer" target="_blank">
          {copy.officialSource}
        </a>
      </div>
      <p className="card-copy">
        {localize(feed.provider, language)}
        {showKind ? ` · ${localize(kindLabels[feed.kind], language)}` : null}
      </p>
      <StreamPlayer
        compact
        feed={feed}
        isItsActive={isItsActive}
        language={language}
        onItsPlaybackChange={onItsPlaybackChange}
        priority={priority}
      />
    </article>
  )
}
