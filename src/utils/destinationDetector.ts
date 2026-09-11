import { TourPackage, DestinationInfo } from '../types';

export const DEFAULT_DESTINATION_IMAGE = 'https://raw.githubusercontent.com/yamanozgur/voyratours/main/asset/main3.jpg';

export function normalizeImageUrl(url?: string): string {
  if (!url || !url.trim()) {
    return DEFAULT_DESTINATION_IMAGE;
  }
  let clean = url.trim();
  if (clean.includes('github.com/yamanozgur/voyratours/blob/')) {
    clean = clean.replace('github.com/yamanozgur/voyratours/blob/', 'raw.githubusercontent.com/yamanozgur/voyratours/');
  }
  // Replace legacy or random unsplash/default images with the requested default image
  if (clean.includes('images.unsplash.com') || clean.includes('asset/default.jpg') || clean.includes('1570939274717-7eda259b50ed')) {
    return DEFAULT_DESTINATION_IMAGE;
  }
  return clean;
}

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
 * Curated knowledge base of individual (atomic) Turkey tourism destinations.
 * Each location is strictly separate (e.g. Antalya, Efes, Pamukkale, Kapadokya, Istanbul).
 * No grouped or compound regions (e.g. NO "Antalya & Turkuaz Kıyı", NO "Efes & Pamukkale").
 * All default images strictly use Voyra's official asset (main3.jpg).
 */
