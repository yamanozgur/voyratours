import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Language, DestinationInfo } from '../types';
import { DESTINATIONS_DATA } from '../data/toursData';
import { SEOHead } from '../components/SEOHead';
import { ChevronRight, Sparkles, MapPin, Calendar, Compass, ArrowRight } from 'lucide-react';

interface DestinationsPageProps {
  language: Language;
}

export const DestinationsPage: React.FC<DestinationsPageProps> = ({ language }) => {
  const navigate = useNavigate();
  const isTr = language === 'tr';
  const [destinationsData, setDestinationsData] = useState<DestinationInfo[]>(DESTINATIONS_DATA);

  useEffect(() => {
    const handleUpdate = () => {
      setDestinationsData([...DESTINATIONS_DATA]);
    };
    window.addEventListener('voyra_destinations_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('voyra_destinations_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const extendedDestinations = [
    {
      id: 'cappadocia',
      nameEn: 'Cappadocia',
      nameTr: 'Kapadokya',
      taglineEn: 'Surreal Fairy Chimneys & Hot Air Balloons',
      taglineTr: 'Peri Bacaları & Sıcak Hava Balonları',
      image: 'https://raw.githubusercontent.com/yamanozgur/voyratours/main/asset/default.jpg',
      descriptionEn:
        'A magical wonderland sculpted by volcanic erosion and early Christian history. Drift in hot air balloons at sunrise over Goreme Valley, sleep in centuries-old authentic cave suites, and explore subterranean underground cities.',
      descriptionTr:
        'Volkanik tüflerin rüzgar ve yağmurla şekillendiği masalsı bir coğrafya. Göreme üzerinde gün doğumu sıcak hava balonlarıyla süzülün, lüks mağara otellerinde konaklayın ve Derinkuyu yeraltı şehirlerini keşfedin.',
      bestTime: isTr ? 'Nisan - Kasım' : 'April - November',
      highlights: isTr
        ? ['Gün Doğumu Balon Uçuşu', 'Göreme Açık Hava Müzesi', 'Derinkuyu Yeraltı Şehri', 'Paşabağ Peri Bacaları']
        : ['Sunrise Hot Air Ballooning', 'Goreme Open-Air Museum', 'Derinkuyu Underground City', 'Pasabag Fairy Chimneys'],
      toursCount: 'Paketler',
    },
    {
      id: 'pamukkale',
      nameEn: 'Pamukkale',
      nameTr: 'Pamukkale',
      taglineEn: 'White Mineral Travertines & Cleopatra Antique Pool',
      taglineTr: 'Beyaz Mineral Travertenler & Kleopatra Antik Havuzu',
      image: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=1200&q=80',
      descriptionEn:
        'Marvel at the breathtaking tiered white calcium cascades of Pamukkale and bathe in the thermal mineral waters of Cleopatra’s ancient antique pool amidst sunken Roman marble columns.',
      descriptionTr:
        'Pamukkale’nin kalsiyum zengini bembeyaz traverten teraslarında yürüyün, Hierapolis antik kentini gezin ve Roma sütunları arasında Kleopatra Antik Termal Havuzu’nun keyfini çıkarın.',
      bestTime: isTr ? 'Mart - Aralık' : 'March - December',
      highlights: isTr
        ? ['Pamukkale Beyaz Travertenleri', 'Hierapolis Antik Kenti & Nekropol', 'Kleopatra Antik Termal Havuzu', 'Antik Roma Tiyatrosu']
        : ['White Travertine Terraces', 'Hierapolis Ancient Necropolis', 'Cleopatra Antique Thermal Pool', 'Roman Theatre'],
      toursCount: 'Paketler',
    },
    {
      id: 'ephesus',
      nameEn: 'Ephesus',
      nameTr: 'Efes',
      taglineEn: 'Greco-Roman Metropolis & Library of Celsus',
      taglineTr: 'Antik Roma İhtişamı & Celsus Kütüphanesi',
      image: 'https://images.unsplash.com/photo-1635166045025-b078ac986d77?auto=format&fit=crop&w=1200&q=80',
      descriptionEn:
        'Walk the preserved marble streets where Cleopatra and Mark Antony once strolled. Marvel at the grand Library of Celsus, the Great Theatre, and visit the peaceful House of Virgin Mary.',
      descriptionTr:
        'Antik dünyanın en görkemli metropollerinden Efes’te mermer caddelerde yürüyün. Celsus Kütüphanesi, Meryem Ana Evi ve Artemis Tapınağı’nın büyüleyici tarihini keşfedin.',
      bestTime: isTr ? 'Mart - Aralık' : 'March - December',
      highlights: isTr
        ? ['Celsus Kütüphanesi', 'Meryem Ana Evi', 'Büyük Antik Tiyatro', 'Artemis Tapınağı']
        : ['Library of Celsus', 'House of Virgin Mary', 'Great Ancient Theatre', 'Temple of Artemis'],
      toursCount: 'Paketler',
    },
    {
      id: 'antalya',
      nameEn: 'Antalya',
      nameTr: 'Antalya',
      taglineEn: 'Historic Kaleiçi Old Town & Roman Theatres',
      taglineTr: 'Tarihi Kaleiçi Sokakları & Roma Tiyatroları',
      image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1200&q=80',
      descriptionEn:
        'Discover the jewel of the Mediterranean where historic Ottoman-era stone mansions meet Roman city walls in Kaleiçi, alongside the majestic Aspendos amphitheatre and Düden waterfalls.',
      descriptionTr:
        'Tarihi Kaleiçi’nin begonvilli sokakları, görkemli Aspendos Antik Roma Tiyatrosu, Perge harabeleri ve Akdeniz’e dökülen Düden Şelaleleri ile unutulmaz bir deneyim.',
      bestTime: isTr ? 'Nisan - Kasım' : 'April - November',
      highlights: isTr
        ? ['Tarihi Kaleiçi Sokakları', 'Aspendos Roma Tiyatrosu', 'Düden Şelaleleri', 'Perge Antik Kenti']
        : ['Historic Kaleiçi Old Town', 'Aspendos Roman Theatre', 'Düden Waterfalls', 'Perge Ancient City'],
      toursCount: 'Paketler',
    },
    {
      id: 'istanbul',
      nameEn: 'Istanbul',
      nameTr: 'İstanbul',
      taglineEn: 'Where East Meets West Across the Bosphorus',
      taglineTr: 'Boğaz’ın İki Yakasında Doğu ve Batı',
      image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80',
      descriptionEn:
        'The historic imperial capital connecting Europe and Asia. Explore Hagia Sophia, the Blue Mosque, Topkapi Palace, private Bosphorus yacht cruises at sunset, and the bustling spice scents of the centuries-old Grand Bazaar.',
      descriptionTr:
        'Asya ile Avrupa’nın buluştuğu kadim imparatorluk başkenti. Ayasofya, Sultanahmet, Topkapı Sarayı, gün batımında özel Boğaz yat turu ve Kapalıçarşı’nın otantik labirentlerinde unutulmaz bir seyahat.',
      bestTime: isTr ? 'Tüm Yıl' : 'Year-Round',
      highlights: isTr
        ? ['Ayasofya-i Kebir Camii', 'Topkapı Sarayı', 'Özel Boğaz Yat Turu', 'Tarihi Kapalıçarşı']
        : ['Hagia Sophia', 'Topkapi Palace', 'Private Bosphorus Cruise', 'Grand Bazaar'],
      toursCount: 'Paketler',
    },
    {
      id: 'canakkale',
      nameEn: 'Gallipoli & Çanakkale',
      nameTr: 'Çanakkale & Gelibolu',
      taglineEn: 'Historic Battlefields of 1915 & ANZAC Cove',
      taglineTr: '1915 Çanakkale Zaferi & Anzak Koyu',
      image: 'https://images.unsplash.com/photo-1572025442646-866d16c84a54?auto=format&fit=crop&w=1200&q=80',
      descriptionEn:
        'A deeply moving historic journey along the Dardanelles Strait visiting ANZAC Cove, Lone Pine, Chunuk Bair, and the historic memorial sites of the Gallipoli campaign.',
      descriptionTr:
        'Çanakkale Boğazı boyunca uzanan Anzak Koyu, Conkbayırı, Lone Pine ve Şehitler Abidesi’ne uzanan duygu yüklü bir tarih ve kahramanlık yolculuğu.',
      bestTime: isTr ? 'Nisan - Kasım' : 'April - November',
      highlights: isTr
        ? ['Anzak Koyu Anıtı', 'Conkbayırı', 'Lone Pine Şehitliği', 'Çanakkale Boğazı Geçişi']
        : ['ANZAC Cove Memorial', 'Chunuk Bair', 'Lone Pine Cemetery', 'Dardanelles Strait'],
      toursCount: 'Paketler',
    },
    {
      id: 'troy',
      nameEn: 'Troy',
      nameTr: 'Truva',
      taglineEn: 'Homeric Epics & The Legendary Trojan Wooden Horse',
      taglineTr: 'Homeros Destanları & Efsanevi Truva Tahta Atı',
      image: 'https://images.unsplash.com/photo-1572025442646-866d16c84a54?auto=format&fit=crop&w=1200&q=80',
      descriptionEn:
        'Step into the myth of Homer’s Iliad at the 4,000-year-old archaeological site of Troy, the iconic Wooden Horse, and the award-winning Troy Museum.',
      descriptionTr:
        'Homeros’un İlyada destanına konu olan 4000 yıllık efsanevi Truva Antik Kenti, Tahta At ve ödüllü Truva Müzesi ile mitolojik bir serüven.',
      bestTime: isTr ? 'Nisan - Kasım' : 'April - November',
      highlights: isTr
        ? ['Truva Antik Kenti', 'Efsanevi Tahta At', 'Truva Müzesi', 'Antik Kazı Katmanları']
        : ['Ancient City of Troy', 'Legendary Wooden Horse', 'Museum of Troy', 'Excavation Layers'],
      toursCount: 'Paketler',
    },
    {
      id: 'multi-region',
      nameEn: 'Grand Turkey Loops',
      nameTr: 'Büyük Türkiye Rotaları',
      taglineEn: 'Multi-Region Seamless Comprehensive Odysseys',
      taglineTr: 'Çok Bölgeli Kapsamlı Türkiye Turu',
      image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1200&q=80',
      descriptionEn:
        'The ultimate Turkey discovery combining Istanbul, Cappadocia, Ephesus, and Pamukkale into one seamless, stress-free route connected by domestic flights and premier boutique lodgings.',
      descriptionTr:
        'İstanbul’un ihtişamı, Kapadokya’nın masalsı vadileri ve Ege’nin antik kentlerini iç hat uçuşlarıyla birleştiren eksiksiz, yorulmadan gezilen büyük Türkiye seyahati.',
      bestTime: isTr ? 'Tüm Yıl' : 'Year-Round',
      highlights: isTr
        ? ['İstanbul + Kapadokya + Efes', 'Tüm İç Hat Uçuşları Dahil', 'Özel Havalimanı Transferleri', '10-12 Kişilik Butik Grup']
        : ['Istanbul + Cappadocia + Ephesus', 'All Domestic Flights Included', 'VIP Airport Chauffeur', 'Small Boutique Group (Max 12)'],
      toursCount: '2 Paket',
    },
  ];

  // Map each item in destinationsData, merging with existing rich descriptions if present
  const mergedDestinations = destinationsData.map((dest) => {
    const matched = extendedDestinations.find((ext) => ext.id === dest.id);
    return {
      id: dest.id,
      nameEn: dest.name,
      nameTr: dest.nameTr,
      taglineEn: dest.tagline,
      taglineTr: dest.taglineTr,
      image: dest.image,
      descriptionEn:
        matched?.descriptionEn ||
        `${dest.name} invites you to experience breathtaking scenery, unique heritage, and hand-crafted boutique tour packages.`,
      descriptionTr:
        matched?.descriptionTr ||
        `${dest.nameTr}, benzersiz tarihi ve kültürel zenginlikleri ile sizi unutulmaz bir seyahate davet ediyor.`,
      bestTime: matched?.bestTime || (isTr ? 'Tüm Yıl' : 'Year-Round'),
      highlights: isTr
        ? (dest.popularHighlightsTr && dest.popularHighlightsTr.length > 0 ? dest.popularHighlightsTr : matched?.highlights || [])
        : (dest.popularHighlights && dest.popularHighlights.length > 0 ? dest.popularHighlights : matched?.highlights || []),
      toursCount: `${dest.toursCount} ${isTr ? 'Paket' : 'Tours'}`,
    };
  });

  return (
    <div className="min-h-screen bg-[#f8fbfb] pb-24">
      <SEOHead
        title={isTr ? 'Türkiye Destinasyonları & Bölgeler' : 'Iconic Turkey Destinations & Regions'}
        description={
          isTr
            ? 'Kapadokya, Efes, Pamukkale, İstanbul, Antalya ve Truva gibi Türkiye’nin en büyüleyici kültür ve doğa rotalarını keşfedin.'
            : 'Explore Cappadocia, Ephesus, Pamukkale, Istanbul, Antalya, and Gallipoli with curated boutique itineraries and licensed expert guides.'
        }
        language={language}
      />
      {/* Header */}
      <div className="bg-gradient-to-b from-[#007373] via-[#008b8f] to-[#006a6e] text-white pt-12 pb-16 px-4 sm:px-8 border-b border-[#009999]/40">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-teal-200/80 mb-6 font-medium">
            <Link to="/" className="hover:text-white transition">
              {isTr ? 'Ana Sayfa' : 'Home'}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-teal-400" />
            <span className="text-white font-semibold">
              {isTr ? 'Destinasyonlar' : 'Destinations'}
            </span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[#5ce6e6] text-xs font-bold uppercase tracking-wider mb-4 border border-white/25">
              <Sparkles className="w-3.5 h-3.5 text-[#5ce6e6]" />
              <span>{isTr ? 'TÜRKİYE BÖLGELERİ' : 'ICONIC REGIONS'}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-white mb-4 tracking-tight leading-tight">
              {isTr ? 'Bölgelere Göre Keşfedin' : 'Discover Turkey by Destination'}
            </h1>
            <p className="text-teal-100/90 text-sm sm:text-base leading-relaxed font-light">
              {isTr
                ? 'Peri bacalarının gün doğumu renginden Ege’nin mermer antik kentlerine; her bölgenin kendine has ruhunu seçkin butik detaylarla yaşayın.'
                : 'From sunlit hot air balloons soaring over volcanic fairy chimneys to ancient marble capitals and turquoise Mediterranean coastlines.'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-6">
        {mergedDestinations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mergedDestinations.map((dest) => (
              <div
                key={dest.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-[#009999]/60 transition-all duration-300 flex flex-col group"
              >
                {/* Image Banner */}
                <div className="relative h-52 overflow-hidden bg-slate-100">
                  <img
                    src={dest.image}
                    alt={isTr ? dest.nameTr : dest.nameEn}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/20 to-transparent" />

                  {/* Badges on image */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#009999] text-white text-[11px] font-bold shadow-xs">
                      {dest.toursCount}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#5ce6e6]" />
                      <span>{dest.bestTime}</span>
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="text-xl font-bold font-serif-luxury text-white mb-0.5">
                      {isTr ? dest.nameTr : dest.nameEn}
                    </h3>
                    <p className="text-xs text-teal-200 font-medium">
                      {isTr ? dest.taglineTr : dest.taglineEn}
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-slate-600 text-xs leading-relaxed font-light line-clamp-3">
                    {isTr ? dest.descriptionTr : dest.descriptionEn}
                  </p>

                  {/* Highlights */}
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      {isTr ? 'Öne Çıkan Deneyimler' : 'Key Experiences'}
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {dest.highlights.map((hl, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-slate-100 rounded-md text-[11px] font-medium text-slate-700"
                        >
                          {hl}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action CTA */}
                  <div className="pt-3 border-t border-slate-100">
                    <button
                      onClick={() => navigate(`/tours?dest=${dest.id}`)}
                      className="w-full py-2.5 px-3.5 rounded-xl bg-[#009999] hover:bg-[#008080] text-white text-xs font-semibold tracking-wide transition flex items-center justify-center gap-1.5 shadow-xs shadow-[#009999]/20 cursor-pointer"
                    >
                      <span>{isTr ? `${dest.nameTr} Turlarını İncele` : `Browse ${dest.nameEn} Tours`}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
            <Compass className="w-12 h-12 text-[#009999]/50 mx-auto" />
            <h3 className="text-xl font-bold font-serif-luxury text-slate-800">
              {isTr ? 'Henüz Destinasyon Eklenmedi' : 'No Destinations Available Yet'}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {isTr
                ? 'Admin panelinden Word ile tur yüklediğinizde veya yeni destinasyon oluşturduğunuzda bu sayfada listelenecektir.'
                : 'Destinations will appear here when tours are uploaded from the admin panel.'}
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/tailor-made')}
                className="px-5 py-2.5 rounded-xl bg-[#009999] hover:bg-[#008080] text-white text-xs font-semibold shadow-sm cursor-pointer"
              >
                {isTr ? 'Özel Tur Planlayın' : 'Design Custom Trip'}
              </button>
            </div>
          </div>
        )}

        {/* Tailor-Made Banner */}
        <div className="mt-20 rounded-3xl bg-gradient-to-r from-[#007373] via-[#008b8f] to-[#006a6e] text-white p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 border border-[#009999]/40">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#5ce6e6] uppercase">
              <Compass className="w-4 h-4" />
              <span>{isTr ? 'ÖZEL SEYAHAT TASARIMI' : 'BESPOKE ITINERARY'}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white">
              {isTr ? 'Birden Fazla Bölgeyi Birleştirmek İster Misiniz?' : 'Combine Multiple Regions in One Private Journey'}
            </h3>
            <p className="text-teal-100/90 text-xs sm:text-sm leading-relaxed font-light">
              {isTr
                ? 'Kapadokya balon uçuşunu Efes antik kenti ve Boğaz yat gezisiyle kusursuz bir iç hat uçuş planlamasıyla birleştiriyoruz.'
                : 'Combine Cappadocia hot air balloons with ancient Ephesus and sunset Bosphorus yacht cruises in one seamlessly connected private journey.'}
            </p>
          </div>

          <button
            onClick={() => navigate('/tailor-made')}
            className="px-8 py-4 rounded-xl bg-[#009999] hover:bg-[#008080] text-white font-bold text-xs tracking-wider transition shadow-lg shadow-[#009999]/30 shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <span>{isTr ? 'Özel Tur Planlayın' : 'Design Bespoke Trip'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
