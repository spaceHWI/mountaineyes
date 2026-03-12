export type MountainId =
  | 'hallasan'
  | 'balwangsan'
  | 'seoraksan'
  | 'odaesan'
  | 'chiaksan'
  | 'taebaeksan'
  | 'montblanc'
export type FeedKind = '정상' | '진입부' | '풍경'

export type Mountain = {
  description: string
  id: MountainId
  lat: number
  lng: number
  name: string
  officialPage: string
  region: string
}

export type Feed = {
  id: string
  kind: FeedKind
  mountainId: MountainId
  name: string
  officialLabel: string
  officialPage: string
  provider: string
  region: string
  sourceType?: 'hls' | 'image'
  sourceUrl: string
  thumbnail?: string
}

export const mountains: Mountain[] = [
  {
    id: 'hallasan',
    name: '한라산',
    region: '제주',
    lat: 33.3617,
    lng: 126.5292,
    officialPage: 'https://www.jeju.go.kr/tool/halla/cctv.html',
    description: '제주 대표 산. 정상과 진입부 CCTV가 고르게 있습니다.',
  },
  {
    id: 'balwangsan',
    name: '발왕산',
    region: '강원',
    lat: 37.6444,
    lng: 128.6806,
    officialPage: 'https://www.weather.go.kr/gangwon/maple/cctv2.php',
    description: '강원지방기상청 실시간영상 페이지를 통해 확인할 수 있는 대표 산입니다.',
  },
  {
    id: 'seoraksan',
    name: '설악산',
    region: '강원',
    lat: 38.1194,
    lng: 128.4656,
    officialPage: 'https://www.weather.go.kr/gangwon/maple/cctv.php',
    description: '국립공원공단 공식 실시간영상에서 울산바위 쪽 화면을 확인할 수 있습니다.',
  },
  {
    id: 'odaesan',
    name: '오대산',
    region: '강원',
    lat: 37.7866,
    lng: 128.5646,
    officialPage: 'https://www.weather.go.kr/gangwon/maple/cctv.php',
    description: '국립공원공단 공식 실시간영상에서 두로령 화면을 확인할 수 있습니다.',
  },
  {
    id: 'chiaksan',
    name: '치악산',
    region: '강원',
    lat: 37.3653,
    lng: 128.0504,
    officialPage: 'https://www.weather.go.kr/gangwon/maple/cctv.php',
    description: '국립공원공단 공식 실시간영상에서 상원사 화면을 확인할 수 있습니다.',
  },
  {
    id: 'taebaeksan',
    name: '태백산',
    region: '강원',
    lat: 37.0967,
    lng: 128.9166,
    officialPage: 'https://www.weather.go.kr/gangwon/maple/cctv.php',
    description: '국립공원공단 공식 실시간영상에서 천제단 화면을 확인할 수 있습니다.',
  },
]

