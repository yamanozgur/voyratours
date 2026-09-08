import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { TourCard } from '../components/TourCard';
import { DestinationsSection } from '../components/DestinationsSection';
import { TOURS_DATA } from '../data/toursData';
import { Currency, Language, TourPackage } from '../types';
import { ArrowRight, Compass, Sparkles, SlidersHorizontal } from 'lucide-react';

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
    const bestsellers = TOURS_DATA.filter(
      (tour) =>
        tour.id === 'cappadocia-2-day' ||
        tour.id === 'ephesus-pamukkale-2-day' ||
        tour.id === 'grand-turkey-6-day' ||
        tour.id === 'istanbul-3-day' ||
        tour.id === 'gallipoli-troy-2-day' ||
        tour.featured === true
    );

    if (popularTab === 'all') {
      return bestsellers.slice(0, 6);
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

        {/* Category Filter Pills for Popular Section */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
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

        {/* Compact Tour Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularTours.map((tour) => (
            <TourCard
              key={tour.id}
              tour={tour}
              language={language}
              currency={currency}
              onSelectTour={onSelectTour}
            />
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
        <div className="rounded-2xl bg-gradient-to-r from-[#007373] via-[#008b8f] to-[#006a6e] text-white p-7 sm:p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 border border-[#009999]/50">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-[#5ce6e6] uppercase">
              <Compass className="w-4 h-4" />
              <span>{isTr ? 'KİŞİYE ÖZEL BUTİK SEYAHAT' : 'BESPOKE TRAVEL DESIGN'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif-luxury font-bold text-white">
              {isTr
                ? 'Kendi Türkiye Masalınızı Tasarlayın'
                : 'Looking for a Custom Tailored Itinerary?'}
            </h3>
            <p className="text-teal-100/85 text-xs sm:text-sm leading-relaxed font-light">
              {isTr
                ? 'Tarihlerinize, ilgi alanlarınıza ve temponuza özel gün be gün rotanızı uzman seyahat tasarımcılarımızla birlikte hazırlayalım.'
                : 'Tell us your preferred dates, group size, and must-see destinations. Our Istanbul-based travel specialists will handcraft your private journey within 24 hours.'}
            </p>
          </div>

          <button
            id="home-tailor-made-btn"
            onClick={() => navigate('/tailor-made')}
            className="px-6 py-3.5 rounded-xl bg-[#009999] hover:bg-[#008080] text-white font-bold text-xs tracking-wider transition shadow-md shadow-[#009999]/30 shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <span>{isTr ? 'Özel Tur Planlayın' : 'Design Your Custom Trip'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
