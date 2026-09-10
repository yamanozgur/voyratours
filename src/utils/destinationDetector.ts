import { TourPackage, DestinationInfo } from '../types';

export interface PredefinedRegionMeta {
  id: string;
  name: string;
  nameTr: string;
  tagline: string;
  taglineTr: string;
  image: string;
  popularHighlights: string[];
  popularHighlightsTr: string[];
  aliases: string[];
}

/**
 * Curated knowledge base of major Turkey tourism destinations, cities, and cultural hubs.
 */
export const PREDEFINED_TURKEY_REGIONS: PredefinedRegionMeta[] = [
  {
    id: 'cappadocia',
    name: 'Cappadocia',
    nameTr: 'Kapadokya',
    tagline: 'Fairy Chimneys, Cave Suites & Sunrise Hot Air Balloons',
    taglineTr: 'Peri Bacaları, Mağara Oteller ve Gün Doğumu Sıcak Hava Balonları',
    image: 'https://images.unsplash.com/photo-1570939274717-7eda259b50ed?auto=format&fit=crop&w=1200&q=85',
    popularHighlights: ['Sunrise Balloon Flight', 'Derinkuyu Underground City', 'Göreme Open Air Museum', 'Uçhisar Castle Panoramic View'],
    popularHighlightsTr: ['Gün Doğumu Balon Uçuşu', 'Derinkuyu Yeraltı Şehri', 'Göreme Açık Hava Müzesi', 'Uçhisar Kalesi Manzarası'],
    aliases: ['cappadocia', 'kapadokya', 'goreme', 'göreme', 'urgup', 'ürgüp', 'uchisar', 'uçhisar', 'avanos', 'derinkuyu', 'kaymakli', 'kaymaklı', 'ihlara'],
  },
  {
    id: 'konya',
    name: 'Konya',
    nameTr: 'Konya',
    tagline: 'Sufi Heritage, Mevlana Rumi & Seljuk Imperial Splendor',
    taglineTr: 'Mevlana Celaleddin Rumi, Tasavvuf Mirası ve Selçuklu Başkenti',
    image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1200&q=85',
    popularHighlights: ['Mevlana Rumi Tomb & Museum', 'Whirling Dervishes Ritual', 'Sultanhani Silk Road Caravanserai', 'Alaeddin Mosque & Hill'],
    popularHighlightsTr: ['Mevlana Müzesi ve Türbesi', 'Geleneksel Semazen Ayini', 'Sultanhanı Tarihi Kervansarayı', 'Alâeddin Camii ve Tepesi'],
    aliases: ['konya', 'mevlana', 'rumi', 'catalhoyuk', 'çatalhöyük', 'karatay', 'sultanhani', 'sultanhanı', 'ince minare'],
  },
  {
    id: 'mediterranean',
    name: 'Antalya & Turquoise Coast',
    nameTr: 'Antalya & Turkuaz Sahil',
    tagline: 'Sunken Lycian Cities, Azure Bays & Greco-Roman Theatres',
    taglineTr: 'Likya Antik Kentleri, Turkuaz Koylar ve Görkemli Roma Tiyatroları',
    image: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=1200&q=85',
    popularHighlights: ['Aspendos Roman Amphitheatre', 'Historic Kaleiçi Old Town', 'Düden Waterfalls', 'Kekova Sunken Ruins Yacht Cruise'],
    popularHighlightsTr: ['Aspendos Roma Amfitiyatrosu', 'Tarihi Kaleiçi Sokakları', 'Düden Şelaleleri', 'Kekova Batık Şehir Gulet Turu'],
    aliases: ['antalya', 'kaleici', 'kaleiçi', 'aspendos', 'perge', 'duden', 'düden', 'side', 'kemer', 'alanya', 'mediterranean', 'akdeniz'],
  },
  {
    id: 'aegean-ephesus',
    name: 'Ephesus & Pamukkale',
    nameTr: 'Efes & Pamukkale',
    tagline: 'Ancient Roman Grandeur & White Mineral Travertine Cascades',
    taglineTr: 'Antik Roma İhtişamı ve Beyaz Mineral Traverten Havuzları',
    image: 'https://images.unsplash.com/photo-1635166045025-b078ac986d77?auto=format&fit=crop&w=1200&q=85',
    popularHighlights: ['Library of Celsus', 'Pamukkale Travertine Terraces', 'House of Virgin Mary', 'Cleopatra Antique Thermal Pool'],
    popularHighlightsTr: ['Celsus Kütüphanesi', 'Pamukkale Traverten Havuzları', 'Meryem Ana Evi', 'Kleopatra Antik Termal Havuzu'],
    aliases: ['ephesus', 'efes', 'pamukkale', 'hierapolis', 'selcuk', 'selçuk', 'denizli', 'aegean', 'ege'],
  },
  {
    id: 'istanbul',
    name: 'Istanbul',
    nameTr: 'İstanbul',
    tagline: 'Two Continents, Grand Ottoman Palaces & Sunset Bosphorus Yachts',
    taglineTr: 'İki Kıta, İhtişamlı Osmanlı Sarayları ve Gün Batımı Boğaz Yat Turları',
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=85',
    popularHighlights: ['Hagia Sophia Grand Mosque', 'Topkapi Imperial Palace', 'Private Bosphorus Sunset Yacht Cruise', 'Historic Grand Bazaar'],
    popularHighlightsTr: ['Ayasofya-i Kebir Camii', 'Topkapı Sarayı', 'Özel Boğaz Yat Turu', 'Tarihi Kapalıçarşı'],
    aliases: ['istanbul', 'istanbul', 'bosphorus', 'boğaz', 'sultanahmet', 'ayasofya', 'topkapi', 'topkapı'],
  },
  {
    id: 'gallipoli',
    name: 'Gallipoli & Troy',
    nameTr: 'Çanakkale & Truva',
    tagline: 'Homeric Epics, Trojan Horse & Historic Battlefields of 1915',
    taglineTr: 'Homeros Destanları, Truva Efsanesi ve 1915 Çanakkale Siperleri',
    image: 'https://images.unsplash.com/photo-1572025442646-866d16c84a54?auto=format&fit=crop&w=1200&q=85',
    popularHighlights: ['Ancient Troy & Legendary Wooden Horse', 'ANZAC Cove Memorial', 'Chunuk Bair', 'Dardanelles Strait Ferry Crossing'],
    popularHighlightsTr: ['Truva Antik Kenti ve Tahta At', 'Anzak Koyu Anıtı', 'Conkbayırı', 'Çanakkale Boğazı Geçişi'],
    aliases: ['gallipoli', 'troy', 'truva', 'canakkale', 'çanakkale', 'anzac', 'anzak', 'dardanelles'],
  },
  {
    id: 'bodrum',
    name: 'Bodrum',
    nameTr: 'Bodrum',
    tagline: 'White-Washed Aegean Villas, St. Peter Castle & Gulet Charters',
    taglineTr: 'Beyaz Ege Evleri, Tarihi Bodrum Kalesi ve Özel Gulet Koy Turları',
    image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=85',
    popularHighlights: ['Castle of St. Peter & Underwater Museum', 'Halicarnassus Mausoleum', 'Private Gulet Blue Cruise', 'Yalıkavak Marina & Windmills'],
    popularHighlightsTr: ['Bodrum Kalesi ve Sualtı Arkeoloji Müzesi', 'Halikarnas Mozolesi', 'Mavi Yolculuk Özel Gulet Turu', 'Yalıkavak Marina ve Değirmenler'],
    aliases: ['bodrum', 'halicarnassus', 'halikarnas', 'yalikavak', 'yalıkavak'],
  },
  {
    id: 'fethiye',
    name: 'Fethiye & Ölüdeniz',
    nameTr: 'Fethiye & Ölüdeniz',
    tagline: 'Blue Lagoon, Butterfly Valley & Lycian Rock Tombs',
    taglineTr: 'Ölüdeniz Mavi Lagün, Kelebekler Vadisi ve Likya Kaya Mezarları',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85',
    popularHighlights: ['Ölüdeniz Blue Lagoon Paragliding', 'Butterfly Valley Boat Excursion', 'Kayaköy Ghost Village', 'Saklıkent Gorge Canyon Walk'],
    popularHighlightsTr: ['Ölüdeniz Lagün Yamaç Paraşütü', 'Kelebekler Vadisi Tekne Turu', 'Kayaköy Tarihi Rum Köyü', 'Saklıkent Kanyonu Keşfi'],
    aliases: ['fethiye', 'oludeniz', 'ölüdeniz', 'butterfly valley', 'kelebekler vadisi', 'kayakoy', 'kayaköy', 'saklikent', 'saklıkent'],
  },
  {
    id: 'kas-kalkan',
    name: 'Kaş & Kalkan',
    nameTr: 'Kaş & Kalkan',
    tagline: 'Charming Cobblestone Harbors, Kaputaş Beach & Sunken City of Kekova',
    taglineTr: 'Begonvilli Taş Sokaklar, Kaputaş Plajı ve Kekova Batık Şehir',
    image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1200&q=85',
    popularHighlights: ['Kekova Sunken City Island by Sea Kayak', 'Kaputaş Canyon Beach', 'Antiphellos Ancient Amphitheatre', 'Meis Island Panoramic Ferry'],
    popularHighlightsTr: ['Kekova Batık Kent Deniz Kanosu', 'Kaputaş Kanyon Plajı', 'Antiphellos Antik Tiyatrosu', 'Kaş Tarihi Çarşısı'],
    aliases: ['kas', 'kaş', 'kalkan', 'kekova', 'kaputas', 'kaputaş', 'simena'],
  },
  {
    id: 'mardin',
    name: 'Mardin & Mesopotamia',
    nameTr: 'Mardin & Mezopotamya',
    tagline: 'Stone Mansions, Ancient Monasteries & Sweeping Mesopotamian Plains',
    taglineTr: 'Otantik Taş Konaklar, Süryani Manastırları ve Mezopotamya Ovası',
    image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1200&q=85',
    popularHighlights: ['Deyrulzafaran Saffron Monastery', 'Dara Ancient Roman Fortress Ruins', 'Historic Stone Bazaar & Silver Filigree', 'Midyat Old Town & Mor Gabriel'],
    popularHighlightsTr: ['Deyrulzafaran Süryani Manastırı', 'Dara Antik Kenti Harabeleri', 'Tarihi Mardin Taş Sokakları ve Telkari', 'Midyat Konukevi ve Mor Gabriel'],
    aliases: ['mardin', 'midyat', 'mezopotamya', 'mesopotamia', 'deyrulzafaran', 'dara'],
  },
  {
    id: 'sanliurfa',
    name: 'Şanlıurfa & Göbeklitepe',
    nameTr: 'Şanlıurfa & Göbeklitepe',
    tagline: 'The Cradle of Civilization, 12,000-Year-Old Temples & Prophets',
    taglineTr: 'Uygarlığın Sıfır Noktası, 12.000 Yıllık Göbeklitepe ve Peygamberler Şehri',
    image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1200&q=85',
    popularHighlights: ['Göbeklitepe UNESCO Megalithic Sanctuary', 'Balıklıgöl Sacred Pool of Abraham', 'Harran Mudbrick Beehive Houses', 'Archaeological Museum of Urfa'],
    popularHighlightsTr: ['Göbeklitepe Arkeolojik Alanı', 'Tarihi Balıklıgöl ve Ayn Zeliha', 'Harran Kümbet Evleri', 'Şanlıurfa Mozaik ve Arkeoloji Müzesi'],
    aliases: ['sanliurfa', 'şanlıurfa', 'urfa', 'gobeklitepe', 'göbeklitepe', 'karahantepe', 'harran', 'balikligol', 'balıklıgöl'],
  },
  {
    id: 'gaziantep',
    name: 'Gaziantep',
    nameTr: 'Gaziantep',
    tagline: 'UNESCO Gastronomy Capital, Zeugma Mosaics & Coppersmith Bazars',
    taglineTr: 'UNESCO Gastronomi Başkenti, Zeugma Mozaikleri ve Tarihi Bakırcılar Çarşısı',
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=85',
    popularHighlights: ['Zeugma Mosaic Museum & Gypsy Girl', 'Historic Coppersmiths Bazaar', 'Traditional Pistachio Baklava Tasting', 'Gaziantep Castle & Old Citadel'],
    popularHighlightsTr: ['Zeugma Mozaik Müzesi ve Çingene Kızı', 'Tarihi Bakırcılar Çarşısı', 'Otantik Antep Baklavası ve Mutfak Keşfi', 'Gaziantep Kalesi ve Tahmis Kahvesi'],
    aliases: ['gaziantep', 'antep', 'zeugma', 'bakırcılar', 'coppersmith'],
  },
  {
    id: 'trabzon',
    name: 'Trabzon & Black Sea',
    nameTr: 'Trabzon & Karadeniz',
    tagline: 'Cliffside Sumela Monastery, Emerald Highland Valleys & Tea Terraces',
    taglineTr: 'Sarp Kayalıklarda Sümela Manastırı, Zümrüt Yaylalar ve Çay Bahçeleri',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
    popularHighlights: ['Sümela Rock-Cut Monastery', 'Uzungöl Alpine Lake', 'Ayder Highland & Cloud Valleys', 'Fırtına River & Ottoman Stone Bridges'],
    popularHighlightsTr: ['Sümela Kaya Manastırı', 'Uzungöl Tabiat Parkı', 'Ayder Yaylası ve Bulut Denizi', 'Fırtına Deresi ve Tarihi Kemer Köprüler'],
    aliases: ['trabzon', 'black sea', 'karadeniz', 'sumela', 'sümela', 'uzungol', 'uzungöl', 'rize', 'ayder'],
  },
  {
    id: 'kars',
    name: 'Kars & Ani Ruins',
    nameTr: 'Kars & Ani Harabeleri',
    tagline: 'City of 1001 Churches, Frozen Lake Çıldır & Russian Architecture',
    taglineTr: '1001 Kiliseli Ani Antik Kenti, Donmuş Çıldır Gölü ve Baltık Mimarisi',
    image: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1200&q=85',
    popularHighlights: ['UNESCO Medieval Ani Ruins on Silk Road', 'Frozen Lake Çıldır Horse Sleigh', 'Baltic Stone Architecture Walk', 'Kars Castle & Cheese Tasting'],
    popularHighlightsTr: ['UNESCO Ani Harabeleri ve İpek Yolu Köprüsü', 'Donmuş Çıldır Gölü Atlı Kızak Turu', 'Tarihi Baltık Mimarisi Evleri', 'Kars Kalesi ve Meşhur Gravyer Keşfi'],
    aliases: ['kars', 'ani', 'cildir', 'çıldır', 'sarikamis', 'sarıkamış'],
  },
  {
    id: 'nemrut',
    name: 'Mount Nemrut',
    nameTr: 'Nemrut Dağı',
    tagline: 'Colossal Royal Statues, Sunrise Sanctuaries & Commagene Kings',
    taglineTr: 'Devasa Kral Heykelleri, Gün Doğumu Terasları ve Kommagene Krallığı',
    image: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=1200&q=85',
    popularHighlights: ['Sunrise at Mount Nemrut Sanctuary', 'Arsameia & Ancient Cendere Bridge', 'Karakuş Tumulus', 'Taurus Mountain Panoramas'],
    popularHighlightsTr: ['Nemrut Dağı Zirvesinde Gün Doğumu', 'Cendere Roma Taş Köprüsü', 'Arsameia Ören Yeri', 'Karakuş Tümülüsü'],
    aliases: ['nemrut', 'mount nemrut', 'commagene', 'kommagene', 'adiyaman', 'adıyaman'],
  },
  {
    id: 'bursa',
    name: 'Bursa & Cumalıkızık',
    nameTr: 'Bursa & Cumalıkızık',
    tagline: 'First Ottoman Capital, Green Mosques & Silk Caravanserais',
    taglineTr: 'İlk Osmanlı Başkenti, Yeşil Türbe, İpek Hanları ve Cumalıkızık',
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=85',
    popularHighlights: ['Grand Mosque (Ulu Cami)', 'Historic Koza Han Silk Bazaar', 'UNESCO Cumalıkızık Ottoman Village', 'Uludağ Cable Car & Mountain View'],
    popularHighlightsTr: ['Ulu Cami ve Şadırvanı', 'Tarihi Koza Han İpek Pazarı', 'UNESCO Cumalıkızık Köyü', 'Uludağ Teleferik Gezisi'],
    aliases: ['bursa', 'cumalikizik', 'cumalıkızık', 'uludag', 'uludağ', 'koza han'],
  },
  {
    id: 'izmir',
    name: 'İzmir & Çeşme',
    nameTr: 'İzmir & Çeşme',
    tagline: 'Aegean Pearl, Stone Boutiques of Alaçatı & Turquoise Bays',
    taglineTr: 'Ege’nin İncisi, Alaçatı Taş Evleri ve Turkuaz Koylar',
    image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=85',
    popularHighlights: ['Alaçatı Windmills & Stone Streets', 'Historic Kemeraltı Bazaar', 'Kordon Seaside Promenade', 'Çeşme Marina & Fortress'],
    popularHighlightsTr: ['Alaçatı Değirmenleri ve Taş Evleri', 'Tarihi Kemeraltı Çarşısı', 'İzmir Kordon Sahil Yürüyüşü', 'Çeşme Kalesi ve Marina'],
    aliases: ['izmir', 'izmir', 'cesme', 'çeşme', 'alacati', 'alaçatı', 'sirince', 'şirince'],
  },
  {
    id: 'ankara',
    name: 'Ankara',
    nameTr: 'Ankara',
    tagline: 'The Republic Capital & Museum of Anatolian Civilizations',
    taglineTr: 'Cumhuriyet Başkenti, Anıtkabir ve Anadolu Medeniyetleri Müzesi',
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=85',
    popularHighlights: ['Anıtkabir Mausoleum of Atatürk', 'Museum of Anatolian Civilizations', 'Ankara Citadel & Historic Hamamönü', 'Hacı Bayram Veli Mosque'],
    popularHighlightsTr: ['Anıtkabir ve Atatürk Müzesi', 'Anadolu Medeniyetleri Müzesi', 'Ankara Kalesi ve Hamamönü', 'Hacı Bayram Veli Camii'],
    aliases: ['ankara', 'anitkabir', 'anıtkabir', 'hamamonu', 'hamamönü'],
  },
];

