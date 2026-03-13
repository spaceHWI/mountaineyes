import type { Feed } from '../data/feeds'
import { appCopy, kindLabels, localize, type Language } from '../i18n'
import { StreamPlayer } from './StreamPlayer'

type FeedCardProps = {
  feed: Feed
  language: Language
  priority?: boolean
  showKind?: boolean
}

export function FeedCard({
  feed,
  language,
  priority = false,
  showKind = false,
}: FeedCardProps) {
  const copy = appCopy[language]

  return (
    <article className="simul-card">
      <div className="card-head">
        <div className="card-title-row">
          <h3>{localize(feed.name, language)}</h3>
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
        language={language}
        priority={priority}
      />
    </article>
  )
}
