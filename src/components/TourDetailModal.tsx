import React, { useState } from 'react';
import {
  X,
  Star,
  Clock,
  MapPin,
  Users,
  Plane,
  Check,
  Calendar,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Share2,
  CheckCircle2,
} from 'lucide-react';
import { Currency, Language, TourPackage } from '../types';
import { formatPrice } from '../utils/currency';

interface TourDetailModalProps {
  tour: TourPackage | null;
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  currency: Currency;
}

export const TourDetailModal: React.FC<TourDetailModalProps> = ({
  tour,
  isOpen,
  onClose,
  language,
  currency,
}) => {
  if (!isOpen || !tour) return null;

  const isTr = language === 'tr';
  const title = isTr ? tour.titleTr : tour.title;
  const overview = isTr ? tour.overviewTr : tour.overview;
  const destination = isTr ? tour.destinationTr : tour.destination;
  const highlights = isTr ? tour.highlightsTr : tour.highlights;
  const included = isTr ? tour.includedTr : tour.included;
  const excluded = isTr ? tour.excludedTr : tour.excluded;
  const hotelType = isTr ? tour.hotelTypeTr : tour.hotelType;
  const departure = isTr ? tour.departureTr : tour.departure;
  const importantInfo = isTr ? (tour.importantInfoTr || tour.importantInfo) : tour.importantInfo;
  const travelRecommendations = isTr ? (tour.travelRecommendationsTr || tour.travelRecommendations) : tour.travelRecommendations;

  // Gallery state
  const [selectedImage, setSelectedImage] = useState<string>(tour.heroImage);
  const [expandedDay, setExpandedDay] = useState<number>(1);

  // Booking Calculator state
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [travelDate, setTravelDate] = useState<string>('2026-05-15');
  const [tourTier, setTourTier] = useState<'group' | 'private'>('group');
  const [addBalloon, setAddBalloon] = useState<boolean>(false);
  const [travelerName, setTravelerName] = useState<string>('');
  const [travelerEmail, setTravelerEmail] = useState<string>('');
  const [travelerPhone, setTravelerPhone] = useState<string>('');
  const [specialNotes, setSpecialNotes] = useState<string>('');
  const [inquirySubmitted, setInquirySubmitted] = useState<boolean>(false);

  // Pricing math
  const basePriceEUR = tour.priceEUR;
  const privateTierMultiplier = 1.35; // +35% for private VIP guide & private Mercedes van
  const effectiveBasePerPerson = tourTier === 'private' ? Math.round(basePriceEUR * privateTierMultiplier) : basePriceEUR;
  const balloonPriceEUR = tour.region === 'cappadocia' || tour.region === 'multi-region' ? 240 : 0;

  const totalAdultsCost = adults * effectiveBasePerPerson;
  const totalChildrenCost = children * Math.round(effectiveBasePerPerson * 0.7); // 30% discount for children
  const totalBalloonCost = addBalloon ? (adults + children) * balloonPriceEUR : 0;
  const totalCostEUR = totalAdultsCost + totalChildrenCost + totalBalloonCost;

  const t = {
    en: {
      days: 'Days',
      nights: 'Nights',
      overview: 'Tour Overview',
      itinerary: 'Detailed Daily Itinerary',
      highlights: 'Tour Highlights',
      includedTitle: 'What is Included',
      excludedTitle: 'What is Not Included',
      bookingTitle: 'Instant Booking & Inquiry',
      departureDate: 'Desired Departure Date',
      guests: 'Travelers',
      adultsLabel: 'Adults (12+ yrs)',
      childrenLabel: 'Children (3-11 yrs)',
      tourFormat: 'Tour Format',
      groupOption: 'Small Boutique Group',
      privateOption: 'Private VIP Departure (+35%)',
      balloonAddon: 'Add Sunrise Hot Air Balloon Flight',
      balloonSubtext: 'Guaranteed basket slot with champagne toast & flight certificate (+€240/pp)',
      totalEstimate: 'Estimated Total',
      perPersonAvg: 'average per person',
      fullName: 'Full Name',
      email: 'Email Address',
      phone: 'Phone / WhatsApp',
      specialRequests: 'Special Requests / Dietary / Hotel preferences',
      submitBtn: 'Send Booking Inquiry',
      whatsappBtn: 'Reserve via WhatsApp',
      inquirySuccessTitle: 'Inquiry Received!',
      inquirySuccessDesc: 'Our senior Turkey travel concierge will review your preferred dates and reply with availability & confirmation within 2 hours.',
      close: 'Close',
      tursabGuarantee: '100% Guaranteed Departures • TÜRSAB Member A-Grade License',
      needHelp: 'Questions? Speak with an Istanbul Destination Expert',
    },
    tr: {
      days: 'Gün',
      nights: 'Gece',
      overview: 'Tur Genel Bakışı',
      itinerary: 'Gün Gün Detaylı Program',
      highlights: 'Öne Çıkan Ayrıcalıklar',
      includedTitle: 'Fiyata Dahil Olanlar',
      excludedTitle: 'Fiyata Dahil Olmayanlar',
      bookingTitle: 'Hızlı Rezervasyon & Fiyat Hesaplama',
      departureDate: 'Tercih Edilen Başlangıç Tarihi',
      guests: 'Misafir Sayısı',
      adultsLabel: 'Yetişkin (12+ yaş)',
      childrenLabel: 'Çocuk (3-11 yaş)',
      tourFormat: 'Tur Formatı',
      groupOption: 'Butik Küçük Grup',
      privateOption: 'Özel VIP Tur (+%35)',
      balloonAddon: 'Kapadokya Gün Doğumu Balon Uçuşu Ekle',
      balloonSubtext: 'Öncelikli sepet garantisi, şampanya kutlaması ve sertifika (+€240/kişi)',
      totalEstimate: 'Tahmini Toplam Tutar',
      perPersonAvg: 'kişi başı ortalama',
      fullName: 'Adınız Soyadınız',
      email: 'E-posta Adresiniz',
      phone: 'Telefon / WhatsApp',
      specialRequests: 'Özel İstekler / Diyet / Otel Tercihi',
      submitBtn: 'Rezervasyon Talebi Gönder',
      whatsappBtn: 'WhatsApp ile Hızlı Bağlan',
      inquirySuccessTitle: 'Talebiniz Alındı!',
      inquirySuccessDesc: 'Uzman seyahat danışmanımız müsaitlik durumunu inceleyip en geç 2 saat içinde sizinle iletişime geçecektir.',
      close: 'Kapat',
      tursabGuarantee: 'Kesin Hareket Garantisi • TÜRSAB A-Grubu Seyahat Acentesi Güvencesi',
      needHelp: 'Sorularınız mı var? İstanbul merkez ofisimizle görüşün',
    },
  }[language];

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySubmitted(true);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Voyra Tours, I would like to inquire about booking:
Tour: ${tour.title}
Date: ${travelDate}
Travelers: ${adults} Adults, ${children} Children
Tour Format: ${tourTier === 'private' ? 'Private VIP' : 'Small Group'}
${addBalloon ? 'Includes Hot Air Balloon Flight add-on: Yes' : ''}
Estimated Total: ${formatPrice(totalCostEUR, currency)}
Client Name: ${travelerName || 'Guest'}
Phone: ${travelerPhone || 'Not provided'}
Could you please confirm availability and provide details?`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      <div className="relative bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Sticky Modal Top Bar */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-md bg-[#e6f8f8] text-[#0d9695] text-xs font-semibold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#12bbba]" />
              <span>{destination}</span>
            </span>
            <span className="hidden sm:inline-block text-stone-300">|</span>
            <div className="hidden sm:flex items-center gap-1 text-xs text-stone-600">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-stone-900">{tour.rating}</span>
              <span>({tour.reviewsCount} reviews)</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-900 transition cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
          {/* Main Title & Gallery */}
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-luxury font-bold text-stone-900 mb-3 leading-tight">
              {title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-stone-600 mb-6">
              <span className="flex items-center gap-1 bg-[#f0fbfb] px-3 py-1.5 rounded-lg border border-[#d6eeee]">
                <Clock className="w-4 h-4 text-[#12bbba]" />
                <span>
                  {tour.durationDays} {t.days} / {tour.durationNights} {t.nights}
                </span>
              </span>
              <span className="flex items-center gap-1 bg-[#f0fbfb] px-3 py-1.5 rounded-lg border border-[#d6eeee]">
                <Users className="w-4 h-4 text-[#12bbba]" />
                <span>{isTr ? tour.groupTypeTr : tour.groupType}</span>
              </span>
              <span className="flex items-center gap-1 bg-[#f0fbfb] px-3 py-1.5 rounded-lg border border-[#d6eeee]">
                <Plane className="w-4 h-4 text-[#12bbba]" />
                <span>{departure}</span>
              </span>
            </div>

            {/* Gallery: Hero Image + Thumbnails */}
            <div className="space-y-3">
              <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden bg-stone-100 shadow-sm">
                <img
                  src={selectedImage}
                  alt={title}
                  className="w-full h-full object-cover transition-all duration-500"
                />
              </div>
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {tour.galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition cursor-pointer ${
                      selectedImage === img ? 'border-[#12bbba] ring-2 ring-[#12bbba]/30' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Two-Column Details & Interactive Calculator */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Columns: Overview, Highlights, Day Itinerary, Inclusions */}
            <div className="lg:col-span-2 space-y-8">
              {/* Tour Overview */}
              <div>
                <h3 className="text-xl font-serif-luxury font-bold text-stone-900 mb-3">
                  {t.overview}
                </h3>
                <p className="text-stone-700 leading-relaxed text-sm sm:text-base">
                  {overview}
                </p>
              </div>

              {/* Highlights */}
              <div className="bg-[#f0fbfb] border border-[#c3eeee] rounded-2xl p-5">
                <h3 className="text-base font-bold text-[#0d9695] font-serif-luxury mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#12bbba]" />
                  <span>{t.highlights}</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-stone-800">
                      <Check className="w-4 h-4 text-[#12bbba] shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Day-by-Day Interactive Accordion Itinerary */}
              <div>
                <h3 className="text-xl font-serif-luxury font-bold text-stone-900 mb-4">
                  {t.itinerary}
                </h3>
                <div className="space-y-3">
                  {tour.itinerary.map((day) => {
                    const isExpanded = expandedDay === day.day;
                    const dayTitle = isTr ? day.titleTr : day.title;
                    const dayDesc = isTr ? day.descriptionTr : day.description;
                    const dayMeals = isTr ? day.mealsTr : day.meals;
                    const dayHighlights = isTr ? day.highlightsTr : day.highlights;
                    const dayOvernight = isTr ? day.overnightTr : day.overnight;

                    return (
                      <div
                        key={day.day}
                        className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
                          isExpanded
                            ? 'border-[#12bbba]/60 bg-[#f8fcfc] shadow-xs'
                            : 'border-stone-200 hover:border-stone-300 bg-white'
                        }`}
                      >
                        <button
                          onClick={() => setExpandedDay(isExpanded ? 0 : day.day)}
                          className="w-full px-5 py-4 flex items-center justify-between text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-xl bg-slate-900 text-[#12bbba] font-bold text-xs flex items-center justify-center shrink-0">
                              D{day.day}
                            </span>
                            <span className="font-semibold text-stone-900 text-sm sm:text-base">
                              {dayTitle}
                            </span>
                          </div>
                          <span className="text-stone-400">
                            {isExpanded ? <ChevronUp className="w-5 h-5 text-[#12bbba]" /> : <ChevronDown className="w-5 h-5" />}
                          </span>
                        </button>

                        {isExpanded && (
                          <div className="px-5 pb-5 pt-1 space-y-3 text-xs sm:text-sm border-t border-[#d8f4f4] text-stone-700">
                            <p className="leading-relaxed">{dayDesc}</p>
                            
                            {/* Day tags */}
                            <div className="flex flex-wrap items-center gap-2 pt-2">
                              {dayHighlights.map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="bg-white border border-stone-200 px-2.5 py-1 rounded-md text-[11px] text-stone-600 font-medium"
                                >
                                  • {tag}
                                </span>
                              ))}
                            </div>

                            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-500">
                              <div>
                                <span className="font-semibold text-stone-700">
                                  {isTr ? 'Öğünler:' : 'Meals:'}
                                </span>{' '}
                                {dayMeals.join(', ')}
                              </div>
                              <div>
                                <span className="font-semibold text-stone-700">
                                  {isTr ? 'Konaklama:' : 'Overnight:'}
                                </span>{' '}
                                {dayOvernight}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Inclusions & Exclusions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="bg-emerald-50/60 border border-emerald-200/60 rounded-2xl p-5">
                  <h4 className="font-bold text-emerald-950 font-serif-luxury text-base mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{t.includedTitle}</span>
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-stone-700">
                    {included.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-rose-50/50 border border-rose-200/50 rounded-2xl p-5">
                  <h4 className="font-bold text-rose-950 font-serif-luxury text-base mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>{t.excludedTitle}</span>
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-stone-700">
                    {excluded.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <X className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Important Info / Optional Experiences Section */}
              {importantInfo && (
                <div className="bg-amber-50/70 border border-amber-200/70 rounded-2xl p-5">
                  <h4 className="font-bold text-amber-950 font-serif-luxury text-base mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>{isTr ? 'Önemli Bilgiler & Opsiyonel Deneyimler' : 'Important Information & Optional Experiences'}</span>
                  </h4>
                  <p className="text-stone-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                    {importantInfo}
                  </p>
                </div>
              )}

              {/* Travel Recommendations Section */}
              {travelRecommendations && travelRecommendations.length > 0 && (
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5">
                  <h4 className="font-bold text-stone-900 font-serif-luxury text-base mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#12bbba]" />
                    <span>{isTr ? 'Seyahat & Konfor Önerileri' : 'Travel Recommendations'}</span>
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-stone-700">
                    {travelRecommendations.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#12bbba] font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Column: Interactive Booking Calculator & Instant Quote */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 bg-stone-50 border border-stone-200/90 rounded-3xl p-6 shadow-sm space-y-6">
                <div>
                  <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold block">
                    {t.bookingTitle}
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-bold font-serif-luxury text-stone-900">
                      {formatPrice(effectiveBasePerPerson, currency)}
                    </span>
                    <span className="text-xs text-stone-500">/ person</span>
                  </div>
                </div>

                {inquirySubmitted ? (
                  <div className="bg-emerald-100/70 border border-emerald-300 rounded-2xl p-5 text-center space-y-3">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                    <h4 className="font-bold text-emerald-950 text-base">{t.inquirySuccessTitle}</h4>
                    <p className="text-xs text-emerald-800 leading-relaxed">{t.inquirySuccessDesc}</p>
                    <a
                      href={`https://wa.me/905320000000?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{t.whatsappBtn}</span>
                    </a>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-4 text-xs">
                    {/* Date Picker */}
                    <div>
                      <label className="block text-stone-700 font-semibold mb-1">
                        {t.departureDate}
                      </label>
                      <input
                        type="date"
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-stone-800"
                        required
                      />
                    </div>

                    {/* Guests selector */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-stone-700 font-semibold mb-1">
                          {t.adultsLabel}
                        </label>
                        <div className="flex items-center border border-stone-300 bg-white rounded-xl overflow-hidden">
                          <button
                            type="button"
                            onClick={() => setAdults(Math.max(1, adults - 1))}
                            className="px-3 py-1.5 hover:bg-stone-100 font-bold text-stone-600"
                          >
                            -
                          </button>
                          <span className="flex-1 text-center font-bold text-stone-900">{adults}</span>
                          <button
                            type="button"
                            onClick={() => setAdults(adults + 1)}
                            className="px-3 py-1.5 hover:bg-stone-100 font-bold text-stone-600"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-stone-700 font-semibold mb-1">
                          {t.childrenLabel}
                        </label>
                        <div className="flex items-center border border-stone-300 bg-white rounded-xl overflow-hidden">
                          <button
                            type="button"
                            onClick={() => setChildren(Math.max(0, children - 1))}
                            className="px-3 py-1.5 hover:bg-stone-100 font-bold text-stone-600"
                          >
                            -
                          </button>
                          <span className="flex-1 text-center font-bold text-stone-900">{children}</span>
                          <button
                            type="button"
                            onClick={() => setChildren(children + 1)}
                            className="px-3 py-1.5 hover:bg-stone-100 font-bold text-stone-600"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Tour Tier (Group vs Private VIP) */}
                    <div>
                      <label className="block text-stone-700 font-semibold mb-1.5">
                        {t.tourFormat}
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setTourTier('group')}
                          className={`py-2 px-2 text-center rounded-xl border transition cursor-pointer ${
                            tourTier === 'group'
                              ? 'border-[#12bbba] bg-[#e6f8f8] text-[#0d9695] font-bold'
                              : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                          }`}
                        >
                          {t.groupOption}
                        </button>
                        <button
                          type="button"
                          onClick={() => setTourTier('private')}
                          className={`py-2 px-2 text-center rounded-xl border transition cursor-pointer ${
                            tourTier === 'private'
                              ? 'border-[#12bbba] bg-[#e6f8f8] text-[#0d9695] font-bold'
                              : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                          }`}
                        >
                          {t.privateOption}
                        </button>
                      </div>
                    </div>

                    {/* Optional Balloon Addon for Cappadocia */}
                    {(tour.region === 'cappadocia' || tour.region === 'multi-region') && (
                      <label className="flex items-start gap-2.5 p-3 rounded-xl bg-[#e6f8f8]/60 border border-[#bcebeb] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={addBalloon}
                          onChange={(e) => setAddBalloon(e.target.checked)}
                          className="mt-0.5 accent-[#12bbba] w-4 h-4 rounded cursor-pointer"
                        />
                        <div>
                          <span className="font-bold text-stone-900 block">{t.balloonAddon}</span>
                          <span className="text-[11px] text-stone-600 block">{t.balloonSubtext}</span>
                        </div>
                      </label>
                    )}

                    {/* Total Estimated Cost Box */}
                    <div className="p-3.5 bg-slate-900 text-white rounded-2xl flex items-center justify-between shadow-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                          {t.totalEstimate}
                        </span>
                        <span className="text-2xl font-bold font-serif-luxury text-[#12bbba]">
                          {formatPrice(totalCostEUR, currency)}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-300 text-right">
                        {adults + children} {isTr ? 'kişi için' : 'total guests'}
                      </span>
                    </div>

                    {/* Traveler Details */}
                    <div className="space-y-2.5 pt-2 border-t border-stone-200">
                      <div>
                        <input
                          type="text"
                          placeholder={t.fullName}
                          value={travelerName}
                          onChange={(e) => setTravelerName(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#12bbba] text-stone-900"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="email"
                          placeholder={t.email}
                          value={travelerEmail}
                          onChange={(e) => setTravelerEmail(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#12bbba] text-stone-900"
                          required
                        />
                        <input
                          type="tel"
                          placeholder={t.phone}
                          value={travelerPhone}
                          onChange={(e) => setTravelerPhone(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#12bbba] text-stone-900"
                          required
                        />
                      </div>
                      <textarea
                        rows={2}
                        placeholder={t.specialRequests}
                        value={specialNotes}
                        onChange={(e) => setSpecialNotes(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#12bbba] text-stone-900 text-xs"
                      />
                    </div>

                    {/* Actions */}
                    <div className="space-y-2 pt-2">
                      <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-[#12bbba] hover:bg-[#0fa8a7] text-white font-bold text-xs tracking-wider transition shadow-md shadow-[#12bbba]/25 cursor-pointer"
                      >
                        {t.submitBtn}
                      </button>

                      <a
                        href={`https://wa.me/905320000000?text=${whatsappMessage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow-xs"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>{t.whatsappBtn}</span>
                      </a>
                    </div>
                  </form>
                )}

                {/* Trust Footer */}
                <div className="pt-2 text-[11px] text-stone-500 space-y-2 border-t border-stone-200">
                  <div className="flex items-center gap-2 text-stone-700 font-medium">
                    <ShieldCheck className="w-4 h-4 text-[#0d9695] shrink-0" />
                    <span>{t.tursabGuarantee}</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-600">
                    <HelpCircle className="w-4 h-4 text-[#12bbba] shrink-0" />
                    <span>{t.needHelp}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
