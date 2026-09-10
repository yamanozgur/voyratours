import { TourPackage, DestinationInfo } from '../types';

const STORAGE_KEY = 'voyra_admin_tours_v1';

// Known dummy tour IDs to remove completely
export const DUMMY_TOUR_IDS = new Set([
  'cappadocia-2-day',
  'ephesus-pamukkale-2-day',
  'gallipoli-troy-2-day',
  'grand-turkey-6-day',
  'istanbul-3-day',
  'turquoise-coast-7-day',
  'istanbul-cappadocia-4-day',
  'cappadocia-ephesus-pamukkale-5-day',
  'grand-anatolian-8-day',
  'ultimate-turkey-9-day',
]);

// Dummy destination IDs set (empty so custom/detected destinations are never removed)
export const DUMMY_DESTINATION_IDS = new Set<string>();

// No hardcoded dummy tours - only tours uploaded or created by the user
export const INITIAL_TOURS_DATA: TourPackage[] = [];

export const REVIEWS_DATA = [
  {
    id: 'rev-1',
    author: 'James & Sarah Thornton',
    country: 'Australia',
    countryFlag: '🇦🇺',
    tourTaken: 'Magical Cappadocia Escape',
    tourTakenTr: 'Büyülü Kapadokya Kaçamağı',
    rating: 5,
    date: 'August 2024',
    comment: 'Voyra Tours delivered beyond our wildest expectations! From our pickup in Istanbul to the breathtaking sunrise balloon flight over Göreme and our exquisite cave suite, everything was seamless. Our guide was so knowledgeable. Worth every cent.',
    commentTr: 'Voyra Tours tüm beklentilerimizin ötesine geçti! İstanbul otelimizden alınışımızdan Göreme üzerindeki nefes kesen gün doğumu balon uçuşuna ve kaldığımız harika mağara süitine kadar her şey kusursuzdu. Rehberimiz olağanüstü bilgiliydi.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'rev-2',
    author: 'Elena Rostova',
    country: 'United Kingdom',
    countryFlag: '🇬🇧',
    tourTaken: 'Gallipoli & Troy Legends',
    tourTakenTr: 'Çanakkale & Truva Efsaneleri',
    rating: 5,
    date: 'July 2024',
    comment: 'The Gallipoli trip was deeply moving and respectful. Walking inside the original trenches at Lone Pine and standing at Anzac Cove while our historian guide narrated the events gave us chills. Exceptional service and comfortable VIP transport.',
    commentTr: 'Gelibolu seyahati son derece duygusal ve etkileyiciydi. Lone Pine siperlerinde yürümek ve Anzak Koyu’nda rehberimizin anlatımını dinlemek tüylerimizi diken diken etti. Kusursuz hizmet ve konforlu VIP transferler için teşekkür ederiz.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'rev-3',
    author: 'Marc & Chloé Dubois',
    country: 'France',
    countryFlag: '🇫🇷',
    tourTaken: 'Best of Turkey Grand Loop',
    tourTakenTr: 'Klasik Türkiye Büyük Turu',
    rating: 5,
    date: 'October 2024',
    comment: 'We booked the full multi-region package. Having 3 domestic flights and all hotel & airport transfers pre-arranged made our vacation completely stress-free. Every boutique hotel was charming, especially the cave suite in Uçhisar.',
    commentTr: 'Çok bölgeli Türkiye paketini tercih ettik. İç hat uçuşlarının ve tüm otel-havalimanı VIP transferlerinin önceden ayarlanmış olması tatilimizi tamamen stressiz kıldı. Kaldığımız her butik otel ve özellikle Uçhisar mağara süiti harikaydı.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'rev-4',
    author: 'David K. Miller',
    country: 'United States',
    countryFlag: '🇺🇸',
    tourTaken: 'Pamukkale & Ancient Ephesus',
    tourTakenTr: 'Pamukkale & Antik Efes',
    rating: 5,
    date: 'September 2024',
    comment: 'Walking on the white terraces of Pamukkale and swimming in Cleopatra’s Antique pool surrounded by ancient columns was pure magic. Voyra’s team was responsive on WhatsApp 24/7. Highly recommended for travelers looking for quality over mass tourism.',
    commentTr: 'Pamukkale’nin bembeyaz travertenlerinde yürümek ve Kleopatra Havuzu’nda antik sütunlar arasında yüzmek tam anlamıyla büyüleyiciydi. Voyra ekibi WhatsApp üzerinden her an yanımızdaydı. Kitle turizmi yerine kalite arayan herkese tavsiye ederim.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
  },
];

export const DESTINATIONS_STORAGE_KEY = 'voyra_destinations_v1';

// No hardcoded dummy destinations - initialized empty
export const INITIAL_DESTINATIONS_DATA: DestinationInfo[] = [];

