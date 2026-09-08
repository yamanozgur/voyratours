import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Language } from '../types';
import {
  ShieldCheck,
  Building,
  GraduationCap,
  Plane,
  Headphones,
  CheckCircle,
  Sparkles,
  ChevronRight,
  ArrowRight,
  Check,
  X,
  Users,
  Compass,
} from 'lucide-react';

interface WhyVoyraPageProps {
  language: Language;
}

export const WhyVoyraPage: React.FC<WhyVoyraPageProps> = ({ language }) => {
  const navigate = useNavigate();
  const isTr = language === 'tr';

  const pillars = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#009999]" />,
      title: isTr ? 'TÜRSAB A-Grubu Yasal Güvence' : 'TÜRSAB A-Grade Certified Agency',
      desc: isTr
        ? 'T.C. Kültür ve Turizm Bakanlığı denetimli A-Grubu Seyahat Acentası işletme belgemizle (Belge No: 12480) tüm rezervasyonlarınız yasal teminat altındadır.'
        : 'Fully bonded, licensed, and insured member of the Association of Turkish Travel Agencies (License #12480). Your payments, safety, and bookings are 100% legally protected.',
    },
    {
      icon: <Building className="w-6 h-6 text-[#009999]" />,
      title: isTr ? 'Özenle Seçilmiş Mağara & Butik Oteller' : 'Authentic Cave & Heritage Stays',
      desc: isTr
        ? 'Kapadokya’da gerçek oyma mağara süitleri, Sultanahmet’te restore edilmiş tarihi Osmanlı konakları ve seçkin termal otellerde kalırsınız.'
        : 'Handpicked family-owned cave suites in Göreme, Ottoman mansions in Sultanahmet, and authentic boutique retreats that immerse you in regional heritage.',
    },
    {
      icon: <GraduationCap className="w-6 h-6 text-[#009999]" />,
      title: isTr ? 'Lisanslı Tarihçi ve Arkeolog Rehberler' : 'Licensed Historian & Scholar Guides',
      desc: isTr
        ? 'Ezberlenmiş tur metinleri yerine, bölgeye aşık profesyonel kokartlı arkeolog ve sanat tarihçisi rehberlerimizle antik kentleri keşfedersiniz.'
        : 'Led exclusively by government-certified art historians and archaeologists who bring the living stories of Roman ruins and Byzantine frescoes to life.',
    },
    {
      icon: <Plane className="w-6 h-6 text-[#009999]" />,
      title: isTr ? 'İç Hat Uçuşları & VIP Araçlar' : 'Domestic Flights & VIP Chauffeurs',
      desc: isTr
        ? '10-12 saatlik yorucu otobüs yolculuklarını eliyoruz. Türk Hava Yolları / Pegasus uçuşları, 20 kg bagaj ve özel Mercedes VIP araçlarla dinlenerek gezersiniz.'
        : 'We eliminate 10-hour highway bus exhaustion by including convenient domestic flights with 20kg luggage and executive VIP Mercedes van transfers.',
    },
    {
      icon: <Headphones className="w-6 h-6 text-[#009999]" />,
      title: isTr ? '7/24 Kesintisiz WhatsApp Konsiyerj' : '24/7 Dedicated Ground Concierge',
      desc: isTr
        ? 'Havalimanında karşılanmanızdan dönüşünüze kadar balon uçuş hava durumu kontrolleri ve özel rezervasyonlar için seyahat uzmanınız doğrudan telefonunuzda.'
        : 'From real-time balloon weather updates to dinner reservations, our dedicated Istanbul operations team is directly on WhatsApp with you.',
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-[#009999]" />,
      title: isTr ? 'Alışveriş Tuzağı Olmayan Samimi Rotalar' : 'Zero High-Pressure Shopping Traps',
      desc: isTr
        ? 'Değerli tatil zamanınızı zoraki komisyonlu halı ya da deri mağazalarında bekleyerek harcatmıyor; sadece gerçek kültürel atölyeler sunuyoruz.'
        : 'We respect your vacation time. Zero forced high-pressure carpet or leather factory detours — only authentic artisan workshops if requested.',
    },
  ];

  const comparison = [
    {
      feature: isTr ? 'Grup Büyüklüğü' : 'Group Size',
      voyra: isTr ? 'Maksimum 10 - 12 Kişilik Butik Grup' : 'Small Boutique Group (Max 10-12 guests)',
      massMarket: isTr ? '35 - 50 Kişilik Büyük Otobüsler' : 'Crowded 40-50 Passenger Buses',
    },
    {
      feature: isTr ? 'Şehirler Arası Ulaşım' : 'Intercity Travel',
      voyra: isTr ? 'İç Hat Uçak Biletleri (Bagaj Dahil)' : 'Domestic Flights (20kg Luggage Included)',
      massMarket: isTr ? '8-12 Saat Karayolu Otobüs Yolculuğu' : '8-12 Hour Highway Night Buses',
    },
    {
      feature: isTr ? 'Konaklama Tarzı' : 'Accommodation Style',
      voyra: isTr ? 'Kapadokya Orijinal Mağara / Tarihi Konaklar' : 'Authentic Cave Suites & Heritage Mansions',
      massMarket: isTr ? 'Şehir Dışında Standart Zincir Oteller' : 'Impersonal Out-of-town Chain Hotels',
    },
    {
      feature: isTr ? 'Rehberlik Kalitesi' : 'Guiding Quality',
      voyra: isTr ? 'Bakanlık Kokartlı Sanat Tarihçileri' : 'Government-Certified Historians & Scholars',
      massMarket: isTr ? 'Hızlı ve Yüzeysel Tur Anlatımları' : 'Scripted, rushed crowd walkthroughs',
    },
    {
      feature: isTr ? 'Zorunlu Alışveriş Durakları' : 'Commercial Shopping Detours',
      voyra: isTr ? 'Sıfır Zorunlu Satış / %100 Geziye Odaklı' : 'Zero High-Pressure Shopping Traps',
      massMarket: isTr ? 'Günde 2-3 Mağazada Saatlerce Bekleme' : 'Frequent lengthy commission store detours',
    },
    {
      feature: isTr ? 'Misafir Desteği' : 'Traveler Support',
      voyra: isTr ? 'WhatsApp Üzerinden 7/24 Birebir Asistan' : 'Direct 24/7 Dedicated WhatsApp Concierge',
      massMarket: isTr ? 'Sadece Belirli Saatlerde Çağrı Merkezi' : 'Generic call center with long hold times',
    },
  ];

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
              {isTr ? 'Neden Voyra?' : 'Why Voyra'}
            </span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[#5ce6e6] text-xs font-bold uppercase tracking-wider mb-4 border border-white/25">
              <Sparkles className="w-3.5 h-3.5 text-[#5ce6e6]" />
              <span>{isTr ? 'TÜRKİYE SEYAHATİNDE GÜVEN' : 'THE VOYRA ADVANTAGE'}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-white mb-4 tracking-tight leading-tight">
              {isTr ? 'Neden Voyra Tours?' : 'Crafted with Integrity, Backed by Experience'}
            </h1>
            <p className="text-teal-100/90 text-sm sm:text-base leading-relaxed font-light">
              {isTr
                ? 'Klasik, kalabalık otobüs turlarını ve aceleye getirilmiş programları reddediyoruz. Her seyahatimiz, Türk misafirperverliğini derin bir tarih bilgisi ve butik konforla buluşturur.'
                : 'We reject mass-market bus tours and rushed itineraries. Every Voyra journey is designed to immerse you deeply in authentic Turkish culture, ancient wonder, and boutique comfort.'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-6 space-y-16">
        {/* 6 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-lg hover:border-[#009999]/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#e6f8f8] flex items-center justify-center">
                  {pillar.icon}
                </div>
                <h3 className="text-lg font-bold font-serif-luxury text-slate-900 leading-snug">
                  {pillar.title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-light">
                  {pillar.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Section: Voyra vs Mass-Market */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-slate-900 mb-3">
              {isTr ? 'Voyra Tours ile Klasik Turların Karşılaştırması' : 'How Voyra Compares to Generic Mass-Market Tours'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-light">
              {isTr
                ? 'Tatilinizde neye para ödediğinizi bilmeniz için farklarımızı şeffaf bir şekilde sunuyoruz.'
                : 'A transparent look at the differences that make your Turkey vacation restful, authentic, and unforgettable.'}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-100">
                  <th className="py-4 px-4 font-bold text-slate-500 uppercase tracking-wider text-xs">
                    {isTr ? 'Özellik' : 'Feature'}
                  </th>
                  <th className="py-4 px-4 font-bold text-[#009999] bg-[#e6f8f8]/60 rounded-t-xl text-xs uppercase tracking-wider">
                    Voyra Tours
                  </th>
                  <th className="py-4 px-4 font-bold text-slate-400 uppercase tracking-wider text-xs">
                    {isTr ? 'Sıradan Otobüs Turları' : 'Generic Bus Tours'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {comparison.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="py-4 px-4 font-semibold text-slate-800">
                      {row.feature}
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-900 bg-[#e6f8f8]/30 flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#009999] shrink-0" />
                      <span>{row.voyra}</span>
                    </td>
                    <td className="py-4 px-4 text-slate-500">
                      <div className="flex items-center gap-2">
                        <X className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>{row.massMarket}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Callout */}
        <div className="rounded-3xl bg-gradient-to-r from-[#007373] via-[#008b8f] to-[#006a6e] text-white p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 border border-[#009999]/40">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#5ce6e6] uppercase">
              <Compass className="w-4 h-4" />
              <span>{isTr ? 'HUZURLA SEYAHAT EDİN' : 'TRAVEL WITH PEACE OF MIND'}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white">
              {isTr ? 'Hayalinizdeki Türkiye Seyahatini Başlatalım' : 'Ready to Experience Turkey with True Craftsmanship?'}
            </h3>
            <p className="text-teal-100/90 text-xs sm:text-sm leading-relaxed font-light">
              {isTr
                ? 'Paket turlarımızı inceleyebilir veya size özel bir rota tasarlamamız için uzmanlarımızla hemen iletişime geçebilirsiniz.'
                : 'Explore our curated signature packages or connect with our specialists to handcraft your private bespoke route.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <button
              onClick={() => navigate('/tours')}
              className="px-6 py-3.5 rounded-xl bg-[#009999] hover:bg-[#008080] text-white font-bold text-xs tracking-wider transition shadow-md cursor-pointer"
            >
              <span>{isTr ? 'Paket Turları İncele' : 'Browse Tours'}</span>
            </button>
            <button
              onClick={() => navigate('/tailor-made')}
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-xs tracking-wider transition cursor-pointer"
            >
              <span>{isTr ? 'Özel Tur Planlayın' : 'Custom Trip'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
