import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Users, ShieldCheck, ArrowRight, Sparkles, Plane, IdCard, CircleUserRound, Clock, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Language } from '../types';
import { HERO_SLIDES } from '../data/toursData';

interface HeroProps {
  language: Language;
  selectedDestination: string;
  onDestinationChange: (dest: string) => void;
  selectedDuration: string;
  onDurationChange: (duration: string) => void;
  selectedGroupType: string;
  onGroupTypeChange: (type: string) => void;
  onSearch: () => void;
  onOpenPlanner: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  language,
  selectedDestination,
  onDestinationChange,
  selectedDuration,
  onDurationChange,
  selectedGroupType,
  onGroupTypeChange,
  onSearch,
  onOpenPlanner,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play slider every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const t = {
    en: {
      badge: 'PREMIER TURKEY TRAVEL EXPERIENCES & BOUTIQUE TOURS',
      titleLine1: 'Curated Journeys',
      titleLine2: 'Through Timeless Turkey',
      subtitle: 'From the sunrise hot air balloons over Cappadocia’s fairy chimneys to the ancient marble boulevards of Ephesus and private Bosphorus yacht cruises — travel Turkey with handpicked boutique stays and native historian guides.',
      destinationLabel: 'Destination',
      allDestinations: 'All Turkey Destinations',
      durationLabel: 'Duration',
      allDurations: 'Any Duration',
      duration2Days: '2 Days (Quick Escape)',
      duration3to5Days: '3 - 5 Days',
      duration6PlusDays: '6+ Days (Grand Tours)',
      styleLabel: 'Tour Style',
      allStyles: 'All Styles',
      smallGroup: 'Small Boutique Group',
      privateVIP: 'Private VIP Departure',
      searchBtn: 'Explore Tours',
      customBtn: 'Design Custom Trip',
      feature1Line1: 'Licensed',
      feature1Line2: 'Tour Operator',
      feature2Line1: 'Local',
      feature2Line2: 'Tour Guides',
      feature3Line1: 'Domestic',
      feature3Line2: 'Flight Included',
      feature4Line1: 'Free',
      feature4Line2: 'Cancellation',
      feature5Line1: '7/24',
      feature5Line2: 'WhatsApp Support',
    },
    tr: {
      badge: 'SEÇKİN TÜRKİYE SEYAHAT DENEYİMLERİ & BUTİK TURLAR',
      titleLine1: 'Türkiye’yi Masalsı ve',
      titleLine2: 'Ayrıcalıklı Keşfedin',
      subtitle: 'Kapadokya peri bacaları üzerindeki gün doğumu sıcak hava balonlarından, Efes’in antik mermer caddelerine ve özel Boğaz yat turlarına — seçkin butik mağara oteller ve uzman tarihçi rehberler eşliğinde hayalinizdeki Türkiye yolculuğuna çıkın.',
      destinationLabel: 'Destinasyon',
      allDestinations: 'Tüm Destinasyonlar',
      durationLabel: 'Süre',
      allDurations: 'Tüm Süreler',
      duration2Days: '2 Günlük Kaçamaklar',
      duration3to5Days: '3 - 5 Gün',
      duration6PlusDays: '6+ Gün (Büyük Turlar)',
      styleLabel: 'Tur Tarzı',
      allStyles: 'Tüm Tarzlar',
      smallGroup: 'Butik Küçük Grup',
      privateVIP: 'Özel VIP Tur',
      searchBtn: 'Turları Keşfet',
      customBtn: 'Özel Tur Tasarla',
      feature1Line1: 'Lisanslı',
      feature1Line2: 'Tur Operatörü',
      feature2Line1: 'Yerel',
      feature2Line2: 'Rehberler',
      feature3Line1: 'İç Hat',
      feature3Line2: 'Uçak Dahil',
      feature4Line1: 'Ücretsiz',
      feature4Line2: 'İptal Hakkı',
      feature5Line1: '7/24',
      feature5Line2: 'WhatsApp Desteği',
    },
  }[language];

