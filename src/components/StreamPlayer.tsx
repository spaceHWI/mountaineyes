import { useEffect, useMemo, useRef, useState } from 'react'
import type { Feed } from '../data/feeds'
import { useItsStreamUrl } from '../hooks/useItsUrls'
import { localize, playerCopy, type Language } from '../i18n'

type StreamStatus = 'loading' | 'ready' | 'error'

type StreamPlayerProps = {
  compact?: boolean
  feed: Feed
  isItsActive?: boolean
  language: Language
  onItsPlaybackChange?: (nextActive: boolean) => void
  priority?: boolean
}

const IMAGE_REFRESH_MS = 60_000
const LOADING_TICK_MS = 1_000
const ITS_WAITING_GRACE_MS = 2_500

const getStatusTone = (status: StreamStatus, isPlaying: boolean) => {
  if (status === 'error') {
    return 'error'
  }

  if (isPlaying) {
    return 'playing'
  }

  return status
}

export function StreamPlayer({
  compact = false,
  feed,
  isItsActive = false,
  language,
  onItsPlaybackChange,
  priority = false,
}: StreamPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const imageUrlRef = useRef(feed.sourceUrl)
  const hasStartedPlaybackRef = useRef(false)
  const waitingTimerRef = useRef<number | null>(null)
  const [activeItsStreamUrl, setActiveItsStreamUrl] = useState<string | null>(null)
  const [status, setStatus] = useState<StreamStatus>('loading')
  const [isPlaying, setIsPlaying] = useState(false)
  const [captureMessage, setCaptureMessage] = useState('')
  const [imageVersion, setImageVersion] = useState(0)
  const [loadingElapsed, setLoadingElapsed] = useState(0)
  const copy = playerCopy[language]
  const feedName = localize(feed.name, language)

  const isImageFeed = feed.sourceType === 'image'
  const isItsFeed = feed.sourceType === 'its'
  const itsStreamUrl = useItsStreamUrl(isItsFeed ? feed.itsDeviceId : undefined)
  const playerTone = getStatusTone(status, isPlaying)
  const playerStatusLabel = isItsFeed && !isItsActive
    ? copy.itsStandby
    : status === 'error'
      ? copy.connectionCheck
      : copy.live

  useEffect(() => {
    if (!isItsFeed) {
      setActiveItsStreamUrl(null)
      return
    }

    if (!itsStreamUrl) {
      return
    }

    setActiveItsStreamUrl((current) => {
      if (!current || status === 'error') {
        return itsStreamUrl
      }

      return current
    })
  }, [isItsFeed, itsStreamUrl, status])

  const playbackUrl = useMemo(() => {
    if (isItsFeed) {
      return activeItsStreamUrl ?? ''
    }

    return feed.sourceUrl.startsWith('http://')
      ? `/api/proxy?target=${encodeURIComponent(feed.sourceUrl)}`
      : feed.sourceUrl
  }, [activeItsStreamUrl, feed.sourceUrl, isItsFeed])
  const refreshedImageUrl = useMemo(
    () => `${feed.sourceUrl}${feed.sourceUrl.includes('?') ? '&' : '?'}t=${imageVersion}`,
    [feed.sourceUrl, imageVersion],
  )

  useEffect(() => {
    setCaptureMessage('')
  }, [feed.id, language])

  useEffect(() => {
    if (status !== 'loading' || isImageFeed) {
      setLoadingElapsed(0)
      return
    }

    setLoadingElapsed(1)
    const timer = window.setInterval(() => {
      setLoadingElapsed((current) => current + 1)
    }, LOADING_TICK_MS)

    return () => {
      window.clearInterval(timer)
    }
  }, [isImageFeed, status])

  useEffect(() => {
    if (!isImageFeed) {
      return
    }

    setStatus('ready')
    setIsPlaying(true)
    imageUrlRef.current = refreshedImageUrl

    const interval = window.setInterval(() => {
      setImageVersion((current) => current + 1)
    }, IMAGE_REFRESH_MS)

    return () => {
      window.clearInterval(interval)
    }
  }, [isImageFeed, refreshedImageUrl])

  useEffect(() => {
    if (isImageFeed) {
      return
    }

    const video = videoRef.current

    if (isItsFeed && !isItsActive) {
      hasStartedPlaybackRef.current = false
      setStatus('ready')
      setIsPlaying(false)
      if (video) {
        video.pause()
        video.removeAttribute('src')
        video.load()
      }
      return
    }

    if (isItsFeed && !playbackUrl) {
      setStatus('loading')
      return
    }

    if (!video) {
      return
    }

    let cancelled = false
    let teardown: (() => void) | undefined

    const clearWaitingTimer = () => {
      if (waitingTimerRef.current !== null) {
        window.clearTimeout(waitingTimerRef.current)
        waitingTimerRef.current = null
      }
    }

    hasStartedPlaybackRef.current = false
    setStatus('loading')
    setIsPlaying(false)
    video.pause()
    video.removeAttribute('src')
    video.load()

    const handleError = () => setStatus('error')
    const markReady = () => {
      clearWaitingTimer()
      hasStartedPlaybackRef.current = true
      setStatus('ready')
    }
    const handlePlay = () => setIsPlaying(true)
    const handlePlaying = () => {
      setIsPlaying(true)
      markReady()
    }
    const handlePause = () => {
      clearWaitingTimer()
      setIsPlaying(false)
    }
    const handleWaiting = () => {
      if (!hasStartedPlaybackRef.current) {
        return
      }

      clearWaitingTimer()

      if (isItsFeed) {
        waitingTimerRef.current = window.setTimeout(() => {
          setStatus('loading')
          waitingTimerRef.current = null
        }, ITS_WAITING_GRACE_MS)
        return
      }

      setStatus('loading')
    }
    const handleTimeUpdate = () => {
      if (video.currentTime > 0) {
        markReady()
      }
    }

    video.addEventListener('error', handleError)
    video.addEventListener('play', handlePlay)
    video.addEventListener('playing', handlePlaying)
    video.addEventListener('pause', handlePause)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('waiting', handleWaiting)

    const setupPlayer = async () => {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = playbackUrl
      } else {
        const { default: Hls } = await import('hls.js')

        if (cancelled) {
          return
        }

        if (!Hls.isSupported()) {
          setStatus('error')
          return
        }

        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        })

        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) {
            setStatus('error')
          }
        })

        hls.loadSource(playbackUrl)
        hls.attachMedia(video)
        teardown = () => hls.destroy()
      }

      try {
        await video.play()
      } catch {
        setIsPlaying(false)
      }
    }

    void setupPlayer()

    return () => {
      cancelled = true
      clearWaitingTimer()
      video.removeEventListener('error', handleError)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('playing', handlePlaying)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('waiting', handleWaiting)
      teardown?.()
    }
  }, [feed, isImageFeed, isItsActive, isItsFeed, playbackUrl])

  const togglePlayback = async () => {
    if (isImageFeed) {
      return
    }

    const video = videoRef.current

    if (!video || status === 'loading' || status === 'error') {
      return
    }

    if (video.paused) {
      try {
        await video.play()
      } catch {
        setCaptureMessage(copy.statusCannotStartPlayback)
      }
      return
    }

    video.pause()
  }

  const handleItsPlaybackToggle = () => {
    if (!isItsFeed || !onItsPlaybackChange) {
      return
    }

    if (isItsActive) {
      onItsPlaybackChange(false)
      return
    }

    setStatus('loading')
    onItsPlaybackChange(true)
  }

  const handleCapture = async () => {
    try {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')

      if (!context) {
        setCaptureMessage(copy.statusCapturePreparingFailed)
        return
      }

      if (isImageFeed) {
        const image = new Image()
        image.crossOrigin = 'anonymous'
        image.src = imageUrlRef.current
        await new Promise<void>((resolve, reject) => {
          image.onload = () => resolve()
          image.onerror = () => reject(new Error('image_load_failed'))
        })

        canvas.width = image.naturalWidth
        canvas.height = image.naturalHeight
        context.drawImage(image, 0, 0, canvas.width, canvas.height)
      } else {
        const video = videoRef.current

        if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
          setCaptureMessage(copy.statusCannotStoreYet)
          return
        }

        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
      }

      const timestamp = new Date().toISOString().replaceAll(':', '-')
      const fileName = `${feedName}-${timestamp}.png`
      const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)

      const downloadImage = () => {
        const link = document.createElement('a')
        link.download = fileName
        link.href = canvas.toDataURL('image/png')
        link.click()
        setCaptureMessage(copy.statusDownloaded)
      }

      if (isMobile && typeof navigator.share === 'function') {
        const blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob((value) => resolve(value), 'image/png')
        })

        if (blob) {
          const file = new File([blob], fileName, { type: 'image/png' })

          if (typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
            try {
              await navigator.share({
                files: [file],
                title: copy.shareFallbackTitle(feedName),
                text: copy.shareFallbackText(feedName),
              })
              setCaptureMessage(copy.statusOpenedShare)
              return
            } catch {
              downloadImage()
              return
            }
          }
        }
      }

      downloadImage()
    } catch {
      setCaptureMessage(copy.statusCaptureFailed)
    }
  }

  return (
    <div className="stream-shell">
      <div className="stream-meta">
        <span className={`stream-pill ${playerTone}`}>{playerStatusLabel}</span>
        <span className="stream-area">{localize(feed.region, language)}</span>
      </div>
      <div className={compact ? 'stream-player compact' : 'stream-player'}>
        {isItsFeed && !isItsActive ? (
          <div className="stream-its-gate">
            <button
              className="stream-its-play-button"
              onClick={handleItsPlaybackToggle}
              type="button"
            >
              {copy.itsPlay}
            </button>
          </div>
        ) : isImageFeed ? (
          <img
            alt={copy.streamImageAlt(feedName)}
            className="stream-image"
            onError={() => setStatus('error')}
            src={refreshedImageUrl}
          />
        ) : (
          <video
            aria-label={copy.streamVideoAriaLabel(feedName)}
            className="stream-video"
            crossOrigin="anonymous"
            muted
            onClick={() => {
              void togglePlayback()
            }}
            playsInline
            poster={feed.thumbnail}
            preload={priority ? 'auto' : 'metadata'}
            ref={videoRef}
          />
        )}
        {!isImageFeed && status === 'loading' ? (
          <div className="stream-loading-overlay" aria-live="polite">
            <div className="stream-loading-card">
              <div className="stream-loading-head">
                <strong>{copy.loadingTitle}</strong>
                <span>{copy.loadingAverage}</span>
              </div>
              <p>{copy.loadingBody(loadingElapsed)}</p>
              <div className="stream-loading-bar" aria-hidden="true">
                <span />
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="stream-tools">
        {isItsFeed ? (
          <button
            className="capture-button"
            onClick={handleItsPlaybackToggle}
            type="button"
          >
            {isItsActive ? copy.itsStop : copy.itsPlay}
          </button>
        ) : (
          <button
            className="capture-button"
            onClick={() => {
              void handleCapture()
            }}
            type="button"
          >
            {copy.capture}
          </button>
        )}
        <span className="capture-message" aria-live="polite">
          {isItsFeed && !isItsActive ? '' : captureMessage}
        </span>
      </div>
    </div>
  )
}
