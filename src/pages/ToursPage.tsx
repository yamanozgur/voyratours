import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link, useNavigate, useParams } from 'react-router-dom';
import { TourCard } from '../components/TourCard';
import { TOURS_DATA, DESTINATIONS_DATA } from '../data/toursData';
import { Currency, Language, TourPackage, DestinationInfo } from '../types';
import { tourVisitsDestination } from '../utils/destinationDetector';
import { SEOHead } from '../components/SEOHead';
import { Search, RotateCcw, Compass, ArrowRight, Sparkles, ChevronRight, Calendar, Clock } from 'lucide-react';

interface ToursPageProps {
  language: Language;
  currency: Currency;
  onSelectTour: (tour: TourPackage) => void;
}

interface DurationMeta {
  days: number;
  slug: string;
  badgeEn: string;
  badgeTr: string;
  titleEn: string;
  titleTr: string;
  descEn: string;
  descTr: string;
}

const DURATION_METAS: Record<number, DurationMeta> = {
  2: {
    days: 2,
    slug: '2-days',
    badgeEn: '2 DAYS / 1 NIGHT',
    badgeTr: '2 GÜN / 1 GECE',
    titleEn: '2-Day Turkey Tours & Express Escapes',
    titleTr: '2 Günlük Türkiye Turları ve Ekspres Kaçamaklar',
    descEn: 'Perfect short weekend getaways & express escapes with domestic flights, private transfers and boutique cave hotels.',
    descTr: 'Hafta sonu kaçamakları ve ekspres rotalar: İç hat uçuşları ve butik oteller eşliğinde Kapadokya, Efes veya Çanakkale.',
  },
  3: {
    days: 3,
    slug: '3-days',
    badgeEn: '3 DAYS / 2 NIGHTS',
    badgeTr: '3 GÜN / 2 GECE',
    titleEn: '3-Day Turkey Tours & City Breaks',
    titleTr: '3 Günlük Türkiye Turları ve Şehir Kaçamakları',
    descEn: 'Imperial Istanbul classics, private Bosphorus yachting, and quintessential boutique cultural journeys.',
    descTr: 'İstanbul imparatorluk sarayları, özel Boğaz yat turu ve seçkin kültür programları.',
  },
  4: {
    days: 4,
    slug: '4-days',
    badgeEn: '4 DAYS / 3 NIGHTS',
    badgeTr: '4 GÜN / 3 GECE',
    titleEn: '4-Day Turkey Tours & Dual Highlights',
    titleTr: '4 Günlük Türkiye Turları ve İki Bölge Klasikleri',
    descEn: 'Seamless dual-destination packages combining Istanbul’s heritage with Cappadocia’s sunrise hot air balloon flights.',
    descTr: 'İstanbul’un tarihi sarayları ile Kapadokya’nın gün doğumu balonlarını birleştiren 4 günlük seçkin rota.',
  },
  5: {
    days: 5,
    slug: '5-days',
    badgeEn: '5 DAYS / 4 NIGHTS',
    badgeTr: '5 GÜN / 4 GECE',
    titleEn: '5-Day Turkey Tours & Golden Triangle',
    titleTr: '5 Günlük Türkiye Turları ve Altın Üçgen',
    descEn: 'The iconic Golden Triangle loop: Cappadocia fairy chimneys, Pamukkale white travertines, and ancient Greco-Roman Ephesus.',
    descTr: 'Kapadokya peri bacaları, Pamukkale travertenleri ve Antik Efes’i kapsayan 5 günlük klasik rota.',
  },
  6: {
    days: 6,
    slug: '6-days',
    badgeEn: '6 DAYS / 5 NIGHTS',
    badgeTr: '6 GÜN / 5 GECE',
    titleEn: '6-Day Turkey Tours & Heritage Circuits',
    titleTr: '6 Günlük Türkiye Turları ve Klasik Büyük Miras Turu',
    descEn: 'Comprehensive Anatolian circuit covering Istanbul, Cappadocia cave suites, Pamukkale, and Ephesus ruins.',
    descTr: 'İstanbul, Kapadokya mağara süitleri, Pamukkale ve Efes’i birbirine bağlayan 6 günlük büyük klasik tur.',
  },
  7: {
    days: 7,
    slug: '7-days',
    badgeEn: '7 DAYS / 6 NIGHTS',
    badgeTr: '7 GÜN / 6 GECE',
    titleEn: '7-Day Turkey Tours & Turquoise Coast',
    titleTr: '7 Günlük Türkiye Turları ve Turkuaz Kıyı Rotaları',
    descEn: 'A glorious week along the Mediterranean: Kekova sunken ruins, Kas, Oludeniz Blue Lagoon, and Antalya Old Town.',
    descTr: 'Akdeniz Rivierası’nda bir hafta: Kekova batık şehri, Kaş, Ölüdeniz ve Antalya Kaleiçi.',
  },
  8: {
    days: 8,
    slug: '8-days',
    badgeEn: '8 DAYS / 7 NIGHTS',
    badgeTr: '8 GÜN / 7 GECE',
    titleEn: '8-Day Turkey Tours & Grand Journeys',
    titleTr: '8 Günlük Türkiye Turları ve Kapsamlı Anadolu-Ege Turu',
    descEn: 'In-depth grand heritage odyssey through Istanbul imperial monuments, Cappadocia ballooning, Pamukkale, and ancient Ephesus.',
    descTr: 'İstanbul, Kapadokya balonları, Pamukkale ve Antik Efes’i derinlemesine keşfeden 8 günlük rüya program.',
  },
  9: {
    days: 9,
    slug: '9-days',
    badgeEn: '9 DAYS / 8 NIGHTS',
    badgeTr: '9 GÜN / 8 GECE',
    titleEn: '9-Day Turkey Tours & Ultimate Loop',
    titleTr: '9 Günlük Türkiye Turları ve Baştan Başa Büyük Türkiye Turu',
    descEn: 'The definitive Turkish loop: Istanbul, Cappadocia, Antalya Mediterranean coastline, Pamukkale thermal terraces, and Ephesus.',
    descTr: 'Türkiye’nin en görkemli köşelerini bir araya getiren 9 günlük eksiksiz büyük Türkiye turu.',
  },
};

