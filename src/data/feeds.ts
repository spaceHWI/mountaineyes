import type { LocalizedText } from '../i18n'
import { withProxyBase } from '../utils/proxy'

export type MountainId =
  | 'hallasan'
  | 'balwangsan'
  | 'high1'
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
  officialPage: string
  provider: LocalizedText
  region: LocalizedText
  sourceType: 'hls' | 'image' | 'its'
  sourceUrl: string
  itsDeviceId?: string
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
    id: 'high1',
    name: { ko: '하이원', en: 'High1' },
    region: { ko: '강원', en: 'Gangwon' },
    lat: 37.2088,
    lng: 128.8333,
    officialPage: 'https://www.weather.go.kr/gangwon/maple/cctv3.php',
    description: {
      ko: '강원지방기상청이 연결한 하이원리조트 실시간 슬로프 영상입니다. 함백산권 설경 확인용으로 테스트 중입니다.',
      en: 'Official High1 Resort live slope feeds linked by the Gangwon Regional Meteorological Administration, useful for checking the Hambaeksan snow view.',
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
    officialPage: 'https://www.jeju.go.kr/tool/halla/cctv_01.html',
    sourceType: 'hls',
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
    officialPage: 'https://www.jeju.go.kr/tool/halla/cctv_02.html',
    sourceType: 'hls',
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
    officialPage: 'https://www.jeju.go.kr/tool/halla/cctv_03.html',
    sourceType: 'hls',
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
    officialPage: 'https://www.jeju.go.kr/tool/halla/cctv_04.html',
    sourceType: 'hls',
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
    officialPage: 'https://www.jeju.go.kr/tool/halla/cctv_05.html',
    sourceType: 'hls',
    sourceUrl: 'https://hallacctv.kr/live/cctv05.stream_360p/playlist.m3u8',
    thumbnail: 'https://www.jeju.go.kr/tool/halla/images/cctv05.png',
  },
  {
    id: 'hallasan-its-1100',
    name: { ko: '1100고지 도로', en: '1100 Highland Road' },
    mountainId: 'hallasan',
    kind: 'access',
    region: { ko: '제주', en: 'Jeju' },
    provider: { ko: '제주 교통정보센터', en: 'Jeju ITS' },
    officialPage: 'https://www.jejuits.go.kr/jido/mainView.do?DEVICE_KIND=CCTV',
    sourceType: 'its',
    sourceUrl: '',
    itsDeviceId: '0ce6ae92-c6d2-78ed-cf34-f0c6f119bdca',
  },
  {
    id: 'hallasan-its-seongpanak',
    name: { ko: '성판악 도로', en: 'Seongpanak Road' },
    mountainId: 'hallasan',
    kind: 'access',
    region: { ko: '제주', en: 'Jeju' },
    provider: { ko: '제주 교통정보센터', en: 'Jeju ITS' },
    officialPage: 'https://www.jejuits.go.kr/jido/mainView.do?DEVICE_KIND=CCTV',
    sourceType: 'its',
    sourceUrl: '',
    itsDeviceId: 'fc4a8973-eda7-7c81-bd51-851cf452ac86',
  },
  {
    id: 'hallasan-its-eorimok',
    name: { ko: '어리목 입구', en: 'Eorimok Entrance' },
    mountainId: 'hallasan',
    kind: 'access',
    region: { ko: '제주', en: 'Jeju' },
    provider: { ko: '제주 교통정보센터', en: 'Jeju ITS' },
    officialPage: 'https://www.jejuits.go.kr/jido/mainView.do?DEVICE_KIND=CCTV',
    sourceType: 'its',
    sourceUrl: '',
    itsDeviceId: '9261f807-613e-5feb-e772-4b36d255fe27',
  },
  {
    id: 'hallasan-its-donnaeko',
    name: { ko: '돈내코 입구', en: 'Donnaeko Entrance' },
    mountainId: 'hallasan',
    kind: 'access',
    region: { ko: '제주', en: 'Jeju' },
    provider: { ko: '제주 교통정보센터', en: 'Jeju ITS' },
    officialPage: 'https://www.jejuits.go.kr/jido/mainView.do?DEVICE_KIND=CCTV',
    sourceType: 'its',
    sourceUrl: '',
    itsDeviceId: '30326b0b-606b-f9ea-f1a0-c121a26eab96',
  },
  {
    id: 'hallasan-its-sallok',
    name: { ko: '산록남로', en: 'Sallok South Road' },
    mountainId: 'hallasan',
    kind: 'access',
    region: { ko: '제주', en: 'Jeju' },
    provider: { ko: '제주 교통정보센터', en: 'Jeju ITS' },
    officialPage: 'https://www.jejuits.go.kr/jido/mainView.do?DEVICE_KIND=CCTV',
    sourceType: 'its',
    sourceUrl: '',
    itsDeviceId: '549855ee-ee60-7c21-20ac-377385832c4f',
  },
  {
    id: 'balwangsan-skywalk',
    name: { ko: '스카이워크', en: 'Skywalk' },
    mountainId: 'balwangsan',
    kind: 'summit',
    region: { ko: '강원', en: 'Gangwon' },
    provider: { ko: '강원지방기상청 · 모나용평', en: 'Gangwon Weather Office · Mona Yongpyong' },
    officialPage: 'https://www.weather.go.kr/gangwon/maple/cctv2.php',
    sourceType: 'hls',
    sourceUrl: 'https://live.yongpyong.co.kr/Ycam1/cam14.stream/playlist.m3u8',
  },
  {
    id: 'balwangsan-forest',
    name: { ko: '천년주목숲길', en: 'Thousand-Year Yew Forest Trail' },
    mountainId: 'balwangsan',
    kind: 'summit',
    region: { ko: '강원', en: 'Gangwon' },
    provider: { ko: '강원지방기상청 · 모나용평', en: 'Gangwon Weather Office · Mona Yongpyong' },
    officialPage: 'https://www.weather.go.kr/gangwon/maple/cctv2.php',
    sourceType: 'hls',
    sourceUrl: 'https://live.yongpyong.co.kr/Ycam1/cam15.stream/playlist.m3u8',
  },
  {
    id: 'balwangsan-rainbow',
    name: { ko: '레인보우 전경', en: 'Rainbow Panorama' },
    mountainId: 'balwangsan',
    kind: 'view',
    region: { ko: '강원', en: 'Gangwon' },
    provider: { ko: '강원지방기상청 · 모나용평', en: 'Gangwon Weather Office · Mona Yongpyong' },
    officialPage: 'https://www.weather.go.kr/gangwon/maple/cctv2.php',
    sourceType: 'hls',
    sourceUrl: 'https://live.yongpyong.co.kr/Ycam1/cam08.stream/playlist.m3u8',
  },
  {
    id: 'balwangsan-megagreen',
    name: { ko: '메가그린 슬로프', en: 'Mega Green Slope' },
    mountainId: 'balwangsan',
    kind: 'access',
    region: { ko: '강원', en: 'Gangwon' },
    provider: { ko: '강원지방기상청 · 모나용평', en: 'Gangwon Weather Office · Mona Yongpyong' },
    officialPage: 'https://www.weather.go.kr/gangwon/maple/cctv2.php',
    sourceType: 'hls',
    sourceUrl: 'https://live.yongpyong.co.kr/Ycam1/cam01.stream/playlist.m3u8',
  },
  {
    id: 'balwangsan-pink',
    name: { ko: '핑크 슬로프', en: 'Pink Slope' },
    mountainId: 'balwangsan',
    kind: 'view',
    region: { ko: '강원', en: 'Gangwon' },
    provider: { ko: '강원지방기상청 · 모나용평', en: 'Gangwon Weather Office · Mona Yongpyong' },
    officialPage: 'https://www.weather.go.kr/gangwon/maple/cctv2.php',
    sourceType: 'hls',
    sourceUrl: 'https://live.yongpyong.co.kr/Ycam1/cam07.stream/playlist.m3u8',
  },
  {
    id: 'seoraksan-ulsanbawi',
    name: { ko: '울산바위', en: 'Ulsanbawi' },
    mountainId: 'seoraksan',
    kind: 'summit',
    region: { ko: '강원', en: 'Gangwon' },
    provider: { ko: '국립공원공단', en: 'Korea National Park Service' },
    officialPage: 'https://www.weather.go.kr/gangwon/maple/cctv.php',
    sourceType: 'hls',
    sourceUrl: 'https://live.knps.or.kr/cctv/hls/solak.m3u8',
  },
  {
    id: 'high1-athena',
    name: { ko: '아테나 1번 슬로프', en: 'Athena Slope 1' },
    mountainId: 'high1',
    kind: 'access',
    region: { ko: '강원', en: 'Gangwon' },
    provider: { ko: '강원지방기상청 · 하이원리조트', en: 'Gangwon Weather Office · High1 Resort' },
    officialPage: 'https://www.weather.go.kr/gangwon/maple/cctv3.php',
    sourceType: 'hls',
    sourceUrl: withProxyBase('/api/proxy?target=http%3A%2F%2F59.30.12.195%3A1935%2Flive%2F_definst_%2Fch4.stream%2Fplaylist.m3u8'),
  },
  {
    id: 'high1-victoria-lower',
    name: { ko: '빅토리아 1번 슬로프', en: 'Victoria Slope 1' },
    mountainId: 'high1',
    kind: 'access',
    region: { ko: '강원', en: 'Gangwon' },
    provider: { ko: '강원지방기상청 · 하이원리조트', en: 'Gangwon Weather Office · High1 Resort' },
    officialPage: 'https://www.weather.go.kr/gangwon/maple/cctv3.php',
    sourceType: 'hls',
    sourceUrl: withProxyBase('/api/proxy?target=http%3A%2F%2F59.30.12.195%3A1935%2Flive%2Fch12.stream%2Fplaylist.m3u8'),
  },
  {
    id: 'high1-zeus',
    name: { ko: '제우스 2번 슬로프', en: 'Zeus Slope 2' },
    mountainId: 'high1',
    kind: 'view',
    region: { ko: '강원', en: 'Gangwon' },
    provider: { ko: '강원지방기상청 · 하이원리조트', en: 'Gangwon Weather Office · High1 Resort' },
    officialPage: 'https://www.weather.go.kr/gangwon/maple/cctv3.php',
    sourceType: 'hls',
    sourceUrl: withProxyBase('/api/proxy?target=http%3A%2F%2F59.30.12.195%3A1935%2Flive%2Fch10.stream%2Fplaylist.m3u8'),
  },
  {
    id: 'high1-victoria-upper',
    name: { ko: '빅토리아 상단', en: 'Victoria Upper' },
    mountainId: 'high1',
    kind: 'summit',
    region: { ko: '강원', en: 'Gangwon' },
    provider: { ko: '강원지방기상청 · 하이원리조트', en: 'Gangwon Weather Office · High1 Resort' },
    officialPage: 'https://www.weather.go.kr/gangwon/maple/cctv3.php',
    sourceType: 'hls',
    sourceUrl: withProxyBase('/api/proxy?target=http%3A%2F%2F59.30.12.195%3A1935%2Flive%2Fch9.stream%2Fplaylist.m3u8'),
  },
  {
    id: 'high1-hera',
    name: { ko: '헤라 2번 슬로프 입구', en: 'Hera Slope 2 Entrance' },
    mountainId: 'high1',
    kind: 'access',
    region: { ko: '강원', en: 'Gangwon' },
    provider: { ko: '강원지방기상청 · 하이원리조트', en: 'Gangwon Weather Office · High1 Resort' },
    officialPage: 'https://www.weather.go.kr/gangwon/maple/cctv3.php',
    sourceType: 'hls',
    sourceUrl: withProxyBase('/api/proxy?target=http%3A%2F%2F59.30.12.195%3A1935%2Flive%2Fch2.stream%2Fplaylist.m3u8'),
  },
  {
    id: 'odaesan-duro',
    name: { ko: '두로령', en: 'Duro Pass' },
    mountainId: 'odaesan',
    kind: 'summit',
    region: { ko: '강원', en: 'Gangwon' },
    provider: { ko: '국립공원공단', en: 'Korea National Park Service' },
    officialPage: 'https://www.weather.go.kr/gangwon/maple/cctv.php',
    sourceType: 'hls',
    sourceUrl: 'https://live.knps.or.kr/cctv/hls/zduro.m3u8',
  },
  {
    id: 'chiaksan-sangwonsa',
    name: { ko: '상원사', en: 'Sangwonsa' },
    mountainId: 'chiaksan',
    kind: 'summit',
    region: { ko: '강원', en: 'Gangwon' },
    provider: { ko: '국립공원공단', en: 'Korea National Park Service' },
    officialPage: 'https://www.weather.go.kr/gangwon/maple/cctv.php',
    sourceType: 'hls',
    sourceUrl: 'https://live.knps.or.kr/cctv/hls/sangwonsa.m3u8',
  },
  {
    id: 'taebaeksan-cheonjedan',
    name: { ko: '천제단', en: 'Cheonjedan' },
    mountainId: 'taebaeksan',
    kind: 'summit',
    region: { ko: '강원', en: 'Gangwon' },
    provider: { ko: '국립공원공단', en: 'Korea National Park Service' },
    officialPage: 'https://www.weather.go.kr/gangwon/maple/cctv.php',
    sourceType: 'hls',
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
    officialPage: 'https://en.chamonix.com/argentiere-view-of-mont-blanc',
    sourceType: 'image',
    sourceUrl: 'https://docs.chamonix.com/webcam/webcam-ota-1.jpg',
  },
]
