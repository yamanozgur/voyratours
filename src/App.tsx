import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { TourDetailModal } from './components/TourDetailModal';
import { TailorMadePlanner } from './components/TailorMadePlanner';
import { AIChatWidget } from './components/AIChatWidget';

// Pages
import { HomePage } from './pages/HomePage';
import { ToursPage } from './pages/ToursPage';
import { DestinationsPage } from './pages/DestinationsPage';
import { TailorMadePage } from './pages/TailorMadePage';
import { WhyVoyraPage } from './pages/WhyVoyraPage';
import { FAQPage } from './pages/FAQPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';

import { Currency, Language, TourPackage } from './types';
import { TOURS_DATA } from './data/toursData';
import { SEOHead } from './components/SEOHead';

// Direct Tour Link Handler component
const TourRouteHandler: React.FC<{
  onSelectTour: (tour: TourPackage) => void;
  language: Language;
  currency: Currency;
}> = ({ onSelectTour, language, currency }) => {
  const navigate = useNavigate();
  React.useEffect(() => {
    const path = window.location.pathname;
    const tourId = path.split('/tour/')[1]?.replace(/\/$/, '');
    if (tourId) {
      const match = TOURS_DATA.find((t) => t.id === tourId || t.slug === tourId);
      if (match) {
        onSelectTour(match);
      }
    }
  }, [onSelectTour]);

  return <ToursPage language={language} currency={currency} onSelectTour={onSelectTour} />;
};

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [currency, setCurrency] = useState<Currency>('EUR');

  // Modals
  const [activeTour, setActiveTour] = useState<TourPackage | null>(null);
  const [isPlannerOpen, setIsPlannerOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleDestinationSelect = (destId: string) => {
    navigate(`/tours?dest=${destId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F4EE] text-slate-900 font-sans selection:bg-[#009999] selection:text-white">
      {/* Global Dynamic SEO Head */}
      <SEOHead language={language} tour={activeTour} />

      {/* Scroll restoration helper */}
      <ScrollToTop />

      {/* Top Navbar */}
      <Navbar
        currentLanguage={language}
        onLanguageChange={setLanguage}
        currentCurrency={currency}
        onCurrencyChange={setCurrency}
        onOpenPlanner={() => setIsPlannerOpen(true)}
      />

      {/* Dynamic Page Views */}
      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                language={language}
                currency={currency}
                onSelectTour={setActiveTour}
                onOpenPlanner={() => setIsPlannerOpen(true)}
              />
            }
          />
          <Route
            path="/tours"
            element={
              <ToursPage
                language={language}
                currency={currency}
                onSelectTour={setActiveTour}
              />
            }
          />
          <Route
            path="/tours/:durationSlug"
            element={
              <ToursPage
                language={language}
                currency={currency}
                onSelectTour={setActiveTour}
              />
            }
          />
          {/* Direct Tour permalinks for SEO */}
          <Route
            path="/tour/:id"
            element={
              <TourRouteHandler
                onSelectTour={setActiveTour}
                language={language}
                currency={currency}
              />
            }
          />
          <Route
            path="/destinations"
            element={<DestinationsPage language={language} />}
          />
          <Route
            path="/tailor-made"
            element={<TailorMadePage language={language} />}
          />
          <Route
            path="/why-voyra"
            element={<WhyVoyraPage language={language} />}
          />
          <Route
            path="/about"
            element={<WhyVoyraPage language={language} />}
          />
          <Route
            path="/faq"
            element={<FAQPage language={language} />}
          />
          <Route
            path="/contact"
            element={<ContactPage language={language} />}
          />
          <Route
            path="/admin"
            element={<AdminPage language={language} currency={currency} onSelectTour={setActiveTour} />}
          />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Footer */}
      <Footer
        language={language}
        onSelectDestination={handleDestinationSelect}
        onOpenPlanner={() => setIsPlannerOpen(true)}
      />

      {/* Floating AI Chat Concierge & WhatsApp Action */}
      <AIChatWidget language={language} activeTour={activeTour} />

      {/* Tour Detail Modal */}
      <TourDetailModal
        tour={activeTour}
        isOpen={!!activeTour}
        onClose={() => setActiveTour(null)}
        language={language}
        currency={currency}
      />

      {/* Tailor-Made Quick Planner Modal */}
      <TailorMadePlanner
        isOpen={isPlannerOpen}
        onClose={() => setIsPlannerOpen(false)}
        language={language}
      />
    </div>
  );
}