  return (
    <div className="relative min-h-[88vh] flex flex-col justify-between bg-slate-100 text-white overflow-hidden">
      {/* Background Slider Images with Fade Transition */}
      {HERO_SLIDES.map((slideUrl, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-1000 transform scale-105 ${
            idx === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          style={{
            backgroundImage: `url('${slideUrl}')`,
          }}
        >
          {/* Luminous overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>
      ))}

      {/* Slider Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-md transition cursor-pointer hidden sm:flex items-center justify-center border border-white/20"
        title="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-md transition cursor-pointer hidden sm:flex items-center justify-center border border-white/20"
        title="Next Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pt-12 sm:pt-20 pb-12 flex-1 flex flex-col justify-center">
        <div className="max-w-3xl">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-white text-xs font-bold tracking-wider uppercase mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#5ce6e6]" />
            <span>{t.badge}</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif-luxury font-bold tracking-tight text-white leading-[1.1] mb-6">
            <span className="block text-white drop-shadow-md">{t.titleLine1}</span>
            <span className="block italic text-[#5ce6e6] font-serif-luxury font-normal drop-shadow-md">{t.titleLine2}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-white/95 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl font-light drop-shadow-md">
            {t.subtitle}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 mb-10">
            <button
              onClick={onSearch}
              className="px-7 py-3.5 rounded-xl bg-[#009999] hover:bg-[#008080] text-white font-bold text-sm tracking-wide transition shadow-lg shadow-[#009999]/30 flex items-center gap-2 group cursor-pointer"
            >
              <span>{t.searchBtn}</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onOpenPlanner}
              className="px-7 py-3.5 rounded-xl bg-white/95 hover:bg-white text-slate-900 border border-white font-bold text-sm tracking-wide transition flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#009999]" />
              <span>{t.customBtn}</span>
            </button>
          </div>
        </div>

        {/* Slide Indicator Dots */}
        <div className="flex items-center justify-center sm:justify-start gap-2 mb-6 z-20">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentSlide ? 'w-8 bg-[#5ce6e6]' : 'w-2 bg-white/50 hover:bg-white'
              }`}
              title={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Interactive Quick Search / Filter Bar - Crisp luminous card */}
        <div className="w-full bg-white/98 backdrop-blur-md rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-200/80 text-slate-900 mt-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            {/* Destination Selector */}
            <div className="flex flex-col border-b md:border-b-0 md:border-r border-slate-200 pb-3 md:pb-0 md:pr-4">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#009999]" />
                <span>{t.destinationLabel}</span>
              </label>
              <select
                id="search-destination-select"
                value={selectedDestination}
                onChange={(e) => onDestinationChange(e.target.value)}
                aria-label="Filter by destination"
                className="bg-transparent text-slate-900 font-semibold text-sm focus:outline-none cursor-pointer"
              >
                <option value="all">{t.allDestinations}</option>
                <option value="cappadocia">Cappadocia (Kapadokya)</option>
                <option value="aegean-ephesus">Ephesus & Pamukkale (Efes)</option>
                <option value="gallipoli">Gallipoli & Troy (Çanakkale)</option>
                <option value="multi-region">Multi-Region (Grand Turkey)</option>
                <option value="istanbul">Istanbul (İstanbul)</option>
                <option value="mediterranean">Antalya & Turquoise Coast</option>
              </select>
            </div>

            {/* Duration Selector */}
            <div className="flex flex-col border-b md:border-b-0 md:border-r border-slate-200 pb-3 md:pb-0 md:pr-4">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#009999]" />
                <span>{t.durationLabel}</span>
              </label>
              <select
                id="search-duration-select"
                value={selectedDuration}
                onChange={(e) => onDurationChange(e.target.value)}
                aria-label="Filter by duration"
                className="bg-transparent text-slate-900 font-semibold text-sm focus:outline-none cursor-pointer"
              >
                <option value="all">{t.allDurations}</option>
                <option value="2">{t.duration2Days}</option>
                <option value="3-5">{t.duration3to5Days}</option>
                <option value="6+">{t.duration6PlusDays}</option>
              </select>
            </div>

            {/* Tour Style Selector */}
            <div className="flex flex-col border-b md:border-b-0 md:border-r border-slate-200 pb-3 md:pb-0 md:pr-4">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1.5">
                <Users className="w-3.5 h-3.5 text-[#009999]" />
                <span>{t.styleLabel}</span>
              </label>
              <select
                id="search-style-select"
                value={selectedGroupType}
                onChange={(e) => onGroupTypeChange(e.target.value)}
                aria-label="Filter by tour style"
                className="bg-transparent text-slate-900 font-semibold text-sm focus:outline-none cursor-pointer"
              >
                <option value="all">{t.allStyles}</option>
                <option value="Small Group">{t.smallGroup}</option>
                <option value="Private VIP">{t.privateVIP}</option>
              </select>
            </div>

            {/* Find Tours Button */}
            <div>
              <button
                id="search-submit-btn"
                onClick={onSearch}
                className="w-full py-3.5 px-5 bg-[#009999] hover:bg-[#008080] text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-[#009999]/25 cursor-pointer"
              >
                <Search className="w-4 h-4 text-white" />
                <span>{t.searchBtn}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trust & Features Bar - Elegant Ribbon with lighter turquoise gradient */}
      <div className="relative z-10 bg-gradient-to-b from-[#009ca0] via-[#08abb0] to-[#008c90] shadow-sm py-3.5 sm:py-6 lg:py-7 px-2 sm:px-8 text-white border-t border-[#38efee]/30">
        <div className="max-w-7xl mx-auto flex sm:grid sm:grid-cols-5 items-center justify-between sm:justify-items-center overflow-x-auto no-scrollbar gap-1 sm:gap-4 text-center">
          {/* 1. Licensed Tour Operator */}
          <div className="flex-1 min-w-[66px] sm:min-w-0 flex flex-col items-center justify-center px-1">
            <IdCard className="w-5 h-5 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white mb-1.5 sm:mb-2.5 stroke-[1.65]" />
            <span className="text-white text-[10px] sm:text-[13px] lg:text-[14px] font-medium tracking-tight sm:tracking-normal leading-tight sm:leading-[1.35]">
              {t.feature1Line1}
              <br />
              {t.feature1Line2}
            </span>
          </div>

          {/* 2. Local Tour Guides */}
          <div className="flex-1 min-w-[66px] sm:min-w-0 flex flex-col items-center justify-center px-1">
            <CircleUserRound className="w-5 h-5 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white mb-1.5 sm:mb-2.5 stroke-[1.65]" />
            <span className="text-white text-[10px] sm:text-[13px] lg:text-[14px] font-medium tracking-tight sm:tracking-normal leading-tight sm:leading-[1.35]">
              {t.feature2Line1}
              <br />
              {t.feature2Line2}
            </span>
          </div>

          {/* 3. Domestic Flight Included */}
          <div className="flex-1 min-w-[66px] sm:min-w-0 flex flex-col items-center justify-center px-1">
            <Plane className="w-5 h-5 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white mb-1.5 sm:mb-2.5 stroke-[1.65]" />
            <span className="text-white text-[10px] sm:text-[13px] lg:text-[14px] font-medium tracking-tight sm:tracking-normal leading-tight sm:leading-[1.35]">
              {t.feature3Line1}
              <br />
              {t.feature3Line2}
            </span>
          </div>

          {/* 4. Free Cancellation */}
          <div className="flex-1 min-w-[66px] sm:min-w-0 flex flex-col items-center justify-center px-1">
            <Clock className="w-5 h-5 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white mb-1.5 sm:mb-2.5 stroke-[1.65]" />
            <span className="text-white text-[10px] sm:text-[13px] lg:text-[14px] font-medium tracking-tight sm:tracking-normal leading-tight sm:leading-[1.35]">
              {t.feature4Line1}
              <br />
              {t.feature4Line2}
            </span>
          </div>

          {/* 5. 24/7 WhatsApp Support */}
          <div className="flex-1 min-w-[66px] sm:min-w-0 flex flex-col items-center justify-center px-1">
            <MessageCircle className="w-5 h-5 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white mb-1.5 sm:mb-2.5 stroke-[1.65]" />
            <span className="text-white text-[10px] sm:text-[13px] lg:text-[14px] font-medium tracking-tight sm:tracking-normal leading-tight sm:leading-[1.35]">
              {t.feature5Line1}
              <br />
              {t.feature5Line2}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
