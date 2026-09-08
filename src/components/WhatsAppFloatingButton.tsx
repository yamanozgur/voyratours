import React, { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { Language } from '../types';

interface WhatsAppFloatingButtonProps {
  language: Language;
}

export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({ language }) => {
  const isTr = language === 'tr';
  const [popoverOpen, setPopoverOpen] = useState(false);

  const t = {
    en: {
      advisor: 'Voyra Travel Concierge',
      status: 'Online • Typically replies in 5 minutes',
      greeting: 'Hello! How can we assist you with your Turkey travel plans today? Ask us about Cappadocia balloon flights, custom itineraries, or boutique hotels.',
      startChat: 'Start WhatsApp Chat',
      placeholder: 'Type a message...',
    },
    tr: {
      advisor: 'Voyra Seyahat Danışmanı',
      status: 'Çevrimiçi • Genellikle 5 dakikada yanıtlar',
      greeting: 'Merhaba! Türkiye seyahatiniz için nasıl yardımcı olabiliriz? Kapadokya balon turları, kişiye özel rotalar veya oteller hakkında bize hemen yazabilirsiniz.',
      startChat: 'WhatsApp Sohbetini Başlat',
      placeholder: 'Bir mesaj yazın...',
    },
  }[language];

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Popover Card */}
      {popoverOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-emerald-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-white text-sm">
                  VT
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-emerald-600 rounded-full" />
              </div>
              <div>
                <h4 className="font-bold text-sm">{t.advisor}</h4>
                <p className="text-[10px] text-emerald-100">{t.status}</p>
              </div>
            </div>
            <button
              onClick={() => setPopoverOpen(false)}
              className="text-emerald-200 hover:text-white transition"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Message bubble */}
          <div className="p-4 bg-stone-50 space-y-3">
            <div className="bg-white p-3 rounded-2xl rounded-tl-xs shadow-xs border border-stone-200 text-xs text-stone-800 leading-relaxed">
              {t.greeting}
            </div>

            <a
              href="https://wa.me/905320000000?text=Hello%20Voyra%20Tours,%20I%20would%20like%20to%20get%20information%20about%20Turkey%20tours"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-md"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{t.startChat}</span>
            </a>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        id="floating-whatsapp-btn"
        onClick={() => setPopoverOpen(!popoverOpen)}
        className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl hover:shadow-emerald-500/40 flex items-center justify-center transition-all duration-300 transform hover:scale-105"
        aria-label="Open WhatsApp Chat"
      >
        <MessageSquare className="w-7 h-7" />
      </button>
    </div>
  );
};
