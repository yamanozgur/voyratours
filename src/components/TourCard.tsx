import React from 'react';
import { Clock, MapPin, Users, Plane, Check, ArrowRight, MessageSquare } from 'lucide-react';
import { Currency, Language, TourPackage } from '../types';
import { formatPrice } from '../utils/currency';

interface TourCardProps {
  tour: TourPackage;
  language: Language;
  currency: Currency;
  onSelectTour: (tour: TourPackage) => void;
}

export const TourCard: React.FC<TourCardProps> = ({
  tour,
  language,
  currency,
  onSelectTour,
}) => {
  const isTr = language === 'tr';
  const title = isTr ? tour.titleTr : tour.title;
  const subtitle = isTr ? tour.subtitleTr : tour.subtitle;
  const destination = isTr ? tour.destinationTr : tour.destination;
  const badge = isTr ? tour.badgeTr : tour.badge;
  const groupType = isTr ? tour.groupTypeTr : tour.groupType;

  const t = {
    en: {
      days: 'Days',
      night: 'Night',
      nights: 'Nights',
      perPerson: 'per person',
      from: 'From',
      viewItinerary: 'View Itinerary',
      quickInquire: 'Inquire',
    },
    tr: {
      days: 'Gün',
      night: 'Gece',
      nights: 'Gece',
      perPerson: 'kişi başı',
      from: 'Başlangıç',
      viewItinerary: 'Detaylı Program',
      quickInquire: 'Danış',
    },
  }[language];

  return (
    <div
      id={`tour-card-${tour.id}`}
      className="group bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-[#009999]/60 transition-all duration-300 flex flex-col overflow-hidden"
    >
      {/* Image Container - Compact & Sleek */}
      <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={tour.heroImage}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-black/10 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          {badge ? (
            <span className="px-2.5 py-0.5 rounded-full bg-[#009999] backdrop-blur-md text-white text-[11px] font-bold shadow-xs">
              {badge}
            </span>
          ) : <span />}
          <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium flex items-center gap-1">
            <Users className="w-3 h-3 text-[#5ce6e6]" />
            <span>{groupType}</span>
          </span>
        </div>

        {/* Bottom overlay info: Duration and Destination */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-[11px]">
          <div className="flex items-center gap-1 font-medium bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-md">
            <Clock className="w-3 h-3 text-[#5ce6e6]" />
            <span>
              {tour.durationDays} {t.days} / {tour.durationNights} {tour.durationNights === 1 ? t.night : t.nights}
            </span>
          </div>
          <div className="flex items-center gap-1 text-slate-100 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-md">
            <MapPin className="w-3 h-3 text-[#5ce6e6]" />
            <span className="truncate max-w-[120px]">{destination}</span>
          </div>
        </div>
      </div>

      {/* Content Body - Refined Compact Spacing */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Row: Certification & Route Style */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
            <span className="font-semibold text-[#008080] bg-[#e6f8f8] px-2 py-0.5 rounded border border-[#c2efef]">
              TÜRSAB {isTr ? 'Garantili' : 'Verified'}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              {isTr ? 'Butik Rota' : 'Curated Itinerary'}
            </span>
          </div>

          {/* Tour Title */}
          <h3
            onClick={() => onSelectTour(tour)}
            className="text-base font-bold text-slate-900 font-serif-luxury group-hover:text-[#009999] transition cursor-pointer mb-1.5 line-clamp-2 leading-snug"
          >
            {title}
          </h3>

          {/* Subtitle / summary */}
          <p className="text-xs text-slate-600 mb-3 line-clamp-2 leading-relaxed">
            {subtitle}
          </p>

          {/* Key included bullet tags */}
          <div className="space-y-1 mb-4 text-xs text-slate-700">
            <div className="flex items-center gap-1.5 text-slate-600">
              <Plane className="w-3.5 h-3.5 text-[#009999] shrink-0" />
              <span className="truncate text-[11px]">{tour.departure}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <Check className="w-3.5 h-3.5 text-[#009999] shrink-0" />
              <span className="truncate text-[11px]">{tour.hotelType}</span>
            </div>
          </div>
        </div>

        {/* Pricing & Footer Action */}
        <div className="pt-3 border-t border-slate-100 flex items-end justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-medium">
              {t.from}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold font-serif-luxury text-slate-900">
                {formatPrice(tour.priceEUR, currency)}
              </span>
              {tour.originalPriceEUR && (
                <span className="text-[11px] text-slate-400 line-through">
                  {formatPrice(tour.originalPriceEUR, currency)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400 block -mt-0.5">
              {t.perPerson}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <a
              href={`https://wa.me/905320000000?text=${encodeURIComponent(
                `Hello Voyra Tours, I am interested in booking: ${tour.title} (${formatPrice(tour.priceEUR, currency)}/person). Could you provide availability?`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-[#009999] hover:border-[#009999] hover:bg-[#e6f8f8] transition"
              title={t.quickInquire}
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#009999]" />
            </a>

            <button
              onClick={() => onSelectTour(tour)}
              className="px-3.5 py-2 rounded-xl bg-[#009999] hover:bg-[#008080] text-white text-xs font-semibold tracking-wide transition flex items-center gap-1 shadow-xs shadow-[#009999]/20 cursor-pointer"
            >
              <span>{t.viewItinerary}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
