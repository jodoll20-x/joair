export interface RouteSEO {
  path: '/' | '/services/' | '/contact/' | '/location/';
  title: string;
  description: string;
  canonical: string;
}

export const SITE_URL = 'https://jodoll.netlify.app';

export const ROUTES_SEO: Record<string, RouteSEO> = {
  '/': {
    path: '/',
    title: '조군에어컨 | 시스템에어컨·냉난방기 설치 및 이전설치 전문',
    description:
      '19년 노하우 조군에어컨은 LG·삼성·캐리어 시스템에어컨과 냉난방기 판매·신규 및 이전설치, 분해세척 전문 업체입니다. 서울·화성·수원·용인 등 경기 전 지역 출장 및 A/S 1년 보장, 빠른 전화 상담을 받아보세요.',
    canonical: `${SITE_URL}/`,
  },
  '/services/': {
    path: '/services/',
    title: '서비스 안내 | 시스템에어컨·분해세척·에어컨 설치 - 조군에어컨',
    description:
      '조군에어컨의 전문 서비스를 소개합니다. 아파트·상가·사무실·공장 시스템에어컨 천장형·멀티 V 시공부터 고압 스팀 완전 분해세척, 벽걸이·스탠드·2in1 신규 및 이전설치·가스 보충까지 19년 노하우로 완벽하게 시공합니다.',
    canonical: `${SITE_URL}/services/`,
  },
  '/contact/': {
    path: '/contact/',
    title: '견적문의 및 전화 상담 | 010-7120-2305 - 조군에어컨',
    description:
      '에어컨·냉난방기 설치 및 세척 견적이 필요하시다면 지금 바로 전화 상담(010-7120-2305)을 받아보세요. 19년 경력 담당 전문가가 신속하고 친절하게 상담해 드립니다.',
    canonical: `${SITE_URL}/contact/`,
  },
  '/location/': {
    path: '/location/',
    title: '사무실 위치 및 서비스 가능 지역 | 화성 향남 - 조군에어컨',
    description:
      '조군에어컨 본사 위치(경기도 화성시 향남읍 서봉로 372)와 영업시간(연중무휴 09:00 - 20:00), 서울 전 지역 및 화성·오산·평택·수원·용인 등 경기 주요 출장 가능 지역을 안내합니다.',
    canonical: `${SITE_URL}/location/`,
  },
};

export function normalizePath(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  const cleaned = pathname.replace(/\/+$/, '');
  return cleaned ? `${cleaned}/` : '/';
}

export function getRouteSEO(pathname: string): RouteSEO {
  const normalized = normalizePath(pathname);
  return ROUTES_SEO[normalized] ?? ROUTES_SEO['/'];
}
