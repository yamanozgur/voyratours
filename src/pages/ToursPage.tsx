import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { TourCard } from '../components/TourCard';
import { TOURS_DATA } from '../data/toursData';
import { Currency, Language, TourPackage } from '../types';
import { Search, SlidersHorizontal, RotateCcw, Compass, ArrowRight, Sparkles, ChevronRight } from 'lucide-react';

interface ToursPageProps {
  language: Language;
  currency: Currency;
  onSelectTour: (tour: TourPackage) => void;
}

export const ToursPage: React.FC<ToursPageProps> = ({
  language,
  currency,
  onSelectTour,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const isTr = language === 'tr';

  const [selectedDestination, setSelectedDestination] = useState<string>(
    searchParams.get('dest') || 'all'
  );
  const [selectedDuration, setSelectedDuration] = useState<string>(
    searchParams.get('dur') || 'all'
  );
  const [selectedGroupType, setSelectedGroupType] = useState<string>(
    searchParams.get('style') || 'all'
  );
  const [searchTerm, setSearchTerm] = useState<string>(
    searchParams.get('q') || ''
  );

  // Sync URL query params with state when URL changes
  useEffect(() => {
    const dest = searchParams.get('dest');
    const dur = searchParams.get('dur');
    const style = searchParams.get('style');
    const q = searchParams.get('q');
    if (dest !== null) setSelectedDestination(dest);
    if (dur !== null) setSelectedDuration(dur);
    if (style !== null) setSelectedGroupType(style);
    if (q !== null) setSearchTerm(q);
  }, [searchParams]);

  // Filter logic
  const filteredTours = useMemo(() => {
    return TOURS_DATA.filter((tour) => {
      // Destination filter
      if (selectedDestination !== 'all' && tour.region !== selectedDestination) {
        return false;
      }

      // Duration filter
      if (selectedDuration === '2' && tour.durationDays !== 2) return false;
      if (selectedDuration === '3-5' && (tour.durationDays < 3 || tour.durationDays > 5)) return false;
      if (selectedDuration === '6+' && tour.durationDays < 6) return false;

      // Group Style filter
      if (selectedGroupType !== 'all') {
        const matchesType =
          (selectedGroupType === 'Small Group' && (tour.groupType.includes('Small Group') || tour.groupType.includes('Boutique'))) ||
          (selectedGroupType === 'Private VIP' && (tour.groupType.includes('Private') || tour.groupType.includes('VIP')));
        if (!matchesType) return false;
      }

      // Search keyword
      if (searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase();
        const titleMatches =
          tour.title.toLowerCase().includes(term) ||
          tour.titleTr.toLowerCase().includes(term);
        const destMatches =
          tour.destination.toLowerCase().includes(term) ||
          tour.destinationTr.toLowerCase().includes(term);
        const descMatches =
          tour.overview.toLowerCase().includes(term) ||
          tour.overviewTr.toLowerCase().includes(term);
        if (!titleMatches && !destMatches && !descMatches) return false;
      }

      return true;
    });
  }, [selectedDestination, selectedDuration, selectedGroupType, searchTerm]);

  const resetAllFilters = () => {
    setSelectedDestination('all');
    setSelectedDuration('all');
    setSelectedGroupType('all');
    setSearchTerm('');
    setSearchParams({});
  };

  const destinationsList = [
    { id: 'all', label: isTr ? 'Tüm Rotalar' : 'All Packages' },
    { id: 'cappadocia', label: isTr ? 'Kapadokya' : 'Cappadocia' },
    { id: 'aegean-ephesus', label: isTr ? 'Efes & Pamukkale' : 'Ephesus & Pamukkale' },
    { id: 'istanbul', label: isTr ? 'İstanbul' : 'Istanbul' },
    { id: 'gallipoli', label: isTr ? 'Çanakkale & Truva' : 'Gallipoli & Troy' },
    { id: 'multi-region', label: isTr ? 'Büyük Türkiye Turu' : 'Grand Turkey Loop' },
    { id: 'mediterranean', label: isTr ? 'Antalya & Akdeniz' : 'Antalya & Coast' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fbfb] pb-24">
      {/* Page Hero Header */}
      <div className="bg-gradient-to-b from-[#004d53] to-[#003c41] text-white pt-12 pb-16 px-4 sm:px-8 border-b border-[#009999]/40">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-teal-200/80 mb-6 font-medium">
            <Link to="/" className="hover:text-white transition">
              {isTr ? 'Ana Sayfa' : 'Home'}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-teal-400" />
            <span className="text-white font-semibold">
              {isTr ? 'Paket Turlar' : 'Tours & Packages'}
            </span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[#5ce6e6] text-xs font-bold uppercase tracking-wider mb-4 border border-white/25">
              <Sparkles className="w-3.5 h-3.5 text-[#5ce6e6]" />
              <span>{isTr ? 'SEÇKİN TÜRKİYE ROTALARI' : 'CURATED TRAVEL EXPERIENCES'}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-white mb-4 tracking-tight leading-tight">
              {isTr ? 'Tüm Paket Turlarımız' : 'All Tours & Signature Packages'}
            </h1>
            <p className="text-teal-100/90 text-sm sm:text-base leading-relaxed font-light">
              {isTr
                ? 'İç hat uçuşları, seçkin butik mağara otelleri, VIP havalimanı transferleri ve lisanslı profesyonel rehberler eşliğinde eksiksiz tasarlanmış Türkiye paketleri.'
                : 'Every itinerary is thoughtfully curated with boutique cave and heritage hotels, seamless domestic airport transfers, domestic flights, and licensed historian guides.'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-6">
        {/* Filter Controls Bar */}
        <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-200/80 mb-10 space-y-4">
          {/* Top Destination Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {destinationsList.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedDestination(cat.id);
                  const p = new URLSearchParams(searchParams);
                  if (cat.id === 'all') p.delete('dest');
                  else p.set('dest', cat.id);
                  setSearchParams(p);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer shrink-0 ${
                  selectedDestination === cat.id
                    ? 'bg-[#009999] text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Secondary Controls: Search, Duration, Style, Reset */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={isTr ? 'Tur veya bölge ara...' : 'Search tour or sight...'}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#009999]"
              />
            </div>

            {/* Duration Selector */}
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#009999] cursor-pointer"
            >
              <option value="all">{isTr ? 'Tüm Süreler' : 'All Durations'}</option>
              <option value="2">2 {isTr ? 'Gün' : 'Days'}</option>
              <option value="3-5">3 - 5 {isTr ? 'Gün' : 'Days'}</option>
              <option value="6+">6+ {isTr ? 'Gün' : 'Days'}</option>
            </select>

            {/* Tour Style Selector */}
            <select
              value={selectedGroupType}
              onChange={(e) => setSelectedGroupType(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#009999] cursor-pointer"
            >
              <option value="all">{isTr ? 'Tüm Tur Tipleri' : 'All Tour Styles'}</option>
              <option value="Small Group">{isTr ? 'Butik Küçük Grup' : 'Small Group'}</option>
              <option value="Private VIP">{isTr ? 'Özel VIP Tur' : 'Private VIP'}</option>
            </select>

            {/* Reset Button */}
            <button
              onClick={resetAllFilters}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-semibold text-slate-600 flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isTr ? 'Filtreleri Sıfırla' : 'Reset Filters'}</span>
            </button>
          </div>
        </div>

        {/* Results Counter Bar */}
        <div className="flex items-center justify-between mb-6 text-xs text-slate-500 font-medium">
          <span>
            {isTr
              ? `${filteredTours.length} adet paket listeleniyor`
              : `Showing ${filteredTours.length} signature tour packages`}
          </span>
          <span className="text-slate-400">
            {isTr ? 'Tüm fiyatlara vergiler & transferler dahildir' : 'All prices include taxes & transfers'}
          </span>
        </div>

        {/* Tours Grid */}
        {filteredTours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTours.map((tour) => (
              <TourCard
                key={tour.id}
                tour={tour}
                language={language}
                currency={currency}
                onSelectTour={onSelectTour}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
            <Compass className="w-12 h-12 text-[#009999]/50 mx-auto" />
            <h3 className="text-xl font-bold font-serif-luxury text-slate-800">
              {isTr ? 'Aramanıza uygun tur bulunamadı' : 'No matching tours found'}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {isTr
                ? 'Filtrelerinizi sıfırlayabilir veya dilediğiniz rotayı kişiye özel tur planlayıcımız ile sıfırdan oluşturabilirsiniz.'
                : 'Try clearing your filters, or use our Bespoke Trip Planner to design an itinerary tailored to your exact dates.'}
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={resetAllFilters}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                {isTr ? 'Filtreleri Temizle' : 'Clear Filters'}
              </button>
              <button
                onClick={() => navigate('/tailor-made')}
                className="px-5 py-2.5 rounded-xl bg-[#009999] hover:bg-[#008080] text-white text-xs font-semibold shadow-sm cursor-pointer"
              >
                {isTr ? 'Özel Tur Planlayın' : 'Design Custom Trip'}
              </button>
            </div>
          </div>
        )}

        {/* Tailor-Made Bottom Callout */}
        <div className="mt-20 rounded-3xl bg-gradient-to-r from-[#004d53] via-[#005a61] to-[#004d53] text-white p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 border border-[#009999]/40">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#5ce6e6] uppercase">
              <Compass className="w-4 h-4" />
              <span>{isTr ? 'KİŞİYE ÖZEL TUR PLANI' : 'CUSTOM ITINERARY'}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white">
              {isTr ? 'Farklı Bir Rota Mı İstiyorsunuz?' : 'Looking for a Different Route or Schedule?'}
            </h3>
            <p className="text-teal-100/90 text-xs sm:text-sm leading-relaxed font-light">
              {isTr
                ? 'İstediğiniz şehirleri, özel ilgi alanlarınızı ve konaklama tercihlerinizi bize iletin, size özel 24 saat içinde program hazırlayalım.'
                : 'Tell us the regions you want to visit and your preferred travel pace. We will craft a fully bespoke journey tailored exclusively for you.'}
            </p>
          </div>

          <button
            onClick={() => navigate('/tailor-made')}
            className="px-8 py-4 rounded-xl bg-[#009999] hover:bg-[#008080] text-white font-bold text-xs tracking-wider transition shadow-lg shadow-[#009999]/30 shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <span>{isTr ? 'Özel Tur Tasarla' : 'Design Custom Trip'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
