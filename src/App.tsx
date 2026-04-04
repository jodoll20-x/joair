/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Wind className="text-white w-6 h-6" />
          </div>
          <span className={`text-xl font-bold tracking-tight ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
            조군 <span className="text-blue-500">에어컨</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {['서비스', '포트폴리오', '견적문의', '사무실위치'].map((item) => (
            <a 
              key={item} 
              href={`#${item}`} 
              className={`text-sm font-medium hover:text-blue-500 transition-colors ${
                isScrolled ? 'text-gray-600' : 'text-white/90'
              }`}
            >
              {item === '사무실위치' ? '사무실 위치' : item}
            </a>
          ))}
          <a 
            href="tel:01071202305" 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg shadow-blue-600/20"
          >
            <Phone size={16} />
            010-7120-2305
          </a>
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className={isScrolled ? 'text-gray-900' : 'text-white'} />
          ) : (
            <Menu className={isScrolled ? 'text-gray-900' : 'text-white'} />
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
            <div className="px-4 py-6 space-y-4">
              {['서비스', '포트폴리오', '견적문의', '사무실위치'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item}`} 
                  className="block text-lg font-medium text-gray-900 hover:text-blue-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item === '사무실위치' ? '사무실 위치' : item}
                </a>
              ))}
              <a 
                href="tel:01071202305" 
                className="flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-xl font-bold"
              >
                <Phone size={20} />
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
  <section className="relative min-h-[90vh] md:h-screen flex items-center py-16 md:py-20 overflow-hidden">
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

    <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl"
      >
        <div className="inline-flex items-center gap-2 bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 px-4 py-1.5 rounded-full text-blue-400 text-sm font-semibold mb-6">
          <MapPin size={14} />
          서울/경기 전 지역 출장 서비스
        </div>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6">
          에어컨의 모든 것,<br />
          <span className="text-blue-500">19년의 노하우</span>로 케어합니다.
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-6 leading-relaxed">
          LG, 삼성, 캐리어 판매 및 설치 전문<br />
          화성에서 10년 가까이 신뢰를 쌓아온 에어컨 전문가입니다.
        </p>
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-3xl mb-8 max-w-xl">
          <p className="text-sm text-blue-300 font-bold mb-2 flex items-center gap-2">
            <CheckCircle2 size={16} /> 주요 이력
          </p>
          <ul className="text-gray-300 text-xs md:text-sm space-y-1.5">
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
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-2xl shadow-blue-600/40"
          >
            <Phone size={22} />
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

const Services = () => {
  const services = [
    {
      title: "에어컨 설치",
      desc: "벽걸이, 스탠드, 2in1 등 모든 기종의 완벽한 설치 및 가스 충전",
      icon: <Wrench className="w-8 h-8" />,
      color: "bg-blue-500",
      items: ["신규 설치", "이전 설치", "가스 보충", "배관 연장"]
    },
    {
      title: "분해 세척",
      desc: "곰팡이와 세균을 99.9% 제거하는 고압 스팀 완전 분해 세척",
      icon: <Droplets className="w-8 h-8" />,
      color: "bg-cyan-500",
      items: ["고압 세척", "스팀 살균", "필터 청소"]
    },
    {
      title: "시스템 에어컨",
      desc: "아파트, 상가, 사무실 대형 시스템 에어컨 전문 설계 및 시공",
      icon: <Wind className="w-8 h-8" />,
      color: "bg-indigo-500",
      items: ["천장형 설치", "멀티 V 시공", "대형 유지보수", "정기 점검"]
    }
  ];

  return (
    <section id="서비스" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-3">Professional Services</h2>
          <p className="text-4xl font-bold text-gray-900 mb-4">제공하는 전문 서비스</p>
          <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((s, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100"
            >
              <div className={`${s.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg`}>
                {s.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{s.title}</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">{s.desc}</p>
              <ul className="space-y-3">
                {s.items.map(item => (
                  <li key={item} className="flex items-center gap-3 text-gray-700 font-medium">
                    <CheckCircle2 size={18} className="text-blue-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Portfolio = () => {
  const projects = [
    { id: 1, title: "시스템 에어컨 설치 완료", category: "설치", img: "https://postfiles.pstatic.net/MjAyNjA0MDRfMTU3/MDAxNzc1Mjc4MTQ1MzU1.YJnIWvY1JcSNCgZF98HH_PQqDHkenONHN0iuqOuJyT0g.9_hKx5ifMkguJqx5rI_p92MGCex7h_-8C9o2TVsWIeIg.JPEG/KakaoTalk_20260404_114134079_04.jpg?type=w773" },
    { id: 2, title: "천장형 에어컨 시공 현장", category: "설치", img: "https://postfiles.pstatic.net/MjAyNjA0MDRfMjk5/MDAxNzc1Mjc3OTY0MzE2.SJBfNOkeodFx1rFKCA5uyF9E5LAsFQHMCxYELY9ebekg.vHZqLVscBXlOUH-oHNvM5WNQqdYBHy9MpTVXNmfm9jgg.JPEG/SE-a7f09b44-2ea0-4e4e-8991-723905520109.jpg?type=w773" },
    { id: 3, title: "깔끔한 실외기 마감", category: "설치", img: "https://postfiles.pstatic.net/MjAyNjA0MDRfODYg/MDAxNzc1Mjc3NTQ3Mjgw.WQeaYuVrIX2I_nUCk-9QcoOkTppqej4cdsg0wXe01YQg.H9jampFiucbfrQFfbAl5Xha7hXZcLw-ysttYz2nD80Mg.JPEG/SE-883fe084-1c37-48b1-944a-da971f6321bd.jpg?type=w773" },
    { id: 4, title: "실내기 거치 및 연결", category: "설치", img: "https://postfiles.pstatic.net/MjAyNjA0MDRfNTMg/MDAxNzc1Mjc3NDY0ODI2.EcPI9O040xCxZF5jrP4HkcgrWLnjXShn4VWrtrbyXeMg.1bjv8e4MFgM83ckGItY6lYs2X7uq77SWiy0XkGB9ggMg.JPEG/20250908_135833.jpg?type=w773" },
    { id: 5, title: "외부 실외기 설치 작업", category: "설치", img: "https://postfiles.pstatic.net/MjAyNjA0MDRfMjA3/MDAxNzc1Mjc3MjE3NjUy.CHvmx6hzJj9PpjaFpigRLy1Y0PMUpdDEDPv2lHjxXFgg.7Y-au1l3z3ne8z_aIfZKttClbVZEJZazCYdvwlvQIdcg.JPEG/KakaoTalk_20260404_114134079_14.jpg?type=w773" },
    { id: 6, title: "상가 실내기 전문 시공", category: "설치", img: "https://postfiles.pstatic.net/MjAyNjA0MDRfMTAz/MDAxNzc1Mjc4NDIwMzgx.6mhGd9jlwtgrpLPu-AYe5skpsnrcUvy1Dm6s747ogTUg.R8dtsWPgtGRfGK_T6THPtFEUHpy8ao3hg7d2v0eoCpsg.JPEG/20260306_113611.jpg?type=w773" },
  ];

  return (
    <section id="포트폴리오" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-3">Our Work</h2>
            <p className="text-4xl font-bold text-gray-900">최근 작업 포트폴리오</p>
          </div>
          <div className="flex gap-2">
            {['전체'].map(tab => (
              <button key={tab} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                tab === '전체' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <motion.div 
              key={p.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="group relative overflow-hidden rounded-3xl aspect-[4/3] cursor-pointer"
            >
              <img 
                src={p.img} 
                alt={p.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                <span className="text-blue-400 text-sm font-bold mb-2">{p.category}</span>
                <h3 className="text-white text-xl font-bold">{p.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ContactSection = () => {
  return (
    <section id="견적문의" className="py-24 bg-blue-600 relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full -mr-48 -mt-48 blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-700 rounded-full -ml-48 -mb-48 blur-3xl opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center text-white max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
            지금 바로<br />
            <span className="text-blue-200">전화 상담</span>을 받아보세요
          </h2>
          <p className="text-xl text-blue-100 mb-12 leading-relaxed">
            담당 전문가가 친절히 상담해 드립니다.<br />
            아래 번호로 전화주시면 신속하게 도와드리겠습니다.
          </p>
          
          <div className="inline-flex flex-col items-center gap-6 bg-white/10 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/20 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="bg-white p-4 rounded-2xl shadow-lg">
                <Phone className="text-blue-600 w-8 h-8" />
              </div>
              <div className="text-left">
                <p className="text-blue-200 text-sm font-bold">빠른 전화 상담</p>
                <a href="tel:01071202305" className="text-3xl md:text-4xl font-extrabold hover:text-blue-200 transition-colors">010-7120-2305</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const MapSection = () => (
  <section id="사무실위치" className="py-24 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-3">Location</h2>
        <p className="text-4xl font-bold text-gray-900 mb-12">사무실 위치</p>
        
        <div className="grid md:grid-cols-2 gap-8 text-left">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex gap-4 mb-6">
              <div className="bg-blue-50 p-3 rounded-xl h-fit">
                <MapPin className="text-blue-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900 mb-1">본사 주소</p>
                <p className="text-gray-600">경기도 화성시 향남읍 서봉로 372</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-blue-50 p-3 rounded-xl h-fit">
                <Clock className="text-blue-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900 mb-1">영업 시간</p>
                <p className="text-gray-600">평일 09:00 - 19:00</p>
                <p className="text-gray-600">주말 10:00 - 17:00 (예약제)</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-600 p-8 rounded-3xl shadow-xl text-white">
            <p className="font-bold text-xl mb-4">서비스 가능 지역</p>
            <p className="text-blue-100 leading-relaxed">
              서울 전 지역 및 경기 주요 도시<br />
              (수원, 용인, 성남, 하남, 구리, 남양주, 의정부, 고양, 김포, 부천, 광명, 안양, 과천, 의왕, 군포, 시흥, 안산 등)
            </p>
            <div className="mt-6 pt-6 border-t border-blue-500/30">
              <p className="text-sm text-blue-200">※ 그 외 지역은 전화 문의 부탁드립니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-gray-900 text-gray-400 py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Wind className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              조군 <span className="text-blue-500">에어컨</span>
            </span>
          </div>
          <p className="max-w-sm mb-6 leading-relaxed">
            조군에어컨은 <span className="text-white font-bold underline decoration-blue-500 underline-offset-4">19년 경력</span>의 전문가가 직접 시공하는 에어컨 전문 브랜드입니다. 
            LG, 삼성, 캐리어 판매 및 설치와 업소, 공장, 오피스텔, 빌라 공사 등 화성에서 10년 가까이 믿음으로 유지해온 신뢰의 업체입니다.
          </p>
          <div className="bg-gray-800/50 p-4 rounded-xl mb-8 border border-gray-800">
            <p className="text-blue-400 font-bold text-sm mb-2">주요 이력</p>
            <p className="text-xs leading-relaxed text-gray-400">
              지하철 승강장 천장형 멀티(서현역), 주거형 오피스텔 천장형(구로), 스트레스 프리존(강남구) 등 최초 시공자
            </p>
          </div>
          <div className="mb-4 text-sm space-y-1">
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
          <h4 className="text-white font-bold mb-6">Quick Links</h4>
          <ul className="space-y-4">
            {['서비스 소개', '포트폴리오'].map(item => (
              <li key={item}><a href="#" className="hover:text-blue-500 transition-colors">{item}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Contact Info</h4>
          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <Phone size={16} className="text-blue-500" />
              010-7120-2305
            </li>
            <li className="flex items-center gap-3">
              <MapPin size={16} className="text-blue-500" />
              경기도 화성시 향남읍 서봉로 372
            </li>
            <li className="flex items-center gap-3">
              <Clock size={16} className="text-blue-500" />
              연중무휴 09:00 - 20:00
            </li>
          </ul>
        </div>
      </div>
      
      <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
        <p>© 2026 조군에어컨. All rights reserved.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white">이용약관</a>
          <a href="#" className="hover:text-white font-bold text-blue-400">개인정보처리방침</a>
        </div>
      </div>
    </div>
  </footer>
);

export default function App() {
  return (
    <div className="font-sans text-gray-900 bg-white selection:bg-blue-100 selection:text-blue-600">
      <Header />
      <main>
        <Hero />
        <Services />
        <Portfolio />
        <ContactSection />
        <MapSection />
      </main>
      <Footer />
      
      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 z-40 md:hidden">
        <a 
          href="tel:01071202305"
          className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl animate-bounce"
        >
          <Phone size={28} />
        </a>
      </div>
    </div>
  );
}
