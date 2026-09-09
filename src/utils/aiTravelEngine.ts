import { TourPackage, Language } from '../types';
import { TOURS_DATA } from '../data/toursData';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Intelligent Client-Side Travel Concierge Engine.
 * Used seamlessly on static hosting like GitHub Pages, Vercel static, or when backend API is unreachable.
 */
export function getSmartClientSideResponse(
  userQuery: string,
  language: Language,
  conversationHistory: Message[] = [],
  activeTour?: TourPackage | null
): string {
  const isTr = language === 'tr';
  const q = userQuery.toLowerCase().trim();

  // Helper to find relevant tours from data
  const findToursByDuration = (days: number) =>
    TOURS_DATA.filter((t) => t.durationDays === days);

  // 1. Kapadokya & Balon (Hot Air Balloon)
  if (
    q.includes('balon') ||
    q.includes('balloon') ||
    q.includes('sıcak hava') ||
    q.includes('hot air')
  ) {
    if (isTr) {
      return `🎈 **Kapadokya Sıcak Hava Balon Uçuşları Hakkında:**

• **Fiyata Dahil mi?** Standart paket turlarımızda balon turu **opsiyonel** bir etkinliktir. Dilerseniz rezervasyon aşamasında paketinize indirimli olarak ekleyebiliriz.
• **Gündoğumu Uçuşu:** Uçuşlar sabah 05:00-06:00 civarında başlar ve peri bacaları üzerinde yaklaşık 1 saat sürer. Otel transferi ve uçuş sonrası şampanyalı kutlama dahildir.
• **%100 Hava Durumu İade Garantisi:** Balon uçuşları Sivil Havacılık kontrolündedir. Rüzgar veya hava muhalefeti nedeniyle iptal olması durumunda balon ücreti **%100 kesintisiz iade edilir**!
• **Tavsiye:** Kapadokya'da en az 2 veya 3 gün kalmak, ilk gün hava uygun olmasa bile ikinci gün uçma şansınızı garantiye alır.

Dilerseniz Kapadokya içeren **2, 3, 4 veya 5 günlük** paketlerimizi inceleyebilir veya WhatsApp'tan anında yer ayırtabilirsiniz!`;
    } else {
      return `🎈 **About Cappadocia Hot Air Balloon Flights:**

• **Is it included?** On standard packages, the hot air balloon flight is an **optional add-on** at exclusive partner rates.
• **Sunrise Experience:** Launches at sunrise around 05:30 AM, offering a magical 60-minute flight over the fairy chimneys and valleys. Includes boutique hotel pickup and a celebratory champagne toast.
• **100% Weather Refund Guarantee:** Flights are regulated by Turkish Civil Aviation for maximum safety. If cancelled due to high winds, your balloon fee is **100% fully refunded immediately**!
• **Pro Tip:** Staying at least 2 or 3 nights in Cappadocia gives you multiple sunrise flight windows.

Would you like to explore our **2, 3, 4, or 5-day Cappadocia packages**?`;
    }
  }

  // 2. Paketlerin İçeriği & Neler Dahil / Hariç (Inclusions & Exclusions)
  if (
    q.includes('dahil') ||
    q.includes('hariç') ||
    q.includes('include') ||
    q.includes('exclude') ||
    q.includes('uçak') ||
    q.includes('transfer') ||
    q.includes('otel') ||
    q.includes('hotel') ||
    q.includes('flight')
  ) {
    if (isTr) {
      return `✨ **Voyra Tours Paketlerimize Neler Dahil?**

✅ **Dahil Olan Hizmetler:**
• Seçkin **butik mağara oteller** (Kapadokya) ve 4*/5* tarihi konaklar (İstanbul, Ege, Akdeniz)
• Şehirlerarası tüm **iç hat uçak biletleri** (İstanbul ⇄ Kapadokya ⇄ İzmir vb.)
• Klimalı Mercedes VIP araçlarla tüm havalimanı ve tur transferleri
• Lisanslı profesyonel **tarihçi rehberlik hizmeti**
• Tüm müze ve örenyeri giriş ücretleri (Müze kart / bilet sıraları beklemeden)
• Tur günlerinde geleneksel yöresel öğle yemekleri & otellerde açık büfe kahvaltılar

❌ **Dahil Olmayanlar:**
• Uluslararası dış hat uçuşları
• Akşam yemekleri ve kişisel harcamalar
• İsteğe bağlı aktiviteler (Balon turu, ATV safari, Türk Gecesi)`;
    } else {
      return `✨ **What is Included in Voyra Tour Packages?**

✅ **Always Included:**
• Curated boutique cave suites (Cappadocia) and authentic heritage 4*/5* hotels
• All **domestic flight tickets** within Turkey (e.g. Istanbul ⇄ Cappadocia ⇄ Izmir)
• Private VIP Mercedes airport & tour transfers
• Licensed professional historian guides
• All museum & ancient ruins entry tickets (skip-the-line access)
• Delicious local lunches on touring days & artisan daily breakfast at hotels

❌ **Not Included:**
• International flights to/from Turkey
• Dinners & personal shopping
• Optional excursions (Hot air balloon flight, ATV sunset safari, Turkish Night show)`;
    }
  }

  // 3. Gün Sayısına Göre Turlar (2 to 9 Days Tours)
  const dayMatch = q.match(/(\d+)\s*(gün|gun|day)/);
  if (dayMatch) {
    const days = parseInt(dayMatch[1], 10);
    const matchingTours = findToursByDuration(days);
    if (days >= 2 && days <= 9) {
      if (isTr) {
        let tourListText = '';
        if (matchingTours.length > 0) {
          tourListText = matchingTours
            .slice(0, 3)
            .map((t) => `• **${t.titleTr}** (€${t.priceEUR} / kişi başı) - ${t.destinationTr}`)
            .join('\n');
        } else {
          tourListText = `• ${days} günlük hazır veya kişiye özel hazırlanabilen özel rotalarımız mevcuttur.`;
        }

        return `🗓️ **${days} Günlük Türkiye Tur Paketlerimiz:**

${tourListText}

🔹 **Bu turda sizi neler bekliyor?**
Tüm iç hat uçuşları, VIP transferler, seçkin butik oteller ve lisanslı rehberler eşliğinde baştan sona eksiksiz organize edilir.

👉 Üst menüdeki **"Turlar & Paketler" > "${days} Günlük Turlar"** sekmesinden tüm detaylı programı görebilir veya size özel uyarlanması için bize yazabilirsiniz!`;
      } else {
        let tourListText = '';
        if (matchingTours.length > 0) {
          tourListText = matchingTours
            .slice(0, 3)
            .map((t) => `• **${t.title}** (€${t.priceEUR} / person) - ${t.destination}`)
            .join('\n');
        } else {
          tourListText = `• Custom curated ${days}-day journeys available upon request.`;
        }

        return `🗓️ **${days}-Day Turkey Tour Packages:**

${tourListText}

🔹 **What's included?**
Domestic flights, private airport transfers, boutique cave/heritage hotels, and licensed historian guides.

👉 You can explore all itineraries under **"Tours & Packages" > "${days}-Day Tours"** or let us customize this for you!`;
      }
    }
  }

  // 4. Popüler Rotalar / Kaç Gün Ayırmalı? (Duration recommendation)
  if (
    q.includes('kaç gün') ||
    q.includes('kac gun') ||
    q.includes('how many days') ||
    q.includes('hangisi') ||
    q.includes('öneri') ||
    q.includes('recommend') ||
    q.includes('en popüler') ||
    q.includes('popular')
  ) {
    if (isTr) {
      return `🌟 **En Çok Tercih Edilen Türkiye Rotaları:**

1. **4 Günlük Tur (İstanbul & Kapadokya):** Zamanı kısıtlı olanlar için mükemmel bir ikili! 2 gün tarihi İstanbul sarayları, 2 gün Kapadokya peri bacaları ve sıcak hava balonu.
2. **5 Günlük Tur (Altın Üçgen):** Türkiye'nin en popüler rotası! Kapadokya + Pamukkale travertenleri + Antik Efes kenti.
3. **7 Günlük Tur (Turkuaz Kıyı & Likya):** Antalya, Kekova batık şehri, Kaş ve Ölüdeniz mavilikleri.
4. **8-9 Günlük Büyük Türkiye Turu:** İstanbul, Kapadokya, Antalya, Pamukkale ve Efes'i birleştiren eksiksiz rüya yolculuğu.

Hangi bölgeye gitmek istediğinizi söylerseniz size en uygun turu hemen önerebilirim!`;
    } else {
      return `🌟 **Our Most Popular Turkey Itineraries:**

1. **4-Day Dual Highlights (Istanbul & Cappadocia):** Ideal for travellers with a short break. Historic sultans' palaces and Cappadocia sunrise balloons.
2. **5-Day Golden Triangle (Cappadocia, Pamukkale, Ephesus):** Turkey’s crown jewel route!
3. **7-Day Turquoise Coast & Lycian Wonders:** Mediterranean cruise, sunken city of Kekova, Kas, and Oludeniz.
4. **8-9 Day Ultimate Grand Turkey Loop:** Complete journey covering Istanbul, Cappadocia, Antalya coast, and Ephesus.

Which destinations are on your wishlist?`;
    }
  }

  // 5. Efes & Pamukkale (Ephesus & Pamukkale)
  if (
    q.includes('efes') ||
    q.includes('ephesus') ||
    q.includes('pamukkale') ||
    q.includes('hierapolis')
  ) {
    if (isTr) {
      return `🏛️ **Efes & Pamukkale Turlarımız:**

• **Efes Antik Kenti:** Celsus Kütüphanesi, Antik Tiyatro ve Meryem Ana Evi ziyaretleri.
• **Pamukkale:** Beyaz traverten terasları, Kleopatra Antik Termal Havuzu ve Hierapolis kalıntıları.
• **Süre:** 2 günlük hızlı ekspres turumuz veya Kapadokya ile birleşen **5 ve 6 günlük Altın Üçgen** paketlerimiz en çok tercih edilenlerdir.
• **Ulaşım:** İzmir/Denizli havalimanı VIP transferleri ve iç hat uçuşları dahildir.`;
    } else {
      return `🏛️ **Ephesus & Pamukkale Tours:**

• **Ancient Ephesus:** Celsus Library, Grand Theater, and the House of Virgin Mary with expert historian guides.
• **Pamukkale:** Natural white travertine thermal terraces and Cleopatra’s Antique Pool in Hierapolis.
• **Duration:** Available as a 2-Day Express getaway or seamlessly combined in our signature **5-Day and 6-Day Golden Triangle** loops with Cappadocia.
• **Transfers:** Private Mercedes vehicles and domestic flights between Istanbul and Izmir/Denizli are included.`;
    }
  }

  // 6. Kişiye Özel Tur / Özel İstekler (Tailor-Made & Custom Requests)
  if (
    q.includes('özel') ||
    q.includes('ozel') ||
    q.includes('tailor') ||
    q.includes('custom') ||
    q.includes('balayı') ||
    q.includes('honeymoon') ||
    q.includes('aile') ||
    q.includes('family') ||
    q.includes('grup') ||
    q.includes('group')
  ) {
    if (isTr) {
      return `✨ **%100 Kişiye Özel Tur Planlama (Bespoke Travel):**

Voyra Tours olarak seyahatinizi tamamen sizin zevkinize göre tasarlıyoruz:
• İstediğiniz gün sayısı (1 günden 20 güne kadar)
• Balayı çiftlerine özel jakuzili lüks mağara süitleri ve romantik vadi yemekleri
• Aileler ve çocuklu misafirler için sakin ve konforlu tempo
• Özel lüks araçlar ve sadece size özel kokartlı rehber

Sitemizdeki **"Kişiye Özel Tur"** formunu doldurabilir veya hemen **WhatsApp (+90 532 000 0000)** üzerinden bize yazabilirsiniz! 24 saat içinde size özel teklif sunuyoruz.`;
    } else {
      return `✨ **100% Tailor-Made & Bespoke Travel:**

We specialize in crafting completely customized journeys:
• Any duration (from a 2-day escape to a 20-day Grand Expedition)
• Honeymoon cave suites with panoramic terraces and private valley dinners
• Family-friendly itineraries with gentle pacing
• Dedicated private Mercedes vans and personal historian guides

You can submit your dream travel ideas via our **"Tailor-Made"** planner or chat directly on **WhatsApp (+90 532 000 0000)**!`;
    }
  }

  // 7. Fiyat, Rezervasyon & Ödeme (Pricing & Booking)
  if (
    q.includes('fiyat') ||
    q.includes('ücret') ||
    q.includes('price') ||
    q.includes('cost') ||
    q.includes('rezervasyon') ||
    q.includes('booking') ||
    q.includes('öde') ||
    q.includes('pay')
  ) {
    if (isTr) {
      return `💳 **Fiyatlandırma ve Rezervasyon Bilgileri:**

• **Fiyatlar:** 2 günlük ekspres turlarımız yaklaşık **€320 - €490**'dan başlarken, 4-5 günlük kapsamlı paketlerimiz ortalama **€690 - €890** aralığındadır.
• **Net Fiyat:** Fiyatlarımıza iç hat uçuşları, butik oteller, VIP transferler, müze biletleri ve rehberlik dahildir; gizli hiçbir ek ücret yoktur.
• **Rezervasyon:** Beğendiğiniz turun detayındaki **"Rezervasyon Yap"** butonuna tıklayabilir veya WhatsApp üzerinden tarihlerinizi ileterek anında ön rezervasyon oluşturabilirsiniz.
• **Ödeme:** Güvenli kredi kartı veya banka havalesi ile kolay ödeme imkanı mevcuttur.`;
    } else {
      return `💳 **Pricing & Booking Information:**

• **Rates:** 2-day express tours start around **€320 – €490**, while 4 to 5-day comprehensive packages range from **€690 – €890** per person.
• **Transparent Pricing:** Rates include boutique accommodations, domestic flight tickets, private VIP transfers, licensed guiding, and museum entries.
• **How to Book:** Simply click **"Book This Tour"** on any tour page or message us directly on WhatsApp with your planned dates.
• **Payment:** Secure online payment via credit card or bank wire transfer.`;
    }
  }

  // 8. Selamlama (Greetings)
  if (
    q === 'merhaba' ||
    q === 'selam' ||
    q.startsWith('merhaba') ||
    q.startsWith('selam') ||
    q === 'hello' ||
    q === 'hi' ||
    q.startsWith('hello') ||
    q.startsWith('hi ') ||
    q.includes('günaydın') ||
    q.includes('iyi günler')
  ) {
    if (isTr) {
      return `👋 Merhaba! Voyra Tours'a hoş geldiniz. 

Kapadokya sıcak hava balonları, İstanbul, Efes, Pamukkale veya Antalya turlarımız hakkında sormak istediğiniz her konuda size yardımcı olmaktan mutluluk duyarım. 

Özellikle ilgilendiğiniz bir bölge veya planladığınız bir gün sayısı var mı?`;
    } else {
      return `👋 Hello! Welcome to Voyra Tours. 

I'd be delighted to assist you with Cappadocia balloon rides, Istanbul heritage, Ephesus ruins, or our 2 to 9-day tour packages. 

Is there a specific region or duration you have in mind for your trip?`;
    }
  }

  // 9. Eğer kullanıcı "çalışmıyor", "hata", "test", "burası" dediyse
  if (
    q.includes('çalışmıyor') ||
    q.includes('calismiyor') ||
    q.includes('not working') ||
    q.includes('burası') ||
    q.includes('test') ||
    q.includes('kimsin') ||
    q.includes('who are you')
  ) {
    if (isTr) {
      return `Harika! Ben **Voyra AI Seyahat Asistanınızım** ve şu anda aktif olarak hizmetinizdeyim. 😊

Kapadokya balon uçuşları, iç hat uçuşlu 2-9 günlük hazır tur paketlerimiz, butik otellerimiz veya kişiye özel tatil planlama hakkında her türlü sorunuzu yanıtlayabilirim.

Hangi rota veya gün sayısı hakkında bilgi almak istersiniz?`;
    } else {
      return `I am here! I am **Voyra AI Travel Concierge** and fully online to help you. 😊

Feel free to ask me anything about Cappadocia balloon tours, 2 to 9-day packages with domestic flights, boutique cave hotels, or tailor-made itineraries.

Which destinations or dates are you planning for?`;
    }
  }

  // 10. Default contextual / intelligent response
  if (activeTour) {
    const tourTitle = isTr ? activeTour.titleTr : activeTour.title;
    if (isTr) {
      return `Şu anda incelediğiniz **"${tourTitle}"** turumuz (${activeTour.durationDays} Gün / ${activeTour.durationDays - 1} Gece) en sevilen programlarımızdan biridir. 

Bu tur hakkında daha fazla bilgi, fiyata dahil olan iç hat uçuşları veya otel detayları hakkında ne öğrenmek istersiniz? Ayrıca doğrudan **WhatsApp (+90 532 000 0000)** üzerinden uzmanlarımızla da görüşebilirsiniz.`;
    } else {
      return `You are currently viewing **"${tourTitle}"** (${activeTour.durationDays} Days / ${activeTour.durationDays - 1} Nights), one of our signature curated journeys.

Would you like to know more about the domestic flights, cave hotels, or daily itinerary? You can also message our travel experts directly on **WhatsApp (+90 532 000 0000)**.`;
    }
  }

  // Default response
  if (isTr) {
    return `Anladım! Voyra Tours olarak Kapadokya peri bacaları, Antik Efes, Pamukkale beyaz travertenleri ve İstanbul turlarında uzmanlaşmış butik bir seyahat acentesiyiz.

• **2'den 9'a kadar** gün seçenekli hazır paket turlarımız
• **Kişiye özel** VIP rotalar ve balayı programları
• **%100 garantili** Kapadokya sıcak hava balonu rezervasyonları

Aklınıza takılan detayları sorabilir veya doğrudan **+90 532 000 0000** numaralı WhatsApp hattımızdan seyahat danışmanımıza ulaşabilirsiniz.`;
  } else {
    return `Certainly! At Voyra Tours, we specialize in luxury boutique travel across Turkey, including Cappadocia, Ephesus, Pamukkale, Istanbul, and the Turquoise Coast.

• **2 to 9-Day** signature curated packages with domestic flights & boutique hotels
• **100% Tailor-made** bespoke itineraries & honeymoon journeys
• **Guaranteed sunrise** Cappadocia hot air balloon bookings

Feel free to ask me about any itinerary, or chat with our team on **WhatsApp (+90 532 000 0000)** anytime!`;
  }
}
