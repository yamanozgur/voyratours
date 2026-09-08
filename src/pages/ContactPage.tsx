import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Language } from '../types';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  MessageSquare,
  Send,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface ContactPageProps {
  language: Language;
}

export const ContactPage: React.FC<ContactPageProps> = ({ language }) => {
  const isTr = language === 'tr';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleWhatsApp = () => {
    const text = isTr
      ? `Merhaba Voyra Tours! İletişime geçmek istiyorum.%0A%0Aİsim: ${name}%0AKonu: ${subject}%0AMesaj: ${message}`
      : `Hello Voyra Tours! I would like to inquire about Turkey travel.%0A%0AName: ${name}%0ASubject: ${subject}%0AMessage: ${message}`;
    window.open(`https://wa.me/905321234567?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#f8fbfb] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#007373] via-[#008b8f] to-[#006a6e] text-white pt-12 pb-16 px-4 sm:px-8 border-b border-[#009999]/40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-teal-200/80 mb-6 font-medium">
            <Link to="/" className="hover:text-white transition">
              {isTr ? 'Ana Sayfa' : 'Home'}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-teal-400" />
            <span className="text-white font-semibold">
              {isTr ? 'İletişim' : 'Contact'}
            </span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[#5ce6e6] text-xs font-bold uppercase tracking-wider mb-4 border border-white/25">
              <Sparkles className="w-3.5 h-3.5 text-[#5ce6e6]" />
              <span>{isTr ? 'BİZE ULAŞIN' : 'GET IN TOUCH'}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-white mb-4 tracking-tight leading-tight">
              {isTr ? 'Bizimle İletişime Geçin' : 'Connect with Our Travel Specialists'}
            </h1>
            <p className="text-teal-100/90 text-sm sm:text-base leading-relaxed font-light">
              {isTr
                ? 'İstanbul Sultanahmet ofisimiz ve 7/24 kesintisiz seyahat ekibimizle tüm sorularınız ve rezervasyon talepleriniz için yanınızdayız.'
                : 'Whether planning your first visit to Cappadocia or seeking bespoke private journeys, our Istanbul concierge team is ready to assist.'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Details Card (Left - 5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-6">
              <h2 className="text-xl font-bold font-serif-luxury text-slate-900">
                {isTr ? 'Merkez Ofis & İletişim' : 'Headquarters & Direct Lines'}
              </h2>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#e6f8f8] text-[#009999] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-bold text-slate-900 mb-0.5">
                      {isTr ? 'İstanbul Ofisi' : 'Istanbul Office'}
                    </span>
                    <p className="text-slate-600 leading-relaxed font-light">
                      Divanyolu Caddesi No: 42, Sultanahmet, Fatih, 34122 İstanbul, Türkiye
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#e6f8f8] text-[#009999] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-bold text-slate-900 mb-0.5">
                      {isTr ? 'Telefon Numarası' : 'Direct Telephone'}
                    </span>
                    <a href="tel:+902125184040" className="text-[#009999] font-semibold hover:underline">
                      +90 (212) 518 40 40
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-bold text-slate-900 mb-0.5">
                      WhatsApp 7/24 Concierge
                    </span>
                    <a
                      href="https://wa.me/905321234567"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 font-semibold hover:underline"
                    >
                      +90 532 123 45 67
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#e6f8f8] text-[#009999] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-bold text-slate-900 mb-0.5">
                      {isTr ? 'E-posta' : 'Email Inquiries'}
                    </span>
                    <a href="mailto:info@voyra.tours" className="text-[#009999] font-semibold hover:underline">
                      info@voyra.tours
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#e6f8f8] text-[#009999] flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-bold text-slate-900 mb-0.5">
                      {isTr ? 'Çalışma Saatleri' : 'Working Hours'}
                    </span>
                    <p className="text-slate-600 font-light">
                      {isTr ? 'Pzt - Cmt: 08:30 - 20:00 (TSİ)' : 'Mon - Sat: 08:30 - 20:00 (TRT)'}
                    </p>
                    <span className="text-[11px] text-slate-400">
                      {isTr ? 'Seyahatteki misafirlerimize 7/24 acil hat açıktır' : '24/7 dedicated assistance for active travelers'}
                    </span>
                  </div>
                </div>
              </div>

              {/* TURSAB License Badge */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-[#009999] shrink-0" />
                <div>
                  <span className="block text-xs font-bold text-slate-900">
                    {isTr ? 'TÜRSAB A-Grubu Seyahat Acentası' : 'TÜRSAB A-Grade Travel Agency'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {isTr ? 'Belge No: 12480 • T.C. Kültür ve Turizm Bakanlığı' : 'License #12480 • Republic of Turkey Ministry of Tourism'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Card (Right - 7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl">
              {!submitted ? (
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold font-serif-luxury text-slate-900 mb-2">
                    {isTr ? 'Mesaj Gönderin' : 'Send an Inquiry'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mb-6 font-light">
                    {isTr
                      ? 'Sorularınızı iletin, uzman seyahat danışmanımız en kısa sürede dönüş yapsın.'
                      : 'Fill out the form below and one of our Turkey specialists will get in touch promptly.'}
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          {isTr ? 'Adınız Soyadınız *' : 'Full Name *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Eleanor Vance"
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-[#009999] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          {isTr ? 'E-posta Adresiniz *' : 'Email Address *'}
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="eleanor@example.com"
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-[#009999] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          {isTr ? 'Telefon / WhatsApp' : 'Phone / WhatsApp'}
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+1 555 987 6543"
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-[#009999] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          {isTr ? 'İlgilendiğiniz Konu / Tur' : 'Subject or Tour of Interest'}
                        </label>
                        <input
                          type="text"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          placeholder={isTr ? 'örn: Kapadokya 2 Günlük Tur' : 'e.g. Cappadocia 2-Day Tour'}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-[#009999] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {isTr ? 'Mesajınız *' : 'Your Message *'}
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={
                          isTr
                            ? 'Seyahat tarihiniz, kişi sayınız veya merak ettiğiniz detaylar...'
                            : 'Preferred dates, number of guests, or any questions you have...'
                        }
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-[#009999] focus:outline-none resize-none"
                      />
                    </div>

                    <div className="pt-3 flex flex-col sm:flex-row items-center gap-3 justify-end">
                      <button
                        type="button"
                        onClick={handleWhatsApp}
                        className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-wider transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>{isTr ? 'WhatsApp’tan Gönder' : 'Send via WhatsApp'}</span>
                      </button>

                      <button
                        type="submit"
                        className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#009999] hover:bg-[#008080] text-white font-bold text-xs tracking-wider transition flex items-center justify-center gap-2 shadow-md shadow-[#009999]/25 cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                        <span>{isTr ? 'Mesajı İlet' : 'Send Message'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#e6f8f8] text-[#009999] flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold font-serif-luxury text-slate-900">
                    {isTr ? 'Mesajınız Alındı!' : 'Message Sent Successfully!'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    {isTr
                      ? `Teşekkür ederiz Sayın ${name}. Ekibimiz mesajınızı inceleyip en geç birkaç saat içinde ${email} adresiniz üzerinden sizinle iletişime geçecektir.`
                      : `Thank you, ${name}. Our concierge team will review your inquiry and respond to ${email} within a few hours.`}
                  </p>
                  <div className="pt-4 flex items-center justify-center gap-3">
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
                    >
                      {isTr ? 'Yeni Mesaj Gönder' : 'Send Another Message'}
                    </button>
                    <Link
                      to="/tours"
                      className="px-5 py-2.5 rounded-xl bg-[#009999] text-white text-xs font-bold hover:bg-[#008080]"
                    >
                      {isTr ? 'Turları İncele' : 'Explore Tours'}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
