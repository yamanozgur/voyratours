import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, MessageSquare } from 'lucide-react';
import { Language } from '../types';

interface FAQSectionProps {
  language: Language;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ language }) => {
  const isTr = language === 'tr';
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const t = {
    en: {
      eyebrow: 'FREQUENTLY ASKED QUESTIONS',
      title: 'Everything You Need to Know',
      subtitle: 'Clear, transparent answers to help you plan your voyage through Turkey with total peace of mind.',
      stillQuestions: 'Have a specific question not listed here?',
      chatWithUs: 'Chat with our Istanbul team on WhatsApp',
    },
    tr: {
      eyebrow: 'SIKÇA SORULAN SORULAR',
      title: 'Seyahatiniz Hakkında Bilmeniz Gerekenler',
      subtitle: 'Türkiye gezinizi güvenle ve soru işaretsiz planlayabilmeniz için en çok merak edilen konular.',
      stillQuestions: 'Aradığınız cevabı bulamadınız mı?',
      chatWithUs: 'İstanbul merkez ekibimizle WhatsApp’tan görüşün',
    },
  }[language];

  const faqs = [
    {
      q: isTr
        ? 'Kapadokya sıcak hava balonu uçuşu nasıl işler ve hava muhalefetinde ne olur?'
        : 'How does the Cappadocia hot air balloon flight work, and what if weather cancels it?',
      a: isTr
        ? 'Sıcak hava balonu uçuşları Sivil Havacılık Genel Müdürlüğü (SHGM) onayına bağlıdır. Sabah gün doğumunda otelinizden alınır ve uçuş alanına götürülürsünüz. Hava şartları nedeniyle uçuş iptal edilirse, ödediğiniz balon ücretinin %100’ü derhal kesintisiz iade edilir veya programınız elveriyorsa ertesi sabah için öncelikli sıraya alınır.'
        : 'Hot air balloon departures are strictly regulated by the Turkish Civil Aviation Authority for safety. You are picked up before dawn directly from your cave hotel. If a flight is grounded due to wind, the balloon fee is 100% refunded immediately, or rescheduled to the following morning if your itinerary allows.',
    },
    {
      q: isTr
        ? 'İç hat uçak biletleri ve havalimanı transferleri fiyata dahil mi?'
        : 'Are domestic flights, baggage allowances, and airport transfers included?',
      a: isTr
        ? 'Evet! Voyra Tours paketlerinde belirtilen tüm iç hat uçuşları (İstanbul - Kapadokya, İzmir, Denizli vb.) 20 kg kayıtlı bagaj ve 8 kg kabin hakkı ile dahildir. İndiğinizde rehberiniz veya VIP transfer kaptanımız sizi havalimanı çıkış kapısında isminizle karşılar.'
        : 'Yes! All domestic flights mentioned in our itineraries (e.g., Istanbul to Cappadocia, Izmir, Denizli, Antalya) include 20kg checked luggage plus cabin bag. Upon arrival, our private driver meets you at the arrivals gate holding a personalized name sign.',
    },
    {
      q: isTr
        ? 'Küçük grup turları kaç kişiden oluşur? Özel VIP tur tercih edebilir miyim?'
        : 'How large are the small groups? Can we book a private VIP tour instead?',
      a: isTr
        ? 'Butik küçük grup turlarımız maksimum 12-14 misafirle sınırlandırılmıştır; böylece 50 kişilik büyük otobüs turlarındaki uzun kuyruklar ve zaman kayıpları yaşanmaz. Dilerseniz sadece ailenize ve arkadaş grubunuza özel Mercedes VIP araç ve kişisel rehber tahsis ettiğimiz Özel VIP opsiyonumuzu seçebilirsiniz.'
        : 'Our small-group departures never exceed 12–14 travelers, ensuring personalized attention and avoiding the chaos of 50-person bus tours. You can also select the Private VIP option during booking for an exclusive Mercedes executive van and private licensed guide exclusively for your party.',
    },
    {
      q: isTr
        ? 'Müzelerdeki uzun bilet kuyruklarında bekleyecek miyiz?'
        : 'Will we have to wait in long ticket lines at major attractions?',
      a: isTr
        ? 'Hayır. Voyra Tours profesyonel kokartlı turist rehberleri ile çalıştığı için Ayasofya, Topkapı Sarayı, Efes Antik Kenti ve Göreme Açık Hava Müzesi gibi tüm ana noktalarda acente hızlı geçiş (skip-the-line) yetkisine sahibiz.'
        : 'No. All Voyra Tours are led by official government-licensed guides with authorized fast-track group admissions. You bypass general public queues at Hagia Sophia, Topkapi Palace, Göreme Open Air Museum, and Ephesus.',
    },
    {
      q: isTr
        ? 'Rezervasyon ve ödeme süreci nasıl işliyor? Güvenilir mi?'
        : 'What is the booking deposit, payment, and cancellation policy?',
      a: isTr
        ? 'Rezervasyonunuzu güvenceye almak için %20 ön ödeme yeterlidir; bakiye tutarı tur başlangıcında ödenebilir. Tur tarihine 15 günden fazla süre kala yapılan iptallerde iç hat uçak biletleri haricindeki tüm ön ödeme iade edilir. Şirketimiz TÜRSAB A-Grubu yetkili seyahat acentesidir.'
        : 'We require a 20% deposit to secure domestic flights, cave hotel suites, and balloon slots. The balance can be completed upon arrival in Istanbul. Cancellations made 15+ days prior to travel receive full refunds (excluding non-refundable airline ticketing fees). We are an official TÜRSAB A-Grade licensed agency.',
    },
  ];

  return (
    <section id="faq" className="py-24 bg-[#F5F1E8] border-t border-[#DDD6C8]">
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0d9695] mb-2 block">
            {t.eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-slate-900 mb-3">
            {t.title}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            {t.subtitle}
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-[#12bbba] bg-white shadow-md'
                    : 'border-[#DDD6C8] bg-white hover:border-slate-400'
                }`}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-serif-luxury font-bold text-base sm:text-lg text-slate-900">
                    {faq.q}
                  </span>
                  <span className="text-[#12bbba] shrink-0">
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-[#EFEAE1]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* WhatsApp support callout */}
        <div className="mt-12 p-6 rounded-2xl bg-white border border-[#DDD6C8] text-center space-y-3 shadow-sm">
          <p className="text-xs sm:text-sm font-medium text-slate-800">
            {t.stillQuestions}
          </p>
          <a
            href="https://wa.me/905320000000?text=Hello%20Voyra%20Tours,%20I%20have%20a%20question%20about%20your%20Turkey%20tours"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#12bbba] hover:bg-[#0fa8a7] text-white font-semibold text-xs transition shadow-sm shadow-[#12bbba]/25 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-white" />
            <span>{t.chatWithUs}</span>
          </a>
        </div>
      </div>
    </section>
  );
};
