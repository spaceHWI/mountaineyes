import { useEffect, useMemo, useRef, useState } from 'react'
import type { Feed } from '../data/feeds'
import { localize, playerCopy, type Language } from '../i18n'

type StreamPlayerProps = {
  compact?: boolean
  feed: Feed
  language: Language
  priority?: boolean
}

export function StreamPlayer({
  compact = false,
  feed,
  language,
  priority = false,
}: StreamPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const imageUrlRef = useRef(feed.sourceUrl)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [isPlaying, setIsPlaying] = useState(false)
  const [captureMessage, setCaptureMessage] = useState('')
  const [imageVersion, setImageVersion] = useState(0)
  const copy = playerCopy[language]
  const feedName = localize(feed.name, language)
  const playbackUrl = useMemo(
    () =>
      feed.sourceUrl.startsWith('http://')
        ? `/api/proxy?target=${encodeURIComponent(feed.sourceUrl)}`
        : feed.sourceUrl,
    [feed.sourceUrl],
  )
  const refreshedImageUrl = useMemo(
    () => `${feed.sourceUrl}${feed.sourceUrl.includes('?') ? '&' : '?'}t=${imageVersion}`,
    [feed.sourceUrl, imageVersion],
  )

  useEffect(() => {
    setCaptureMessage('')
  }, [feed.id, language])

  useEffect(() => {
    if (feed.sourceType !== 'image') {
      return
    }

    setStatus('ready')
    setIsPlaying(true)
    imageUrlRef.current = refreshedImageUrl

    const interval = window.setInterval(() => {
      setImageVersion((current) => current + 1)
    }, 60000)

    return () => {
      window.clearInterval(interval)
    }
  }, [feed.sourceType, refreshedImageUrl])

  useEffect(() => {
    if (feed.sourceType === 'image') {
      return
    }

    const video = videoRef.current

    if (!video) {
      return
    }

    let cancelled = false
    let teardown: (() => void) | undefined
    setStatus('loading')
    setIsPlaying(false)
    video.pause()
    video.removeAttribute('src')
    video.load()

    const handleCanPlay = () => setStatus('ready')
    const handleError = () => setStatus('error')
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('playing', handleCanPlay)
    video.addEventListener('error', handleError)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)

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
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('playing', handleCanPlay)
      video.removeEventListener('error', handleError)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      teardown?.()
    }
  }, [feed, playbackUrl])

  const togglePlayback = async () => {
    if (feed.sourceType === 'image') {
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

  const handleCapture = async () => {
    try {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')

      if (!context) {
        setCaptureMessage(copy.statusCapturePreparingFailed)
        return
      }

      if (feed.sourceType === 'image') {
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
        <span
          className={`stream-pill ${
            status === 'error' ? 'error' : isPlaying ? 'playing' : status === 'loading' ? 'loading' : 'ready'
          }`}
        >
          {status === 'error' ? copy.connectionCheck : copy.live}
        </span>
        <span className="stream-area">{localize(feed.region, language)}</span>
      </div>
      <div className={compact ? 'stream-player compact' : 'stream-player'}>
        {feed.sourceType === 'image' ? (
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
      </div>

      <div className="stream-tools">
        <button
          className="capture-button"
          onClick={() => {
            void handleCapture()
          }}
          type="button"
        >
          {copy.capture}
        </button>
        <span className="capture-message" aria-live="polite">
          {captureMessage}
        </span>
      </div>
    </div>
  )
}
