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

  // 1. Kapadokya Turları & Genel Tur Danışmanlığı (Cappadocia & Tour Guidance)
  if (
    q.includes('kapadokya') ||
    q.includes('cappadocia') ||
    q.includes('peri baca') ||
    q.includes('fairy chimney')
  ) {
    // If specifically asking about balloon, give balloon details with duration tips
    if (q.includes('balon') || q.includes('balloon') || q.includes('uçuş') || q.includes('flight')) {
      if (isTr) {
        return `🎈 **Kapadokya Sıcak Hava Balon Uçuşları & Paket Bilgisi:**

• **Fiyata Dahil mi?** Standart paket turlarımızda balon turu **opsiyonel** bir etkinliktir. Dilerseniz rezervasyon aşamasında paketinize özel acente indirimli fiyatıyla ekleyebiliriz.
• **Gündoğumu Uçuşu:** Uçuşlar sabah 05:00-06:00 civarında başlar ve peri bacaları üzerinde yaklaşık 1 saat sürer. Otel transferi ve uçuş sonrası şampanyalı kutlama dahildir.
• **%100 Hava Durumu İade Garantisi:** Balon uçuşları Sivil Havacılık kontrolündedir. Rüzgar veya hava muhalefeti nedeniyle iptal olması durumunda balon ücreti **%100 kesintisiz iade edilir**!
• **Önemli Tavsiye:** Kapadokya'da en az 2 veya 3 gün kalmak, ilk gün hava muhalefeti olsa bile ikinci gün uçma şansınızı garantiye alır.

🗓️ **Kapadokya için kaç günlük bir seyahat düşünüyorsunuz?**
• **2 Günlük Hızlı Kaçamak:** €555 / kişi başı (Uçak, mağara otel, rehberli turlar)
• **3 Günlük Derinlemesine Tur:** €690 / kişi başı (Ihlara Vadisi ve Yeraltı Şehri dahil)`;
      } else {
        return `🎈 **Cappadocia Hot Air Balloon Flights & Packages:**

• **Is it included?** On standard packages, the sunrise balloon flight is an **optional add-on** at exclusive agency rates.
• **The Experience:** Launches at sunrise, offering a 60-minute flight over the fairy chimneys with boutique hotel pickup and champagne toast.
• **100% Weather Refund Guarantee:** Flights are regulated by Turkish Civil Aviation. If cancelled due to wind, your balloon fee is **100% fully refunded immediately**!
• **Pro Tip:** Staying at least 2 or 3 nights in Cappadocia gives you multiple sunrise flight windows.

🗓️ **How many days are you planning for Cappadocia?**
• **2-Day Quick Escape:** €555 / person (Flights, cave hotel, guided tours)
• **3-Day In-Depth Journey:** €690 / person (Ihlara Valley & Underground Cities included)`;
      }
    }

    // 2-Day Cappadocia Tour specific breakdown
    if (q.includes('2 gün') || q.includes('2 gun') || q.includes('2-day') || q.includes('2 day') || (q.includes('iki') && q.includes('gün'))) {
      if (isTr) {
        return `🌟 **2 Günlük Büyülü Kapadokya Kaçamağı (€555 / Kişi Başı)**

Zamanı kısıtlı olan misafirlerimiz için en popüler ve verimli Kapadokya programımızdır:

• **1. Gün (Kırmızı Tur):** Sabah İstanbul'dan Kapadokya uçuşu. VIP araçla karşılama. Göreme Açık Hava Müzesi, Paşabağ (Keşişler Vadisi), Devrent Hayal Vadisi, Avanos çömlek atölyesi ve Uçhisar Kalesi panoraması. Akşam butik mağara otele yerleşme.
• **2. Gün (Gün Doğumu & Vadi Keşfi):** Sabah gün doğumunda Kapadokya Sıcak Hava Balon Uçuşu (opsiyonel) veya balonları vadiden izleme. Güvercinlik Vadisi, Kaymaklı/Derinkuyu Yeraltı Şehri keşfi. Akşam üzeri havalimanı transferi ve İstanbul'a dönüş uçuşu.

✅ **Fiyata Dahil Olanlar:**
- İstanbul ⇄ Kapadokya gidiş-dönüş iç hat uçak biletleri
- 1 Gece Seçkin Butik Mağara Otel konaklaması ve açık büfe artisan kahvaltı
- Klimalı Mercedes VIP araçlarla tüm transferler
- Lisanslı profesyonel tarihçi rehberlik hizmeti ve tüm müze giriş ücretleri
- 2 gün boyunca yöresel öğle yemekleri

💰 **Bütçe Seçenekleri:**
- **Butik Standart Mağara:** €555 / kişi
- **Balayı / Lüks Jakuzili Mağara Süiti:** Özel fiyat farkı ile rezerve edilebilir.

👉 Tarihlerinize göre müsaitlik ve rezervasyon için doğrudan **WhatsApp (+90 532 000 0000)** hattımızdan bize yazabilirsiniz!`;
      } else {
        return `🌟 **2-Day Magical Cappadocia & Cave Suite Escape (€555 / Person)**

Our top-rated express journey designed for travelers with limited time:

• **Day 1 (Red Tour):** Morning flight from Istanbul to Cappadocia. VIP transfer. Göreme Open Air Museum, Paşabağ fairy chimneys, Devrent Imagination Valley, Avanos pottery masterclass & Uçhisar viewpoint. Check into your boutique cave hotel.
• **Day 2 (Sunrise & Underground Cities):** Optional sunrise hot air balloon flight or scenic balloon watching. Pigeon Valley, Kaymaklı/Derinkuyu underground city. Afternoon VIP airport transfer and return flight to Istanbul.

✅ **What is Included:**
- Roundtrip domestic flights (Istanbul ⇄ Cappadocia)
- 1 Night in a handpicked boutique cave hotel with artisan breakfast
- Private Mercedes VIP airport & tour transfers
- Licensed professional historian guide & skip-the-line museum tickets
- Authentic local lunches on tour days

💰 **Style & Budget:**
- **Curated Cave Room:** €555 / person
- **Honeymoon / Luxury Jacuzzi Cave Suite:** Available upon request.

👉 Ready to check dates or reserve? Chat directly on **WhatsApp (+90 532 000 0000)**!`;
      }
    }

    // 3-Day Cappadocia Tour specific breakdown
    if (q.includes('3 gün') || q.includes('3 gun') || q.includes('3-day') || q.includes('3 day') || (q.includes('üç') && q.includes('gün'))) {
      if (isTr) {
        return `🌟 **3 Günlük Derinlemesine Kapadokya Turu (€690 / Kişi Başı)**

Kapadokya'yı acele etmeden, vadileri yürüyerek ve 2 gün doğumu balon izleme şansıyla yaşamak isteyenlerin tercihi:

• **1. Gün:** İstanbul - Kapadokya uçuşu. Göreme Açık Hava Müzesi, Aşk Vadisi, Çavuşin Köyü ve Paşabağ. Butik mağara otele yerleşme.
• **2. Gün (Balon & Yeşil Tur):** Sabah erken gün doğumu balon uçuşu. Ardından Ihlara Vadisi kanyon yürüyüşü, Melendiz Çayı kenarında öğle yemeği, Selime Kaya Manastırı ve Derinkuyu Yeraltı Şehri.
• **3. Gün:** Uçhisar Kalesi, Güvercinlik Vadisi, Kızılçukur gün batımı vadisi ve el sanatları atölyeleri. Akşam havalimanı transferi.

✅ **Fiyata Dahil:** Tüm iç hat uçuşları, 2 gece butik mağara otel, Mercedes VIP transferler, rehberlik, müze biletleri ve öğle yemekleri.
💰 **Fiyat:** €690 / kişi başı.

👉 Rezervasyon ve müsaitlik için **WhatsApp (+90 532 000 0000)** hattımızdan anında bilgi alabilirsiniz!`;
      } else {
        return `🌟 **3-Day In-Depth Cappadocia & Underground Cities (€690 / Person)**

The ideal pacing with 2 sunrise flight windows and deep valley exploration:

• **Day 1:** Morning flight from Istanbul. Göreme Open Air Museum, Love Valley, Paşabağ. Cave hotel check-in.
• **Day 2 (Green Tour & Balloons):** Sunrise hot air balloon flight. Ihlara Valley canyon hike, riverside lunch at Melendiz River, Selime Rock Monastery & Derinkuyu Underground City.
• **Day 3:** Uçhisar Castle, Pigeon Valley, Red Valley viewpoints, artisan workshops and evening airport transfer.

✅ **Included:** Roundtrip domestic flights, 2 nights boutique cave hotel, private Mercedes VIP transfers, expert guide, museum tickets & lunches.
💰 **Price:** €690 / person.

👉 Message us on **WhatsApp (+90 532 000 0000)** to confirm dates or customize!`;
      }
    }

    // General Cappadocia inquiry - Guide with duration, budget, experiences, and group size!
    if (isTr) {
      return `✨ **Voyra Tours Kapadokya Seyahat Danışmanlığına Hoş Geldiniz!**

Kapadokya'nın büyülü peri bacalarını, yeraltı şehirlerini ve gün doğumu balonlarını en konforlu şekilde deneyimlemeniz için size rehberlik etmekten mutluluk duyarım.

Size en uygun turu belirleyebilmemiz için şu **4 temel özellik** üzerinden ilerleyebiliriz:

---

### 1. 📅 Gün Sayısı & Rota Seçeneklerimiz:
• **2 Gün / 1 Gece (€555/kişi):** Zamanı kısıtlı olanlar için ideal hızlı kaçamak. Göreme Açık Hava Müzesi, Paşabağ, Devrent Vadisi, Uçhisar Kalesi ve 1 gün doğumu balon penceresi.
• **3 Gün / 2 Gece (€690/kişi):** En popüler programımız! Kırmızı Tur + Yeşil Tur (Derinkuyu Yeraltı Şehri ve Ihlara Vadisi doğa yürüyüşü) ile 2 gün doğumu balon penceresi.
• **4 Gün / 3 Gece (€930/kişi):** İstanbul ve Kapadokya İkilisi (Sultanahmet sarayları + Kapadokya peri bacaları).
• **5 Gün / 4 Gece (€1.280/kişi):** Altın Üçgen (Kapadokya + Pamukkale Travertenleri + Efes Antik Kenti).

---

### 2. 💰 Konaklama ve Bütçe Tercihiniz:
• **Otantik Butik Mağara Otel:** Geleneksel taş/kaya mimarili, konforlu standart paket.
• **Panoramik Lüks Süit:** Özel jakuzili ve balkonundan gün doğumunda balonları izleyebileceğiniz premium süitler (özellikle balayı çiftleri için önerilir).

---

### 3. 🎈 Katılmak İstediğiniz Aktiviteler:
• **Gün Doğumu Sıcak Hava Balon Uçuşu** (%100 hava muhalefeti iade garantili)
• **Gün Batımı ATV / Quad Safari** (Kızıl Vadi & Kılıçlar Vadisi)
• **Avanos Çömlek Yapımı & Geleneksel Türk Gecesi**

---

### 4. 👥 Seyahat Grubu:
Kaç kişi seyahat edeceksiniz? (Çift, balayı, çocuklu aile veya arkadaş grubu?)

👉 **Aklınızdaki gün sayısı ve bütçe tercihini paylaşabilir misiniz?** Size özel güncel programı ve fiyat teklifini anında paylaşabilirim. Dilerseniz **WhatsApp (+90 532 000 0000)** üzerinden uzmanlarımızla da anında görüşebilirsiniz!`;
    } else {
      return `✨ **Welcome to Voyra Tours Cappadocia Concierge!**

We are thrilled to help you explore Cappadocia’s magical fairy chimneys, underground cities, and sunrise balloons in complete boutique comfort.

To help you choose or customize the ideal journey, here are the key features to guide your decision:

---

### 1. 📅 Duration & Package Options:
• **2 Days / 1 Night (€555/person):** Perfect short getaway. Göreme Open Air Museum, Paşabağ, Devrent Valley, Uçhisar Castle & 1 sunrise balloon window.
• **3 Days / 2 Nights (€690/person):** Our most popular in-depth tour! Red Tour + Green Tour (Derinkuyu Underground City & Ihlara Valley hike) with 2 sunrise flight windows.
• **4 Days / 3 Nights (€930/person):** Best of Istanbul & Cappadocia highlights.
• **5 Days / 4 Nights (€1,280/person):** Golden Triangle (Cappadocia + Pamukkale + Ancient Ephesus).

---

### 2. 💰 Accommodation Style & Budget:
• **Curated Boutique Cave Hotel:** Authentic rock-carved rooms with modern comfort.
• **Panoramic Luxury Cave Suite:** With private jacuzzi and balloon-view terrace (ideal for honeymoons).

---

### 3. 🎈 Must-Have Experiences:
• **Sunrise Hot Air Balloon Flight** (100% weather refund guarantee)
• **Sunset ATV / Quad Safari** across Rose & Swords Valleys
• **Avanos Pottery Workshop & Cave Turkish Night Show**

---

### 4. 👥 Travelers:
How many guests will be traveling? (Couples/honeymoon, family with children, or private group?)

👉 **How many days do you have in mind, and what is your preferred style?** Reply with your preferences and I will give you a tailored plan, or chat with our specialists on **WhatsApp (+90 532 000 0000)**!`;
    }
  }

  // 2. Balon (Hot Air Balloon) - Genel
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

  // 10. Dynamic Tour Search across all tours in the catalog
  const cleanQ = q.replace(/[^a-z0-9ğüşıöç\s]/gi, ' ').trim();
  const searchWords = cleanQ.split(/\s+/).filter((w) => w.length >= 3 && !['tur', 'turu', 'turları', 'hakkında', 'bilgi', 'fiyat', 'fiyatı', 'fiyatları', 'nedir', 'nelerdir', 'varmı', 'var', 'mı', 'mu', 'how', 'much', 'tour', 'tours', 'about'].includes(w));

  if (searchWords.length > 0) {
    const matchedTours = TOURS_DATA.filter((t) => {
      const tourText = `${t.title} ${t.titleTr} ${t.destination} ${t.destinationTr} ${t.region || ''} ${t.overview || ''} ${t.overviewTr || ''}`.toLowerCase();
      return searchWords.some((w) => tourText.includes(w));
    });

    if (matchedTours.length > 0) {
      if (isTr) {
        const topMatches = matchedTours.slice(0, 3);
        const tourList = topMatches
          .map(
            (t) =>
              `• **${t.titleTr || t.title}** (${t.durationDays} Gün / ${t.durationNights || t.durationDays - 1} Gece) — **€${t.priceEUR} / kişi başı**\n  *Güzergah:* ${t.destinationTr || t.destination}\n  *Fiyata Dahil:* İç hat uçuşları, VIP transferler, butik otel konaklaması, rehberlik ve müze girişleri.`
          )
          .join('\n\n');

        return `Sistemimizde aradığınız kriterlere uygun ${matchedTours.length} adet tur programımız bulunmaktadır:\n\n${tourList}\n\n🗓️ Bu turlarımızdan herhangi birinin detaylı gün gün programını görmek ister misiniz, yoksa dilediğiniz tarihe özel VIP fiyat teklifi mi hazırlayalım?`;
      } else {
        const topMatches = matchedTours.slice(0, 3);
        const tourList = topMatches
          .map(
            (t) =>
              `• **${t.title}** (${t.durationDays} Days / ${t.durationNights || t.durationDays - 1} Nights) — **€${t.priceEUR} / person**\n  *Route:* ${t.destination}\n  *Inclusions:* Domestic flights, VIP Mercedes transfers, boutique hotels, licensed guide, and museum entries.`
          )
          .join('\n\n');

        return `We have ${matchedTours.length} curated journey(s) matching your request in our catalog:\n\n${tourList}\n\n🗓️ Would you like to review the day-by-day itinerary, or should we prepare a custom quote for your preferred dates?`;
      }
    }
  }

  // 11. Default contextual / intelligent response
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
