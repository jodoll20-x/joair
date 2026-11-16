/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getRouteSEO, normalizePath } from './seo';

declare global {
  interface Window {
    karrotPixel?: {
      track: (eventName: string, params?: Record<string, any>) => void;
      init: (id: string) => void;
    };
  }
}

const handleTrackLead = () => {
  if (typeof window !== 'undefined' && window.karrotPixel) {
    window.karrotPixel.track('Lead');
  }
};
import { 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Wind, 
  Wrench, 
  Droplets, 
  Menu, 
  X, 
  ChevronRight,
  Star,
  ArrowRight,
  Instagram,
  Facebook,
  MessageCircle
} from 'lucide-react';

// --- Components ---

const NAV_ITEMS = [
  { label: '서비스', path: '/services/', sectionId: '서비스' },
  { label: '견적문의', path: '/contact/', sectionId: '견적문의' },
  { label: '사무실 위치', path: '/location/', sectionId: '사무실위치' },
] as const;

type NavigateHandler = (
  e: React.MouseEvent<HTMLAnchorElement>,
  path: string,
  sectionId?: string,
) => void;

const Header = ({
  currentPath,
  onNavigate,
}: {
  currentPath: string;
  onNavigate: NavigateHandler;
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isSolid = isScrolled || currentPath !== '/';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isSolid ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-4 md:py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <a
          href="/"
          onClick={(e) => {
            setIsMobileMenuOpen(false);
            onNavigate(e, '/');
          }}
          className="flex items-center gap-2"
        >
          <div className="bg-blue-600 p-1.5 md:p-2 rounded-lg">
            <Wind className="text-white w-5 h-5 md:w-6 md:h-6" />
          </div>
          <span className={`text-lg md:text-xl font-bold tracking-tight ${isSolid ? 'text-gray-900' : 'text-white'}`}>
            조군 <span className="text-blue-500">에어컨</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => onNavigate(e, item.path, item.sectionId)}
                aria-current={isActive ? 'page' : undefined}
                className={`text-sm font-medium hover:text-blue-500 transition-colors ${
                  isActive
                    ? isSolid
                      ? 'text-blue-600 font-semibold'
                      : 'text-blue-400 font-semibold'
                    : isSolid
                      ? 'text-gray-600'
                      : 'text-white/90'
                }`}
              >
                {item.label}
              </a>
            );
          })}
          <a 
            href="tel:01071202305" 
            onClick={handleTrackLead}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg shadow-blue-600/20"
          >
            <Phone size={16} />
            010-7120-2305
          </a>
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2"
          aria-label="메뉴 열기"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className={isSolid ? 'text-gray-900' : 'text-white'} />
          ) : (
            <Menu className={isSolid ? 'text-gray-900' : 'text-white'} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white shadow-xl border-t border-gray-100 md:hidden"
          >
            <div className="px-5 py-5 space-y-3">
              {NAV_ITEMS.map((item) => {
                const isActive = currentPath === item.path;
                return (
                  <a
                    key={item.path}
                    href={item.path}
                    aria-current={isActive ? 'page' : undefined}
                    className={`block py-1 text-base font-medium hover:text-blue-600 ${
                      isActive ? 'text-blue-600 font-bold' : 'text-gray-900'
                    }`}
                    onClick={(e) => {
                      setIsMobileMenuOpen(false);
                      onNavigate(e, item.path, item.sectionId);
                    }}
                  >
                    {item.label}
                  </a>
                );
              })}
              <a 
                href="tel:01071202305" 
                onClick={handleTrackLead}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3.5 rounded-xl text-[15px] font-bold"
              >
                <Phone size={18} />
                전화 상담 연결
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const Hero = () => (
  <section className="relative min-h-[88vh] md:min-h-[90vh] md:h-screen flex items-center pt-24 pb-14 md:py-20 overflow-hidden">
    {/* Background Image with Overlay */}
    <div className="absolute inset-0 z-0">
      <img 
        src="https://live.lge.co.kr/wp-content/uploads/2022/05/3.lg_-16.jpg" 
        alt="Air Conditioning Service" 
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/80 to-transparent" />
    </div>

    <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 w-full">
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl"
      >
        <div className="inline-flex items-center gap-2 bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 px-3.5 py-1.5 md:px-4 rounded-full text-blue-400 text-xs sm:text-sm font-semibold mb-4 md:mb-6">
          <MapPin size={14} />
          서울/경기 전 지역 출장 서비스
        </div>
        <h1 className="text-[28px] sm:text-[32px] md:text-6xl lg:text-7xl font-bold text-white leading-[1.25] md:leading-[1.1] tracking-tight md:tracking-normal break-keep mb-4 md:mb-6">
          에어컨의 모든 것,<br />
          <span className="text-blue-500">19년의 노하우로</span><br />
          케어합니다.
        </h1>
        <p className="text-[15px] sm:text-base md:text-xl text-gray-300 mb-5 md:mb-6 leading-relaxed break-keep">
          LG, 삼성, 캐리어 판매 및 설치 전문<br />
          시스템, 중대형, 업소용 에어컨, 냉난방기 전문 업체입니다.
        </p>
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 md:p-5 rounded-2xl md:rounded-3xl mb-6 md:mb-8 max-w-xl">
          <p className="text-xs sm:text-sm text-blue-300 font-bold mb-2 flex items-center gap-2">
            <CheckCircle2 size={16} /> 주요 이력
          </p>
          <ul className="text-gray-300 text-[13px] md:text-sm space-y-1.5 leading-relaxed break-keep">
            <li className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>지하철 승강장 천장형 멀티(서현역) 최초 시공</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>주거형 오피스텔 천장형(구로) 최초 시공</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>강남구 스트레스 프리존 최초 시공</span>
            </li>
          </ul>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <a 
            href="tel:01071202305" 
            onClick={handleTrackLead}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 md:px-8 md:py-4 rounded-2xl font-bold text-[15px] sm:text-base md:text-lg flex items-center justify-center gap-2.5 md:gap-3 transition-all transform hover:scale-105 shadow-2xl shadow-blue-600/40"
          >
            <Phone size={20} className="md:w-[22px] md:h-[22px]" />
            빠른 전화 상담하기
          </a>
        </div>
      </motion.div>
    </div>

    {/* Floating Stats Card */}
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className="absolute bottom-8 right-4 sm:right-10 hidden lg:block"
    >
      <div className="bg-white p-6 rounded-2xl shadow-2xl border border-gray-100">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-green-100 p-3 rounded-xl">
            <Clock className="text-green-600" />
          </div>
          <div>
            <p className="text-gray-900 font-bold text-xl">당일 방문 가능</p>
            <p className="text-gray-600 text-sm">오전 접수 시 당일 처리</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-xl">
            <CheckCircle2 className="text-blue-600" />
          </div>
          <div>
            <p className="text-gray-900 font-bold text-xl">A/S 1년 보장</p>
            <p className="text-gray-600 text-sm">설치 결함 시 무상 수리</p>
          </div>
        </div>
      </div>
    </motion.div>
  </section>
);

const Services = ({
  isStandalone = false,
  onNavigate,
}: {
  isStandalone?: boolean;
  onNavigate?: NavigateHandler;
}) => {
  const Heading = isStandalone ? 'h1' : 'h2';
  const services = [
    {
      title: "시스템 에어컨",
      desc: "아파트, 상가, 사무실 대형 시스템 에어컨 전문 설계 및 시공",
      icon: <Wind className="w-8 h-8" />,
      color: "bg-indigo-500",
      items: ["천장형 설치", "멀티 V 시공", "공장 대형 설치", "원룸 및 상가 설치"]
    },
    {
      title: "분해 세척",
      desc: "곰팡이와 세균을 99.9% 제거하는 고압 스팀 완전 분해 세척",
      icon: <Droplets className="w-8 h-8" />,
      color: "bg-cyan-500",
      items: ["고압 세척", "스팀 살균", "필터 청소"]
    },
    {
      title: "에어컨 설치",
      desc: "벽걸이, 스탠드, 2in1 등 모든 기종의 완벽한 설치 및 가스 충전",
      icon: <Wrench className="w-8 h-8" />,
      color: "bg-blue-500",
      items: ["신규 설치", "이전 설치", "가스 보충", "배관 연장"]
    }
  ];

  return (
    <section id="서비스" className="py-14 md:py-24 bg-gray-50 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-16">
          <p className="text-blue-600 font-bold tracking-wider uppercase text-xs md:text-sm mb-2 md:mb-3">Professional Services</p>
          <Heading className="text-2xl sm:text-[26px] md:text-4xl font-bold text-gray-900 leading-snug tracking-tight md:tracking-normal break-keep mb-3 md:mb-4">제공하는 전문 서비스</Heading>
          <div className="w-16 md:w-20 h-1 md:h-1.5 bg-blue-600 mx-auto rounded-full" />
          {isStandalone && (
            <p className="max-w-2xl mx-auto mt-5 text-[14px] sm:text-[15px] md:text-base text-gray-600 leading-relaxed break-keep">
              조군에어컨은 19년 현장 시공 경력을 바탕으로 LG·삼성·캐리어 시스템에어컨 설계 및 시공, 고압 스팀 완전 분해세척, 가정용·업소용 에어컨 신규 및 이전설치를 직접 책임 시공합니다. 설치 후 A/S 1년 보장 및 오전 접수 시 당일 방문 상담이 가능합니다.
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-5 md:gap-8">
          {services.map((s, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -10 }}
              className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100"
            >
              <div className={`${s.color} w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center text-white mb-5 md:mb-8 shadow-lg`}>
                {s.icon}
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2.5 md:mb-4 leading-snug break-keep">{s.title}</h3>
              <p className="text-[14px] sm:text-[15px] md:text-base text-gray-600 mb-5 md:mb-8 leading-relaxed break-keep">{s.desc}</p>
              <ul className="space-y-2.5 md:space-y-3">
                {s.items.map(item => (
                  <li key={item} className="flex items-center gap-2.5 md:gap-3 text-sm md:text-base text-gray-700 font-medium">
                    <CheckCircle2 size={18} className="text-blue-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {isStandalone && onNavigate && (
          <div className="mt-10 md:mt-14 flex flex-wrap items-center justify-center gap-3">
            <a
              href="/#서비스"
              onClick={(e) => onNavigate(e, '/', '서비스')}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-colors shadow-sm"
            >
              메인 페이지 서비스 영역으로 이동
              <ArrowRight size={16} />
            </a>
            <a
              href="/"
              onClick={(e) => onNavigate(e, '/')}
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors"
            >
              홈으로 돌아가기
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

const ContactSection = ({
  isStandalone = false,
  onNavigate,
}: {
  isStandalone?: boolean;
  onNavigate?: NavigateHandler;
}) => {
  const Heading = isStandalone ? 'h1' : 'h2';
  return (
    <section id="견적문의" className="py-14 md:py-24 bg-blue-600 relative overflow-hidden scroll-mt-16">
      {/* Decorative Circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full -mr-48 -mt-48 blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-700 rounded-full -ml-48 -mb-48 blur-3xl opacity-50" />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center text-white max-w-3xl mx-auto">
          <Heading className="text-2xl sm:text-[26px] md:text-5xl font-bold mb-5 md:mb-8 leading-[1.3] md:leading-tight tracking-tight md:tracking-normal break-keep">
            지금 바로<br />
            <span className="text-blue-200">전화 상담</span>을 받아보세요
          </Heading>
          <p className="text-[15px] sm:text-base md:text-xl text-blue-100 mb-8 md:mb-12 leading-relaxed break-keep">
            담당 전문가가 친절히 상담해 드립니다.<br />
            아래 번호로 전화주시면 신속하게 도와드리겠습니다.
          </p>
          {isStandalone && (
            <p className="max-w-2xl mx-auto -mt-3 mb-8 text-sm md:text-base text-blue-100 leading-relaxed break-keep">
              설치 공간(가정·원룸·상가·사무실·공장), 희망 기종(시스템에어컨·냉난방기·벽걸이·스탠드), 시공 지역을 알려주시면 19년 경력 전문가가 예상 견적과 당일 방문 가능 일정을 안내해 드립니다.
            </p>
          )}
          
          <div className="inline-flex flex-col items-center gap-4 md:gap-6 bg-white/10 backdrop-blur-md px-5 py-5 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-white/20 shadow-2xl max-w-full">
            <div className="flex items-center gap-3.5 md:gap-4">
              <div className="bg-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow-lg shrink-0">
                <Phone className="text-blue-600 w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div className="text-left">
                <p className="text-blue-200 text-xs md:text-sm font-bold">빠른 전화 상담</p>
                <a href="tel:01071202305" onClick={handleTrackLead} className="text-[22px] sm:text-2xl md:text-4xl font-extrabold hover:text-blue-200 transition-colors tracking-tight whitespace-nowrap">010-7120-2305</a>
              </div>
            </div>
          </div>

          {isStandalone && onNavigate && (
            <div className="mt-10 md:mt-12 flex flex-wrap items-center justify-center gap-3">
              <a
                href="/#견적문의"
                onClick={(e) => onNavigate(e, '/', '견적문의')}
                className="inline-flex items-center gap-2 bg-white hover:bg-blue-50 text-blue-600 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors shadow-sm"
              >
                메인 페이지 견적문의 영역으로 이동
                <ArrowRight size={16} />
              </a>
              <a
                href="/"
                onClick={(e) => onNavigate(e, '/')}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors"
              >
                홈으로 돌아가기
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const MapSection = ({
  isStandalone = false,
  onNavigate,
}: {
  isStandalone?: boolean;
  onNavigate?: NavigateHandler;
}) => {
  const Heading = isStandalone ? 'h1' : 'h2';
  return (
  <section id="사무실위치" className="py-14 md:py-24 bg-gray-50 scroll-mt-16">
    <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-blue-600 font-bold tracking-wider uppercase text-xs md:text-sm mb-2 md:mb-3">Location</p>
        <Heading className="text-2xl sm:text-[26px] md:text-4xl font-bold text-gray-900 mb-8 md:mb-12 leading-snug tracking-tight md:tracking-normal break-keep">사무실 위치</Heading>
        {isStandalone && (
          <p className="max-w-2xl mx-auto -mt-4 mb-8 md:mb-10 text-[14px] sm:text-[15px] md:text-base text-gray-600 leading-relaxed break-keep">
            조군에어컨 본사(경기도 화성시 향남읍 서봉로 372)를 중심으로 화성·오산·평택·수원·용인 등 경기 남부권과 서울 전 지역 출장 설치·세척 서비스를 운영하고 있습니다.
          </p>
        )}
        
        <div className="grid md:grid-cols-2 gap-5 md:gap-8 text-left">
          <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100">
            <div className="flex gap-3.5 md:gap-4 mb-5 md:mb-6">
              <div className="bg-blue-50 p-2.5 md:p-3 rounded-xl h-fit shrink-0">
                <MapPin className="text-blue-600 w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <h3 className="text-[15px] md:text-base font-bold text-gray-900 mb-1">본사 주소</h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed break-keep">경기도 화성시 향남읍 서봉로 372</p>
              </div>
            </div>
            <div className="flex gap-3.5 md:gap-4">
              <div className="bg-blue-50 p-2.5 md:p-3 rounded-xl h-fit shrink-0">
                <Clock className="text-blue-600 w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <h3 className="text-[15px] md:text-base font-bold text-gray-900 mb-1">영업 시간</h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">연중무휴 09:00 - 20:00</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-600 p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-xl text-white">
            <h3 className="font-bold text-lg md:text-xl mb-3 md:mb-4">서비스 가능 지역</h3>
            <p className="text-sm md:text-base text-blue-100 leading-relaxed break-keep">
              서울 전 지역 및 경기 주요 도시<br />
              (화성, 오산, 평택, 수원, 용인, 성남, 하남, 김포, 안양, 과천, 의왕, 군포, 시흥, 안산 등)
            </p>
            <div className="mt-5 md:mt-6 pt-5 md:pt-6 border-t border-blue-500/30">
              <p className="text-xs md:text-sm text-blue-200">※ 그 외 지역은 전화 문의 부탁드립니다.</p>
            </div>
          </div>
        </div>

        {isStandalone && onNavigate && (
          <div className="mt-10 md:mt-12 flex flex-wrap items-center justify-center gap-3">
            <a
              href="/#사무실위치"
              onClick={(e) => onNavigate(e, '/', '사무실위치')}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-colors shadow-sm"
            >
              메인 페이지 위치 안내로 이동
              <ArrowRight size={16} />
            </a>
            <a
              href="/"
              onClick={(e) => onNavigate(e, '/')}
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors"
            >
              홈으로 돌아가기
            </a>
          </div>
        )}
      </div>
    </div>
  </section>
  );
};

const Footer = ({ onNavigate }: { onNavigate: NavigateHandler }) => (
  <footer className="bg-gray-900 text-gray-400 py-12 md:py-16">
    <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-8 md:mb-12">
        <div className="col-span-1 md:col-span-2">
          <a href="/" onClick={(e) => onNavigate(e, '/')} className="flex items-center gap-2 mb-5 md:mb-6 w-fit">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Wind className="text-white w-5 h-5" />
            </div>
            <span className="text-lg md:text-xl font-bold text-white tracking-tight">
              조군 <span className="text-blue-500">에어컨</span>
            </span>
          </a>
          <p className="max-w-sm mb-5 md:mb-6 text-sm md:text-base leading-relaxed break-keep">
            조군에어컨은 <span className="text-white font-bold underline decoration-blue-500 underline-offset-4">19년 경력</span>의 전문가가 직접 시공하는 에어컨 전문 브랜드입니다. 
            LG, 삼성, 캐리어 판매 및 설치와 업소, 공장, 오피스텔, 빌라 공사 등 화성에서 10년 가까이 믿음으로 유지해온 신뢰의 업체입니다.
          </p>
          <div className="bg-gray-800/50 p-4 rounded-xl mb-6 md:mb-8 border border-gray-800">
            <p className="text-blue-400 font-bold text-xs md:text-sm mb-2">주요 이력</p>
            <p className="text-xs leading-relaxed text-gray-400 break-keep">
              지하철 승강장 천장형 멀티(서현역), 주거형 오피스텔 천장형(구로), 스트레스 프리존(강남구) 등 최초 시공자
            </p>
          </div>
          <div className="mb-4 text-[13px] md:text-sm space-y-1.5 leading-relaxed break-keep">
            <p>대표: 조인형 | 사업자번호: 102-04-02694</p>
            <p>주소: 경기도 화성시 향남읍 서봉로 372</p>
            <p>전화: 010-7120-2305</p>
          </div>
          <div className="flex gap-4">
            <a href="https://blog.naver.com/jodoll0203" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-full hover:bg-blue-600 hover:text-white transition-all">
              <MessageCircle size={18} />
              <span className="text-sm font-bold">Naver Blog</span>
            </a>
          </div>
        </div>
        <div>
          <h3 className="text-white text-base font-bold mb-4 md:mb-6">Contact Info</h3>
          <ul className="space-y-3 md:space-y-4 text-sm md:text-base">
            <li className="flex items-center gap-3">
              <Phone size={16} className="text-blue-500 shrink-0" />
              <a href="tel:01071202305" onClick={handleTrackLead} className="hover:text-white transition-colors">010-7120-2305</a>
            </li>
            <li className="flex items-center gap-3">
              <MapPin size={16} className="text-blue-500 shrink-0" />
              <span>경기도 화성시 향남읍 서봉로 372</span>
            </li>
            <li className="flex items-center gap-3">
              <Clock size={16} className="text-blue-500 shrink-0" />
              <span>연중무휴 09:00 - 20:00</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="pt-6 md:pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 text-xs md:text-sm">
        <p>© 2026 조군에어컨. All rights reserved.</p>
        <div className="flex gap-6 md:gap-8">
          <a href="#" className="hover:text-white">이용약관</a>
          <a href="#" className="hover:text-white font-bold text-blue-400">개인정보처리방침</a>
        </div>
      </div>
    </div>
  </footer>
);

function updateHeadMeta(pathname: string) {
  const seo = getRouteSEO(pathname);
  document.title = seo.title;

  const setMeta = (selector: string, content: string) => {
    const el = document.querySelector<HTMLMetaElement>(selector);
    if (el) el.setAttribute('content', content);
  };

  setMeta('meta[name="description"]', seo.description);
  setMeta('meta[property="og:title"]', seo.title);
  setMeta('meta[property="og:description"]', seo.description);
  setMeta('meta[property="og:url"]', seo.canonical);
  setMeta('meta[name="twitter:title"]', seo.title);
  setMeta('meta[name="twitter:description"]', seo.description);

  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (canonical) canonical.setAttribute('href', seo.canonical);
}

export default function App({ initialPath }: { initialPath?: string }) {
  const [currentPath, setCurrentPath] = useState<string>(() =>
    normalizePath(
      initialPath ?? (typeof window !== 'undefined' ? window.location.pathname : '/'),
    ),
  );

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(normalizePath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    updateHeadMeta(currentPath);
  }, [currentPath]);

  const scrollToSection = (sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    if (currentPath === '/' && typeof window !== 'undefined' && window.location.hash) {
      const sectionId = decodeURIComponent(window.location.hash.slice(1));
      if (sectionId) {
        requestAnimationFrame(() => scrollToSection(sectionId));
      }
    }
  }, [currentPath]);

  useEffect(() => {
    const handleGlobalTelClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a[href^="tel:"]');
      if (target) {
        handleTrackLead();
      }
    };
    document.addEventListener('click', handleGlobalTelClick);
    return () => document.removeEventListener('click', handleGlobalTelClick);
  }, []);

  const handleNavigate: NavigateHandler = (e, targetPath, sectionId) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    e.preventDefault();

    // When a sectionId is provided (top menu or back-to-section link),
    // smoothly scroll within the main one-page layout.
    if (sectionId) {
      if (currentPath !== '/') {
        window.history.pushState({}, '', `/#${sectionId}`);
        setCurrentPath('/');
        setTimeout(() => scrollToSection(sectionId), 50);
      } else {
        if (window.location.hash !== `#${sectionId}`) {
          window.history.replaceState({}, '', `/#${sectionId}`);
        }
        scrollToSection(sectionId);
      }
      return;
    }

    const nextPath = normalizePath(targetPath);
    if (nextPath !== currentPath || window.location.hash) {
      window.history.pushState({}, '', nextPath);
      setCurrentPath(nextPath);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderMainContent = () => {
    switch (currentPath) {
      case '/services/':
        return (
          <main className="pt-16">
            <Services isStandalone onNavigate={handleNavigate} />
          </main>
        );
      case '/contact/':
        return (
          <main className="pt-16">
            <ContactSection isStandalone onNavigate={handleNavigate} />
          </main>
        );
      case '/location/':
        return (
          <main className="pt-16">
            <MapSection isStandalone onNavigate={handleNavigate} />
          </main>
        );
      default:
        return (
          <main>
            <Hero />
            <Services />
            <ContactSection />
            <MapSection />
          </main>
        );
    }
  };

  return (
    <div className="font-sans text-gray-900 bg-white selection:bg-blue-100 selection:text-blue-600 overflow-x-hidden">
      <Header currentPath={currentPath} onNavigate={handleNavigate} />
      {renderMainContent()}
      <Footer onNavigate={handleNavigate} />
      
      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 z-40 md:hidden">
        <a 
          href="tel:01071202305"
          onClick={handleTrackLead}
          className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl animate-bounce"
        >
          <Phone size={28} />
        </a>
      </div>
    </div>
  );
}
