import React, { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { TourCard } from '../components/TourCard';
import { DestinationsSection } from '../components/DestinationsSection';
import { WhyVoyra } from '../components/WhyVoyra';
import { FAQSection } from '../components/FAQSection';
import { TOURS_DATA } from '../data/toursData';
import { Currency, Language, TourPackage } from '../types';
import { ArrowRight, Compass, Sparkles, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

interface HomePageProps {
  language: Language;
  currency: Currency;
  onSelectTour: (tour: TourPackage) => void;
  onOpenPlanner: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  language,
  currency,
  onSelectTour,
  onOpenPlanner,
}) => {
  const navigate = useNavigate();
  const [selectedDestination, setSelectedDestination] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [selectedGroupType, setSelectedGroupType] = useState('all');
  const [popularTab, setPopularTab] = useState<string>('all');
  const popularScrollRef = useRef<HTMLDivElement>(null);

  const scrollPopular = (direction: 'left' | 'right') => {
    if (popularScrollRef.current) {
      const { scrollLeft, clientWidth } = popularScrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      popularScrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const isTr = language === 'tr';

  // Quick search in Hero forwards to /tours with query params
  const handleHeroSearch = () => {
    const params = new URLSearchParams();
    if (selectedDestination !== 'all') params.set('dest', selectedDestination);
    if (selectedDuration !== 'all') params.set('dur', selectedDuration);
    if (selectedGroupType !== 'all') params.set('style', selectedGroupType);
    navigate(`/tours?${params.toString()}`);
  };

  // Popular Bestselling Tours (Top curated tours with domestic flights and boutique stays)
  const popularTours = useMemo(() => {
    const bestsellers = TOURS_DATA.filter((tour) => {
      const lower = tour.title.toLowerCase();
      if (
        lower.startsWith('number of guests') ||
        lower.includes('1-2 pax') ||
        lower.startsWith('day 1:') ||
        lower.startsWith('your journey begins')
      ) {
        return false;
      }

      return (
        tour.id === 'cappadocia-2-day' ||
        tour.id === 'ephesus-pamukkale-2-day' ||
        tour.id === 'grand-turkey-6-day' ||
        tour.id === 'istanbul-3-day' ||
        tour.id === 'gallipoli-troy-2-day' ||
        tour.featured === true
      );
    });

    if (popularTab === 'all') {
      return bestsellers.slice(0, 8);
    }
    return bestsellers.filter((t) => t.region === popularTab);
  }, [popularTab]);

  return (
    <div>
      {/* Bright & Sunlit Hero Section */}
      <Hero
        language={language}
        selectedDestination={selectedDestination}
        onDestinationChange={setSelectedDestination}
        selectedDuration={selectedDuration}
        onDurationChange={setSelectedDuration}
        selectedGroupType={selectedGroupType}
        onGroupTypeChange={setSelectedGroupType}
        onSearch={handleHeroSearch}
        onOpenPlanner={() => navigate('/tailor-made')}
      />

      {/* Popular Tours Section */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e6f8f8] text-[#008080] text-xs font-bold uppercase tracking-wider mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-[#009999]" />
              <span>{isTr ? 'EN ÇOK TERCİH EDİLENLER' : 'BESTSELLING EXPERIENCES'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-luxury font-bold text-slate-900 mb-2 tracking-tight">
              {isTr ? 'Popüler Paket Turlar' : 'Popular Tour Packages'}
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm max-w-2xl font-light">
              {isTr
                ? 'İç hat uçak biletleri, otantik butik mağara oteller ve lisanslı tarihçi rehberler dahil en çok satan ikonik rotalarımız.'
                : 'Our most requested boutique journeys combining domestic flights, handpicked cave & heritage hotels, and licensed historian guides.'}
            </p>
          </div>

          <button
            onClick={() => navigate('/tours')}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#009999] hover:bg-[#008080] text-white font-semibold text-xs tracking-wide transition shadow-xs shadow-[#009999]/20 shrink-0 cursor-pointer self-start md:self-auto"
          >
            <span>{isTr ? 'Tüm Turları İncele' : 'View All Tours'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Category Filter Pills & Carousel Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'all', label: isTr ? 'Tüm Popüler Turlar' : 'All Bestsellers' },
              { id: 'cappadocia', label: isTr ? 'Kapadokya' : 'Cappadocia' },
              { id: 'aegean-ephesus', label: isTr ? 'Efes & Pamukkale' : 'Ephesus & Aegean' },
              { id: 'multi-region', label: isTr ? 'Büyük Türkiye Turu' : 'Grand Turkey Loop' },
              { id: 'istanbul', label: isTr ? 'İstanbul' : 'Istanbul' },
            ].map((tab) => {
              const isActive = popularTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setPopularTab(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    isActive
                      ? 'bg-[#009999] text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Carousel Arrows */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              onClick={() => scrollPopular('left')}
              className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition cursor-pointer shadow-xs"
              title="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollPopular('right')}
              className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition cursor-pointer shadow-xs"
              title="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Compact Tour Cards Horizontal Carousel */}
        <div
          ref={popularScrollRef}
          className="flex overflow-x-auto gap-6 snap-x snap-mandatory scrollbar-none pb-4 items-stretch"
        >
          {popularTours.map((tour) => (
            <div key={tour.id} className="snap-start shrink-0 w-[280px] sm:w-[320px] lg:w-[calc(25%-18px)] flex flex-col">
              <TourCard
                tour={tour}
                language={language}
                currency={currency}
                onSelectTour={onSelectTour}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Popular Destinations Section - Sleek & Compact */}
      <DestinationsSection
        language={language}
        onSelectDestination={(destId) => navigate(`/tours?dest=${destId}`)}
      />

      {/* Tailor-Made Custom Trip Banner Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-14">
        <div className="rounded-2xl bg-gradient-to-r from-[#009ca0] via-[#08abb0] to-[#008c90] text-white p-7 sm:p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 border border-[#38efee]/35">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-[#e0fbfc] uppercase">
              <Compass className="w-4 h-4" />
              <span>{isTr ? 'KİŞİYE ÖZEL BUTİK SEYAHAT' : 'BESPOKE TRAVEL DESIGN'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif-luxury font-bold text-white">
              {isTr
                ? 'Kendi Türkiye Masalınızı Tasarlayın'
                : 'Looking for a Custom Tailored Itinerary?'}
            </h3>
            <p className="text-teal-50 text-xs sm:text-sm leading-relaxed font-normal">
              {isTr
                ? 'Tarihlerinize, ilgi alanlarınıza ve temponuza özel gün be gün rotanızı uzman seyahat tasarımcılarımızla birlikte hazırlayalım.'
                : 'Tell us your preferred dates, group size, and must-see destinations. Our Istanbul-based travel specialists will handcraft your private journey within 24 hours.'}
            </p>
          </div>

          <button
            id="home-tailor-made-btn"
            onClick={() => navigate('/tailor-made')}
            className="px-6 py-3.5 rounded-xl bg-white hover:bg-teal-50 text-[#007f82] font-bold text-xs tracking-wider transition shadow-lg shadow-black/10 shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <span>{isTr ? 'Özel Tur Planlayın' : 'Design Your Custom Trip'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Why Voyra & FAQ Section directly on Homepage above footer */}
      <WhyVoyra language={language} />
      <FAQSection language={language} />
    </div>
  );
};
