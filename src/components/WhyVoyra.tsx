import React from 'react';
import {
  ShieldCheck,
  Building,
  GraduationCap,
  Plane,
  Headphones,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import { Language } from '../types';

interface WhyVoyraProps {
  language: Language;
}

export const WhyVoyra: React.FC<WhyVoyraProps> = ({ language }) => {
  const isTr = language === 'tr';

  const t = {
    en: {
      eyebrow: 'THE VOYRA ADVANTAGE',
      title: 'Crafted with Integrity, Backed by Experience',
      subtitle: 'We reject mass-market bus tours and rushed itineraries. Every Voyra experience is designed to immerse you deeply in Turkish hospitality, ancient wonder, and boutique comfort.',
      feature1Title: 'TÜRSAB A-Grade Certified Agency',
      feature1Desc: 'Fully bonded, licensed, and insured member of the Association of Turkish Travel Agencies. Your payments, bookings, and welfare are legally protected.',
      feature2Title: 'Authentic Cave & Heritage Stays',
      feature2Desc: 'Handpicked family-owned cave suites in Göreme, Ottoman mansions in Sultanahmet, and sea-view resorts with authentic Turkish charm.',
      feature3Title: 'Native Historian & Scholar Guides',
      feature3Desc: 'Led by government-certified archaeologists and art historians who tell the living stories behind ancient Roman stones and Byzantine frescoes.',
      feature4Title: 'Seamless Domestic Flights Included',
      feature4Desc: 'We eliminate 10-hour highway exhaustion by packaging comfortable domestic flights with 20kg luggage and executive VIP Mercedes van transfers.',
      feature5Title: '24/7 On-Ground WhatsApp Concierge',
      feature5Desc: 'From restaurant reservations to balloon flight weather updates, our dedicated team is directly in touch with you throughout your journey.',
      feature6Title: 'No Tourist Shopping Traps',
      feature6Desc: 'We respect your valuable vacation time with authentic cultural workshops and zero high-pressure carpet or leather sales detours.',
    },
    tr: {
      eyebrow: 'VOYRA TOURS FARKI',
      title: 'Güvenle Planlanan, Tutkuyla Yaşanan Deneyimler',
      subtitle: 'Klasik kalabalık otobüs turlarını ve aceleye getirilmiş programları reddediyoruz. Her Voyra yolculuğu, Türk misafirperverliğini ve tarihi butik konforla buluşturur.',
      feature1Title: 'TÜRSAB A-Grubu Lisanslı Acente',
      feature1Desc: 'Türkiye Seyahat Acentaları Birliği (TÜRSAB) onaylı yasal A-Grubu belgemizle tüm rezervasyonlarınız ve seyahatiniz yasal güvence altındadır.',
      feature2Title: 'Otantik Mağara ve Butik Oteller',
      feature2Desc: 'Kapadokya’da gerçek oyma mağara süitleri, Sultanahmet’te tarihi konaklar ve seçkin termal otellerde unutulmaz konaklama deneyimi.',
      feature3Title: 'Kokartlı Tarihçi & Arkeolog Rehberler',
      feature3Desc: 'Bakanlık kokartlı, alanında uzman sanat tarihçileri ve arkeolog rehberlerimizle antik kentlerin gerçek hikayelerini keşfedin.',
      feature4Title: 'Konforlu İç Hat Uçuşları & VIP Araçlar',
      feature4Desc: 'Saatlerce süren karayolu yorgunluğunu ortadan kaldırıyor; uçak biletleri, 20 kg bagaj ve özel Mercedes VIP araç transferleriyle seyahat ettiriyoruz.',
      feature5Title: '7/24 Kesintisiz WhatsApp Asistanı',
      feature5Desc: 'Havalimanı inişinizden dönüşünüze kadar balon hava durumu takibi, restoran tavsiyeleri ve her türlü sorunuz için bir tık uzağınızdayız.',
      feature6Title: 'Şeffaf Program & Alışveriş Dayatmasız',
      feature6Desc: 'Değerli tatil zamanınıza saygı duyuyor; zorunlu halı veya deri mağazası dayatmaları yerine gerçek kültürel deneyimler sunuyoruz.',
    },
  }[language];

  const features = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#12bbba] group-hover:text-white" />,
      title: t.feature1Title,
      desc: t.feature1Desc,
    },
    {
      icon: <Building className="w-6 h-6 text-[#12bbba] group-hover:text-white" />,
      title: t.feature2Title,
      desc: t.feature2Desc,
    },
    {
      icon: <GraduationCap className="w-6 h-6 text-[#12bbba] group-hover:text-white" />,
      title: t.feature3Title,
      desc: t.feature3Desc,
    },
    {
      icon: <Plane className="w-6 h-6 text-[#12bbba] group-hover:text-white" />,
      title: t.feature4Title,
      desc: t.feature4Desc,
    },
    {
      icon: <Headphones className="w-6 h-6 text-[#12bbba] group-hover:text-white" />,
      title: t.feature5Title,
      desc: t.feature5Desc,
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-[#12bbba] group-hover:text-white" />,
      title: t.feature6Title,
      desc: t.feature6Desc,
    },
  ];

  return (
    <section id="why-voyra" className="py-24 bg-[#EFE9DF] border-y border-[#DDD6C8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0d9695] mb-2 block">
            {t.eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-slate-900 mb-4">
            {t.title}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-white border border-[#DDD6C8] hover:border-[#12bbba] hover:shadow-xl transition-all duration-300 flex flex-col justify-between group shadow-sm"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#DDD6C8] shadow-xs flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#12bbba] transition-all">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold font-serif-luxury text-slate-900 mb-2 group-hover:text-[#0d9695] transition">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
