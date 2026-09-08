import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, MessageSquare, Menu, X, ChevronDown, ShieldCheck, Globe } from 'lucide-react';
import { Currency, Language } from '../types';

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
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const location = useLocation();

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
      whyVoyra: 'Why Voyra',
      faq: 'FAQ',
      contact: 'Contact',
      licensed: 'TÜRSAB A-Grade Certified Agency',
      tagline: 'TURKEY TRAVEL SPECIALIST',
    },
    tr: {
      tours: 'Turlar & Paketler',
      destinations: 'Destinasyonlar',
      planner: 'Kişiye Özel Tur',
      whyVoyra: 'Neden Voyra',
      faq: 'SSS',
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
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#009999] text-white flex items-center justify-center shadow-md shadow-[#009999]/25 group-hover:bg-[#008080] transition-all">
              <Compass className="w-6 h-6 transform group-hover:rotate-45 transition-transform duration-500" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif-luxury text-2xl font-bold tracking-wider text-slate-900 leading-none">
                VOYRA<span className="text-[#009999] font-sans font-semibold text-xl">.TOURS</span>
              </span>
              <span className="text-[9px] tracking-[0.25em] text-slate-500 font-semibold uppercase mt-0.5">
                {t.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-9 text-sm font-medium">
            <Link
              to="/tours"
              className={`py-1 transition ${
                isActive('/tours')
                  ? 'text-[#009999] font-bold border-b-2 border-[#009999]'
                  : 'text-slate-700 hover:text-[#009999]'
              }`}
            >
              {t.tours}
            </Link>
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
              to="/why-voyra"
              className={`py-1 transition ${
                isActive('/why-voyra')
                  ? 'text-[#009999] font-bold border-b-2 border-[#009999]'
                  : 'text-slate-700 hover:text-[#009999]'
              }`}
            >
              {t.whyVoyra}
            </Link>
            <Link
              to="/faq"
              className={`py-1 transition ${
                isActive('/faq')
                  ? 'text-[#009999] font-bold border-b-2 border-[#009999]'
                  : 'text-slate-700 hover:text-[#009999]'
              }`}
            >
              {t.faq}
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
            <Link
              to="/tours"
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2 text-base font-medium border-b border-slate-100 ${
                isActive('/tours') ? 'text-[#009999] font-bold' : 'text-slate-800'
              }`}
            >
              {t.tours}
            </Link>
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
              to="/why-voyra"
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2 text-base font-medium border-b border-slate-100 ${
                isActive('/why-voyra') ? 'text-[#009999] font-bold' : 'text-slate-800'
              }`}
            >
              {t.whyVoyra}
            </Link>
            <Link
              to="/faq"
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2 text-base font-medium border-b border-slate-100 ${
                isActive('/faq') ? 'text-[#009999] font-bold' : 'text-slate-800'
              }`}
            >
              {t.faq}
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