export const ToursPage: React.FC<ToursPageProps> = ({
  language,
  currency,
  onSelectTour,
}) => {
  const { durationSlug } = useParams<{ durationSlug?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const isTr = language === 'tr';

  // Determine duration from route param or search query
  const routeDay = useMemo(() => {
    if (!durationSlug) return null;
    const match = durationSlug.match(/^(\d+)/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num >= 2 && num <= 9) return num;
    }
    return null;
  }, [durationSlug]);

  const [selectedDestination, setSelectedDestination] = useState<string>(
    searchParams.get('dest') || 'all'
  );
  const [selectedDuration, setSelectedDuration] = useState<string>(
    routeDay ? String(routeDay) : searchParams.get('dur') || 'all'
  );
  const [selectedGroupType, setSelectedGroupType] = useState<string>(
    searchParams.get('style') || 'all'
  );
  const [searchTerm, setSearchTerm] = useState<string>(
    searchParams.get('q') || ''
  );

  // Sync route param with duration state
  useEffect(() => {
    if (routeDay !== null) {
      setSelectedDuration(String(routeDay));
    } else {
      const dur = searchParams.get('dur');
      setSelectedDuration(dur || 'all');
    }
  }, [routeDay, searchParams]);

  // Sync searchParams with state
  useEffect(() => {
    const dest = searchParams.get('dest');
    const style = searchParams.get('style');
    const q = searchParams.get('q');
    if (dest !== null) setSelectedDestination(dest);
    if (style !== null) setSelectedGroupType(style);
    if (q !== null) setSearchTerm(q);
  }, [searchParams]);

  // Tours data state with live update subscription
  const [toursList, setToursList] = useState<TourPackage[]>(TOURS_DATA);

  useEffect(() => {
    const handleToursUpdate = () => {
      setToursList([...TOURS_DATA]);
    };
    window.addEventListener('voyra_tours_updated', handleToursUpdate);
    window.addEventListener('storage', handleToursUpdate);
    return () => {
      window.removeEventListener('voyra_tours_updated', handleToursUpdate);
      window.removeEventListener('storage', handleToursUpdate);
    };
  }, []);

  // Count available tours per duration for badges
  const durationCounts = useMemo(() => {
    const counts: Record<number, number> = { 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
    toursList.forEach((tour) => {
      const d = tour.durationDays;
      if (counts[d] !== undefined) {
        counts[d]++;
      }
    });
    return counts;
  }, [toursList]);

  // Destinations data state with live update subscription
  const [destinationsData, setDestinationsData] = useState<DestinationInfo[]>(DESTINATIONS_DATA);

  useEffect(() => {
    const handleDestUpdate = () => {
      setDestinationsData([...DESTINATIONS_DATA]);
    };
    window.addEventListener('voyra_destinations_updated', handleDestUpdate);
    window.addEventListener('storage', handleDestUpdate);
    return () => {
      window.removeEventListener('voyra_destinations_updated', handleDestUpdate);
      window.removeEventListener('storage', handleDestUpdate);
    };
  }, []);

  // Filter logic
  const filteredTours = useMemo(() => {
    return toursList.filter((tour) => {
      const lower = tour.title.toLowerCase();
      if (
        lower.startsWith('number of guests') ||
        lower.includes('1-2 pax') ||
        lower.startsWith('day 1:') ||
        lower.startsWith('your journey begins')
      ) {
        return false;
      }

      // Destination filter - matches region, title, destination tokens or day overnights
      if (selectedDestination !== 'all') {
        const matches = tourVisitsDestination(tour, selectedDestination, destinationsData);
        if (!matches) return false;
      }

      // Duration filter
      if (selectedDuration !== 'all') {
        const targetDays = parseInt(selectedDuration, 10);
        if (!isNaN(targetDays)) {
          if (tour.durationDays !== targetDays) return false;
        } else if (selectedDuration === '3-5') {
          if (tour.durationDays < 3 || tour.durationDays > 5) return false;
        } else if (selectedDuration === '6+') {
          if (tour.durationDays < 6) return false;
        }
      }

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
  }, [selectedDestination, selectedDuration, selectedGroupType, searchTerm, destinationsData]);

  const handleSelectDuration = (val: string) => {
    setSelectedDuration(val);
    if (val === 'all') {
      navigate('/tours');
    } else {
      navigate(`/tours/${val}-days`);
    }
  };

  const resetAllFilters = () => {
    setSelectedDestination('all');
    setSelectedDuration('all');
    setSelectedGroupType('all');
    setSearchTerm('');
    setSearchParams({});
    navigate('/tours');
  };

  const currentDurationMeta = routeDay && DURATION_METAS[routeDay]
    ? DURATION_METAS[routeDay]
    : (!isNaN(parseInt(selectedDuration, 10)) && DURATION_METAS[parseInt(selectedDuration, 10)])
    ? DURATION_METAS[parseInt(selectedDuration, 10)]
    : null;

  const destinationsList = useMemo(() => {
    return [
      { id: 'all', label: isTr ? 'Tüm Rotalar' : 'All Regions' },
      ...destinationsData.map((d) => ({
        id: d.id,
        label: isTr ? d.nameTr : d.name,
      })),
    ];
  }, [destinationsData, isTr]);

  const durationNavItems = [
    { key: 'all', labelEn: 'All Tours', labelTr: 'Tüm Turlar', count: TOURS_DATA.length, slug: '' },
    { key: '2', labelEn: '2 Days', labelTr: '2 Günlük', count: durationCounts[2] || 0, slug: '2-days' },
    { key: '3', labelEn: '3 Days', labelTr: '3 Günlük', count: durationCounts[3] || 0, slug: '3-days' },
    { key: '4', labelEn: '4 Days', labelTr: '4 Günlük', count: durationCounts[4] || 0, slug: '4-days' },
    { key: '5', labelEn: '5 Days', labelTr: '5 Günlük', count: durationCounts[5] || 0, slug: '5-days' },
    { key: '6', labelEn: '6 Days', labelTr: '6 Günlük', count: durationCounts[6] || 0, slug: '6-days' },
    { key: '7', labelEn: '7 Days', labelTr: '7 Günlük', count: durationCounts[7] || 0, slug: '7-days' },
    { key: '8', labelEn: '8 Days', labelTr: '8 Günlük', count: durationCounts[8] || 0, slug: '8-days' },
    { key: '9', labelEn: '9 Days', labelTr: '9 Günlük', count: durationCounts[9] || 0, slug: '9-days' },
  ];

  const currentDestObj = destinationsData.find((d) => d.id === selectedDestination);
  const destName = currentDestObj ? (isTr ? currentDestObj.nameTr : currentDestObj.name) : null;

  let seoTitle = isTr ? 'Özenle Hazırlanmış Türkiye Paket Turları' : 'Curated Turkey Tour Packages & Itineraries';
  if (currentDurationMeta && destName) {
    seoTitle = isTr
      ? `${currentDurationMeta.days} Günlük ${destName} Turları`
      : `${currentDurationMeta.days}-Day ${destName} Tours`;
  } else if (currentDurationMeta) {
    seoTitle = isTr ? currentDurationMeta.titleTr : currentDurationMeta.titleEn;
  } else if (destName) {
    seoTitle = isTr ? `${destName} Turları & Paketleri` : `${destName} Tours & Packages`;
  }

  const seoDesc = currentDurationMeta
    ? (isTr ? currentDurationMeta.descTr : currentDurationMeta.descEn)
    : (isTr
        ? 'İstanbul çıkışlı Kapadokya, Efes, Pamukkale ve Antalya turları. İç hat uçuşları, lüks mağara otel konaklamaları ve hava muhalefeti iade garantili balon uçuşu opsiyonu.'
        : 'Curated boutique Turkey packages from Istanbul to Cappadocia, Ephesus, Pamukkale, and Antalya. Domestic flights, cave suites, and licensed guides included.');

  return (
    <div className="min-h-screen bg-[#f8fbfb] pb-24">
      <SEOHead
        title={seoTitle}
        description={seoDesc}
        language={language}
      />
      {/* Page Hero Header */}
      <div className="bg-gradient-to-b from-[#007373] via-[#008b8f] to-[#006a6e] text-white pt-10 pb-14 px-4 sm:px-8 border-b border-[#009999]/40">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-teal-200/80 mb-5 font-medium flex-wrap">
            <Link to="/" className="hover:text-white transition">
              {isTr ? 'Ana Sayfa' : 'Home'}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-teal-400" />
            {currentDurationMeta ? (
              <>
                <Link to="/tours" className="hover:text-white transition">
                  {isTr ? 'Paket Turlar' : 'Tours & Packages'}
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-teal-400" />
                <span className="text-white font-semibold">
                  {isTr ? `${currentDurationMeta.days} Günlük Turlar` : `${currentDurationMeta.days}-Day Tours`}
                </span>
              </>
            ) : (
              <span className="text-white font-semibold">
                {isTr ? 'Tüm Paket Turlar' : 'All Tours & Packages'}
              </span>
            )}
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[#5ce6e6] text-xs font-bold uppercase tracking-wider mb-4 border border-white/25">
              <Sparkles className="w-3.5 h-3.5 text-[#5ce6e6]" />
              <span>
                {currentDurationMeta
                  ? (isTr ? currentDurationMeta.badgeTr : currentDurationMeta.badgeEn)
                  : (isTr ? 'SEÇKİN TÜRKİYE ROTALARI' : 'CURATED TRAVEL EXPERIENCES')}
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-white mb-4 tracking-tight leading-tight">
              {currentDurationMeta
                ? (isTr ? currentDurationMeta.titleTr : currentDurationMeta.titleEn)
                : (isTr ? 'Tüm Paket Turlarımız' : 'All Tours & Signature Packages')}
            </h1>
            <p className="text-teal-100/90 text-sm sm:text-base leading-relaxed font-light">
              {currentDurationMeta
                ? (isTr ? currentDurationMeta.descTr : currentDurationMeta.descEn)
                : (isTr
                    ? 'İç hat uçuşları, seçkin butik mağara otelleri, VIP havalimanı transferleri ve lisanslı profesyonel rehberler eşliğinde eksiksiz tasarlanmış Türkiye paketleri.'
                    : 'Every itinerary is thoughtfully curated with boutique cave and heritage hotels, seamless domestic airport transfers, domestic flights, and licensed historian guides.')}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-6">
        {/* Dedicated Duration Switcher Tabs (Requested by User) */}
        <div className="bg-white rounded-2xl p-2.5 shadow-md border border-slate-200/90 mb-6">
          <div className="flex items-center justify-between px-2.5 py-1 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#009999]" />
              <span>{isTr ? 'GÜN SAYISINA GÖRE GÖSTERİM' : 'BROWSE BY TOUR DURATION'}</span>
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              2, 3, 4, 5, 6, 7, 8, 9 {isTr ? 'günlük seçenekler' : 'days available'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {durationNavItems.map((item) => {
              const isSelected = item.key === 'all'
                ? selectedDuration === 'all'
                : selectedDuration === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => handleSelectDuration(item.key)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#009999] text-white shadow-md shadow-[#009999]/25 scale-[1.02]'
                      : 'bg-[#FAF8F5] text-slate-700 hover:bg-[#F4EFE6] hover:text-[#009999] border border-[#E5DFD5]'
                  }`}
                >
                  <span>{isTr ? item.labelTr : item.labelEn}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200/80 text-slate-600'
                    }`}
                  >
                    {item.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-200/80 mb-8 space-y-4">
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
              onChange={(e) => handleSelectDuration(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#009999] cursor-pointer"
            >
              <option value="all">{isTr ? 'Tüm Süreler (2-9 Gün)' : 'All Durations (2-9 Days)'}</option>
              <option value="2">2 {isTr ? 'Günlük Turlar' : 'Days Tour'}</option>
              <option value="3">3 {isTr ? 'Günlük Turlar' : 'Days Tour'}</option>
              <option value="4">4 {isTr ? 'Günlük Turlar' : 'Days Tour'}</option>
              <option value="5">5 {isTr ? 'Günlük Turlar' : 'Days Tour'}</option>
              <option value="6">6 {isTr ? 'Günlük Turlar' : 'Days Tour'}</option>
              <option value="7">7 {isTr ? 'Günlük Turlar' : 'Days Tour'}</option>
              <option value="8">8 {isTr ? 'Günlük Turlar' : 'Days Tour'}</option>
              <option value="9">9 {isTr ? 'Günlük Turlar' : 'Days Tour'}</option>
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
          <span className="font-semibold text-slate-700">
            {isTr
              ? `${filteredTours.length} adet paket listeleniyor`
              : `Showing ${filteredTours.length} signature tour packages`}
            {currentDurationMeta && (
              <span className="text-[#009999] ml-1.5 font-bold">
                ({currentDurationMeta.days} {isTr ? 'Günlük' : 'Days'})
              </span>
            )}
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
              {isTr ? 'Bu gün sayısında tur bulunamadı' : 'No tours found for this duration'}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {isTr
                ? 'Filtrelerinizi temizleyebilir veya dilediğiniz gün sayısında size özel tur planlamamız için Kişiye Özel Tur formunu doldurabilirsiniz.'
                : 'Try viewing all tours, or request a custom itinerary for this exact duration with our Bespoke Trip Planner.'}
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={resetAllFilters}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                {isTr ? 'Tüm Turları Göster' : 'View All Tours'}
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
        <div className="mt-20 rounded-3xl bg-gradient-to-r from-[#007373] via-[#008b8f] to-[#006a6e] text-white p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 border border-[#009999]/40">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#5ce6e6] uppercase">
              <Compass className="w-4 h-4" />
              <span>{isTr ? 'KİŞİYE ÖZEL TUR PLANI' : 'CUSTOM ITINERARY'}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white">
              {isTr ? 'Farklı Bir Gün Sayısı Mı İstiyorsunuz?' : 'Need a Specific Number of Days?'}
            </h3>
            <p className="text-teal-100/90 text-xs sm:text-sm leading-relaxed font-light">
              {isTr
                ? '1 günden 15 güne kadar dilediğiniz rotayı, ilgi alanlarınızı ve konaklama tercihlerinizi bize iletin, size özel 24 saat içinde program hazırlayalım.'
                : 'From express day trips to 15-day grand expeditions, tell us your dates and dream sights. We will craft a bespoke itinerary just for you.'}
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
