import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { REVIEWS_DATA } from '../data/toursData';

interface TestimonialsSectionProps {
  language: Language;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ language }) => {
  const isTr = language === 'tr';

  const t = {
    en: {
      eyebrow: 'TRAVELER VOICES',
      title: 'Real Journeys, Lasting Memories',
      subtitle: 'Read authentic experiences from travelers around the globe who entrusted their dream Turkey vacations to Voyra Tours.',
      verifiedBadge: 'Verified Voyra Traveler',
    },
    tr: {
      eyebrow: 'MİSAFİR YORUMLARI',
      title: 'Gerçek Deneyimler, Unutulmaz Anlar',
      subtitle: 'Hayallerindeki Türkiye tatilini Voyra Tours ile gerçekleştiren dünyanın dört bir yanından misafirlerimizin samimi görüşleri.',
      verifiedBadge: 'Doğrulanmış Voyra Gezgini',
    },
  }[language];

  return (
    <section id="reviews" className="py-24 bg-[#FAF7F2] text-slate-800 border-y border-[#E6E0D5] relative overflow-hidden">
      {/* Subtle brand glow effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#12bbba]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#12bbba]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
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

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {REVIEWS_DATA.map((rev) => {
            const comment = isTr ? rev.commentTr : rev.comment;
            const tourTaken = isTr ? rev.tourTakenTr : rev.tourTaken;

            return (
              <div
                key={rev.id}
                className="bg-white border border-[#E2DDD2] rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-[#12bbba] transition-all duration-300"
              >
                <div>
                  {/* Rating & Quote Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <Quote className="w-6 h-6 text-[#12bbba]/30" />
                  </div>

                  {/* Comment */}
                  <p className="text-xs sm:text-sm text-slate-700 italic mb-6 leading-relaxed">
                    "{comment}"
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EFEAE1]">
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={rev.avatar}
                      alt={rev.author}
                      className="w-10 h-10 rounded-full object-cover border-2 border-[#bcebeb]"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1">
                        <span>{rev.author}</span>
                        <span title={rev.country}>{rev.countryFlag}</span>
                      </h4>
                      <span className="text-[10px] text-slate-400 block">
                        {rev.date}
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] text-[#0d9695] font-semibold truncate">
                    {tourTaken}
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