export const feeds: Feed[] = [
  {
    id: 'hallasan-baengnokdam',
    name: '백록담',
    mountainId: 'hallasan',
    kind: '정상',
    region: '제주',
    provider: '제주특별자치도',
    officialLabel: '한라산 CCTV 원본',
    officialPage: 'https://www.jeju.go.kr/tool/halla/cctv_01.html',
    sourceUrl: 'https://hallacctv.kr/live/cctv01.stream_360p/playlist.m3u8',
    thumbnail: 'https://www.jeju.go.kr/tool/halla/images/cctv01.png',
  },
  {
    id: 'hallasan-wanggwanneung',
    name: '왕관릉',
    mountainId: 'hallasan',
    kind: '정상',
    region: '제주',
    provider: '제주특별자치도',
    officialLabel: '한라산 CCTV 원본',
    officialPage: 'https://www.jeju.go.kr/tool/halla/cctv_02.html',
    sourceUrl: 'https://hallacctv.kr/live/cctv02.stream_360p/playlist.m3u8',
    thumbnail: 'https://www.jeju.go.kr/tool/halla/images/cctv02.png',
  },
  {
    id: 'hallasan-witseoreum',
    name: '윗세오름',
    mountainId: 'hallasan',
    kind: '정상',
    region: '제주',
    provider: '제주특별자치도',
    officialLabel: '한라산 CCTV 원본',
    officialPage: 'https://www.jeju.go.kr/tool/halla/cctv_03.html',
    sourceUrl: 'https://hallacctv.kr/live/cctv03.stream_360p/playlist.m3u8',
    thumbnail: 'https://www.jeju.go.kr/tool/halla/images/cctv03.png',
  },
  {
    id: 'hallasan-eoseungsaengak',
    name: '어승생악',
    mountainId: 'hallasan',
    kind: '진입부',
    region: '제주',
    provider: '제주특별자치도',
    officialLabel: '한라산 CCTV 원본',
    officialPage: 'https://www.jeju.go.kr/tool/halla/cctv_04.html',
    sourceUrl: 'https://hallacctv.kr/live/cctv04.stream_360p/playlist.m3u8',
    thumbnail: 'https://www.jeju.go.kr/tool/halla/images/cctv04.png',
  },
  {
    id: 'hallasan-1100',
    name: '1100도로',
    mountainId: 'hallasan',
    kind: '진입부',
    region: '제주',
    provider: '제주특별자치도',
    officialLabel: '한라산 CCTV 원본',
    officialPage: 'https://www.jeju.go.kr/tool/halla/cctv_05.html',
    sourceUrl: 'https://hallacctv.kr/live/cctv05.stream_360p/playlist.m3u8',
    thumbnail: 'https://www.jeju.go.kr/tool/halla/images/cctv05.png',
  },
  {
    id: 'balwangsan-skywalk',
    name: '스카이워크',
    mountainId: 'balwangsan',
    kind: '정상',
    region: '강원',
    provider: '강원지방기상청 · 모나용평',
    officialLabel: '강원 기상청 원본',
    officialPage: 'https://www.weather.go.kr/gangwon/maple/cctv2.php',
    sourceUrl: 'https://live.yongpyong.co.kr/Ycam1/cam14.stream/playlist.m3u8',
  },
  {
    id: 'balwangsan-forest',
    name: '천년주목숲길',
    mountainId: 'balwangsan',
    kind: '정상',
    region: '강원',
    provider: '강원지방기상청 · 모나용평',
    officialLabel: '강원 기상청 원본',
    officialPage: 'https://www.weather.go.kr/gangwon/maple/cctv2.php',
    sourceUrl: 'https://live.yongpyong.co.kr/Ycam1/cam15.stream/playlist.m3u8',
  },
  {
    id: 'balwangsan-rainbow',
    name: '레인보우 전경',
    mountainId: 'balwangsan',
    kind: '풍경',
    region: '강원',
    provider: '강원지방기상청 · 모나용평',
    officialLabel: '강원 기상청 원본',
    officialPage: 'https://www.weather.go.kr/gangwon/maple/cctv2.php',
    sourceUrl: 'https://live.yongpyong.co.kr/Ycam1/cam08.stream/playlist.m3u8',
  },
  {
    id: 'balwangsan-megagreen',
    name: '메가그린 슬로프',
    mountainId: 'balwangsan',
    kind: '진입부',
    region: '강원',
    provider: '강원지방기상청 · 모나용평',
    officialLabel: '강원 기상청 원본',
    officialPage: 'https://www.weather.go.kr/gangwon/maple/cctv2.php',
    sourceUrl: 'https://live.yongpyong.co.kr/Ycam1/cam01.stream/playlist.m3u8',
  },
  {
    id: 'balwangsan-pink',
    name: '핑크 슬로프',
    mountainId: 'balwangsan',
    kind: '풍경',
    region: '강원',
    provider: '강원지방기상청 · 모나용평',
    officialLabel: '강원 기상청 원본',
    officialPage: 'https://www.weather.go.kr/gangwon/maple/cctv2.php',
    sourceUrl: 'https://live.yongpyong.co.kr/Ycam1/cam07.stream/playlist.m3u8',
  },
  {
    id: 'seoraksan-ulsanbawi',
    name: '울산바위',
    mountainId: 'seoraksan',
    kind: '정상',
    region: '강원',
    provider: '국립공원공단',
    officialLabel: '강원 기상청 원본',
    officialPage: 'https://www.weather.go.kr/gangwon/maple/cctv.php',
    sourceUrl: 'https://live.knps.or.kr/cctv/hls/solak.m3u8',
  },
  {
    id: 'odaesan-duro',
    name: '두로령',
    mountainId: 'odaesan',
    kind: '정상',
    region: '강원',
    provider: '국립공원공단',
    officialLabel: '강원 기상청 원본',
    officialPage: 'https://www.weather.go.kr/gangwon/maple/cctv.php',
    sourceUrl: 'https://live.knps.or.kr/cctv/hls/zduro.m3u8',
  },
  {
    id: 'chiaksan-sangwonsa',
    name: '상원사',
    mountainId: 'chiaksan',
    kind: '정상',
    region: '강원',
    provider: '국립공원공단',
    officialLabel: '강원 기상청 원본',
    officialPage: 'https://www.weather.go.kr/gangwon/maple/cctv.php',
    sourceUrl: 'https://live.knps.or.kr/cctv/hls/sangwonsa.m3u8',
  },
  {
    id: 'taebaeksan-cheonjedan',
    name: '천제단',
    mountainId: 'taebaeksan',
    kind: '정상',
    region: '강원',
    provider: '국립공원공단',
    officialLabel: '강원 기상청 원본',
    officialPage: 'https://www.weather.go.kr/gangwon/maple/cctv.php',
    sourceUrl: 'https://live.knps.or.kr/cctv/hls/zchunje.m3u8',
  },
]

export const worldPicks: Feed[] = [
  {
    id: 'montblanc-argentiere',
    name: '몽블랑',
    mountainId: 'montblanc',
    kind: '풍경',
    region: '프랑스',
    provider: 'Chamonix Mont-Blanc Tourisme',
    officialLabel: '몽블랑 최신 이미지 원본',
    officialPage: 'https://en.chamonix.com/argentiere-view-of-mont-blanc',
    sourceType: 'image',
    sourceUrl: 'https://docs.chamonix.com/webcam/webcam-ota-1.jpg',
  },
]