/**
 * Normalizes text to handle Turkish characters and strip punctuation.
 */
export function normalizeRegionText(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Clean and format title-cased names.
 */
function toTitleCase(str: string): string {
  if (!str) return '';
  return str
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Checks if a tour visits a specific destination.
 */
export function tourVisitsDestination(
  tour: TourPackage,
  dest: DestinationInfo | string,
  allDestinations?: DestinationInfo[]
): boolean {
  const destObj =
    typeof dest === 'string'
      ? allDestinations?.find((d) => d.id === dest) || { id: dest, name: dest, nameTr: dest }
      : dest;

  const destId = destObj.id.toLowerCase();
  const nameEn = (destObj.name || '').toLowerCase();
  const nameTr = (destObj.nameTr || '').toLowerCase();
  const normDestId = normalizeRegionText(destId);
  const normNameEn = normalizeRegionText(nameEn);
  const normNameTr = normalizeRegionText(nameTr);

  // 1. Direct region match
  if (tour.region && (tour.region.toLowerCase() === destId || normalizeRegionText(tour.region) === normDestId)) {
    return true;
  }

  // 2. Check destination / destinationTr field
  const dEn = (tour.destination || '').toLowerCase();
  const dTr = (tour.destinationTr || '').toLowerCase();
  const normDEn = normalizeRegionText(dEn);
  const normDTr = normalizeRegionText(dTr);

  if (normDEn.includes(normDestId) || normDEn.includes(normNameEn) || (normNameTr && normDEn.includes(normNameTr))) {
    return true;
  }
  if (normDTr.includes(normDestId) || normDTr.includes(normNameTr) || (normNameEn && normDTr.includes(normNameEn))) {
    return true;
  }

  // 3. Check tour title / titleTr
  const tEn = (tour.title || '').toLowerCase();
  const tTr = (tour.titleTr || '').toLowerCase();
  const normTEn = normalizeRegionText(tEn);
  const normTTr = normalizeRegionText(tTr);

  if (normTEn.includes(normNameEn) || (normNameTr && normTEn.includes(normNameTr)) || normTEn.includes(normDestId)) {
    return true;
  }
  if (normTTr.includes(normNameTr) || (normNameEn && normTTr.includes(normNameEn)) || normTTr.includes(normDestId)) {
    return true;
  }

  // 4. Check itinerary day titles or overnight locations
  if (tour.itinerary && Array.isArray(tour.itinerary)) {
    for (const day of tour.itinerary) {
      const over = normalizeRegionText(((day.overnight || '') + ' ' + (day.overnightTr || '')).toLowerCase());
      const dTitle = normalizeRegionText(((day.title || '') + ' ' + (day.titleTr || '')).toLowerCase());
      if (over.includes(normNameEn) || (normNameTr && over.includes(normNameTr)) || over.includes(normDestId)) {
        return true;
      }
      if (dTitle.includes(normNameEn) || (normNameTr && dTitle.includes(normNameTr)) || dTitle.includes(normDestId)) {
        return true;
      }
    }
  }

  // 5. Check predefined aliases
  const known = PREDEFINED_TURKEY_REGIONS.find((r) => r.id === destId);
  if (known) {
    const combinedTourText = normalizeRegionText(
      `${tour.title || ''} ${tour.titleTr || ''} ${tour.destination || ''} ${tour.destinationTr || ''} ${tour.overview || ''} ${tour.overviewTr || ''}`
    );
    for (const alias of known.aliases) {
      const normAlias = normalizeRegionText(alias);
      if (normAlias.length >= 4 && combinedTourText.includes(normAlias)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Extracts and detects all individual destination regions mentioned in a tour.
 * E.g. for a "3-day Cappadocia, Konya, Antalya Tour", detects:
 * - Cappadocia (id: cappadocia)
 * - Konya (id: konya)
 * - Antalya (id: mediterranean or antalya)
 */
export function detectRegionsFromTour(tour: Partial<TourPackage>): PredefinedRegionMeta[] {
  const detectedMap = new Map<string, PredefinedRegionMeta>();

  // Gather all relevant tour textual contexts
  const destinationText = `${tour.destination || ''}, ${tour.destinationTr || ''}`;
  const titleText = `${tour.title || ''} ${tour.titleTr || ''}`;
  const itineraryText = (tour.itinerary || [])
    .map((day) => `${day.title || ''} ${day.titleTr || ''} ${day.overnight || ''} ${day.overnightTr || ''} ${day.description || ''}`)
    .join(' ');
  const combinedAllText = `${destinationText} ${titleText} ${tour.subtitle || ''} ${tour.subtitleTr || ''} ${tour.overview || ''} ${itineraryText}`;
  const normalizedAllText = normalizeRegionText(combinedAllText);

  // 1. First priority: Check known predefined regions against the text
  for (const region of PREDEFINED_TURKEY_REGIONS) {
    let matched = false;

    // Check if region id or names are present
    const normName = normalizeRegionText(region.name);
    const normNameTr = normalizeRegionText(region.nameTr);
    const normId = normalizeRegionText(region.id);

    if (
      normalizedAllText.includes(normName) ||
      normalizedAllText.includes(normNameTr) ||
      (normId.length >= 4 && normalizedAllText.includes(normId))
    ) {
      matched = true;
    }

    // Check aliases
    if (!matched) {
      for (const alias of region.aliases) {
        const normAlias = normalizeRegionText(alias);
        // Word boundary check or length >= 4
        if (normAlias.length >= 4 && normalizedAllText.includes(normAlias)) {
          matched = true;
          break;
        }
      }
    }

    if (matched) {
      detectedMap.set(region.id, region);
    }
  }

  // 2. Second priority: Explicit tokens in destination / destinationTr fields
  // Often entered as: "Kapadokya, Konya, Antalya" or "Cappadocia - Konya - Antalya"
  const rawTokens = destinationText
    .split(/[,;&+/|]|\s+(?:ve|and|to|ile)\s+/gi)
    .map((t) => t.trim())
    .filter((t) => t.length > 2);

  // Clean noise words
  const noiseWords = ['tour', 'turu', 'turları', 'paket', 'paketi', 'days', 'day', 'gün', 'günlük', 'gece', 'nights', 'yolculuk', 'journey', 'escape', 'tatili', 'özel', 'private', 'luxury', 'boutique'];

  for (const rawToken of rawTokens) {
    const cleanWord = rawToken
      .replace(/[\d\(\)\.\-]/g, '')
      .split(' ')
      .filter((w) => !noiseWords.includes(w.toLowerCase()))
      .join(' ')
      .trim();

    if (cleanWord.length < 3) continue;

    const normClean = normalizeRegionText(cleanWord);

    // Check if already covered by detectedMap
    const alreadyFound = Array.from(detectedMap.values()).some((r) => {
      return (
        normalizeRegionText(r.name).includes(normClean) ||
        normalizeRegionText(r.nameTr).includes(normClean) ||
        normClean.includes(normalizeRegionText(r.name)) ||
        normClean.includes(normalizeRegionText(r.nameTr)) ||
        r.aliases.some((a) => normalizeRegionText(a) === normClean)
      );
    });

    if (!alreadyFound) {
      // Check if it matches any predefined region
      const matchedPredefined = PREDEFINED_TURKEY_REGIONS.find((r) => {
        return (
          normalizeRegionText(r.name).includes(normClean) ||
          normalizeRegionText(r.nameTr).includes(normClean) ||
          r.aliases.some((a) => normalizeRegionText(a) === normClean)
        );
      });

      if (matchedPredefined) {
        detectedMap.set(matchedPredefined.id, matchedPredefined);
      } else {
        // Create custom dynamic destination
        const slug = normClean.replace(/\s+/g, '-').slice(0, 30);
        const titleCase = toTitleCase(cleanWord);
        const dynamicMeta: PredefinedRegionMeta = {
          id: slug,
          name: titleCase,
          nameTr: titleCase,
          tagline: `Experience the unique heritage & scenic beauty of ${titleCase}`,
          taglineTr: `${titleCase}’nin tarihi dokusu, doğal güzellikleri ve zengin kültürel mirası`,
          image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1200&q=85',
          popularHighlights: ['Historic Old Town', 'Cultural Heritage', 'Guided Discovery', 'Local Gastronomy'],
          popularHighlightsTr: ['Tarihi Şehir Merkezi', 'Kültür Mirası', 'Rehberli Keşif', 'Yöresel Lezzetler'],
          aliases: [normClean],
        };
        detectedMap.set(slug, dynamicMeta);
      }
    }
  }

  return Array.from(detectedMap.values());
}

/**
 * Synchronizes destinations when a tour is added, edited, or imported.
 * Automatically adds missing regions to destination list and recalculates tour counts.
 */
export function autoSyncDestinationsFromTour(
  targetTour: Partial<TourPackage>,
  allTours: TourPackage[],
  currentDestinations: DestinationInfo[]
): {
  updatedDestinations: DestinationInfo[];
  newlyAdded: DestinationInfo[];
  detectedRegions: PredefinedRegionMeta[];
} {
  const detected = detectRegionsFromTour(targetTour);
  const newlyAdded: DestinationInfo[] = [];
  const destMap = new Map<string, DestinationInfo>();

  // Populate existing
  currentDestinations.forEach((d) => destMap.set(d.id, { ...d }));

  // Check which detected regions are missing
  for (const region of detected) {
    // Check if an existing destination covers this region
    const existing = Array.from(destMap.values()).find((d) => {
      if (d.id === region.id) return true;
      const normDName = normalizeRegionText(d.name);
      const normDNameTr = normalizeRegionText(d.nameTr);
      const normRName = normalizeRegionText(region.name);
      const normRNameTr = normalizeRegionText(region.nameTr);
      return (
        normDName === normRName ||
        normDNameTr === normRNameTr ||
        normDName.includes(normRName) ||
        normDNameTr.includes(normRNameTr)
      );
    });

    if (!existing) {
      const newDest: DestinationInfo = {
        id: region.id,
        name: region.name,
        nameTr: region.nameTr,
        tagline: region.tagline,
        taglineTr: region.taglineTr,
        image: region.image,
        toursCount: 1,
        popularHighlights: region.popularHighlights,
        popularHighlightsTr: region.popularHighlightsTr,
      };
      destMap.set(newDest.id, newDest);
      newlyAdded.push(newDest);
    }
  }

  // Recalculate toursCount for all destinations across all tours
  const updatedDestinations: DestinationInfo[] = Array.from(destMap.values()).map((dest) => {
    let count = 0;
    for (const tour of allTours) {
      if (tourVisitsDestination(tour, dest, Array.from(destMap.values()))) {
        count++;
      }
    }
    return {
      ...dest,
      toursCount: Math.max(count, dest.toursCount || 0),
    };
  });

  return {
    updatedDestinations,
    newlyAdded,
    detectedRegions: detected,
  };
}

/**
 * Scans ALL existing tours and ensures all regions are in destinations with correct counts.
 */
export function syncDestinationsWithAllTours(
  allTours: TourPackage[],
  currentDestinations: DestinationInfo[]
): {
  updatedDestinations: DestinationInfo[];
  newlyAdded: DestinationInfo[];
} {
  const destMap = new Map<string, DestinationInfo>();
  currentDestinations.forEach((d) => destMap.set(d.id, { ...d }));
  const newlyAdded: DestinationInfo[] = [];

  for (const tour of allTours) {
    const detected = detectRegionsFromTour(tour);
    for (const region of detected) {
      const existing = Array.from(destMap.values()).find((d) => {
        if (d.id === region.id) return true;
        const normDName = normalizeRegionText(d.name);
        const normDNameTr = normalizeRegionText(d.nameTr);
        const normRName = normalizeRegionText(region.name);
        const normRNameTr = normalizeRegionText(region.nameTr);
        return normDName === normRName || normDNameTr === normRNameTr;
      });

      if (!existing) {
        const newDest: DestinationInfo = {
          id: region.id,
          name: region.name,
          nameTr: region.nameTr,
          tagline: region.tagline,
          taglineTr: region.taglineTr,
          image: region.image,
          toursCount: 1,
          popularHighlights: region.popularHighlights,
          popularHighlightsTr: region.popularHighlightsTr,
        };
        destMap.set(newDest.id, newDest);
        newlyAdded.push(newDest);
      }
    }
  }

  // Recount
  const updatedDestinations: DestinationInfo[] = Array.from(destMap.values()).map((dest) => {
    let count = 0;
    for (const tour of allTours) {
      if (tourVisitsDestination(tour, dest, Array.from(destMap.values()))) {
        count++;
      }
    }
    return {
      ...dest,
      toursCount: count > 0 ? count : (dest.toursCount || 0),
    };
  });

  return {
    updatedDestinations,
    newlyAdded,
  };
}
