import React, { useState } from 'react';
import {
  X,
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
} from 'lucide-react';
import { Language } from '../types';

interface TailorMadePlannerProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const TailorMadePlanner: React.FC<TailorMadePlannerProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  if (!isOpen) return null;

  const isTr = language === 'tr';

  const [step, setStep] = useState<number>(1);
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([
    'cappadocia',
    'istanbul',
  ]);
  const [duration, setDuration] = useState<string>('5-7');
  const [hotelTier, setHotelTier] = useState<string>('boutique-cave');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'hot-air-balloon',
    'historical-archaeology',
  ]);
  const [guestCount, setGuestCount] = useState<number>(2);
  const [approxDate, setApproxDate] = useState<string>('2026-06-15');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
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
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== id));
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  const t = {
    en: {
      eyebrow: 'VOYRA BESPOKE SERVICE',
      title: 'Design Your Dream Turkey Journey',
      subtitle: 'Tell us where you wish to wander. Our Istanbul travel designers will craft a custom day-by-day itinerary tailored to your pace, style, and budget.',
      step1: '1. Destinations',
      step2: '2. Style & Dates',
      step3: '3. Contact Details',
      destQuestion: 'Which destinations do you want to explore?',
      durationQuestion: 'Preferred Trip Duration',
      hotelQuestion: 'Accommodation Preference',
      interestsQuestion: 'Special Interests & Experiences',
      nextBtn: 'Next Step',
      prevBtn: 'Back',
      submitBtn: 'Generate My Custom Itinerary',
      whatsappBtn: 'Discuss via WhatsApp Now',
      successTitle: 'Bespoke Trip Request Created!',
      successDesc: 'Our senior destination planner is now drafting your personalized day-by-day proposal with hotel options, private driver routes, and flight logistics.',
      close: 'Close',
    },
    tr: {
      eyebrow: 'VOYRA ÖZEL HİZMETİ',
      title: 'Kişiye Özel Hayalinizdeki Turu Tasarlayın',
      subtitle: 'Nereyi görmek istediğinizi seçin. İstanbul merkezli uzman tur tasarımcılarımız tarzınıza, bütçenize ve takviminize özel gün gün program hazırlasın.',
      step1: '1. Rotalar',
      step2: '2. Tarz & Tarihler',
      step3: '3. İletişim',
      destQuestion: 'Hangi destinasyonları ziyaret etmek istersiniz?',
      durationQuestion: 'Planladığınız Tur Süresi',
      hotelQuestion: 'Konaklama Tercihi',
      interestsQuestion: 'Özel İlgi Alanları & Deneyimler',
      nextBtn: 'Sonraki Adım',
      prevBtn: 'Geri',
      submitBtn: 'Özel Tur Programımı Hazırla',
      whatsappBtn: 'WhatsApp ile Anında Danış',
      successTitle: 'Özel Tur Talebiniz Hazırlandı!',
      successDesc: 'Kıdemli seyahat danışmanımız seçtiğiniz rotalara, butik otellere ve VIP transfer planına göre size özel teklifi hazırlıyor.',
      close: 'Kapat',
    },
  }[language];

  const destinationOptions = [
    { id: 'cappadocia', label: isTr ? 'Kapadokya (Peri Bacaları & Balon)' : 'Cappadocia (Cave Suites & Balloon)' },
    { id: 'istanbul', label: isTr ? 'İstanbul (Boğaz & Tarihi Yarımada)' : 'Istanbul (Old City & Bosphorus Yacht)' },
    { id: 'ephesus', label: isTr ? 'Efes & Meryem Ana Evi' : 'Ancient Ephesus & Virgin Mary House' },
    { id: 'pamukkale', label: isTr ? 'Pamukkale Travertenleri & Hierapolis' : 'Pamukkale Travertines & Thermal Pools' },
    { id: 'gallipoli', label: isTr ? 'Çanakkale Gelibolu & Truva' : 'Gallipoli Battlefields & Ancient Troy' },
    { id: 'antalya', label: isTr ? 'Antalya & Kaş & Kekova Batık Şehir' : 'Antalya, Kas & Sunken City Kekova' },
    { id: 'fethiye', label: isTr ? 'Fethiye Ölüdeniz & Likya Yolu' : 'Fethiye Blue Lagoon & Lycian Way' },
    { id: 'blacksea', label: isTr ? 'Karadeniz & Sümela Manastırı' : 'Black Sea Highlands & Sumela Monastery' },
  ];

  const interestOptions = [
    { id: 'hot-air-balloon', label: isTr ? 'Sıcak Hava Balon Uçuşu' : 'Sunrise Hot Air Balloon' },
    { id: 'historical-archaeology', label: isTr ? 'Tarih & Arkeoloji' : 'History & Ancient Sites' },
    { id: 'private-yacht', label: isTr ? 'Özel Yat Gezisi' : 'Private Bosphorus/Gulet Yacht' },
    { id: 'honeymoon', label: isTr ? 'Balayı & Romantizm' : 'Honeymoon & Romance' },
    { id: 'culinary', label: isTr ? 'Yöresel Gastronomi & Şarap' : 'Culinary & Wine Tasting' },
    { id: 'photography', label: isTr ? 'Fotoğrafçılık Noktaları' : 'Landscape & Photography' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const customSummaryMessage = encodeURIComponent(
    `Hello Voyra Tours, I would like to design a custom Turkey itinerary:
Destinations: ${selectedDestinations.join(', ')}
Duration: ${duration} Days
Travelers: ${guestCount} Guests
Approx Date: ${approxDate}
Hotel Tier: ${hotelTier}
Interests: ${selectedInterests.join(', ')}
Name: ${name || 'Guest'}
Phone: ${phone || 'Not provided'}
Special Notes: ${notes || 'None'}
Please reach out with a personalized proposal.`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0e2a2a] via-[#123636] to-[#0e2a2a] text-white px-6 sm:px-8 py-6 flex items-center justify-between border-b border-[#1f4a4a]">
          <div>
            <div className="flex items-center gap-2 text-[#42dedd] text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.eyebrow}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-white">
              {t.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white rounded-full hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step indicator */}
        {!isSubmitted && (
          <div className="bg-[#f0fbfb] px-6 sm:px-8 py-3 border-b border-[#d8f4f4] flex items-center justify-between text-xs font-semibold text-slate-600">
            <span className={step >= 1 ? 'text-[#0d9695] font-bold' : ''}>{t.step1}</span>
            <span className="text-slate-300">→</span>
            <span className={step >= 2 ? 'text-[#0d9695] font-bold' : ''}>{t.step2}</span>
            <span className="text-slate-300">→</span>
            <span className={step >= 3 ? 'text-[#0d9695] font-bold' : ''}>{t.step3}</span>
          </div>
        )}

        {/* Content */}
        <div className="p-6 sm:p-8">
          {isSubmitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-[#e6f8f8] text-[#0d9695] rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-2xl font-serif-luxury font-bold text-slate-900">
                {t.successTitle}
              </h3>
              <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                {t.successDesc}
              </p>

              <div className="pt-4 max-w-sm mx-auto space-y-3">
                <a
                  href={`https://wa.me/905320000000?text=${customSummaryMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{t.whatsappBtn}</span>
                </a>
                <button
                  onClick={onClose}
                  className="w-full py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm font-medium transition cursor-pointer"
                >
                  {t.close}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); setStep(step + 1); }}>
              {/* STEP 1: Destinations */}
              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <h4 className="font-bold text-base text-slate-900 mb-1">
                      {t.destQuestion}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {isTr ? 'Birden fazla yer seçebilirsiniz. Uçak ve araç bağlantılarını biz planlayacağız.' : 'Select one or more. We handle all domestic flights and VIP ground connections.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {destinationOptions.map((dest) => {
                      const isSelected = selectedDestinations.includes(dest.id);
                      return (
                        <button
                          key={dest.id}
                          type="button"
                          onClick={() => toggleDestination(dest.id)}
                          className={`p-3 text-left rounded-xl border text-xs font-medium transition flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'border-[#12bbba] bg-[#e6f8f8] text-[#0d9695] font-bold shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                          }`}
                        >
                          <span>{dest.label}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-[#12bbba] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-6 py-3 rounded-xl bg-[#12bbba] hover:bg-[#0fa8a7] text-white font-semibold text-xs transition flex items-center gap-2 shadow-sm shadow-[#12bbba]/20 cursor-pointer"
                    >
                      <span>{t.nextBtn}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Duration, Hotel & Interests */}
              {step === 2 && (
                <div className="space-y-6 text-xs">
                  {/* Duration */}
                  <div>
                    <label className="font-bold text-slate-900 block mb-2">
                      {t.durationQuestion}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['2-3', '4-6', '7+'].map((dur) => (
                        <button
                          key={dur}
                          type="button"
                          onClick={() => setDuration(dur)}
                          className={`py-2.5 px-3 rounded-xl border font-semibold text-center cursor-pointer ${
                            duration === dur
                              ? 'border-[#12bbba] bg-[#e6f8f8] text-[#0d9695] font-bold'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          {dur} {isTr ? 'Gün' : 'Days'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Hotel Tier */}
                  <div>
                    <label className="font-bold text-slate-900 block mb-2">
                      {t.hotelQuestion}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setHotelTier('boutique-cave')}
                        className={`p-3 rounded-xl border text-left cursor-pointer ${
                          hotelTier === 'boutique-cave'
                            ? 'border-[#12bbba] bg-[#e6f8f8] text-[#0d9695] font-bold'
                            : 'border-slate-200 bg-white text-slate-700'
                        }`}
                      >
                        <span className="font-bold block">{isTr ? 'Butik / Mağara Lüks' : 'Boutique & Cave Suites'}</span>
                        <span className="text-[11px] text-slate-500">{isTr ? 'Otantik ve seçkin' : 'Authentic luxury'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setHotelTier('5-star')}
                        className={`p-3 rounded-xl border text-left cursor-pointer ${
                          hotelTier === '5-star'
                            ? 'border-[#12bbba] bg-[#e6f8f8] text-[#0d9695] font-bold'
                            : 'border-slate-200 bg-white text-slate-700'
                        }`}
                      >
                        <span className="font-bold block">{isTr ? '5 Yıldızlı Uluslararası' : '5-Star Luxury Resorts'}</span>
                        <span className="text-[11px] text-slate-500">{isTr ? 'Hilton, Marriott vb.' : 'Full resort amenities'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setHotelTier('4-star')}
                        className={`p-3 rounded-xl border text-left cursor-pointer ${
                          hotelTier === '4-star'
                            ? 'border-[#12bbba] bg-[#e6f8f8] text-[#0d9695] font-bold'
                            : 'border-slate-200 bg-white text-slate-700'
                        }`}
                      >
                        <span className="font-bold block">{isTr ? '4 Yıldızlı Konfor' : '4-Star Comfort'}</span>
                        <span className="text-[11px] text-slate-500">{isTr ? 'Ekonomik & şık' : 'Best balance value'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Special Interests */}
                  <div>
                    <label className="font-bold text-slate-900 block mb-2">
                      {t.interestsQuestion}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {interestOptions.map((opt) => {
                        const isSelected = selectedInterests.includes(opt.id);
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => toggleInterest(opt.id)}
                            className={`p-2 rounded-lg border text-center transition cursor-pointer ${
                              isSelected
                                ? 'border-[#12bbba] bg-[#e6f8f8] text-[#0d9695] font-bold'
                                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                            }`}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold cursor-pointer"
                    >
                      {t.prevBtn}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-6 py-3 rounded-xl bg-[#12bbba] hover:bg-[#0fa8a7] text-white font-semibold flex items-center gap-2 shadow-sm shadow-[#12bbba]/20 cursor-pointer"
                    >
                      <span>{t.nextBtn}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Dates & Contact Details */}
              {step === 3 && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        {isTr ? 'Tahmini Başlangıç Tarihi' : 'Approximate Start Date'}
                      </label>
                      <input
                        type="date"
                        value={approxDate}
                        onChange={(e) => setApproxDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#12bbba]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        {isTr ? 'Kişi Sayısı' : 'Number of Guests'}
                      </label>
                      <div className="flex items-center border border-slate-300 bg-white rounded-xl overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                          className="px-3 py-2 font-bold hover:bg-slate-100"
                        >
                          -
                        </button>
                        <span className="flex-1 text-center font-bold text-slate-900">{guestCount}</span>
                        <button
                          type="button"
                          onClick={() => setGuestCount(guestCount + 1)}
                          className="px-3 py-2 font-bold hover:bg-slate-100"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      {isTr ? 'Ad Soyad' : 'Full Name'}
                    </label>
                    <input
                      type="text"
                      placeholder={isTr ? 'Örn: Ahmet Yılmaz' : 'e.g. John Smith'}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#12bbba]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        {isTr ? 'E-posta' : 'Email Address'}
                      </label>
                      <input
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#12bbba]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        {isTr ? 'Telefon / WhatsApp' : 'Phone / WhatsApp'}
                      </label>
                      <input
                        type="tel"
                        placeholder="+90 532..."
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#12bbba]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      {isTr ? 'Özel Notlar veya Beklentiler' : 'Special Notes or Desired Additions'}
                    </label>
                    <textarea
                      rows={2}
                      placeholder={isTr ? 'Örn: Balayı sürprizi, vejetaryen menü, özel havaalanı karşılama...' : 'e.g. Honeymoon setup, specific flight times, vegetarian food...'}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#12bbba]"
                    />
                  </div>

                  <div className="flex justify-between items-center pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold cursor-pointer"
                    >
                      {t.prevBtn}
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-[#12bbba] hover:bg-[#0fa8a7] text-white font-bold tracking-wide shadow-md shadow-[#12bbba]/25 cursor-pointer"
                    >
                      {t.submitBtn}
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