export const PREDEFINED_TURKEY_REGIONS: PredefinedRegionMeta[] = [
  {
    id: 'cappadocia',
    name: 'Cappadocia',
    nameTr: 'Kapadokya',
    tagline: 'Fairy Chimneys, Cave Suites & Sunrise Hot Air Balloons',
    taglineTr: 'Peri Bacaları, Butik Mağara Oteller ve Gün Doğumu Sıcak Hava Balonları',
    image: DEFAULT_DESTINATION_IMAGE,
    popularHighlights: ['Sunrise Balloon Flight', 'Derinkuyu Underground City', 'Göreme Open Air Museum', 'Uçhisar Rock Castle'],
    popularHighlightsTr: ['Gün Doğumu Balon Uçuşu', 'Derinkuyu Yeraltı Şehri', 'Göreme Açık Hava Müzesi', 'Uçhisar Kalesi'],
    aliases: [
      'cappadocia', 'kapadokya', 'cappadocian', 'goreme', 'göreme', 'urgup', 'ürgüp',
      'uchisar', 'uçhisar', 'avanos', 'derinkuyu', 'kaymakli', 'kaymaklı', 'ihlara',
      'pasabag', 'paşabağ', 'devrent', 'fairy chimney', 'peri bacasi', 'peri bacası', 'balloon flight', 'balon turu'
    ],
  },
  {
    id: 'pamukkale',
    name: 'Pamukkale',
    nameTr: 'Pamukkale',
    tagline: 'White Mineral Travertine Terraces & Cleopatra Antique Thermal Pool',
    taglineTr: 'Beyaz Mineral Traverten Havuzları ve Kleopatra Antik Termal Havuzu',
    image: DEFAULT_DESTINATION_IMAGE,
    popularHighlights: ['White Travertine Terraces', 'Hierapolis Ancient Necropolis', 'Cleopatra Antique Thermal Pool', 'Roman Amphitheatre'],
    popularHighlightsTr: ['Pamukkale Traverten Havuzları', 'Hierapolis Antik Kenti & Nekropol', 'Kleopatra Antik Termal Havuzu', 'Roma Tiyatrosu'],
    aliases: [
      'pamukkale', 'hierapolis', 'travertine', 'traverten', 'cleopatra pool', 'kleopatra havuzu', 'denizli'
    ],
  },
  {
    id: 'ephesus',
    name: 'Ephesus',
    nameTr: 'Efes',
    tagline: 'Greco-Roman Metropolis, Grand Library of Celsus & House of Virgin Mary',
    taglineTr: 'Antik Roma İhtişamı, Görkemli Celsus Kütüphanesi ve Meryem Ana Evi',
    image: DEFAULT_DESTINATION_IMAGE,
    popularHighlights: ['Library of Celsus', 'House of Virgin Mary', 'Temple of Artemis', 'Great Ancient Theatre'],
    popularHighlightsTr: ['Celsus Kütüphanesi', 'Meryem Ana Evi', 'Artemis Tapınağı', 'Büyük Antik Tiyatro'],
    aliases: [
      'ephesus', 'efes', 'celsus', 'meryem ana', 'virgin mary', 'selcuk', 'selçuk', 'sirince', 'şirince', 'artemis'
    ],
  },
  {
    id: 'antalya',
    name: 'Antalya',
    nameTr: 'Antalya',
    tagline: 'Historic Kaleiçi Old Town, Aspendos Roman Theatre & Azure Waterfalls',
    taglineTr: 'Tarihi Kaleiçi Sokakları, Aspendos Roma Tiyatrosu ve Düden Şelaleleri',
    image: DEFAULT_DESTINATION_IMAGE,
    popularHighlights: ['Historic Kaleiçi Old Town', 'Aspendos Roman Theatre', 'Düden Waterfalls', 'Perge Ancient City Ruins'],
    popularHighlightsTr: ['Tarihi Kaleiçi', 'Aspendos Roma Tiyatrosu', 'Düden Şelaleleri', 'Perge Antik Kenti'],
    aliases: [
      'antalya', 'kaleici', 'kaleiçi', 'aspendos', 'perge', 'duden', 'düden', 'kemer', 'belek', 'alanya', 'side'
    ],
  },
  {
    id: 'istanbul',
    name: 'Istanbul',
    nameTr: 'İstanbul',
    tagline: 'Imperial Capital of Two Continents: Palaces & Bosphorus Yacht Cruises',
    taglineTr: 'İki Kıtanın Buluştuğu Kadim Başkent, Saraylar ve Boğaz Turları',
    image: DEFAULT_DESTINATION_IMAGE,
    popularHighlights: ['Hagia Sophia Grand Mosque', 'Topkapi Imperial Palace', 'Private Bosphorus Sunset Yacht Cruise', 'Historic Grand Bazaar'],
    popularHighlightsTr: ['Ayasofya-i Kebir Camii', 'Topkapı Sarayı', 'Özel Boğaz Yat Turu', 'Tarihi Kapalıçarşı'],
    aliases: [
      'istanbul', 'bosphorus', 'boğaz', 'sultanahmet', 'ayasofya', 'hagia sophia', 'topkapi', 'topkapı',
      'kapalicarsi', 'kapalıçarşı', 'grand bazaar', 'galata', 'taksim', 'istiklal', 'yerebatan', 'dolmabahce', 'dolmabahçe'
    ],
  },
  {
    id: 'canakkale',
    name: 'Gallipoli & Çanakkale',
    nameTr: 'Çanakkale & Gelibolu',
    tagline: 'Historic 1915 Battlefields, Anzac Cove & Dardanelles Strait',
    taglineTr: '1915 Çanakkale Siperleri, Anzak Koyu ve Boğaz Geçişi',
    image: DEFAULT_DESTINATION_IMAGE,
    popularHighlights: ['ANZAC Cove Memorial', 'Chunuk Bair', 'Lone Pine Cemetery', 'Dardanelles Strait Ferry Crossing'],
    popularHighlightsTr: ['Anzak Koyu Anıtı', 'Conkbayırı', 'Lone Pine Şehitliği', 'Çanakkale Boğazı'],
    aliases: [
      'canakkale', 'çanakkale', 'gallipoli', 'gelibolu', 'anzac', 'anzak', 'dardanelles', 'chunuk bair', 'conkbayırı', 'lone pine'
    ],
  },
  {
    id: 'troy',
    name: 'Troy',
    nameTr: 'Truva',
    tagline: 'Homeric Epics & The Legendary Trojan Wooden Horse',
    taglineTr: 'Homeros Destanları ve Efsanevi Truva Tahta Atı',
    image: DEFAULT_DESTINATION_IMAGE,
    popularHighlights: ['Ancient City of Troy', 'Legendary Wooden Horse', 'Museum of Troy', 'Trojan Excavation Layers'],
    popularHighlightsTr: ['Truva Antik Kenti', 'Efsanevi Tahta At', 'Truva Müzesi', 'Truva Kazı Katmanları'],
    aliases: ['troy', 'truva', 'troia', 'wooden horse', 'tahta at'],
  },
  {
    id: 'fethiye',
    name: 'Fethiye',
    nameTr: 'Fethiye',
    tagline: 'Ölüdeniz Blue Lagoon, Butterfly Valley & Babadag Paragliding',
    taglineTr: 'Ölüdeniz Mavi Lagün, Kelebekler Vadisi ve Babadağ Yamaç Paraşütü',
    image: DEFAULT_DESTINATION_IMAGE,
    popularHighlights: ['Ölüdeniz Blue Lagoon Paragliding', 'Butterfly Valley Boat Excursion', 'Kayaköy Ghost Village', 'Saklıkent Canyon Walk'],
    popularHighlightsTr: ['Ölüdeniz Yamaç Paraşütü', 'Kelebekler Vadisi Tekne Turu', 'Kayaköy Tarihi Rum Köyü', 'Saklıkent Kanyonu'],
    aliases: ['fethiye', 'oludeniz', 'ölüdeniz', 'saklikent', 'saklıkent', 'butterfly valley', 'kelebekler vadisi', 'kayakoy', 'kayaköy'],
  },
  {
    id: 'bodrum',
    name: 'Bodrum',
    nameTr: 'Bodrum',
    tagline: 'St. Peter Castle, White Aegean Stone Villas & Blue Cruises',
    taglineTr: 'Tarihi Bodrum Kalesi, Beyaz Ege Evleri ve Mavi Yolculuk',
    image: DEFAULT_DESTINATION_IMAGE,
    popularHighlights: ['Castle of St. Peter & Underwater Museum', 'Halicarnassus Mausoleum', 'Private Gulet Blue Cruise', 'Yalıkavak Marina'],
    popularHighlightsTr: ['Bodrum Kalesi & Sualtı Müzesi', 'Halikarnas Mozolesi', 'Mavi Yolculuk Gulet Turu', 'Yalıkavak Marina'],
    aliases: ['bodrum', 'halicarnassus', 'halikarnas', 'yalikavak', 'yalıkavak'],
  },
  {
    id: 'kas',
    name: 'Kaş',
    nameTr: 'Kaş',
    tagline: 'Sunken City of Kekova, Kaputaş Beach & Lycian Rock Tombs',
    taglineTr: 'Kekova Batık Şehir, Kaputaş Kanyon Plajı ve Likya Kaya Mezarları',
    image: DEFAULT_DESTINATION_IMAGE,
    popularHighlights: ['Kekova Sunken City Island Boat Tour', 'Kaputaş Canyon Beach', 'Antiphellos Ancient Amphitheatre', 'Meis Island Ferry'],
    popularHighlightsTr: ['Kekova Batık Kent Tekne Turu', 'Kaputaş Kanyon Plajı', 'Antiphellos Antik Tiyatrosu', 'Kaş Tarihi Çarşısı'],
    aliases: ['kas', 'kaş', 'kalkan', 'kekova', 'kaputas', 'kaputaş', 'simena', 'antiphellos'],
  },
  {
    id: 'izmir',
    name: 'İzmir',
    nameTr: 'İzmir',
    tagline: 'Historic Clock Tower, Kemeraltı Bazaar & Kordon Promenade',
    taglineTr: 'Tarihi Saat Kulesi, Kemeraltı Çarşısı ve Kordon Sahili',
    image: DEFAULT_DESTINATION_IMAGE,
    popularHighlights: ['Konak Clock Tower', 'Historic Kemeraltı Bazaar', 'Kordon Seaside Promenade', 'Agora of Smyrna'],
    popularHighlightsTr: ['Tarihi Saat Kulesi', 'Kemeraltı Çarşısı', 'Kordon Sahil Boyu', 'Smyrna Agorası'],
    aliases: ['izmir', 'kemeralti', 'kemeraltı', 'kordon boyu', 'konak meydanı'],
  },
  {
    id: 'cesme',
    name: 'Çeşme',
    nameTr: 'Çeşme',
    tagline: 'Alaçatı Stone Streets, Windmills & Aegean Beaches',
    taglineTr: 'Alaçatı Taş Sokakları, Tarihi Değirmenler ve Ege Plajları',
    image: DEFAULT_DESTINATION_IMAGE,
    popularHighlights: ['Alaçatı Windmills & Cobbled Streets', 'Çeşme Marina & Ottoman Castle', 'Ilıca Thermal Beach', 'Ayayorgi Bay'],
    popularHighlightsTr: ['Alaçatı Değirmenleri ve Taş Evleri', 'Çeşme Kalesi & Marina', 'Ilıca Termal Plajı', 'Ayayorgi Koyu'],
    aliases: ['cesme', 'çeşme', 'alacati', 'alaçatı', 'cesme kalesi', 'çeşme kalesi'],
  },
  {
    id: 'konya',
    name: 'Konya',
    nameTr: 'Konya',
    tagline: 'Mevlana Rumi Shrine, Whirling Dervishes & Seljuk Heritage',
    taglineTr: 'Mevlana Celaleddin Rumi, Semazen Ayinleri ve Selçuklu Mirası',
    image: DEFAULT_DESTINATION_IMAGE,
    popularHighlights: ['Mevlana Rumi Tomb & Museum', 'Whirling Dervishes Ceremony', 'Sultanhani Silk Road Caravanserai', 'Alaeddin Mosque'],
    popularHighlightsTr: ['Mevlana Müzesi ve Türbesi', 'Geleneksel Semazen Gösterisi', 'Sultanhanı Kervansarayı', 'Alâeddin Camii'],
    aliases: ['konya', 'mevlana', 'rumi', 'catalhoyuk', 'çatalhöyük', 'sultanhani', 'sultanhanı', 'semazen'],
  },
  {
    id: 'trabzon',
    name: 'Trabzon',
    nameTr: 'Trabzon',
    tagline: 'Cliffside Sümela Monastery, Uzungöl Alpine Lake & Cloud Valleys',
    taglineTr: 'Sarp Kayalıklarda Sümela Manastırı, Uzungöl ve Yaylalar',
    image: DEFAULT_DESTINATION_IMAGE,
    popularHighlights: ['Sümela Rock-Cut Monastery', 'Uzungöl Alpine Nature Park', 'Ayder Highland', 'Fırtına River Stone Bridges'],
    popularHighlightsTr: ['Sümela Kaya Manastırı', 'Uzungöl Tabiat Parkı', 'Ayder Yaylası', 'Fırtına Deresi Köprüleri'],
    aliases: ['trabzon', 'sumela', 'sümela', 'uzungol', 'uzungöl', 'ayder', 'rize'],
  },
  {
    id: 'mardin',
    name: 'Mardin',
    nameTr: 'Mardin',
    tagline: 'Stone Mansions, Syriac Monasteries & Sweeping Mesopotamian Plains',
    taglineTr: 'Tarihi Taş Konaklar, Süryani Manastırları ve Mezopotamya Ovası',
    image: DEFAULT_DESTINATION_IMAGE,
    popularHighlights: ['Deyrulzafaran Saffron Monastery', 'Dara Roman Ruins', 'Midyat Old Town & Filigree Bazaars', 'Mor Gabriel Monastery'],
    popularHighlightsTr: ['Deyrulzafaran Süryani Manastırı', 'Dara Antik Kenti', 'Midyat Tarihi Taş Evleri', 'Mor Gabriel Manastırı'],
    aliases: ['mardin', 'midyat', 'mezopotamya', 'mesopotamia', 'deyrulzafaran', 'dara antik'],
  },
  {
    id: 'sanliurfa',
    name: 'Şanlıurfa',
    nameTr: 'Şanlıurfa',
    tagline: 'Göbeklitepe Megaliths, Sacred Pool of Abraham & Harran Beehive Houses',
    taglineTr: 'Göbeklitepe 12.000 Yıllık Tapınaklar, Balıklıgöl ve Harran Evleri',
    image: DEFAULT_DESTINATION_IMAGE,
    popularHighlights: ['Göbeklitepe UNESCO Megalithic Site', 'Balıklıgöl Sacred Pool of Abraham', 'Harran Mudbrick Beehive Houses', 'Urfa Archaeology Museum'],
    popularHighlightsTr: ['Göbeklitepe Arkeolojik Alanı', 'Tarihi Balıklıgöl', 'Harran Kümbet Evleri', 'Şanlıurfa Mozaik Müzesi'],
    aliases: ['sanliurfa', 'şanlıurfa', 'gobeklitepe', 'göbeklitepe', 'karahantepe', 'harran', 'balikligol', 'balıklıgöl', 'urfa'],
  },
  {
    id: 'bursa',
    name: 'Bursa',
    nameTr: 'Bursa',
    tagline: 'First Ottoman Capital, Green Mosque & Silk Caravanserais',
    taglineTr: 'İlk Osmanlı Başkenti, Yeşil Türbe, İpek Hanları ve Uludağ',
    image: DEFAULT_DESTINATION_IMAGE,
    popularHighlights: ['Grand Mosque (Ulu Cami)', 'Historic Koza Han Silk Bazaar', 'UNESCO Cumalıkızık Village', 'Uludağ Cable Car'],
    popularHighlightsTr: ['Ulu Cami', 'Tarihi Koza Han', 'UNESCO Cumalıkızık Köyü', 'Uludağ Teleferik'],
    aliases: ['bursa', 'cumalikizik', 'cumalıkızık', 'koza han', 'uludag', 'uludağ'],
  },
  {
    id: 'ankara',
    name: 'Ankara',
    nameTr: 'Ankara',
    tagline: 'Anıtkabir Atatürk Mausoleum & Museum of Anatolian Civilizations',
    taglineTr: 'Anıtkabir ve Anadolu Medeniyetleri Müzesi',
    image: DEFAULT_DESTINATION_IMAGE,
    popularHighlights: ['Anıtkabir Atatürk Mausoleum', 'Museum of Anatolian Civilizations', 'Ankara Citadel', 'Hacı Bayram Veli Mosque'],
    popularHighlightsTr: ['Anıtkabir Atatürk Mozolesi', 'Anadolu Medeniyetleri Müzesi', 'Ankara Kalesi', 'Hacı Bayram Veli Camii'],
    aliases: ['ankara', 'anitkabir', 'anıtkabir'],
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
 * Checks if a normalized string contains an alias as a discrete word/phrase.
 */
function textContainsAlias(text: string, alias: string): boolean {
  const normAlias = normalizeRegionText(alias);
  if (!normAlias || normAlias.length < 3) return false;
  const regex = new RegExp(`(?:^|\\s)${normAlias}(?:\\s|$)`, 'i');
  return regex.test(text);
}

/**
 * Matches a region against a tour title.
 * User instruction: "Zaten lokasyon isimleri Tur adında var. Onu baz alalım.
 * Mesela Tur adı 2 gün kapadokya & pamukkale ise 2 lokasyon var. PAMUKKALE ve KAPADOKYA"
 */
function regionMatchesTitle(region: PredefinedRegionMeta, normTitle: string): boolean {
  // Check direct English/Turkish name
  if (textContainsAlias(normTitle, region.name) || textContainsAlias(normTitle, region.nameTr)) {
    return true;
  }
  // Check key signature aliases
  for (const alias of region.aliases) {
    if (textContainsAlias(normTitle, alias)) {
      return true;
    }
  }
  return false;
}

/**
 * Clean transit clauses (flight departures, airport transfers, hotel pick-ups) from itinerary description.
 * This prevents departure airports like Istanbul or transit stops like Izmir ADB from being registered as destinations.
 */
function cleanTransitFromText(text: string): string {
  if (!text) return '';
  const clauses = text.split(/[.\n;]/);
  const cleanClauses = clauses.filter((clause) => {
    const lower = clause.toLowerCase();
    const hasTransitWords =
      lower.includes('flight') ||
      lower.includes('fly') ||
      lower.includes('havalimani') ||
      lower.includes('havalimanı') ||
      lower.includes('airport') ||
      lower.includes('transfer to') ||
      lower.includes('transfer from') ||
      lower.includes('transfer into') ||
      lower.includes('drive to airport') ||
      lower.includes('ucak') ||
      lower.includes('uçak');

    // If it has transit words but does NOT mention major tourist sights, treat as transit noise
    const hasSightWords =
      lower.includes('celsus') ||
      lower.includes('hierapolis') ||
      lower.includes('travertine') ||
      lower.includes('traverten') ||
      lower.includes('meryem') ||
      lower.includes('goreme') ||
      lower.includes('göreme') ||
      lower.includes('balloon') ||
      lower.includes('balon') ||
      lower.includes('hagia sophia') ||
      lower.includes('ayasofya') ||
      lower.includes('blue mosque') ||
      lower.includes('sultanahmet') ||
      lower.includes('topkapi') ||
      lower.includes('topkapı') ||
      lower.includes('aspendos') ||
      lower.includes('kaleiçi') ||
      lower.includes('kaleici') ||
      lower.includes('alacati') ||
      lower.includes('alaçatı') ||
      lower.includes('truva') ||
      lower.includes('troy') ||
      lower.includes('anzac') ||
      lower.includes('anzak');

    return !(hasTransitWords && !hasSightWords);
  });

  return cleanClauses.join(' ');
}

/**
 * Checks if a specific day's sightseeing text matches a predefined location.
 */
function dayMatchesRegion(region: PredefinedRegionMeta, dayText: string, rawTitle: string): boolean {
  const normTitle = normalizeRegionText(rawTitle);

  // Transit Protection:
  // Istanbul: Only match if actual Istanbul sightseeing monuments are visited OR day title is explicitly an Istanbul tour!
  if (region.id === 'istanbul') {
    const isExplicitIstanbulTitle =
      normTitle.includes('istanbul tour') ||
      normTitle.includes('istanbul gezisi') ||
      normTitle.includes('istanbul classic') ||
      normTitle.includes('istanbul old city') ||
      normTitle.includes('bosphorus tour') ||
      normTitle.includes('bosphorus cruise');

    const hasIstanbulSightseeing = region.aliases.some((alias) => {
      return alias !== 'istanbul' && textContainsAlias(dayText, alias);
    });

    return isExplicitIstanbulTitle || hasIstanbulSightseeing;
  }

  // İzmir: Never match on "izmir" alone if it is just airport transit
  if (region.id === 'izmir') {
    const isExplicitIzmirTour =
      normTitle.includes('izmir city tour') ||
      normTitle.includes('izmir sehiri') ||
      normTitle.includes('izmir gezisi');

    const hasIzmirSightseeing = textContainsAlias(dayText, 'saat kulesi') || textContainsAlias(dayText, 'kemeralti');
    return isExplicitIzmirTour || hasIzmirSightseeing;
  }

  // General check
  if (textContainsAlias(normTitle, region.name) || textContainsAlias(normTitle, region.nameTr)) {
    return true;
  }
  for (const alias of region.aliases) {
    if (textContainsAlias(dayText, alias) || textContainsAlias(normTitle, alias)) {
      return true;
    }
  }

  return false;
}

/**
 * Extracts individual atomic destinations for a tour package.
 *
 * User rule:
 * "tek tek olacak Antalya & turkuaz kıyı ne? Antalya, Efes, Pamukkale bunlar hep ayrı lokasyonlar.
 * Zaten lokasyon isimleri Tur adında var. Onu baz alalım. Mesela Tur adı 2 gün kapadokya & pamukkale ise 2 lokasyon var. PAMUKKALE ve KAPADOKYA"
 *
 * 1. Primary: Scans Tour Title (English and Turkish). If location names are present in the title,
 *    each location is extracted individually (e.g. "2 Gün Kapadokya & Pamukkale" -> [Kapadokya, Pamukkale]).
 * 2. Secondary: If no locations were identified from the title, scans the day-by-day itinerary sightseeing.
 * 3. Fallback: Checks the tour's destination field.
 */
export function detectRegionsFromTour(tour: Partial<TourPackage>): PredefinedRegionMeta[] {
  const detectedMap = new Map<string, PredefinedRegionMeta>();

  // PRIORITY 1: Tour Title
  const rawTitle = `${tour.title || ''} ${tour.titleTr || ''}`;
  const normTitle = normalizeRegionText(rawTitle);

  if (normTitle) {
    for (const region of PREDEFINED_TURKEY_REGIONS) {
      if (regionMatchesTitle(region, normTitle)) {
        detectedMap.set(region.id, region);
      }
    }
  }

  // If regions were found in the tour title, that is our authoritative list!
  if (detectedMap.size > 0) {
    return Array.from(detectedMap.values());
  }

  // PRIORITY 2: Day-by-Day Itinerary Sightseeing
  const days = Array.isArray(tour.itinerary) ? tour.itinerary : [];
  if (days.length > 0) {
    for (const day of days) {
      const dayTitle = `${day.title || ''} ${day.titleTr || ''}`;
      const dayHighlights = Array.isArray(day.highlights) ? day.highlights.join(' ') : '';
      const dayHighlightsTr = Array.isArray(day.highlightsTr) ? day.highlightsTr.join(' ') : '';
      const dayOvernight = `${day.overnight || ''} ${day.overnightTr || ''}`;
      const cleanDesc = cleanTransitFromText(`${day.description || ''} ${day.descriptionTr || ''}`);

      const combinedDayText = normalizeRegionText(
        `${dayTitle} ${dayHighlights} ${dayHighlightsTr} ${dayOvernight} ${cleanDesc}`
      );

      for (const region of PREDEFINED_TURKEY_REGIONS) {
        if (dayMatchesRegion(region, combinedDayText, dayTitle)) {
          detectedMap.set(region.id, region);
        }
      }
    }
  }

  // PRIORITY 3: Existing destination field
  if (detectedMap.size === 0) {
    const destFieldText = normalizeRegionText(`${tour.destination || ''} ${tour.destinationTr || ''}`);
    if (destFieldText) {
      for (const region of PREDEFINED_TURKEY_REGIONS) {
        if (regionMatchesTitle(region, destFieldText)) {
          detectedMap.set(region.id, region);
        }
      }
    }
  }

  return Array.from(detectedMap.values());
}

/**
 * Sanitizes a tour package so that its destination, destinationTr, and region
 * strictly reflect the verified atomic sightseeing destinations.
 *
 * Example:
 * Title "2 Gün Kapadokya & Pamukkale"
 * -> destination: "Cappadocia, Pamukkale"
 * -> destinationTr: "Kapadokya, Pamukkale"
 * -> region: "multi-region"
 *
 * Title "Antalya Tour"
 * -> destination: "Antalya"
 * -> destinationTr: "Antalya"
 * -> region: "antalya"
 */
export function sanitizeTourDestinations(tour: TourPackage): TourPackage {
  if (!tour) return tour;
  const detected = detectRegionsFromTour(tour);
  if (detected.length === 0) {
    return tour;
  }

  const destination = detected.map((r) => r.name).join(', ');
  const destinationTr = detected.map((r) => r.nameTr).join(', ');
  const region = (detected.length > 1 ? 'multi-region' : detected[0].id) as TourPackage['region'];

  return {
    ...tour,
    destination,
    destinationTr,
    region,
  };
}

/**
 * Checks if a tour genuinely visits a specific destination.
 * Supports checking by ID (e.g. 'pamukkale', 'cappadocia', 'ephesus', 'antalya')
 * or by DestinationInfo object.
 */
export function tourVisitsDestination(
  tour: TourPackage,
  dest: DestinationInfo | string,
  _allDestinations?: DestinationInfo[]
): boolean {
  const destId = (typeof dest === 'string' ? dest : dest.id).toLowerCase();
  const destName = typeof dest === 'string' ? dest : (dest.name || '');
  const destNameTr = typeof dest === 'string' ? dest : (dest.nameTr || '');

  const normDestId = normalizeRegionText(destId);
  const normDestName = normalizeRegionText(destName);
  const normDestNameTr = normalizeRegionText(destNameTr);

  // 1. Check direct region ID match
  if (tour.region && (tour.region.toLowerCase() === destId || normalizeRegionText(tour.region) === normDestId)) {
    return true;
  }

  // 2. Check detected visited regions for this tour
  const visited = detectRegionsFromTour(tour);
  const isVisited = visited.some((r) => {
    return (
      r.id.toLowerCase() === destId ||
      normalizeRegionText(r.name) === normDestName ||
      normalizeRegionText(r.nameTr) === normDestNameTr ||
      normalizeRegionText(r.name) === normDestId ||
      normalizeRegionText(r.nameTr) === normDestId
    );
  });
  if (isVisited) return true;

  // 3. Check destination and title strings
  const combinedText = normalizeRegionText(
    `${tour.title || ''} ${tour.titleTr || ''} ${tour.destination || ''} ${tour.destinationTr || ''}`
  );
  if (normDestName && textContainsAlias(combinedText, normDestName)) return true;
  if (normDestNameTr && textContainsAlias(combinedText, normDestNameTr)) return true;
  if (normDestId && textContainsAlias(combinedText, normDestId)) return true;

  return false;
}

/**
 * Synchronizes destinations with all existing tours.
 * Accurately calculates tour counts for each atomic destination, adds missing visited destinations,
 * and PRUNES ghost or legacy grouped destinations (like 'aegean-ephesus' or 'mediterranean') that have 0 tours.
 */
export function syncDestinationsWithAllTours(
  allTours: TourPackage[],
  currentDestinations: DestinationInfo[]
): {
  updatedDestinations: DestinationInfo[];
  newlyAdded: DestinationInfo[];
} {
  const destMap = new Map<string, DestinationInfo>();
  const newlyAdded: DestinationInfo[] = [];

  // Track counts per detected atomic location
  const regionCounts = new Map<string, number>();

  for (const tour of allTours) {
    const visited = detectRegionsFromTour(tour);
    for (const region of visited) {
      regionCounts.set(region.id, (regionCounts.get(region.id) || 0) + 1);

      if (!destMap.has(region.id)) {
        // Look for existing destination info to preserve custom images or descriptions
        const existing = currentDestinations.find(
          (d) =>
            d.id === region.id ||
            normalizeRegionText(d.name) === normalizeRegionText(region.name) ||
            normalizeRegionText(d.nameTr) === normalizeRegionText(region.nameTr)
        );

        if (existing) {
          destMap.set(region.id, {
            ...existing,
            id: region.id,
            name: region.name,
            nameTr: region.nameTr,
            image: normalizeImageUrl(existing.image),
            showOnHome: existing.showOnHome !== false,
          });
        } else {
          const newDest: DestinationInfo = {
            id: region.id,
            name: region.name,
            nameTr: region.nameTr,
            tagline: region.tagline,
            taglineTr: region.taglineTr,
            image: normalizeImageUrl(region.image),
            toursCount: 1,
            popularHighlights: region.popularHighlights,
            popularHighlightsTr: region.popularHighlightsTr,
            showOnHome: true,
          };
          destMap.set(region.id, newDest);
          newlyAdded.push(newDest);
        }
      }
    }
  }

  // Build finalized clean destinations with exact tour counts
  const updatedDestinations: DestinationInfo[] = Array.from(destMap.values()).map((dest) => ({
    ...dest,
    toursCount: regionCounts.get(dest.id) || 1,
    showOnHome: dest.showOnHome !== false,
  }));

  return {
    updatedDestinations,
    newlyAdded,
  };
}

/**
 * Synchronizes destinations when a tour is added, edited, or imported.
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
  const { updatedDestinations, newlyAdded } = syncDestinationsWithAllTours(allTours, currentDestinations);

  return {
    updatedDestinations,
    newlyAdded,
    detectedRegions: detected,
  };
}
