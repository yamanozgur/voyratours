import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Send,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { Language } from '../types';
import { DESTINATIONS_DATA } from '../data/toursData';
import vtFooterLogo from '../assets/VT_footer.png';

interface FooterProps {
  language: Language;
  onSelectDestination: (destId: string) => void;
  onOpenPlanner: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  onSelectDestination,
  onOpenPlanner,
}) => {
  const isTr = language === 'tr';
  const [emailSubscribed, setEmailSubscribed] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [destList, setDestList] = useState(DESTINATIONS_DATA);

  useEffect(() => {
    const handleUpdate = () => {
      setDestList([...DESTINATIONS_DATA]);
    };
    window.addEventListener('voyra_destinations_updated', handleUpdate);
    return () => window.removeEventListener('voyra_destinations_updated', handleUpdate);
  }, []);

  const defaultEnglishDestinations = [
    { id: 'cappadocia', name: 'Cappadocia' },
    { id: 'pamukkale', name: 'Pamukkale' },
    { id: 'ephesus', name: 'Ephesus' },
    { id: 'antalya', name: 'Antalya' },
    { id: 'istanbul', name: 'Istanbul' },
    { id: 'gallipoli', name: 'Gallipoli' },
  ];

  const displayedDestinations =
    destList && destList.length > 0
      ? destList.slice(0, 6).map((d) => ({
          id: d.id,
          name: (d.name || '').split('/')[0].trim(),
        }))
      : defaultEnglishDestinations;

  const t = {
    en: {
      aboutTitle: 'About Voyra Tours',
      aboutText: 'Voyra Tours is an Istanbul-based boutique travel agency specializing in tailor-made Turkey itineraries, small-group cultural journeys, cave hotel experiences in Cappadocia, and licensed private guiding.',
      quickLinks: 'Quick Links',
      destinationsTitle: 'Destinations',
      contactTitle: 'Istanbul Headquarters',
      tursabBadge: 'TÜRSAB Licensed Travel Agency (A-Grade License No: 12480)',
      address: 'Alemdar Mah. Divanyolu Cad. No: 42, Sultanahmet, Fatih / Istanbul, Turkey',
      hours: 'Mon - Sun: 08:30 - 20:00 (GMT+3)',
      newsletterTitle: 'Exclusive Turkey Travel Offers',
      newsletterDesc: 'Join our private newsletter for early balloon slots, boutique hotel upgrades, and seasonal Turkey guides.',
      newsletterPlaceholder: 'Enter your email address',
      subscribeBtn: 'Subscribe',
      subscribedMsg: 'Thank you! You have subscribed to Voyra Travel Club.',
      rights: 'All rights reserved. Voyra Tours & Travel Co. Ltd.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      cancellationPolicy: 'Cancellation Policy',
    },
    tr: {
      aboutTitle: 'Voyra Tours Hakkında',
      aboutText: 'Voyra Tours, İstanbul merkezli, kişiye özel Türkiye turları, Kapadokya mağara oteli deneyimleri, Efes ve Pamukkale kültür gezileri ile lisanslı VIP rehberlik hizmetinde uzmanlaşmış butik seyahat acentesidir.',
      quickLinks: 'Hızlı Bağlantılar',
      destinationsTitle: 'Popüler Rotalar',
      contactTitle: 'İstanbul Merkez Ofis',
      tursabBadge: 'TÜRSAB A-Grubu Yetkili Seyahat Acentesi (Belge No: 12480)',
      address: 'Alemdar Mah. Divanyolu Cad. No: 42, Sultanahmet, Fatih / İstanbul, Türkiye',
      hours: 'Haftanın 7 Günü: 08:30 - 20:00',
      newsletterTitle: 'Özel Tur Fırsatları & Bülten',
      newsletterDesc: 'Öncelikli balon uçuş kontenjanları, erken rezervasyon avantajları ve özel seyahat rehberlerimizden haberdar olun.',
      newsletterPlaceholder: 'E-posta adresinizi girin',
      subscribeBtn: 'Kayıt Ol',
      subscribedMsg: 'Teşekkürler! Voyra Seyahat Bültenine başarıyla kaydoldunuz.',
      rights: 'Tüm hakları saklıdır. Voyra Tours Turizm Tic. Ltd. Şti.',
      privacy: 'Gizlilik Politikası',
      terms: 'Kullanım Koşulları',
      cancellationPolicy: 'İptal ve İade Koşulları',
    },
  }[language];

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setEmailSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer id="contact" className="bg-gradient-to-b from-[#009ca0] via-[#08abb0] to-[#008c90] text-teal-50 pt-16 pb-12 border-t border-[#38efee]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/20">
          {/* Brand Col (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <Link to="/" className="inline-block focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg">
                <img
                  src={vtFooterLogo}
                  alt="Voyra Tours"
                  className="h-10 sm:h-12 w-auto object-contain brightness-0 invert opacity-95 hover:opacity-100 transition-opacity"
                />
              </Link>
            </div>

            <p className="text-xs sm:text-sm text-teal-50/90 leading-relaxed max-w-md font-light">
              {t.aboutText}
            </p>

            <div className="p-3.5 rounded-2xl bg-black/15 backdrop-blur-sm border border-white/25 shadow-xs flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-[#e0fbfc] shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-white block">{t.tursabBadge}</span>
                <span className="text-teal-100 text-[11px]">
                  {isTr ? 'Kültür ve Turizm Bakanlığı Denetiminde' : 'Ministry of Culture & Tourism Bonded'}
                </span>
              </div>
            </div>
          </div>

          {/* Dest Col */}
          <div className="space-y-3">
            <h4 className="font-serif-luxury text-base font-bold text-white">
              {t.destinationsTitle}
            </h4>
            <ul className="space-y-2 text-xs text-teal-100">
              {displayedDestinations.map((dest) => (
                <li key={dest.id}>
                  <Link
                    to={`/tours?dest=${dest.id}`}
                    onClick={() => onSelectDestination(dest.id)}
                    className="hover:text-white transition block"
                  >
                    {dest.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif-luxury text-base font-bold text-white">
              {t.quickLinks}
            </h4>
            <ul className="space-y-2 text-xs text-teal-100">
              <li>
                <Link to="/tours" className="hover:text-white transition">
                  {isTr ? 'Tüm Paket Turlar' : 'All Tour Packages'}
                </Link>
              </li>
              <li>
                <Link to="/destinations" className="hover:text-white transition">
                  {isTr ? 'Bölgeler & Destinasyonlar' : 'Destinations Guide'}
                </Link>
              </li>
              <li>
                <Link to="/tailor-made" className="hover:text-white transition">
                  {isTr ? 'Kişiye Özel Tur Tasarımı' : 'Tailor-Made Trip Planner'}
                </Link>
              </li>
              <li>
                <Link to="/why-voyra" className="hover:text-white transition">
                  {isTr ? 'Neden Voyra Tours?' : 'Why Travel With Voyra'}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition">
                  {isTr ? 'Sıkça Sorulan Sorular' : 'FAQ'}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">
                  {isTr ? 'İletişim' : 'Contact'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="space-y-3">
            <h4 className="font-serif-luxury text-base font-bold text-white">
              {t.contactTitle}
            </h4>
            <ul className="space-y-2.5 text-xs text-teal-100">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#e0fbfc] shrink-0 mt-0.5" />
                <span>{t.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#e0fbfc] shrink-0" />
                <span>{t.hours}</span>
              </li>
              <li className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#e0fbfc] shrink-0" />
                <a
                  href="https://wa.me/905320000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition font-medium"
                >
                  WhatsApp: +90 532 000 0000
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#e0fbfc] shrink-0" />
                <a href="mailto:info@voyratours.com" className="hover:text-white transition">
                  info@voyratours.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="py-8 border-b border-white/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-md">
            <h4 className="font-serif-luxury text-lg font-bold text-white mb-1">
              {t.newsletterTitle}
            </h4>
            <p className="text-xs text-teal-50/90 leading-relaxed font-light">
              {t.newsletterDesc}
            </p>
          </div>

          {emailSubscribed ? (
            <div className="flex items-center gap-2 text-white text-xs font-semibold bg-black/15 px-4 py-3 rounded-xl border border-white/30">
              <CheckCircle className="w-4 h-4 text-[#e0fbfc]" />
              <span>{t.subscribedMsg}</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletter} className="flex w-full md:w-auto gap-2">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder={t.newsletterPlaceholder}
                className="px-4 py-2.5 bg-black/15 border border-white/30 rounded-xl text-xs text-white placeholder-teal-100/70 focus:outline-none focus:border-white w-full sm:w-72 shadow-xs"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-teal-50 text-[#007f82] font-bold text-xs transition flex items-center gap-1.5 shrink-0 shadow-md cursor-pointer"
              >
                <span>{t.subscribeBtn}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

        {/* Bottom micro bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-teal-100/80 gap-4">
          <p>© {new Date().getFullYear()} Voyra Tours. {t.rights}</p>
          <div className="flex items-center gap-6">
            <Link to="/admin" className="hover:text-white transition font-bold text-[#e0fbfc]">⚙️ Admin Panel</Link>
            <a href="#" className="hover:text-white transition">{t.privacy}</a>
            <a href="#" className="hover:text-white transition">{t.terms}</a>
            <a href="#" className="hover:text-white transition">{t.cancellationPolicy}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
