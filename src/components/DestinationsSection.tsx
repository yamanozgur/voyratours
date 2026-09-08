import React from 'react';
import { ArrowRight, MapPin, Sparkles } from 'lucide-react';
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
    <section id="destinations" className="py-16 sm:py-20 bg-gradient-to-b from-[#004d53] via-[#006067] to-[#004d53] text-white border-y border-[#009999]/40 relative overflow-hidden">
      {/* Radiant dark turquoise ambient glow effects */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#00cccc]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#00b3b3]/25 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-2xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#003a3f]/85 border border-[#38efee]/40 mb-2.5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#5ce6e6]" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#5ce6e6]">
              {t.eyebrow}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-luxury font-bold text-white mb-2 tracking-tight">
            {t.title}
          </h2>
          <p className="text-teal-100/90 text-xs sm:text-sm leading-relaxed font-light">
            {t.subtitle}
          </p>
        </div>

        {/* Destination Grid - Sleek, Compact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DESTINATIONS_DATA.map((dest) => {
            const name = isTr ? dest.nameTr : dest.name;
            const tagline = isTr ? dest.taglineTr : dest.tagline;
            const highlights = isTr ? dest.popularHighlightsTr : dest.popularHighlights;

            return (
              <div
                key={dest.id}
                onClick={() => onSelectDestination(dest.id)}
                className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-400 cursor-pointer border border-[#009999]/40 hover:border-[#5ce6e6]"
              >
                {/* Background Image */}
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
                <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 flex flex-col justify-end text-white">
                  <div className="flex items-center gap-1 text-[#5ce6e6] text-[10px] font-bold uppercase tracking-wider mb-0.5">
                    <MapPin className="w-3 h-3" />
                    <span>Turkey</span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-serif-luxury font-bold text-white mb-1 group-hover:text-[#5ce6e6] transition">
                    {name}
                  </h3>

                  <p className="text-[11px] text-teal-100/85 mb-2.5 line-clamp-1 font-light">
                    {tagline}
                  </p>

                  {/* Highlights pills */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {highlights.slice(0, 2).map((h, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-[#003a3f]/85 backdrop-blur-md border border-[#009999]/50 px-2 py-0.5 rounded-md text-teal-100"
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
