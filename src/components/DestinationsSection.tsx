import React, { useRef } from 'react';
import { ArrowRight, MapPin, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { Language } from '../types';
import { DESTINATIONS_DATA } from '../data/toursData';

interface DestinationsSectionProps {
  language: Language;
  onSelectDestination: (destinationId: string) => void;
}

export const DestinationsSection: React.FC<DestinationsSectionProps> = ({
  language,
  onSelectDestination,
}) => {
  const isTr = language === 'tr';
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const t = {
    en: {
      eyebrow: 'ICONIC REGIONS OF ANATOLIA',
      title: 'Explore Turkey By Destination',
      subtitle: 'From volcanic fairy chimney valleys to royal Ottoman palaces and turquoise coasts, discover our most cherished boutique destinations.',
      viewTours: 'View Tours',
      toursAvailable: 'Tours',
    },
    tr: {
      eyebrow: 'ANADOLU’NUN EŞSİZ COĞRAFYASI',
      title: 'Bölgelere Göre Keşfedin',
      subtitle: 'Volkanik peri bacası vadilerinden Osmanlı saraylarına ve turkuaz sahillere uzanan en seçkin butik rotalarımız.',
      viewTours: 'Turları İncele',
      toursAvailable: 'Tur',
    },
  }[language];

  return (
    <section id="destinations" className="py-16 sm:py-20 bg-gradient-to-b from-[#009ca0] via-[#08abb0] to-[#008c90] text-white border-y border-[#38efee]/30 relative overflow-hidden">
      {/* Radiant turquoise ambient glow effects */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#38efee]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Section Header with Carousel Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/15 backdrop-blur-sm border border-white/25 mb-2.5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#e0fbfc]" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#e0fbfc]">
                {t.eyebrow}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-luxury font-bold text-white mb-2 tracking-tight">
              {t.title}
            </h2>
            <p className="text-teal-50 text-xs sm:text-sm leading-relaxed font-normal">
              {t.subtitle}
            </p>
          </div>

          {/* Carousel Arrows */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              onClick={() => scroll('left')}
              className="p-2.5 rounded-xl bg-black/15 hover:bg-black/25 border border-white/25 text-white transition cursor-pointer shadow-xs"
              title="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2.5 rounded-xl bg-black/15 hover:bg-black/25 border border-white/25 text-white transition cursor-pointer shadow-xs"
              title="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Destination Carousel - Strict Horizontal Flex Carousel */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-6 snap-x snap-mandatory scrollbar-none pb-4 items-stretch"
        >
          {DESTINATIONS_DATA.map((dest) => {
            const name = isTr ? dest.nameTr : dest.name;
            const tagline = isTr ? dest.taglineTr : dest.tagline;
            const highlights = isTr ? dest.popularHighlightsTr : dest.popularHighlights;

            return (
              <div
                key={dest.id}
                onClick={() => onSelectDestination(dest.id)}
                className="group relative h-80 sm:h-96 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-400 cursor-pointer border border-[#009999]/50 hover:border-[#5ce6e6] snap-start shrink-0 w-[260px] sm:w-[280px] lg:w-[calc(25%-18px)]"
              >
                {/* Background Image - Story Portrait Format */}
                <img
                  src={dest.image}
                  alt={name}
                  loading="lazy"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Atmospheric dark turquoise gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#003438]/95 via-[#00464c]/40 to-transparent" />

                {/* Top Badge */}
                <div className="absolute top-3 right-3 bg-[#003a3f]/90 backdrop-blur-md border border-[#38efee]/45 px-2.5 py-0.5 rounded-full text-teal-100 text-[11px] font-semibold shadow-xs">
                  {dest.toursCount} {t.toursAvailable}
                </div>

                {/* Bottom Content */}
                <div className="absolute bottom-0 inset-x-0 p-5 flex flex-col justify-end text-white">
                  <div className="flex items-center gap-1 text-[#5ce6e6] text-[10px] font-bold uppercase tracking-wider mb-1">
                    <MapPin className="w-3 h-3" />
                    <span>Turkey</span>
                  </div>

                  <h3 className="text-xl font-serif-luxury font-bold text-white mb-1 group-hover:text-[#5ce6e6] transition">
                    {name}
                  </h3>

                  <p className="text-xs text-teal-100/85 mb-3 line-clamp-1 font-light">
                    {tagline}
                  </p>

                  {/* Highlights pills */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {highlights.slice(0, 2).map((h, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-[#003a3f]/85 backdrop-blur-md border border-[#009999]/50 px-2.5 py-0.5 rounded-md text-teal-100"
                      >
                        {h}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#5ce6e6] group-hover:text-white group-hover:translate-x-1 transition-all">
                    <span>{t.viewTours}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

