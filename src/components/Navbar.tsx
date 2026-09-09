import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, MessageSquare, Menu, X, ChevronDown, ShieldCheck, Globe } from 'lucide-react';
import { Currency, Language } from '../types';
import vtLogo from '../assets/VT_web.png';

interface NavbarProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  currentCurrency: Currency;
  onCurrencyChange: (curr: Currency) => void;
  onOpenPlanner: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLanguage,
  onLanguageChange,
  currentCurrency,
  onCurrencyChange,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileToursOpen, setMobileToursOpen] = useState(true);
  const [toursDropdownOpen, setToursDropdownOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const location = useLocation();

  const durationList = [
    { days: 2, slug: '2-days', labelEn: '2-Day Tours', labelTr: '2 Günlük Turlar', descEn: 'Cappadocia, Ephesus & Troy', descTr: 'Kapadokya, Efes & Truva' },
    { days: 3, slug: '3-days', labelEn: '3-Day Tours', labelTr: '3 Günlük Turlar', descEn: 'Istanbul Imperial & Bosphorus', descTr: 'İstanbul Tarihi & Boğaz' },
    { days: 4, slug: '4-days', labelEn: '4-Day Tours', labelTr: '4 Günlük Turlar', descEn: 'Istanbul & Cappadocia Best', descTr: 'İstanbul & Kapadokya Klasikleri' },
    { days: 5, slug: '5-days', labelEn: '5-Day Tours', labelTr: '5 Günlük Turlar', descEn: 'Golden Triangle Circuit', descTr: 'Kapadokya, Efes & Pamukkale' },
    { days: 6, slug: '6-days', labelEn: '6-Day Tours', labelTr: '6 Günlük Turlar', descEn: 'Grand Turkey Classic Loop', descTr: 'Klasik Türkiye Büyük Turu' },
    { days: 7, slug: '7-days', labelEn: '7-Day Tours', labelTr: '7 Günlük Turlar', descEn: 'Turquoise Coast & Lycia', descTr: 'Turkuaz Kıyı & Likya Cenneti' },
    { days: 8, slug: '8-days', labelEn: '8-Day Tours', labelTr: '8 Günlük Turlar', descEn: 'Grand Anatolian & Aegean', descTr: 'Büyük Anadolu & Ege Mirası' },
    { days: 9, slug: '9-days', labelEn: '9-Day Tours', labelTr: '9 Günlük Turlar', descEn: 'Ultimate Turkey Loop', descTr: 'Baştan Başa Türkiye Turu' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const t = {
    en: {
      tours: 'Tours & Packages',
      destinations: 'Destinations',
      planner: 'Tailor-Made Trip',
      contact: 'Contact',
      licensed: 'TÜRSAB A-Grade Certified Agency',
      tagline: 'TURKEY TRAVEL SPECIALIST',
    },
    tr: {
      tours: 'Turlar & Paketler',
      destinations: 'Destinasyonlar',
      planner: 'Kişiye Özel Tur',
      contact: 'İletişim',
      licensed: 'TÜRSAB A-Grubu Belgeli Acente',
      tagline: 'TÜRKİYE SEYAHAT UZMANI',
    },
  }[currentLanguage];

  const currencies: Currency[] = ['EUR', 'USD', 'TRY', 'GBP'];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top micro bar for trust & quick contact - warm travertine aesthetic */}
      <div className="bg-[#F4EFE6] text-slate-700 text-xs px-4 sm:px-8 py-1.5 flex justify-between items-center border-b border-[#E5DFD5]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[#009999] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#009999]" />
            <span>{t.licensed}</span>
          </span>
          <span className="hidden md:inline-block text-slate-400">|</span>
          <span className="hidden md:inline-block text-slate-600 font-normal">
            {currentLanguage === 'en'
              ? 'Boutique small-group & VIP private Turkey experiences'
              : 'Butik küçük grup ve özel VIP Türkiye turları'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Currency Switcher */}
          <div className="relative">
            <button
              id="currency-selector-btn"
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
              className="flex items-center gap-1 text-slate-700 hover:text-slate-900 px-2 py-0.5 rounded bg-white border border-[#DCD5C8] hover:border-[#009999] transition cursor-pointer"
              aria-label="Select Currency"
            >
              <span className="font-semibold text-xs">{currentCurrency}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>
            {currencyDropdownOpen && (
              <div className="absolute right-0 mt-1 w-20 bg-white border border-[#DDD6C8] rounded-lg shadow-xl py-1 z-50 text-center">
                {currencies.map((curr) => (
                  <button
                    key={curr}
                    onClick={() => {
                      onCurrencyChange(curr);
                      setCurrencyDropdownOpen(false);
                    }}
                    className={`block w-full py-1 text-xs hover:bg-[#F4EFE6] text-left px-3 cursor-pointer ${
                      currentCurrency === curr ? 'text-[#009999] font-bold bg-[#EAE3D5]' : 'text-slate-700'
                    }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language Toggle */}
          <div className="flex items-center gap-1 bg-white border border-[#DCD5C8] rounded px-1.5 py-0.5">
            <Globe className="w-3 h-3 text-slate-500" />
            <button
              id="lang-toggle-en"
              onClick={() => onLanguageChange('en')}
              className={`px-1 rounded text-xs font-semibold transition cursor-pointer ${
                currentLanguage === 'en' ? 'text-[#009999] font-bold bg-[#F4EFE6]' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              EN
            </button>
            <span className="text-slate-300">/</span>
            <button
              id="lang-toggle-tr"
              onClick={() => onLanguageChange('tr')}
              className={`px-1 rounded text-xs font-semibold transition cursor-pointer ${
                currentLanguage === 'tr' ? 'text-[#009999] font-bold bg-[#F4EFE6]' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              TR
            </button>
          </div>

          <a
            href="https://wa.me/905321234567?text=Hello%20Voyra%20Tours,%20I%20would%20like%20to%20inquire%20about%20Turkey%20tours"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1 text-[#009999] hover:text-[#008080] transition font-medium"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#009999]" />
            <span className="font-semibold">+90 (532) Voyra-TR</span>
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FAF8F5]/98 backdrop-blur-md shadow-sm py-3 border-b border-[#E5DFD5]'
            : 'bg-[#FAF8F5] py-4 border-b border-[#ECE6DB]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center group py-1">
            <img
              src={vtLogo}
              alt="Voyra Tours"
              className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105 duration-300"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-9 text-sm font-medium">
            {/* Tours & Packages with Duration Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setToursDropdownOpen(true)}
              onMouseLeave={() => setToursDropdownOpen(false)}
            >
              <div className="flex items-center">
                <Link
                  to="/tours"
                  className={`py-1 inline-flex items-center gap-1.5 transition ${
                    isActive('/tours')
                      ? 'text-[#009999] font-bold border-b-2 border-[#009999]'
                      : 'text-slate-700 hover:text-[#009999]'
                  }`}
                >
                  <span>{t.tours}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      toursDropdownOpen ? 'rotate-180 text-[#009999]' : 'text-slate-400'
                    }`}
                  />
                </Link>
              </div>

              {/* Dropdown Menu */}
              {toursDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-[460px] bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl border border-[#E5DFD5] p-4 z-50 animate-fadeIn">
                  {/* All Tours top link */}
                  <Link
                    to="/tours"
                    onClick={() => setToursDropdownOpen(false)}
                    className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-[#009999]/10 to-[#00b0b5]/5 hover:from-[#009999]/20 hover:to-[#00b0b5]/10 border border-[#009999]/20 transition group mb-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#009999] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                        <Compass className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 group-hover:text-[#009999] transition">
                          {currentLanguage === 'en' ? 'All Tours & Packages' : 'Tüm Turlar & Paketler'}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {currentLanguage === 'en' ? 'Explore our complete signature portfolio' : 'Tüm seçkin Türkiye rotalarını inceleyin'}
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-[#009999] bg-white px-2 py-0.5 rounded-full border border-[#009999]/30">
                      {currentLanguage === 'en' ? 'View All' : 'Tümü'}
                    </span>
                  </Link>

                  {/* Section Label */}
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-2 flex items-center justify-between">
                    <span>{currentLanguage === 'en' ? 'Browse by Duration' : 'Gün Sayısına Göre Turlar'}</span>
                    <span className="text-[10px] text-[#009999] font-medium">2 – 9 {currentLanguage === 'en' ? 'Days' : 'Gün'}</span>
                  </div>

                  {/* 2-column Grid of Days */}
                  <div className="grid grid-cols-2 gap-1.5">
                    {durationList.map((item) => (
                      <Link
                        key={item.days}
                        to={`/tours/${item.slug}`}
                        onClick={() => setToursDropdownOpen(false)}
                        className="p-2.5 rounded-xl hover:bg-[#F4EFE6]/70 border border-transparent hover:border-[#DCD5C8] transition group flex items-start gap-2.5"
                      >
                        <div className="w-7 h-7 rounded-lg bg-[#FAF8F5] border border-[#E5DFD5] group-hover:border-[#009999] group-hover:bg-[#009999] text-slate-700 group-hover:text-white flex items-center justify-center font-bold text-xs shrink-0 transition">
                          {item.days}D
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-800 group-hover:text-[#009999] transition truncate">
                            {currentLanguage === 'en' ? item.labelEn : item.labelTr}
                          </div>
                          <div className="text-[10.5px] text-slate-400 truncate">
                            {currentLanguage === 'en' ? item.descEn : item.descTr}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/destinations"
              className={`py-1 transition ${
                isActive('/destinations')
                  ? 'text-[#009999] font-bold border-b-2 border-[#009999]'
                  : 'text-slate-700 hover:text-[#009999]'
              }`}
            >
              {t.destinations}
            </Link>
            <Link
              to="/tailor-made"
              className={`py-1 transition flex items-center gap-1.5 ${
                isActive('/tailor-made')
                  ? 'text-[#009999] font-bold border-b-2 border-[#009999]'
                  : 'text-slate-700 hover:text-[#009999]'
              }`}
            >
              <span>{t.planner}</span>
              <span className="bg-[#e6f8f8] text-[#009999] border border-[#a7eae9] text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                VIP
              </span>
            </Link>
            <Link
              to="/contact"
              className={`py-1 transition ${
                isActive('/contact')
                  ? 'text-[#009999] font-bold border-b-2 border-[#009999]'
                  : 'text-slate-700 hover:text-[#009999]'
              }`}
            >
              {t.contact}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 shadow-xl space-y-3 animate-fadeIn">
            {/* Tours & Duration submenu */}
            <div className="border-b border-slate-100 pb-2">
              <div className="flex items-center justify-between py-2">
                <Link
                  to="/tours"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-medium ${
                    isActive('/tours') ? 'text-[#009999] font-bold' : 'text-slate-800'
                  }`}
                >
                  {t.tours}
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileToursOpen(!mobileToursOpen)}
                  className="p-1 text-slate-500 hover:text-slate-800 cursor-pointer"
                  aria-label="Toggle duration options"
                >
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-200 ${
                      mobileToursOpen ? 'rotate-180 text-[#009999]' : ''
                    }`}
                  />
                </button>
              </div>

              {mobileToursOpen && (
                <div className="pl-3 pr-1 py-2 space-y-1.5 bg-[#FAF8F5] rounded-xl my-1 border border-[#E5DFD5]">
                  <Link
                    to="/tours"
                    onClick={() => {
                      setMobileToursOpen(false);
                      setMobileMenuOpen(false);
                    }}
                    className="block py-1.5 px-2 text-xs font-bold text-[#009999] hover:underline"
                  >
                    {currentLanguage === 'en' ? '• All Tours & Packages' : '• Tüm Turlar & Paketler'}
                  </Link>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 pt-1">
                    {currentLanguage === 'en' ? 'Tours by Duration' : 'Gün Sayısına Göre'}
                  </div>
                  <div className="grid grid-cols-2 gap-1 pt-1">
                    {durationList.map((item) => (
                      <Link
                        key={item.days}
                        to={`/tours/${item.slug}`}
                        onClick={() => {
                          setMobileToursOpen(false);
                          setMobileMenuOpen(false);
                        }}
                        className="py-1.5 px-2 text-xs rounded-lg text-slate-700 hover:text-[#009999] hover:bg-white flex items-center gap-1.5"
                      >
                        <span className="font-bold text-[#009999]">{item.days}D:</span>
                        <span className="truncate">{currentLanguage === 'en' ? `${item.days} Days` : `${item.days} Gün`}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/destinations"
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2 text-base font-medium border-b border-slate-100 ${
                isActive('/destinations') ? 'text-[#009999] font-bold' : 'text-slate-800'
              }`}
            >
              {t.destinations}
            </Link>
            <Link
              to="/tailor-made"
              onClick={() => setMobileMenuOpen(false)}
              className={`py-2 text-base font-medium border-b border-slate-100 flex items-center justify-between ${
                isActive('/tailor-made') ? 'text-[#009999] font-bold' : 'text-[#009999]'
              }`}
            >
              <span>{t.planner}</span>
              <span className="bg-[#e6f8f8] text-[#009999] text-xs px-2 py-0.5 rounded-full font-bold">
                VIP
              </span>
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2 text-base font-medium ${
                isActive('/contact') ? 'text-[#009999] font-bold' : 'text-slate-800'
              }`}
            >
              {t.contact}
            </Link>

            <div className="pt-3 flex flex-col gap-2">
              <a
                href="https://wa.me/905321234567"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-medium text-sm flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp: +90 532 123 45 67</span>
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
