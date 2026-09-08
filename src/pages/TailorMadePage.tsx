import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Language } from '../types';
import {
  Sparkles,
  MapPin,
  Calendar,
  Users,
  CheckCircle2,
  MessageSquare,
  Building,
  Heart,
  Camera,
  Compass,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Send,
  PhoneCall,
  Clock,
  Award,
} from 'lucide-react';

interface TailorMadePageProps {
  language: Language;
}

export const TailorMadePage: React.FC<TailorMadePageProps> = ({ language }) => {
  const isTr = language === 'tr';

  const [step, setStep] = useState<number>(1);
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([
    'cappadocia',
    'istanbul',
  ]);
  const [duration, setDuration] = useState<string>('5-7');
  const [hotelTier, setHotelTier] = useState<string>('boutique-cave');
  const [travelers, setTravelers] = useState<number>(2);
  const [travelMonth, setTravelMonth] = useState<string>('May 2026');
  const [specialInterests, setSpecialInterests] = useState<string[]>([
    'ballooning',
    'history',
  ]);
  const [contactName, setContactName] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [specialNotes, setSpecialNotes] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const toggleDestination = (id: string) => {
    if (selectedDestinations.includes(id)) {
      if (selectedDestinations.length > 1) {
        setSelectedDestinations(selectedDestinations.filter((d) => d !== id));
      }
    } else {
      setSelectedDestinations([...selectedDestinations, id]);
    }
  };

  const toggleInterest = (id: string) => {
    if (specialInterests.includes(id)) {
      setSpecialInterests(specialInterests.filter((i) => i !== id));
    } else {
      setSpecialInterests([...specialInterests, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const openWhatsAppInquiry = () => {
    const text = isTr
      ? `Merhaba Voyra Tours! Kişiye özel seyahat planı oluşturmak istiyorum.%0A%0Aİsim: ${contactName}%0ABölgeler: ${selectedDestinations.join(', ')}%0ASüre: ${duration} gün%0AÖzel Notlar: ${specialNotes}`
      : `Hello Voyra Tours! I would like to design a tailor-made private Turkey itinerary.%0A%0AName: ${contactName}%0ARegions: ${selectedDestinations.join(', ')}%0ADuration: ${duration} days%0ANotes: ${specialNotes}`;
    window.open(`https://wa.me/905321234567?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#f8fbfb] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#004d53] to-[#003c41] text-white pt-12 pb-16 px-4 sm:px-8 border-b border-[#009999]/40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-teal-200/80 mb-6 font-medium">
            <Link to="/" className="hover:text-white transition">
              {isTr ? 'Ana Sayfa' : 'Home'}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-teal-400" />
            <span className="text-white font-semibold">
              {isTr ? 'Kişiye Özel VIP Tur' : 'Tailor-Made Trip VIP'}
            </span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[#5ce6e6] text-xs font-bold uppercase tracking-wider mb-4 border border-white/25">
              <Sparkles className="w-3.5 h-3.5 text-[#5ce6e6]" />
              <span>{isTr ? 'KİŞİYE ÖZEL BUTİK SEYAHAT' : 'BESPOKE TRAVEL DESIGN'}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-white mb-4 tracking-tight leading-tight">
              {isTr ? 'Size Özel Türkiye Rotası Tasarlayın' : 'Design Your Custom Turkey Journey'}
            </h1>
            <p className="text-teal-100/90 text-sm sm:text-base leading-relaxed font-light">
              {isTr
                ? 'Standart tur programlarına bağlı kalmayın. İlgi alanlarınıza, temponuza ve tercihlerinize göre gün gün şekillenen 100% size özel butik bir rota hazırlıyoruz.'
                : 'Skip rigid bus tour schedules. Tell us your travel dreams, preferred pace, and boutique style. Our senior travel designers will craft your private itinerary within 24 hours.'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 -mt-6">
        {/* Trust Badges */}
        <div className="bg-white rounded-2xl p-4 shadow-md border border-slate-200/80 mb-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div className="p-2">
            <Clock className="w-5 h-5 text-[#009999] mx-auto mb-1" />
            <span className="block text-xs font-bold text-slate-800">
              {isTr ? '24 Saat İçinde Teklif' : '24h Fast Proposal'}
            </span>
            <span className="text-[11px] text-slate-500">
              {isTr ? 'Detaylı fiyat ve rota' : 'Comprehensive route plan'}
            </span>
          </div>
          <div className="p-2">
            <ShieldCheck className="w-5 h-5 text-[#009999] mx-auto mb-1" />
            <span className="block text-xs font-bold text-slate-800">
              {isTr ? 'TÜRSAB A Grubu Güvencesi' : 'TÜRSAB Licensed'}
            </span>
            <span className="text-[11px] text-slate-500">
              {isTr ? 'Kayıt No: 12480' : 'License #12480'}
            </span>
          </div>
          <div className="p-2">
            <Award className="w-5 h-5 text-[#009999] mx-auto mb-1" />
            <span className="block text-xs font-bold text-slate-800">
              {isTr ? '100% Size Özel' : '100% Customizable'}
            </span>
            <span className="text-[11px] text-slate-500">
              {isTr ? 'Sıfır zorunlu mağaza' : 'Zero tourist traps'}
            </span>
          </div>
          <div className="p-2">
            <PhoneCall className="w-5 h-5 text-[#009999] mx-auto mb-1" />
            <span className="block text-xs font-bold text-slate-800">
              {isTr ? '24/7 Seyahat Asistanı' : '24/7 Dedicated Concierge'}
            </span>
            <span className="text-[11px] text-slate-500">
              {isTr ? 'Seyahat boyunca yanınızda' : 'Direct WhatsApp line'}
            </span>
          </div>
        </div>

        {/* Step Navigation Progress */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200">
          {!isSubmitted ? (
            <div>
              {/* Stepper Header */}
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#009999] text-white font-bold text-xs flex items-center justify-center">
                    {step}
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 font-serif-luxury">
                      {step === 1 && (isTr ? '1. Adım: Bölgeler & Süre' : 'Step 1: Regions & Duration')}
                      {step === 2 && (isTr ? '2. Adım: Konaklama & İlgi Alanları' : 'Step 2: Style & Special Interests')}
                      {step === 3 && (isTr ? '3. Adım: İletişim & Özel İstekler' : 'Step 3: Contact & Special Notes')}
                    </h2>
                    <span className="text-xs text-slate-400">
                      {isTr ? 'Toplam 3 Adım • Yaklaşık 1 dakika' : '3 simple steps • Takes 1 minute'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {[1, 2, 3].map((num) => (
                    <button
                      key={num}
                      onClick={() => setStep(num)}
                      className={`w-3 h-3 rounded-full transition cursor-pointer ${
                        step === num
                          ? 'bg-[#009999] ring-4 ring-[#009999]/20'
                          : num < step
                          ? 'bg-[#009999]'
                          : 'bg-slate-200'
                      }`}
                      aria-label={`Step ${num}`}
                    />
                  ))}
                </div>
              </div>

              {/* Step 1 Content */}
              {step === 1 && (
                <div className="space-y-8">
                  {/* Select Destinations */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#009999]" />
                      <span>{isTr ? 'Gezmek İstediğiniz Bölgeler' : 'Destinations You Wish to Explore'}</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'cappadocia', label: isTr ? 'Kapadokya' : 'Cappadocia' },
                        { id: 'istanbul', label: isTr ? 'İstanbul' : 'Istanbul' },
                        { id: 'ephesus', label: isTr ? 'Efes & Şirince' : 'Ephesus & Sirince' },
                        { id: 'pamukkale', label: isTr ? 'Pamukkale Travertenleri' : 'Pamukkale Terraces' },
                        { id: 'antalya', label: isTr ? 'Antalya & Kaş' : 'Antalya & Kas' },
                        { id: 'gallipoli', label: isTr ? 'Çanakkale & Truva' : 'Gallipoli & Troy' },
                      ].map((dest) => (
                        <button
                          key={dest.id}
                          type="button"
                          onClick={() => toggleDestination(dest.id)}
                          className={`p-4 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between ${
                            selectedDestinations.includes(dest.id)
                              ? 'border-[#009999] bg-[#e6f8f8] text-[#009999] font-bold shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 text-slate-700 font-medium'
                          }`}
                        >
                          <span className="text-xs sm:text-sm">{dest.label}</span>
                          {selectedDestinations.includes(dest.id) && (
                            <CheckCircle2 className="w-4 h-4 text-[#009999] shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Trip Duration & Guest Count */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-[#009999]" />
                        <span>{isTr ? 'Tahmini Tur Süresi' : 'Estimated Trip Duration'}</span>
                      </label>
                      <select
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#009999] cursor-pointer"
                      >
                        <option value="2-3">2 - 3 {isTr ? 'Gün (Hafta Sonu / Kısa Kaçamak)' : 'Days (Short Getaway)'}</option>
                        <option value="4-5">4 - 5 {isTr ? 'Gün (Klasik Rota)' : 'Days (Classic Highlights)'}</option>
                        <option value="5-7">5 - 7 {isTr ? 'Gün (İdeal Türkiye Turu)' : 'Days (Ideal Grand Loop)'}</option>
                        <option value="8-10">8 - 10 {isTr ? 'Gün (Kapsamlı Rota)' : 'Days (Comprehensive Discovery)'}</option>
                        <option value="10+">10+ {isTr ? 'Gün (Derinlemesine Seyahat)' : 'Days (In-Depth Expedition)'}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-[#009999]" />
                        <span>{isTr ? 'Misafir Sayısı' : 'Number of Travelers'}</span>
                      </label>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setTravelers(Math.max(1, travelers - 1))}
                          className="w-12 h-12 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-base cursor-pointer"
                        >
                          -
                        </button>
                        <span className="flex-1 text-center font-bold text-slate-900 text-base py-3 bg-slate-50 border border-slate-200 rounded-xl">
                          {travelers} {isTr ? 'Kişi' : travelers === 1 ? 'Traveler' : 'Travelers'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setTravelers(travelers + 1)}
                          className="w-12 h-12 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-base cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-8 py-3.5 rounded-xl bg-[#009999] hover:bg-[#008080] text-white font-bold text-xs tracking-wider transition flex items-center gap-2 shadow-md shadow-[#009999]/25 cursor-pointer"
                    >
                      <span>{isTr ? 'Devam Et: Stil & İstekler' : 'Next: Style & Interests'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2 Content */}
              {step === 2 && (
                <div className="space-y-8">
                  {/* Hotel Tier */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                      <Building className="w-4 h-4 text-[#009999]" />
                      <span>{isTr ? 'Konaklama Tercihiniz' : 'Hotel Style Preference'}</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        {
                          id: 'boutique-cave',
                          title: isTr ? 'Butik Mağara & Tarihi Konak' : 'Boutique Cave & Heritage',
                          desc: isTr ? 'Karakteristik, otantik ve şık taş odalar' : 'Charming, authentic stone & cave suites',
                        },
                        {
                          id: 'luxury-5star',
                          title: isTr ? '5 Yıldızlı Uluslararası Lüks' : '5-Star Ultra Luxury',
                          desc: isTr ? 'Kusursuz servis, spa ve premium olanaklar' : 'Premier luxury resorts and renowned hotels',
                        },
                        {
                          id: 'mix',
                          title: isTr ? 'Dengeli & Özel Seçim' : 'Curated Mix',
                          desc: isTr ? 'Her şehirde en iyi yerel deneyim' : 'Best boutique highlights per region',
                        },
                      ].map((tier) => (
                        <button
                          key={tier.id}
                          type="button"
                          onClick={() => setHotelTier(tier.id)}
                          className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                            hotelTier === tier.id
                              ? 'border-[#009999] bg-[#e6f8f8] text-slate-900 shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <div>
                            <span className="block text-xs sm:text-sm font-bold text-slate-900 mb-1">
                              {tier.title}
                            </span>
                            <span className="text-[11px] text-slate-500">{tier.desc}</span>
                          </div>
                          {hotelTier === tier.id && (
                            <div className="mt-3 flex items-center gap-1 text-[11px] text-[#009999] font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{isTr ? 'Seçildi' : 'Selected'}</span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Special Interests */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                      <Heart className="w-4 h-4 text-[#009999]" />
                      <span>{isTr ? 'Özel İlgi Alanları & Deneyimler' : 'Special Experiences & Interests'}</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'ballooning', label: isTr ? 'Balon Uçuşu (Garantili)' : 'Hot Air Balloon Flight' },
                        { id: 'history', label: isTr ? 'Arkeoloji & Tarihçi Rehber' : 'Historian Guided Sightseeing' },
                        { id: 'yacht', label: isTr ? 'Özel Boğaz / Akdeniz Yat Turu' : 'Private Yacht Cruise' },
                        { id: 'culinary', label: isTr ? 'Şarap Tadımı & Yerel Lezzetler' : 'Wine Tasting & Fine Dining' },
                        { id: 'photography', label: isTr ? 'Gün Batımı & Fotoğraf Rotaları' : 'Sunset & Photography Spots' },
                        { id: 'hammam', label: isTr ? 'Geleneksel Tarihi Türk Hamamı' : 'Historic Turkish Bath & Spa' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleInterest(item.id)}
                          className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                            specialInterests.includes(item.id)
                              ? 'border-[#009999] bg-[#e6f8f8] text-[#009999] font-bold shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 text-slate-700 font-medium'
                          }`}
                        >
                          <span className="text-xs">{item.label}</span>
                          {specialInterests.includes(item.id) && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#009999] shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 flex items-center justify-between border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-6 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs cursor-pointer"
                    >
                      {isTr ? 'Geri Dön' : 'Back'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-8 py-3.5 rounded-xl bg-[#009999] hover:bg-[#008080] text-white font-bold text-xs tracking-wider transition flex items-center gap-2 shadow-md shadow-[#009999]/25 cursor-pointer"
                    >
                      <span>{isTr ? 'Son Adım: İletişim' : 'Next: Contact Details'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3 Content */}
              {step === 3 && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {isTr ? 'Adınız & Soyadınız *' : 'Full Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="e.g. Alexander Mitchell"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-[#009999] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {isTr ? 'E-posta Adresiniz *' : 'Email Address *'}
                      </label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="alex@example.com"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-[#009999] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {isTr ? 'Telefon / WhatsApp Numarası' : 'Phone / WhatsApp Number'}
                      </label>
                      <input
                        type="tel"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="+1 555 123 4567"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-[#009999] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {isTr ? 'Tahmini Seyahat Ayı / Tarihleri' : 'Estimated Travel Dates'}
                      </label>
                      <input
                        type="text"
                        value={travelMonth}
                        onChange={(e) => setTravelMonth(e.target.value)}
                        placeholder="e.g. May 2026 or October 12-20"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-[#009999] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {isTr ? 'Ek Notlar veya Özel İstekleriniz' : 'Special Wishes, Dietary Preferences or Requests'}
                    </label>
                    <textarea
                      rows={3}
                      value={specialNotes}
                      onChange={(e) => setSpecialNotes(e.target.value)}
                      placeholder={
                        isTr
                          ? 'Balayı kutlaması, çocuklu aile transferi, vejetaryen menü veya belirli bir otel tercihi...'
                          : 'Honeymoon surprise, child seats needed, vegetarian meals, or specific hotel preferences...'
                      }
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-[#009999] focus:outline-none resize-none"
                    />
                  </div>

                  <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs cursor-pointer"
                    >
                      {isTr ? 'Geri Dön' : 'Back'}
                    </button>

                    <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3">
                      <button
                        type="button"
                        onClick={openWhatsAppInquiry}
                        className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-wider transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>{isTr ? 'WhatsApp ile Hemen İlet' : 'Send via WhatsApp'}</span>
                      </button>

                      <button
                        type="submit"
                        className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#009999] hover:bg-[#008080] text-white font-bold text-xs tracking-wider transition flex items-center justify-center gap-2 shadow-md shadow-[#009999]/25 cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                        <span>{isTr ? 'Talebi Gönder' : 'Submit Custom Request'}</span>
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div className="text-center py-12 space-y-5">
              <div className="w-16 h-16 rounded-full bg-[#e6f8f8] text-[#009999] flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-slate-900">
                {isTr ? 'Talebiniz Başarıyla Alındı!' : 'Your Bespoke Request Has Been Received!'}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
                {isTr
                  ? `Sayın ${contactName || 'Misafirimiz'}, Türkiye seyahat uzmanlarımız belirttiğiniz tarihler ve tercihler doğrultusunda özel programınızı hazırlamaya başladı. 24 saat içinde detaylı teklifimizle iletişime geçeceğiz.`
                  : `Dear ${contactName || 'Traveler'}, our senior Turkey travel designers have started crafting your private journey based on your selected highlights. We will contact you with a full itinerary proposal within 24 hours.`}
              </p>
              <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={openWhatsAppInquiry}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold tracking-wider flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{isTr ? 'Hemen WhatsApp’tan Yazışın' : 'Chat Instantly on WhatsApp'}</span>
                </button>
                <Link
                  to="/tours"
                  className="px-6 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  {isTr ? 'Diğer Turları İncele' : 'Browse Standard Packages'}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
