import { useEffect, useMemo, useRef, useState } from 'react'
import type { Feed } from '../data/feeds'

type StreamPlayerProps = {
  compact?: boolean
  feed: Feed
  priority?: boolean
}

export function StreamPlayer({ compact = false, feed, priority = false }: StreamPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const imageUrlRef = useRef(feed.sourceUrl)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [isPlaying, setIsPlaying] = useState(false)
  const [captureMessage, setCaptureMessage] = useState('')
  const [imageVersion, setImageVersion] = useState(0)
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
        setCaptureMessage('재생을 시작하지 못했어요')
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
        setCaptureMessage('캡쳐를 준비하지 못했어요')
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
          setCaptureMessage('아직 화면을 저장할 수 없어요')
          return
        }

        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
      }

      const timestamp = new Date().toISOString().replaceAll(':', '-')
      const fileName = `${feed.name}-${timestamp}.png`
      const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)

      const downloadImage = () => {
        const link = document.createElement('a')
        link.download = fileName
        link.href = canvas.toDataURL('image/png')
        link.click()
        setCaptureMessage('사진으로 저장했어요')
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
                title: `${feed.name} 캡쳐`,
                text: `${feed.name} 화면을 저장하거나 공유해보세요.`,
              })
              setCaptureMessage('공유 화면을 열었어요')
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
      setCaptureMessage('이 화면은 저장이 안 되는 상태예요')
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
          {status === 'error' ? '연결 확인 필요' : 'LIVE'}
        </span>
        <span className="stream-area">{feed.region}</span>
      </div>
      <div className={compact ? 'stream-player compact' : 'stream-player'}>
        {feed.sourceType === 'image' ? (
          <img
            alt={`${feed.name} 실시간 이미지`}
            className="stream-image"
            crossOrigin="anonymous"
            onError={() => setStatus('error')}
            src={refreshedImageUrl}
          />
        ) : (
          <video
            aria-label={`${feed.name} 실시간 영상`}
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
          화면 캡쳐
        </button>
        <span className="capture-message" aria-live="polite">
          {captureMessage}
        </span>
      </div>
    </div>
  )
}
