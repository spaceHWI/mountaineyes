import type { LocalizedText } from '../i18n'

export type MountainId =
  | 'hallasan'
  | 'balwangsan'
  | 'seoraksan'
  | 'odaesan'
  | 'chiaksan'
  | 'taebaeksan'
  | 'montblanc'

export type FeedKind = 'summit' | 'access' | 'view'

export type Mountain = {
  description: LocalizedText
  id: MountainId
  lat: number
  lng: number
  name: LocalizedText
  officialPage: string
  region: LocalizedText
}

export type Feed = {
  id: string
  kind: FeedKind
  mountainId: MountainId
  name: LocalizedText
  officialLabel: LocalizedText
  officialPage: string
  provider: LocalizedText
  region: LocalizedText
  sourceType?: 'hls' | 'image'
  sourceUrl: string
  thumbnail?: string
}

export const mountains: Mountain[] = [
  {
    id: 'hallasan',
    name: { ko: '한라산', en: 'Hallasan' },
    region: { ko: '제주', en: 'Jeju' },
    lat: 33.3617,
    lng: 126.5292,
    officialPage: 'https://www.jeju.go.kr/tool/halla/cctv.html',
    description: {
      ko: '제주 대표 산. 정상과 진입부 CCTV가 고르게 있습니다.',
      en: 'Jeju’s signature mountain with a balanced mix of summit and access-point CCTV feeds.',
    },
  },
  {
    id: 'balwangsan',
    name: { ko: '발왕산', en: 'Balwangsan' },
    region: { ko: '강원', en: 'Gangwon' },
    lat: 37.6444,
    lng: 128.6806,
    officialPage: 'https://www.weather.go.kr/gangwon/maple/cctv2.php',
    description: {
      ko: '강원지방기상청 실시간영상 페이지를 통해 확인할 수 있는 대표 산입니다.',
      en: 'A popular mountain with official live feeds available through the Gangwon Regional Meteorological Administration.',
    },
  },
  {
    id: 'seoraksan',
    name: { ko: '설악산', en: 'Seoraksan' },
    region: { ko: '강원', en: 'Gangwon' },
    lat: 38.1194,
    lng: 128.4656,
    officialPage: 'https://www.weather.go.kr/gangwon/maple/cctv.php',
    description: {
      ko: '국립공원공단 공식 실시간영상에서 울산바위 쪽 화면을 확인할 수 있습니다.',
      en: 'The official national park stream lets you check the Ulsanbawi view in real time.',
    },
  },
  {
    id: 'odaesan',
    name: { ko: '오대산', en: 'Odaesan' },
    region: { ko: '강원', en: 'Gangwon' },
    lat: 37.7866,
    lng: 128.5646,
    officialPage: 'https://www.weather.go.kr/gangwon/maple/cctv.php',
    description: {
      ko: '국립공원공단 공식 실시간영상에서 두로령 화면을 확인할 수 있습니다.',
      en: 'Watch the Duro Pass feed from the official Korea National Park Service stream.',
    },
  },
  {
    id: 'chiaksan',
    name: { ko: '치악산', en: 'Chiaksan' },
    region: { ko: '강원', en: 'Gangwon' },
    lat: 37.3653,
    lng: 128.0504,
    officialPage: 'https://www.weather.go.kr/gangwon/maple/cctv.php',
    description: {
      ko: '국립공원공단 공식 실시간영상에서 상원사 화면을 확인할 수 있습니다.',
      en: 'Check the Sangwonsa feed through the official Korea National Park Service live stream.',
    },
  },
  {
    id: 'taebaeksan',
    name: { ko: '태백산', en: 'Taebaeksan' },
    region: { ko: '강원', en: 'Gangwon' },
    lat: 37.0967,
    lng: 128.9166,
    officialPage: 'https://www.weather.go.kr/gangwon/maple/cctv.php',
    description: {
      ko: '국립공원공단 공식 실시간영상에서 천제단 화면을 확인할 수 있습니다.',
      en: 'The official live stream provides the Cheonjedan summit view.',
    },
  },
]

