import type { FeedKind } from './data/feeds'

export type Language = 'ko' | 'en'

export type LocalizedText = Record<Language, string>

export const localize = (text: LocalizedText, language: Language) => text[language]

export const kindLabels: Record<FeedKind, LocalizedText> = {
  summit: { ko: '정상', en: 'Summit' },
  access: { ko: '진입부', en: 'Access' },
  view: { ko: '풍경', en: 'View' },
}

export const appCopy = {
  ko: {
    allLabel: '전체',
    emptyState: '지금 보여줄 CCTV가 없어요.',
    heroEyebrow: 'Live Cam',
    heroText: '전국 산 CCTV를 한눈에 보고 한손에 캡쳐하세요.',
    instagramAriaLabel: 'Instagram에서 @spacehwi로 피드백 보내기',
    instagramTitle: 'Instagram에서 피드백 보내기',
    languageLabel: '언어',
    languageOptions: {
      ko: '한국어',
      en: 'English',
    },
    liveMountainEyebrow: 'Live Mountain',
    locationPrompt: '위치를 허용하면 가까운 산부터 먼저 보여드려요',
    locationWithNearest: (mountainName: string) => `지금 위치에서 가까운 ${mountainName}부터 보여드려요`,
    officialInfo: '공식 정보',
    officialSource: '공식 원본',
    pageDescription:
      'MountainEyes는 한라산, 설악산, 발왕산 등 국내 산 CCTV를 한곳에서 보고 가까운 산을 먼저 추천해주는 실시간 산 CCTV 서비스입니다.',
    pageTitle: 'MountainEyes V1.1',
    poweredBy: 'Powered by HWI',
    twitterDescription: '전국 산 CCTV를 한눈에 보고 가까운 산을 먼저 추천받는 실시간 산 CCTV 서비스',
    worldPickDescription: '프랑스 샤모니 공식 웹캠에서 제공하는 최신 몽블랑 이미지를 함께 보여줍니다.',
    worldPickEyebrow: 'World Pick',
    worldPickTitle: '몽블랑',
  },
  en: {
    allLabel: 'All',
    emptyState: 'No CCTV feed is available right now.',
    heroEyebrow: 'Live Cam',
    heroText: 'Browse mountain CCTV feeds across Korea and capture them in one tap.',
    instagramAriaLabel: 'Send feedback to @spacehwi on Instagram',
    instagramTitle: 'Send feedback on Instagram',
    languageLabel: 'Language',
    languageOptions: {
      ko: 'KR',
      en: 'EN',
    },
    liveMountainEyebrow: 'Live Mountain',
    locationPrompt: 'Allow location access to jump to the nearest mountain first.',
    locationWithNearest: (mountainName: string) => `Showing ${mountainName} first because it is closest to you.`,
    officialInfo: 'Official Info',
    officialSource: 'Official Source',
    pageDescription:
      'MountainEyes is a live mountain CCTV service that brings together official feeds from Hallasan, Seoraksan, Balwangsan, and more.',
    pageTitle: 'MountainEyes V1.1',
    poweredBy: 'Powered by HWI',
    twitterDescription: 'Live mountain CCTV feeds with nearest-mountain recommendations',
    worldPickDescription:
      'See the latest Mont Blanc image provided by the official Chamonix webcam feed.',
    worldPickEyebrow: 'World Pick',
    worldPickTitle: 'Mont Blanc',
  },
} as const

export const playerCopy = {
  ko: {
    capture: '화면 캡쳐',
    connectionCheck: '연결 확인 필요',
    live: 'LIVE',
    loadingAverage: '평균 5-10초',
    loadingBody: (seconds: number) => `스트림 연결 중입니다. ${seconds}초째 기다리는 중이에요.`,
    loadingTitle: '영상 연결 중',
    shareFallbackText: (feedName: string) => `${feedName} 화면을 저장하거나 공유해보세요.`,
    shareFallbackTitle: (feedName: string) => `${feedName} 캡쳐`,
    statusCaptureFailed: '이 화면은 저장이 안 되는 상태예요',
    statusCapturePreparingFailed: '캡쳐를 준비하지 못했어요',
    statusCannotStartPlayback: '재생을 시작하지 못했어요',
    statusStartPlaybackFirst: '먼저 재생을 시작해 주세요',
    statusCannotStoreYet: '아직 화면을 저장할 수 없어요',
    statusDownloaded: '사진으로 저장했어요',
    statusOpenedShare: '공유 화면을 열었어요',
    streamImageAlt: (feedName: string) => `${feedName} 실시간 이미지`,
    streamVideoAriaLabel: (feedName: string) => `${feedName} 실시간 영상`,
  },
  en: {
    capture: 'Capture',
    connectionCheck: 'Check stream',
    live: 'LIVE',
    loadingAverage: 'avg. 5-10s',
    loadingBody: (seconds: number) => `Connecting to the stream. Waiting for ${seconds}s.`,
    loadingTitle: 'Connecting video',
    shareFallbackText: (feedName: string) => `Save or share the ${feedName} view.`,
    shareFallbackTitle: (feedName: string) => `${feedName} capture`,
    statusCaptureFailed: 'This view cannot be saved right now',
    statusCapturePreparingFailed: 'Capture is not available right now',
    statusCannotStartPlayback: 'Playback could not start',
    statusStartPlaybackFirst: 'Start playback first',
    statusCannotStoreYet: 'The frame is not ready to save yet',
    statusDownloaded: 'Saved as an image',
    statusOpenedShare: 'Opened the share sheet',
    streamImageAlt: (feedName: string) => `Live image of ${feedName}`,
    streamVideoAriaLabel: (feedName: string) => `Live video of ${feedName}`,
  },
} as const
