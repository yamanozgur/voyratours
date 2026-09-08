import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Language } from '../types';
import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  MessageSquare,
  Search,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Send,
} from 'lucide-react';

interface FAQPageProps {
  language: Language;
}

export const FAQPage: React.FC<FAQPageProps> = ({ language }) => {
  const isTr = language === 'tr';
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: isTr ? 'Tümü' : 'All Topics' },
    { id: 'flights', label: isTr ? 'Uçuşlar & Transferler' : 'Flights & Transfers' },
    { id: 'balloon', label: isTr ? 'Balon & Kapadokya' : 'Balloons & Cappadocia' },
    { id: 'hotels', label: isTr ? 'Oteller & Rehberlik' : 'Hotels & Guiding' },
    { id: 'booking', label: isTr ? 'Ödeme & İptal' : 'Payment & Cancellations' },
  ];

  const allFaqs = [
    {
      cat: 'balloon',
      q: isTr
        ? 'Kapadokya sıcak hava balonu uçuşu nasıl işler ve hava muhalefetinde ne olur?'
        : 'How does the Cappadocia hot air balloon flight work, and what if weather cancels it?',
      a: isTr
        ? 'Sıcak hava balonu uçuşları Sivil Havacılık Genel Müdürlüğü (SHGM) onayına bağlıdır. Sabah gün doğumunda otelinizden alınır ve kalkış alanına götürülürsünüz. Hava şartları (şiddetli rüzgar vb.) nedeniyle uçuş iptal edilirse, ödediğiniz balon ücretinin %100’ü derhal kesintisiz iade edilir veya programınız elveriyorsa ertesi sabah için öncelikli sıraya alınır.'
        : 'Hot air balloon departures are strictly regulated by the Turkish Civil Aviation Authority for passenger safety. You are picked up before sunrise directly from your cave hotel. If a flight is grounded due to wind, the balloon fee is 100% refunded immediately, or rescheduled to the following morning if your travel schedule permits.',
    },
    {
      cat: 'flights',
      q: isTr
        ? 'İç hat uçak biletleri ve havalimanı transferleri fiyata dahil mi?'
        : 'Are domestic flights, baggage allowances, and airport transfers included in the package?',
      a: isTr
        ? 'Evet! Voyra Tours paketlerinde belirtilen tüm iç hat uçuşları (İstanbul - Kapadokya, İzmir, Denizli vb.) 20 kg kayıtlı bagaj ve 8 kg el bagajı hakkıyla dahildir. İndiğinizde rehberiniz veya VIP transfer kaptanımız sizi havalimanı çıkış kapısında isminizin yazılı olduğu pano ile karşılar.'
        : 'Yes! All domestic flights indicated in our itineraries (e.g., Istanbul to Cappadocia, Izmir, Denizli, Antalya) include 20kg checked luggage plus cabin baggage. Upon touchdown, your private chauffeur awaits you at the arrivals gate holding a personalized name board.',
    },
    {
      cat: 'hotels',
      q: isTr
        ? 'Küçük grup turları kaç kişiden oluşur? Özel VIP tur tercih edebilir miyim?'
        : 'How large are the boutique small groups? Can we upgrade to a private VIP tour?',
      a: isTr
        ? 'Küçük grup turlarımızda maksimum katılımcı sayısı 10-12 kişidir. Kalabalık 40 kişilik otobüsler kesinlikle kullanılmaz; lüks Mercedes Sprinter/Vito araçlarla butik seyahat edilir. Dilerseniz sadece ailenize veya arkadaş grubunuza özel rehber ve araç tahsis edilen Özel VIP seçeneğimizi tercih edebilirsiniz.'
        : 'Our boutique small groups are capped at just 10 to 12 travelers. We never use crowded 40-passenger tour coaches — you travel in luxury Mercedes executive vans. If you prefer exclusivity, every tour can be booked as a 100% Private VIP journey with your own dedicated vehicle and licensed guide.',
    },
    {
      cat: 'hotels',
      q: isTr
        ? 'Kapadokya’da hangi mağara otellerinde konaklıyoruz?'
        : 'What style of cave hotels do we stay at in Cappadocia?',
      a: isTr
        ? 'Yalnızca bölgenin otantik dokusunu yansıtan, yüksek misafir memnuniyetine sahip gerçek kaya oyma mağara süitlerini (Göreme, Uçhisar veya Ürgüp) tercih ediyoruz. Tüm odalarda modern banyo, ısıtma, klima ve yüksek hızlı Wi-Fi mevcuttur.'
        : 'We partner exclusively with authentic, high-rated luxury cave hotels in Göreme, Uchisar, and Urgup. Each room features historic stone-carved architecture equipped with modern marble en-suite bathrooms, heating, climate control, and high-speed Wi-Fi.',
    },
    {
      cat: 'booking',
      q: isTr
        ? 'Rezervasyon ve ödeme süreci nasıl işler? İptal şartları nelerdir?'
        : 'What is the booking and payment process, and what is your cancellation policy?',
      a: isTr
        ? 'Rezervasyonunuzu onaylamak için %25 - %30 ön ödeme yeterlidir; bakiye seyahatten önce veya varışta ödenebilir. Tur başlangıç tarihine 15 gün kalana kadar yapılan iptallerde iç hat uçak bileti kesintileri hariç ödemeniz iade edilir. İptal güvencesi detayları sözleşmenizde şeffafça yer alır.'
        : 'To secure your dates and hotel bookings, a 25% deposit is required upon confirmation. The remaining balance can be settled prior to departure. Free cancellations are offered up to 15 days before arrival (less non-refundable airline ticket fees). Full terms are detailed in your booking confirmation.',
    },
    {
      cat: 'booking',
      q: isTr
        ? 'Türkiye’ye seyahat için vize gerekiyor mu?'
        : 'Do international travelers need a visa to enter Turkey?',
      a: isTr
        ? 'Birçok Avrupa ülkesi, ABD ve Birleşik Krallık vatandaşları Türkiye’ye 90 güne kadar vizesiz veya hızlı e-Vize (www.evisa.gov.tr) ile giriş yapabilmektedir. Pasaportunuzun seyahat bitiş tarihinden itibaren en az 6 ay geçerlilik süresi bulunmalıdır.'
        : 'Citizens of the US, UK, EU, and many other nations can enter Turkey visa-free or via the straightforward official e-Visa portal (www.evisa.gov.tr). Ensure your passport is valid for at least 6 months beyond your travel dates.',
    },
    {
      cat: 'flights',
      q: isTr
        ? 'Uluslararası uçuşları da karşılıyor musunuz?'
        : 'Do you provide meet-and-greet assistance for international flights into Istanbul?',
      a: isTr
        ? 'Evet! İstanbul Havalimanı (IST) veya Sabiha Gökçen Havalimanı’na (SAW) indiğinizde özel şoförünüz sizi bagaj çıkışında karşılar ve doğrudan otelinize ulaştırır. Gece inişleri de dahil olmak üzere 7/24 karşılama hizmetimiz vardır.'
        : 'Yes! Whether arriving at Istanbul Airport (IST) or Sabiha Gokcen Airport (SAW), your private chauffeur will greet you directly outside customs and whisk you smoothly to your hotel. Our meet-and-greet service operates 24/7, including late-night arrivals.',
    },
  ];

  const filteredFaqs = useMemo(() => {
    return allFaqs.filter((faq) => {
      if (activeCategory !== 'all' && faq.cat !== activeCategory) return false;
      if (searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase();
        return (
          faq.q.toLowerCase().includes(term) || faq.a.toLowerCase().includes(term)
        );
      }
      return true;
    });
  }, [activeCategory, searchTerm, allFaqs]);

  return (
    <div className="min-h-screen bg-[#f8fbfb] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#007373] via-[#008b8f] to-[#006a6e] text-white pt-12 pb-16 px-4 sm:px-8 border-b border-[#009999]/40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-teal-200/80 mb-6 font-medium">
            <Link to="/" className="hover:text-white transition">
              {isTr ? 'Ana Sayfa' : 'Home'}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-teal-400" />
            <span className="text-white font-semibold">
              {isTr ? 'Sıkça Sorulan Sorular' : 'FAQ'}
            </span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[#5ce6e6] text-xs font-bold uppercase tracking-wider mb-4 border border-white/25">
              <HelpCircle className="w-3.5 h-3.5 text-[#5ce6e6]" />
              <span>{isTr ? 'MERAK EDİLEN HER ŞEY' : 'FREQUENTLY ASKED QUESTIONS'}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-white mb-4 tracking-tight leading-tight">
              {isTr ? 'Sıkça Sorulan Sorular' : 'Everything You Need to Know'}
            </h1>
            <p className="text-teal-100/90 text-sm sm:text-base leading-relaxed font-light">
              {isTr
                ? 'Kapadokya balon uçuşlarından iç hat bagaj limitlerine ve iptal şartlarına kadar Türkiye seyahatinizle ilgili tüm şeffaf yanıtlar.'
                : 'Clear, transparent answers on Cappadocia balloon flights, domestic baggage allowances, airport transfers, and booking peace of mind.'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-8 -mt-6 space-y-8">
        {/* Search & Topic Filters */}
        <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-200 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isTr ? 'Soru veya konu ara (örn: balon, bagaj, iptal)...' : 'Search questions (e.g., balloon, flights, luggage)...'}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#009999]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer shrink-0 ${
                  activeCategory === cat.id
                    ? 'bg-[#009999] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion FAQ list */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-[#009999]/40 transition"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900 font-serif-luxury leading-snug">
                    {faq.q}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#009999]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed font-light border-t border-slate-100/80 bg-slate-50/40">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still Have Questions Box */}
        <div className="rounded-3xl bg-white p-8 border border-slate-200 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-serif-luxury mb-1">
              {isTr ? 'Aradığınız cevabı bulamadınız mı?' : 'Still Have Questions?'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-light">
              {isTr
                ? 'İstanbul merkezli seyahat uzmanlarımızla WhatsApp üzerinden doğrudan görüşebilirsiniz.'
                : 'Chat directly with our Istanbul travel team for quick assistance.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://wa.me/905321234567"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold tracking-wider flex items-center gap-2 shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{isTr ? 'WhatsApp’tan Sorun' : 'Chat on WhatsApp'}</span>
            </a>
            <Link
              to="/contact"
              className="px-6 py-3 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold"
            >
              {isTr ? 'İletişim Sayfası' : 'Contact Page'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