export let DESTINATIONS_DATA: DestinationInfo[] = (() => {
  try {
    const saved = localStorage.getItem(DESTINATIONS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        // Strip out dummy destinations and enforce Voyra default image
        const cleanDests = parsed
          .filter((d: DestinationInfo) => !DUMMY_DESTINATION_IDS.has(d.id))
          .map((d: DestinationInfo) => ({
            ...d,
            showOnHome: d.showOnHome !== false,
            image:
              !d.image?.trim() || d.image.includes('1570939274717-7eda259b50ed')
                ? 'https://raw.githubusercontent.com/yamanozgur/voyratours/main/asset/default.jpg'
                : d.image,
          }));

        localStorage.setItem(DESTINATIONS_STORAGE_KEY, JSON.stringify(cleanDests));
        return cleanDests;
      }
    }
  } catch (e) {
    console.error(e);
  }
  return INITIAL_DESTINATIONS_DATA;
})();

export function updateDestinationsData(newList: DestinationInfo[]) {
  DESTINATIONS_DATA = newList;
  try {
    localStorage.setItem(DESTINATIONS_STORAGE_KEY, JSON.stringify(newList));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('voyra_destinations_updated'));
    }
  } catch (e) {
    console.error(e);
  }
}

export function resetDestinationsToDefault(): DestinationInfo[] {
  DESTINATIONS_DATA = [...INITIAL_DESTINATIONS_DATA];
  try {
    localStorage.removeItem(DESTINATIONS_STORAGE_KEY);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('voyra_destinations_updated'));
    }
  } catch (e) {
    console.error(e);
  }
  return DESTINATIONS_DATA;
}

export function isInvalidTourTitle(title?: string, badge?: string): boolean {
  if (!title) return true;
  const lower = title.toLowerCase().trim();
  if (
    lower.startsWith('number of guests') ||
    lower.includes('number of guests') ||
    lower.includes('1-2 pax') ||
    lower.startsWith('day 1:') ||
    lower.startsWith('day 1 -') ||
    lower.startsWith('your journey begins')
  ) {
    return true;
  }
  return false;
}

export let TOURS_DATA: TourPackage[] = (() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        // Strip out dummy tours, remove corrupted drafts, and replace legacy images
        const cleanTours = parsed
          .filter((t: TourPackage) => !DUMMY_TOUR_IDS.has(t.id))
          .map((t: TourPackage) => ({
            ...t,
            heroImage:
              !t.heroImage?.trim() || t.heroImage.includes('1570939274717-7eda259b50ed')
                ? 'https://raw.githubusercontent.com/yamanozgur/voyratours/main/asset/default.jpg'
                : t.heroImage,
            galleryImages: t.galleryImages?.map((img) =>
              img.includes('1570939274717-7eda259b50ed')
                ? 'https://raw.githubusercontent.com/yamanozgur/voyratours/main/asset/default.jpg'
                : img
            ),
          }))
          .filter(
            (t: TourPackage) => !isInvalidTourTitle(t.title) && !isInvalidTourTitle(t.titleTr)
          );

        localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanTours));
        return cleanTours;
      }
    }
  } catch (e) {
    console.error(e);
  }
  return INITIAL_TOURS_DATA;
})();

export function updateToursData(newList: TourPackage[]) {
  TOURS_DATA = newList;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('voyra_tours_updated'));
    }
  } catch (e) {
    console.error(e);
  }
}

export function resetToursToDefault(): TourPackage[] {
  TOURS_DATA = [...INITIAL_TOURS_DATA];
  try {
    localStorage.removeItem(STORAGE_KEY);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('voyra_tours_updated'));
    }
  } catch (e) {
    console.error(e);
  }
  return TOURS_DATA;
}

export const HERO_STORAGE_KEY = 'voyra_hero_slides_v1';
export const INITIAL_HERO_SLIDES = [
  'https://raw.githubusercontent.com/yamanozgur/voyratours/main/asset/hero.webp',
  'https://raw.githubusercontent.com/yamanozgur/voyratours/main/asset/main1.jpg',
  'https://raw.githubusercontent.com/yamanozgur/voyratours/main/asset/main2.jpg',
  'https://raw.githubusercontent.com/yamanozgur/voyratours/main/asset/main3.jpg',
  'https://raw.githubusercontent.com/yamanozgur/voyratours/main/asset/main4.jpg',
];

export let HERO_SLIDES: string[] = (() => {
  try {
    const saved = localStorage.getItem(HERO_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error(e);
  }
  return INITIAL_HERO_SLIDES;
})();

export function updateHeroSlides(newSlides: string[]) {
  HERO_SLIDES = newSlides;
  try {
    localStorage.setItem(HERO_STORAGE_KEY, JSON.stringify(newSlides));
  } catch (e) {
    console.error(e);
  }
}
