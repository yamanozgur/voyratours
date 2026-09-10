import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Language, TourPackage } from '../types';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  language?: Language;
  tour?: TourPackage | null;
  schemaType?: 'website' | 'tour' | 'faq';
  faqItems?: Array<{ question: string; answer: string }>;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  image,
  language = 'en',
  tour,
  schemaType = 'website',
  faqItems,
}) => {
  const location = useLocation();
  const isTr = language === 'tr';

  useEffect(() => {
    // 1. Update document title
    const baseTitle = isTr
      ? 'Voyra Tours | Kapadokya & Butik Türkiye Turları'
      : 'Voyra Tours | Curated Turkey Experiences & Boutique Private Tours';

    const finalTitle = title ? `${title} | Voyra Tours` : baseTitle;
    document.title = finalTitle;

    // 2. Update html lang attribute
    document.documentElement.lang = language;

    // 3. Update meta tags helper
    const updateMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const finalDesc =
      description ||
      (isTr
        ? 'İstanbul çıkışlı butik Kapadokya, Efes, Pamukkale ve özel Türkiye turları. Lüks mağara oteller, VIP transferler ve hava muhalefeti iade garantili balon uçuşu.'
        : 'Curated boutique Turkey travel packages, cave hotels in Cappadocia, and licensed private guided tours across Turkey with 100% weather refund guarantee.');

    const finalImage =
      image ||
      tour?.heroImage ||
      'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=85';

    const fullUrl = `https://voyratours.com${location.pathname}${location.search}`;

    updateMeta('description', finalDesc);
    updateMeta('og:title', finalTitle, true);
    updateMeta('og:description', finalDesc, true);
    updateMeta('og:image', finalImage, true);
    updateMeta('og:url', fullUrl, true);
    updateMeta('twitter:title', finalTitle);
    updateMeta('twitter:description', finalDesc);
    updateMeta('twitter:image', finalImage);

    // 4. Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', fullUrl);

    // 5. Injected dynamic JSON-LD for rich snippets
    const scriptId = 'voyra-page-schema';
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      existingScript.remove();
    }

    let dynamicSchema: object | null = null;

    if (tour) {
      // Tour rich snippet (TouristTrip Schema)
      dynamicSchema = {
        '@context': 'https://schema.org',
        '@type': 'TouristTrip',
        name: isTr ? tour.titleTr : tour.title,
        description: isTr ? tour.overviewTr : tour.overview,
        touristType: ['Cultural tourist', 'Luxury tourist'],
        offers: {
          '@type': 'Offer',
          price: tour.priceEUR,
          priceCurrency: 'EUR',
          availability: 'https://schema.org/InStock',
          validFrom: '2026-01-01',
          url: fullUrl,
        },
        image: [tour.heroImage, ...(tour.galleryImages || [])],
        itinerary: {
          '@type': 'ItemList',
          numberOfItems: tour.itinerary?.length || tour.durationDays,
          itemListElement: (tour.itinerary || []).map((day, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            item: {
              '@type': 'TouristAttraction',
              name: isTr ? day.titleTr : day.title,
              description: isTr ? day.descriptionTr : day.description,
            },
          })),
        },
        provider: {
          '@type': 'TravelAgency',
          name: 'Voyra Tours',
          url: 'https://voyratours.com',
        },
      };
    } else if (schemaType === 'faq' && faqItems && faqItems.length > 0) {
      // FAQPage rich snippet
      dynamicSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      };
    }

    if (dynamicSchema) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      script.text = JSON.stringify(dynamicSchema);
      document.head.appendChild(script);
    }

    return () => {
      const el = document.getElementById(scriptId);
      if (el) el.remove();
    };
  }, [title, description, image, language, location.pathname, location.search, tour, schemaType, faqItems, isTr]);

  return null;
};
