import { useEffect, useMemo, useRef, useState } from 'react'
import type { Feed } from '../data/feeds'
import { localize, playerCopy, type Language } from '../i18n'

type StreamStatus = 'loading' | 'ready' | 'error'

type StreamPlayerProps = {
  compact?: boolean
  feed: Feed
  language: Language
  priority?: boolean
}

const IMAGE_REFRESH_MS = 60_000
const LOADING_TICK_MS = 1_000

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
  language,
  priority = false,
}: StreamPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const imageUrlRef = useRef(feed.sourceUrl)
  const hasStartedPlaybackRef = useRef(false)
  const waitingTimerRef = useRef<number | null>(null)
  const [status, setStatus] = useState<StreamStatus>('loading')
  const [isPlaying, setIsPlaying] = useState(false)
  const [captureMessage, setCaptureMessage] = useState('')
  const [imageVersion, setImageVersion] = useState(0)
  const [loadingElapsed, setLoadingElapsed] = useState(0)
  const copy = playerCopy[language]
  const feedName = localize(feed.name, language)

  const [imageLoading, setImageLoading] = useState(true)
  const isImageFeed = feed.sourceType === 'image'
  const playerTone = getStatusTone(status, isPlaying)
  const playerStatusLabel = status === 'error'
    ? copy.connectionCheck
    : copy.live

  const playbackUrl = useMemo(() => {
    return feed.sourceUrl.startsWith('http://')
      ? `/api/proxy?target=${encodeURIComponent(feed.sourceUrl)}`
      : feed.sourceUrl
  }, [feed.sourceUrl])
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

    const handleError = () => {
      setStatus('error')
    }
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
      waitingTimerRef.current = window.setTimeout(() => {
        setStatus('loading')
      }, 3000)
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

    const tryPlay = () => {
      video.play().catch(() => {
        setIsPlaying(false)
      })
    }

    const setupPlayer = async () => {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = playbackUrl
        tryPlay()
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
          lowLatencyMode: false,
          liveSyncDurationCount: 3,
          liveMaxLatencyDurationCount: 6,
          maxBufferLength: 15,
          maxMaxBufferLength: 30,
          startFragPrefetch: true,
        })

        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                hls.startLoad()
                break
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError()
                break
              default:
                setStatus('error')
                break
            }
          }
        })

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          tryPlay()
        })

        hls.loadSource(playbackUrl)
        hls.attachMedia(video)
        teardown = () => hls.destroy()
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
  }, [feed, isImageFeed, playbackUrl])

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

  const playerRef = useRef<HTMLDivElement>(null)

  const toggleFullscreen = () => {
    const el = playerRef.current
    if (!el) return

    if (document.fullscreenElement) {
      void document.exitFullscreen()
    } else {
      void el.requestFullscreen()
    }
  }

  return (
    <div className="stream-shell">
      <div className="stream-meta">
        <span className={`stream-pill ${playerTone}`}>{playerStatusLabel}</span>
        <span className="stream-area">{localize(feed.region, language)}</span>
      </div>
      <div className={compact ? 'stream-player compact' : 'stream-player'} ref={playerRef}>
        {isImageFeed ? (
          <>
            {imageLoading && (
              <div className="stream-image-placeholder" aria-hidden="true">
                <svg viewBox="0 0 64 64" className="placeholder-icon">
                  <path d="M32 6 C26 6 6 40 2 48 Q8 52 14 48 Q20 52 26 48 Q32 52 38 48 Q44 52 50 48 Q56 52 62 48 C58 40 38 6 32 6Z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                  <ellipse cx="23" cy="34" rx="7" ry="8" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                  <ellipse cx="41" cy="34" rx="7" ry="8" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </div>
            )}
            <img
              alt={copy.streamImageAlt(feedName)}
              className="stream-image"
              onClick={toggleFullscreen}
              onError={() => { setImageLoading(false); setStatus('error') }}
              onLoad={() => setImageLoading(false)}
              src={refreshedImageUrl}
              style={imageLoading ? { opacity: 0, position: 'absolute' } : { cursor: 'pointer' }}
            />
          </>
        ) : (
          <video
            aria-label={copy.streamVideoAriaLabel(feedName)}
            className="stream-video"
            muted
            onClick={toggleFullscreen}
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
        <div className="stream-action-group">
          <button
            className="capture-button"
            onClick={() => {
              void handleCapture()
            }}
            type="button"
          >
            {copy.capture}
          </button>
        </div>
        <span className="capture-message" aria-live="polite">
          {captureMessage}
        </span>
      </div>
    </div>
  )
}