export const feeds: Feed[] = [
  {
    id: 'hallasan-baengnokdam',
    name: { ko: '백록담', en: 'Baengnokdam' },
    mountainId: 'hallasan',
    kind: 'summit',
    region: { ko: '제주', en: 'Jeju' },
    provider: { ko: '제주특별자치도', en: 'Jeju Special Self-Governing Province' },
    officialLabel: { ko: '한라산 CCTV 원본', en: 'Hallasan official CCTV' },
    officialPage: 'https://www.jeju.go.kr/tool/halla/cctv_01.html',
    sourceUrl: 'https://hallacctv.kr/live/cctv01.stream_360p/playlist.m3u8',
    thumbnail: 'https://www.jeju.go.kr/tool/halla/images/cctv01.png',
  },
  {
    id: 'hallasan-wanggwanneung',
    name: { ko: '왕관릉', en: 'Wanggwanneung' },
    mountainId: 'hallasan',
    kind: 'summit',
    region: { ko: '제주', en: 'Jeju' },
    provider: { ko: '제주특별자치도', en: 'Jeju Special Self-Governing Province' },
    officialLabel: { ko: '한라산 CCTV 원본', en: 'Hallasan official CCTV' },
    officialPage: 'https://www.jeju.go.kr/tool/halla/cctv_02.html',
    sourceUrl: 'https://hallacctv.kr/live/cctv02.stream_360p/playlist.m3u8',
    thumbnail: 'https://www.jeju.go.kr/tool/halla/images/cctv02.png',
  },
  {
    id: 'hallasan-witseoreum',
    name: { ko: '윗세오름', en: 'Witse Oreum' },
    mountainId: 'hallasan',
    kind: 'summit',
    region: { ko: '제주', en: 'Jeju' },
    provider: { ko: '제주특별자치도', en: 'Jeju Special Self-Governing Province' },
    officialLabel: { ko: '한라산 CCTV 원본', en: 'Hallasan official CCTV' },
    officialPage: 'https://www.jeju.go.kr/tool/halla/cctv_03.html',
    sourceUrl: 'https://hallacctv.kr/live/cctv03.stream_360p/playlist.m3u8',
    thumbnail: 'https://www.jeju.go.kr/tool/halla/images/cctv03.png',
  },
  {
    id: 'hallasan-eoseungsaengak',
    name: { ko: '어승생악', en: 'Eoseungsaengak' },
    mountainId: 'hallasan',
    kind: 'access',
    region: { ko: '제주', en: 'Jeju' },
    provider: { ko: '제주특별자치도', en: 'Jeju Special Self-Governing Province' },
    officialLabel: { ko: '한라산 CCTV 원본', en: 'Hallasan official CCTV' },
    officialPage: 'https://www.jeju.go.kr/tool/halla/cctv_04.html',
    sourceUrl: 'https://hallacctv.kr/live/cctv04.stream_360p/playlist.m3u8',
    thumbnail: 'https://www.jeju.go.kr/tool/halla/images/cctv04.png',
  },
  {
    id: 'hallasan-1100',
    name: { ko: '1100도로', en: '1100 Road' },
    mountainId: 'hallasan',
    kind: 'access',
    region: { ko: '제주', en: 'Jeju' },
    provider: { ko: '제주특별자치도', en: 'Jeju Special Self-Governing Province' },
    officialLabel: { ko: '한라산 CCTV 원본', en: 'Hallasan official CCTV' },
    officialPage: 'https://www.jeju.go.kr/tool/halla/cctv_05.html',
    sourceUrl: 'https://hallacctv.kr/live/cctv05.stream_360p/playlist.m3u8',
    thumbnail: 'https://www.jeju.go.kr/tool/halla/images/cctv05.png',
  },
  {
    id: 'balwangsan-skywalk',
    name: { ko: '스카이워크', en: 'Skywalk' },
    mountainId: 'balwangsan',
    kind: 'summit',
    region: { ko: '강원', en: 'Gangwon' },
    provider: { ko: '강원지방기상청 · 모나용평', en: 'Gangwon Weather Office · Mona Yongpyong' },
    officialLabel: { ko: '강원 기상청 원본', en: 'Gangwon Weather Office source' },
    officialPage: 'https://www.weather.go.kr/gangwon/maple/cctv2.php',
    sourceUrl: 'https://live.yongpyong.co.kr/Ycam1/cam14.stream/playlist.m3u8',
  },
  {
    id: 'balwangsan-forest',
    name: { ko: '천년주목숲길', en: 'Thousand-Year Yew Forest Trail' },
    mountainId: 'balwangsan',
    kind: 'summit',
    region: { ko: '강원', en: 'Gangwon' },
    provider: { ko: '강원지방기상청 · 모나용평', en: 'Gangwon Weather Office · Mona Yongpyong' },
    officialLabel: { ko: '강원 기상청 원본', en: 'Gangwon Weather Office source' },
    officialPage: 'https://www.weather.go.kr/gangwon/maple/cctv2.php',
    sourceUrl: 'https://live.yongpyong.co.kr/Ycam1/cam15.stream/playlist.m3u8',
  },
  {
    id: 'balwangsan-rainbow',
    name: { ko: '레인보우 전경', en: 'Rainbow Panorama' },
    mountainId: 'balwangsan',
    kind: 'view',
    region: { ko: '강원', en: 'Gangwon' },
    provider: { ko: '강원지방기상청 · 모나용평', en: 'Gangwon Weather Office · Mona Yongpyong' },
    officialLabel: { ko: '강원 기상청 원본', en: 'Gangwon Weather Office source' },
    officialPage: 'https://www.weather.go.kr/gangwon/maple/cctv2.php',
    sourceUrl: 'https://live.yongpyong.co.kr/Ycam1/cam08.stream/playlist.m3u8',
  },
  {
    id: 'balwangsan-megagreen',
    name: { ko: '메가그린 슬로프', en: 'Mega Green Slope' },
    mountainId: 'balwangsan',
    kind: 'access',
    region: { ko: '강원', en: 'Gangwon' },
    provider: { ko: '강원지방기상청 · 모나용평', en: 'Gangwon Weather Office · Mona Yongpyong' },
    officialLabel: { ko: '강원 기상청 원본', en: 'Gangwon Weather Office source' },
    officialPage: 'https://www.weather.go.kr/gangwon/maple/cctv2.php',
    sourceUrl: 'https://live.yongpyong.co.kr/Ycam1/cam01.stream/playlist.m3u8',
  },
  {
    id: 'balwangsan-pink',
    name: { ko: '핑크 슬로프', en: 'Pink Slope' },
    mountainId: 'balwangsan',
    kind: 'view',
    region: { ko: '강원', en: 'Gangwon' },
    provider: { ko: '강원지방기상청 · 모나용평', en: 'Gangwon Weather Office · Mona Yongpyong' },
    officialLabel: { ko: '강원 기상청 원본', en: 'Gangwon Weather Office source' },
    officialPage: 'https://www.weather.go.kr/gangwon/maple/cctv2.php',
    sourceUrl: 'https://live.yongpyong.co.kr/Ycam1/cam07.stream/playlist.m3u8',
  },
  {
    id: 'seoraksan-ulsanbawi',
    name: { ko: '울산바위', en: 'Ulsanbawi' },
    mountainId: 'seoraksan',
    kind: 'summit',
    region: { ko: '강원', en: 'Gangwon' },
    provider: { ko: '국립공원공단', en: 'Korea National Park Service' },
    officialLabel: { ko: '강원 기상청 원본', en: 'Gangwon Weather Office source' },
    officialPage: 'https://www.weather.go.kr/gangwon/maple/cctv.php',
    sourceUrl: 'https://live.knps.or.kr/cctv/hls/solak.m3u8',
  },
  {
    id: 'odaesan-duro',
    name: { ko: '두로령', en: 'Duro Pass' },
    mountainId: 'odaesan',
    kind: 'summit',
    region: { ko: '강원', en: 'Gangwon' },
    provider: { ko: '국립공원공단', en: 'Korea National Park Service' },
    officialLabel: { ko: '강원 기상청 원본', en: 'Gangwon Weather Office source' },
    officialPage: 'https://www.weather.go.kr/gangwon/maple/cctv.php',
    sourceUrl: 'https://live.knps.or.kr/cctv/hls/zduro.m3u8',
  },
  {
    id: 'chiaksan-sangwonsa',
    name: { ko: '상원사', en: 'Sangwonsa' },
    mountainId: 'chiaksan',
    kind: 'summit',
    region: { ko: '강원', en: 'Gangwon' },
    provider: { ko: '국립공원공단', en: 'Korea National Park Service' },
    officialLabel: { ko: '강원 기상청 원본', en: 'Gangwon Weather Office source' },
    officialPage: 'https://www.weather.go.kr/gangwon/maple/cctv.php',
    sourceUrl: 'https://live.knps.or.kr/cctv/hls/sangwonsa.m3u8',
  },
  {
    id: 'taebaeksan-cheonjedan',
    name: { ko: '천제단', en: 'Cheonjedan' },
    mountainId: 'taebaeksan',
    kind: 'summit',
    region: { ko: '강원', en: 'Gangwon' },
    provider: { ko: '국립공원공단', en: 'Korea National Park Service' },
    officialLabel: { ko: '강원 기상청 원본', en: 'Gangwon Weather Office source' },
    officialPage: 'https://www.weather.go.kr/gangwon/maple/cctv.php',
    sourceUrl: 'https://live.knps.or.kr/cctv/hls/zchunje.m3u8',
  },
]

export const worldPicks: Feed[] = [
  {
    id: 'montblanc-argentiere',
    name: { ko: '몽블랑', en: 'Mont Blanc' },
    mountainId: 'montblanc',
    kind: 'view',
    region: { ko: '프랑스', en: 'France' },
    provider: { ko: 'Chamonix Mont-Blanc Tourisme', en: 'Chamonix Mont-Blanc Tourisme' },
    officialLabel: { ko: '몽블랑 최신 이미지 원본', en: 'Latest Mont Blanc image source' },
    officialPage: 'https://en.chamonix.com/argentiere-view-of-mont-blanc',
    sourceType: 'image',
    sourceUrl: 'https://docs.chamonix.com/webcam/webcam-ota-1.jpg',
  },
]
