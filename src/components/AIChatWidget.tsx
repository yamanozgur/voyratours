import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  RotateCcw,
  MessageCircle,
  Compass,
  ArrowRight,
  Bot,
  User,
  Clock,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { Language, TourPackage } from '../types';
import { getSmartClientSideResponse } from '../utils/aiTravelEngine';

interface AIChatWidgetProps {
  language: Language;
  activeTour?: TourPackage | null;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const AIChatWidget: React.FC<AIChatWidgetProps> = ({
  language,
  activeTour,
}) => {
  const isTr = language === 'tr';
  const [isOpen, setIsOpen] = useState(false);
  const [showTeaser, setShowTeaser] = useState(true);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Welcome message localized
  const getWelcomeMessage = (): ChatMessage => {
    return {
      id: 'welcome-msg',
      role: 'assistant',
      content: isTr
        ? `👋 **Merhaba! Voyra Tours Akıllı Seyahat Danışmanına hoş geldiniz.**

Türkiye'nin en seçkin rotalarında hayalinizdeki tatili planlamanız için buradayım!

🎈 **Kapadokya sıcak hava balonu** ve butik mağara otel rezervasyonları  
🏛️ **2 günden 9 güne** özel paket turlarımız ve iç hat uçuş detayları  
🏺 **Efes, Pamukkale, İstanbul ve Turkuaz Kıyılar**  
✨ Dilediğiniz gün ve kişi sayısına göre **%100 Kişiye Özel Tur** planlama  

Aklınıza takılan her şeyi sorabilirsiniz. Size bugün nasıl yardımcı olabilirim?`
        : `👋 **Hello! Welcome to Voyra Tours AI Travel Concierge.**

I am here to help you design a seamless and unforgettable journey across Turkey!

🎈 **Cappadocia sunrise balloon flights** & boutique cave hotel stays  
🏛️ **Curated 2 to 9-day** packages with domestic flights included  
🏺 **Ephesus, Pamukkale, Istanbul & Mediterranean Coast**  
✨ **100% Tailor-made itineraries** designed around your schedule  

Feel free to ask me anything about routes, pricing, or travel tips. How may I assist you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const [messages, setMessages] = useState<ChatMessage[]>([getWelcomeMessage()]);

  // Suggested prompt chips
  const suggestedPrompts = isTr
    ? [
        'Kapadokya balon turu fiyata dahil mi?',
        'En popüler 4 ve 5 günlük turlar hangileri?',
        'Paket turlara uçak ve transferler dahil mi?',
        'Bana özel bir rota planlayabilir misiniz?',
        'Efes & Pamukkale turu kaç gün sürer?',
      ]
    : [
        'Is hot air balloon included in Cappadocia?',
        'What are the most popular 4 & 5-day tours?',
        'Are domestic flights & transfers included?',
        'Can you design a custom itinerary for me?',
        'How many days for Ephesus & Pamukkale?',
      ];

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isOpen, messages, isLoading]);

  // Update welcome message if language changed and only 1 message exists
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === 'welcome-msg') {
      setMessages([getWelcomeMessage()]);
    }
  }, [language]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || input).trim();
    if (!messageContent || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    // Auto-detect if user is writing in Turkish or English
    const containsTurkish =
      /[çğışöüÇĞİŞÖÜ]/.test(messageContent) ||
      /\b(merhaba|selam|tur|balon|fiyat|kaç|gun|gün|nedir|nerede|dahil|otel|rezervasyon|burası|çalışmıyor|calismiyor|istiyorum|var mı|yok mu)\b/i.test(
        messageContent
      );
    const effectiveLanguage: Language = containsTurkish ? 'tr' : language;

    let botReply = '';

    try {
      // 1. First attempt: server-side API (works in full-stack dev / Cloud Run)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const apiMessages = newMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: apiMessages,
          userLanguage: effectiveLanguage,
          tourContext: activeTour
            ? {
                title: effectiveLanguage === 'tr' ? activeTour.titleTr : activeTour.title,
                durationDays: activeTour.durationDays,
                priceEUR: activeTour.priceEUR,
                region: activeTour.region,
              }
            : undefined,
        }),
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data && data.reply) {
          botReply = data.reply;
        }
      }
    } catch (error) {
      // Endpoint unreachable (e.g. on GitHub Pages or static hosting)
      console.log('Server endpoint unreachable or static hosting detected, falling back to client engine.');
    }

    // 2. Second attempt / Fallback: Instant Intelligent Client-Side Travel Concierge
    // This ensures chat ALWAYS works 100% on GitHub Pages, offline, or static export!
    if (!botReply) {
      // Brief organic delay for realistic concierge response
      await new Promise((resolve) => setTimeout(resolve, 350));
      botReply = getSmartClientSideResponse(
        messageContent,
        effectiveLanguage,
        newMessages,
        activeTour
      );
    }

    setMessages((prev) => [
      ...prev,
      {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setIsLoading(false);
  };

  const handleResetChat = () => {
    setMessages([getWelcomeMessage()]);
    setInput('');
  };

  // Helper to format simple markdown elements (bold, bullet points, linebreaks)
  const renderFormattedMessage = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="space-y-1.5 text-xs sm:text-[13px] leading-relaxed">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) {
            return <div key={idx} className="h-1.5" />;
          }

          // Format bold text (**word**)
          const parts = line.split(/(\*\*.*?\*\*)/g);
          const formattedLine = parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={pIdx} className="font-semibold text-slate-900">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          });

          // Bullet points
          if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* ')) {
            const bulletText = line.replace(/^[-•*]\s*/, '');
            const bulletParts = bulletText.split(/(\*\*.*?\*\*)/g);
            return (
              <div key={idx} className="flex items-start gap-1.5 pl-1 my-0.5">
                <span className="text-[#009999] font-bold text-sm leading-none mt-0.5">•</span>
                <span className="text-slate-700">
                  {bulletParts.map((part, pIdx) =>
                    part.startsWith('**') && part.endsWith('**') ? (
                      <strong key={pIdx} className="font-semibold text-slate-900">
                        {part.slice(2, -2)}
                      </strong>
                    ) : (
                      part
                    )
                  )}
                </span>
              </div>
            );
          }

          return (
            <p key={idx} className="text-slate-700">
              {formattedLine}
            </p>
          );
        })}
      </div>
    );
  };

  const whatsappMessage = encodeURIComponent(
    isTr
      ? 'Merhaba Voyra Tours, Türkiye turları ve tatil paketleri hakkında bilgi almak istiyorum.'
      : 'Hello Voyra Tours, I would like to get information about your Turkey tours and vacation packages.'
  );

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating Teaser Greeting Bubble (When closed) */}
      {!isOpen && showTeaser && (
        <div className="mb-3 max-w-xs bg-white rounded-2xl p-3.5 shadow-2xl border border-[#009999]/30 flex items-start gap-2.5 animate-bounce-subtle relative group">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTeaser(false);
            }}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center text-[10px] cursor-pointer transition shadow"
            title="Kapat"
          >
            <X className="w-3 h-3" />
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#009999] to-[#20c2c2] text-white flex items-center justify-center shrink-0 shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
          <div
            onClick={() => {
              setIsOpen(true);
              setShowTeaser(false);
            }}
            className="cursor-pointer"
          >
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
              <span>{isTr ? 'Voyra AI Danışmanı' : 'Voyra AI Concierge'}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
              {isTr
                ? 'Sorularınız mı var? Kapadokya, paketler ve fiyatları bana sorun ✨'
                : 'Have questions? Ask me about Cappadocia, packages & pricing ✨'}
            </p>
          </div>
        </div>
      )}

      {/* Main Chat Drawer / Window */}
      {isOpen && (
        <div className="mb-3 w-[92vw] sm:w-[410px] h-[580px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-fadeIn transition-all">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#007373] via-[#008b8f] to-[#006a6e] text-white p-3.5 px-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center font-bold text-white shadow-sm">
                  <Sparkles className="w-4 h-4 text-[#5ce6e6]" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#007373] rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-xs sm:text-sm text-white">
                    {isTr ? 'Voyra AI Seyahat Danışmanı' : 'Voyra AI Travel Concierge'}
                  </h4>
                  <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded font-mono font-medium tracking-wider uppercase">
                    AI
                  </span>
                </div>
                <p className="text-[10.5px] text-teal-100 flex items-center gap-1 font-light">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>{isTr ? 'Çevrimiçi • Anında Yanıt' : 'Online • Instant Concierge'}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                className="p-1.5 rounded-lg text-teal-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
                title={isTr ? 'Sohbeti Sıfırla' : 'Reset Conversation'}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-teal-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* WhatsApp Direct Option Banner */}
          <div className="bg-[#FAF8F5] border-b border-[#E5DFD5] px-3.5 py-2 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-600 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#009999]" />
              <span>{isTr ? 'Canlı temsilci mi istiyorsunuz?' : 'Prefer a human specialist?'}</span>
            </span>
            <a
              href={`https://wa.me/905320000000?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[10.5px] transition shadow-xs"
            >
              <MessageCircle className="w-3 h-3" />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Chat Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50 scrollbar-thin">
            {messages.map((message) => {
              const isAssistant = message.role === 'assistant';
              return (
                <div
                  key={message.id}
                  className={`flex gap-2.5 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  {isAssistant && (
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#009999] to-[#00b0b5] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div className={`max-w-[85%] space-y-1`}>
                    <div
                      className={`p-3.5 rounded-2xl shadow-xs border ${
                        isAssistant
                          ? 'bg-white border-slate-200 text-slate-800 rounded-tl-xs'
                          : 'bg-[#009999] border-[#008888] text-white rounded-tr-xs'
                      }`}
                    >
                      {isAssistant ? (
                        renderFormattedMessage(message.content)
                      ) : (
                        <p className="text-xs sm:text-[13px] leading-relaxed text-white whitespace-pre-wrap">
                          {message.content}
                        </p>
                      )}
                    </div>
                    <div
                      className={`text-[9.5px] text-slate-400 px-1 ${
                        isAssistant ? 'text-left' : 'text-right'
                      }`}
                    >
                      {message.timestamp}
                    </div>
                  </div>

                  {!isAssistant && (
                    <div className="w-7 h-7 rounded-lg bg-slate-700 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-2.5 justify-start animate-fadeIn">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#009999] to-[#00b0b5] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-xs shadow-xs flex items-center gap-1.5">
                  <span className="text-xs text-slate-500 font-medium">
                    {isTr ? 'Voyra AI yanıt hazırlıyor' : 'Voyra AI is typing'}
                  </span>
                  <div className="flex items-center gap-1 pl-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#009999] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#009999] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#009999] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts (Visible when only 1 or 2 messages exist) */}
          {messages.length <= 3 && !isLoading && (
            <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 pl-1">
                {isTr ? 'Öneriler:' : 'Suggestions:'}
              </span>
              {suggestedPrompts.map((prompt, pIdx) => (
                <button
                  key={pIdx}
                  type="button"
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2.5 py-1 rounded-full bg-[#FAF8F5] hover:bg-[#F4EFE6] border border-[#E5DFD5] text-[11px] font-medium text-slate-700 hover:text-[#009999] transition shrink-0 cursor-pointer whitespace-nowrap"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Footer Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                isTr
                  ? 'Türkiye seyahatiniz hakkında bir soru yazın...'
                  : 'Ask anything about Turkey tours & routes...'
              }
              disabled={isLoading}
              className="flex-1 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#009999] focus:border-transparent transition"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`p-2.5 rounded-xl transition cursor-pointer flex items-center justify-center ${
                input.trim() && !isLoading
                  ? 'bg-[#009999] hover:bg-[#008888] text-white shadow-md shadow-[#009999]/25 scale-100 active:scale-95'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
              aria-label="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Trigger Button */}
      <button
        id="floating-ai-chat-btn"
        onClick={() => {
          setIsOpen(!isOpen);
          setShowTeaser(false);
        }}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 cursor-pointer relative group ${
          isOpen
            ? 'bg-slate-800 hover:bg-slate-900 text-white'
            : 'bg-gradient-to-tr from-[#007373] via-[#009999] to-[#20c2c2] text-white ring-4 ring-[#009999]/20 hover:ring-[#009999]/40'
        }`}
        aria-label="Toggle AI Travel Concierge"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <Sparkles className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300" />
            {/* Status dot */}
            <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full animate-pulse" />
          </>
        )}
      </button>
    </div>
  );
};

// Also export as WhatsAppFloatingButton for backwards compatibility
export const WhatsAppFloatingButton = AIChatWidget;
