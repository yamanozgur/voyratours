import { TourPackage, ItineraryDay } from '../types';
import { detectRegionsFromTour } from './destinationDetector';

/**
 * Robust, deterministic parser tailored specifically for Voyra Tour Document templates.
 * 
 * Implements the user's 8 strict rules:
 * 1. Ignore top TRAVEL AGENT metadata table.
 * 2. Day 1, Day 2, etc. -> Detailed Daily Itinerary.
 * 3. Prominent Title section (e.g., 2-Day Cappadocia Tour from Istanbul...) -> Tour Title.
 * 4. Fiyatlar -> priceEUR, Important Info (e.g. Optional Experiences) -> overview/itinerary.
 * 5. Included & Excluded sections -> included, excluded arrays.
 * 6. Travel Recommendations -> extracted and preserved in overview/important info.
 * 7. Overview summarizing the tour.
 * 8. 5-6 Tour Highlights extracted from destinations & experiences.
 */
export function parseVoyraTourDocument(rawText: string, fileName?: string): TourPackage {
  // Normalize linebreaks and trim whitespace
  const lines = rawText
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0);

  // 1. FILTER OUT TRAVEL AGENT TABLE LINES & FORM LABELS
  const isAgentLine = (l: string) => {
    const lower = l.toLowerCase();
    return (
      lower.includes('name & surname') ||
      lower.includes('number of guests') ||
      lower.includes('travel agent') ||
      lower.includes('emergency contact') ||
      lower.includes('istanbul office') ||
      lower.includes('phone number') ||
      lower.includes('e-mail') ||
      lower.includes('iremdalar') ||
      lower.includes('+90 553') ||
      lower.includes('ad soyad') ||
      lower.includes('misafir sayısı') ||
      lower.includes('irtibat no')
    );
  };

  // 2. EXTRACT DAYS (Detailed Daily Itinerary)
  const itinerary: ItineraryDay[] = [];
  const dayIndices: { dayNum: number; lineIndex: number; title: string }[] = [];

  // Match: Day 1: ..., Day 2: ..., 1. Gün: ...
  const dayRegex = /^(?:Day|Gün)\s*(\d+)\s*[:\-\.](.*)$/i;

  lines.forEach((line, idx) => {
    const match = line.match(dayRegex);
    if (match) {
      dayIndices.push({
        dayNum: parseInt(match[1]),
        lineIndex: idx,
        title: match[2]?.trim() || `Day ${match[1]}`
      });
    }
  });

  // Extract day contents
  for (let i = 0; i < dayIndices.length; i++) {
    const current = dayIndices[i];
    const nextIndex = (i + 1 < dayIndices.length)
      ? dayIndices[i + 1].lineIndex
      : lines.findIndex((l, idx) => idx > current.lineIndex && (
          l.includes('Tour from Istanbul') ||
          l.match(/\d+[\-\s]Day.*Tour/i) ||
          l.includes('Per Person') ||
          l.includes('Important Information') ||
          l.includes('Included Services')
        ));

    const endIdx = nextIndex > current.lineIndex ? nextIndex : Math.min(current.lineIndex + 20, lines.length);
    const dayLines = lines.slice(current.lineIndex + 1, endIdx).filter(l => !isAgentLine(l));
    
    // Filter out flight/hotel markers into separate highlights or overnight
    let overnight = 'Selected Boutique Hotel';
    let overnightTr = 'Seçkin Butik Otel';
    const cleanDescLines: string[] = [];
    const dayHighlights: string[] = [];

    dayLines.forEach(dl => {
      if (dl.toLowerCase().includes('hotel in') || dl.toLowerCase().includes('hotel options:')) {
        overnight = dl.replace(/[✈️🏨️]/g, '').trim();
        overnightTr = overnight;
      } else if (dl.toLowerCase().includes('flight from') || dl.toLowerCase().includes('flight to')) {
        dayHighlights.push(dl.replace(/[✈️🏨️]/g, '').trim());
      } else {
        cleanDescLines.push(dl);
      }
    });

    const description = cleanDescLines.join('\n\n') || `Day ${current.dayNum} guided tour activities and sightseeing.`;

    itinerary.push({
      day: current.dayNum,
      title: current.title || `Day ${current.dayNum} Exploration`,
      titleTr: `${current.dayNum}. Gün Programı: ${current.title}`,
      description,
      descriptionTr: description,
      meals: ['Breakfast', 'Lunch'],
      mealsTr: ['Kahvaltı', 'Öğle Yemeği'],
      highlights: dayHighlights.length > 0 ? dayHighlights : [current.title],
      highlightsTr: dayHighlights.length > 0 ? dayHighlights : [current.title],
      overnight,
      overnightTr
    });
  }

  // 3. EXTRACT MAIN TOUR TITLE
  // If file name is provided (e.g. "2 - day Cappadocia Tour.docx"), use it directly as the primary Tour Title!
  let tourTitle = '';
  if (fileName && fileName.trim().length > 0) {
    // Strip file extension (.docx, .doc, .pdf)
    let cleanName = fileName.replace(/\.[^/.]+$/, '').trim();
    // Normalize dashes and extra spaces: e.g. "2 - day Cappadocia Tour" -> "2-Day Cappadocia Tour"
    cleanName = cleanName.replace(/\s*-\s*/g, '-').replace(/[-_]/g, ' ');
    // Capitalize words nicely
    tourTitle = cleanName
      .split(' ')
      .filter(Boolean)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  // If no fileName was provided, scan document for prominent title
  if (!tourTitle) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (
        (line.match(/\d+[\-\s]Day.*Tour/i) ||
         line.includes('Cappadocia Tour') ||
         line.includes('Pamukkale') ||
         line.includes('Ephesus') ||
         line.includes('Istanbul Tour') ||
         line.includes('Turkey Tour') ||
         (line.includes('|') && line.length > 15 && line.length < 120)) &&
        !isAgentLine(line) &&
        !line.startsWith('Day ') &&
        !line.startsWith('Your journey begins')
      ) {
        tourTitle = line;
        break;
      }
    }
  }

  if (!tourTitle) {
    tourTitle = '2-Day Cappadocia Tour';
  }

  // Clean title from special symbols
  tourTitle = tourTitle.replace(/^[\s\-–|]+|[\s\-–|]+$/g, '').trim();

  // 4. EXTRACT PRICING & HOTEL & IMPORTANT INFO
  let priceEUR = 490;
  let originalPriceEUR = 560;

  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    // Look for €490 or 490 € or $560
    const eurMatch = l.match(/€\s*(\d+)/i) || l.match(/(\d+)\s*€/i);
    if (eurMatch) {
      const p = parseInt(eurMatch[1]);
      if (p > 50 && p < 10000) {
        priceEUR = p;
        originalPriceEUR = Math.round(p * 1.2);
        break;
      }
    }
    const usdMatch = l.match(/\$\s*(\d+)/i);
    if (usdMatch && priceEUR === 490) {
      const p = Math.round(parseInt(usdMatch[1]) * 0.92);
      if (p > 50) priceEUR = p;
    }
  }

  // Destination & Multi-Region detection from title, itinerary, and raw text
  const detectedRegions = detectRegionsFromTour({
    title: tourTitle,
    destination: tourTitle,
    overview: rawText.slice(0, 3000),
    itinerary,
  });

  let destination = 'Turkey';
  let destinationTr = 'Türkiye';
  let region: TourPackage['region'] = 'multi-region';

  if (detectedRegions.length > 0) {
    destination = detectedRegions.map((r) => r.name).join(', ');
    destinationTr = detectedRegions.map((r) => r.nameTr).join(', ');
    region = (detectedRegions.length > 1 ? 'multi-region' : detectedRegions[0].id) as any;
  } else {
    const lowerAll = (tourTitle + ' ' + rawText).toLowerCase();
    if (lowerAll.includes('pamukkale') || lowerAll.includes('ephesus') || lowerAll.includes('efes')) {
      destination = 'Ephesus & Pamukkale';
      destinationTr = 'Efes & Pamukkale';
      region = 'aegean-ephesus';
    } else if (lowerAll.includes('cappadocia') || lowerAll.includes('kapadokya')) {
      destination = 'Cappadocia';
      destinationTr = 'Kapadokya';
      region = 'cappadocia';
    } else if (lowerAll.includes('istanbul')) {
      destination = 'Istanbul';
      destinationTr = 'İstanbul';
      region = 'istanbul';
    } else if (lowerAll.includes('antalya') || lowerAll.includes('kaleiçi') || lowerAll.includes('kas') || lowerAll.includes('kaş')) {
      destination = 'Antalya & Mediterranean';
      destinationTr = 'Antalya & Akdeniz';
      region = 'mediterranean';
    } else if (lowerAll.includes('trabzon') || lowerAll.includes('karadeniz') || lowerAll.includes('rize') || lowerAll.includes('uzungöl')) {
      destination = 'Black Sea & Trabzon';
      destinationTr = 'Karadeniz & Trabzon';
      region = 'black-sea';
    }
  }

  // Find Selected Accommodation
  let hotelType = '';
  let hotelTypeTr = '';
  const hotelIdx = lines.findIndex(l => l.toLowerCase().includes('hotel options:') || l.toLowerCase().includes('selected accommodation') || l.toLowerCase().includes('otel seçenekleri'));
  if (hotelIdx !== -1 && lines[hotelIdx + 1]) {
    hotelType = lines[hotelIdx].includes(':') ? lines[hotelIdx].split(':')[1].trim() : lines[hotelIdx + 1];
    hotelTypeTr = hotelType;
  }

  if (!hotelType) {
    if (region === 'cappadocia') {
      hotelType = 'Boutique Cave Hotel (Hera Cave Suites or similar)';
      hotelTypeTr = 'Butik Mağara Oteli (Hera Cave Suites veya benzeri)';
    } else if (region === 'aegean-ephesus') {
      hotelType = 'Selected Thermal & Boutique Aegean Hotel (4★/5★)';
      hotelTypeTr = 'Seçkin Termal & Butik Ege Oteli (4★/5★)';
    } else if (region === 'istanbul') {
      hotelType = 'Historic Peninsula Boutique Hotel (4★/5★)';
      hotelTypeTr = 'Tarihi Yarımada Butik Oteli (4★/5★)';
    } else if (region === 'mediterranean') {
      hotelType = 'Seaside Boutique Hotel or Resort (4★/5★)';
      hotelTypeTr = 'Sahil Butik Oteli veya Resort (4★/5★)';
    } else {
      hotelType = 'Handpicked Premium Boutique Hotel';
      hotelTypeTr = 'Özenle Seçilmiş Butik & Konfor Oteli';
    }
  }

  // 5. EXTRACT INCLUDED & EXCLUDED SERVICES
  const included: string[] = [];
  const excluded: string[] = [];
  let inIncluded = false;
  let inExcluded = false;

  lines.forEach(l => {
    const lower = l.toLowerCase();
    if (lower.includes('included services') || lower.includes('this package includes') || lower.includes('fiyata dahil')) {
      inIncluded = true;
      inExcluded = false;
      return;
    }
    if (lower.includes('excluded services') || lower.includes('not included in the tour price') || lower.includes('dahil olmayan')) {
      inExcluded = true;
      inIncluded = false;
      return;
    }
    if (lower.includes('travel recommendations') || lower.includes('optional experiences') || lower.includes('seyahat tavsiye') || lower.includes('opsiyonel')) {
      inIncluded = false;
      inExcluded = false;
      return;
    }

    if (inIncluded) {
      const clean = l.replace(/^[✔\*\-•►\d\.\)]\s*/, '').trim();
      if (clean.length > 3 && !clean.startsWith('(')) {
        included.push(clean);
      }
    } else if (inExcluded) {
      const clean = l.replace(/^[⌦\*\-•►\d\.\)]\s*/, '').trim();
      if (clean.length > 3 && !clean.startsWith('(')) {
        excluded.push(clean);
      }
    }
  });

  // Default included / excluded if document formatting was unconventional
  if (included.length === 0) {
    included.push(
      'Round-trip domestic flights / transfers as specified in itinerary',
      'Accommodation with daily buffet breakfast',
      'All airport and intercity transfers mentioned in the program',
      `Guided sightseeing tours in modern air-conditioned vehicle`,
      'Entrance fees to all scheduled attractions & museums',
      'Professional licensed local tour guide'
    );
  }
  if (excluded.length === 0) {
    excluded.push(
      'Drinks during lunches and dinners',
      'Optional activities and personal excursions',
      'Travel and medical insurance',
      'Personal expenses and tips for guides/drivers'
    );
  }

  // 6. EXTRACT TRAVEL RECOMMENDATIONS & IMPORTANT INFO
  const travelTips: string[] = [];
  let inRecommendations = false;
  lines.forEach(l => {
    const lower = l.toLowerCase();
    if (
      lower.includes('travel recommendations') ||
      lower.includes('for your comfort during sightseeing') ||
      lower.includes('seyahat tavsiyeleri') ||
      lower.includes('önemli tavsiyeler')
    ) {
      inRecommendations = true;
      return;
    }
    if (inRecommendations) {
      if (lower.includes('included services') || lower.includes('excluded services') || lower.includes('optional')) {
        inRecommendations = false;
        return;
      }
      const clean = l.replace(/^[●\*\-•►\d\.\)]\s*/, '').trim();
      if (clean.length > 4) {
        travelTips.push(clean);
      }
    }
  });

  // Optional Experiences (Hot Air Balloon, ATV, Boat tour, etc.)
  const optionalExp: string[] = [];
  let inOptional = false;
  lines.forEach(l => {
    const lower = l.toLowerCase();
    if (
      lower.includes('optional experiences') ||
      lower.includes('optional activities') ||
      lower.includes('enhance your') ||
      lower.includes('opsiyonel deneyimler') ||
      lower.includes('opsiyonel aktiviteler') ||
      lower.includes('isteğe bağlı')
    ) {
      inOptional = true;
      return;
    }
    if (inOptional) {
      if (
        lower.includes('included services') ||
        lower.includes('dahil olan') ||
        lower.includes('excluded services') ||
        lower.includes('dahil olmayan') ||
        lower.includes('travel recommendations') ||
        lower.includes('seyahat tavsiye')
      ) {
        inOptional = false;
        return;
      }
      const clean = l.replace(/^[⇒\*\-•►\d\.\)]\s*/, '').trim();
      if (clean.length > 3 && !clean.toLowerCase().includes('optional activities can be arranged')) {
        optionalExp.push(clean);
      }
    }
  });

  // 7. SCAN DOCUMENT FOR EXPLICIT OVERVIEW OR INTRODUCTORY NARRATIVE
  const explicitOverviewLines: string[] = [];
  let inOverviewSection = false;

  const isOverviewHeader = (l: string) => {
    const clean = l.replace(/^[#*\-•►\d\.\)\:\s]+/, '').trim().toLowerCase();
    return (
      clean === 'tour overview' ||
      clean === 'overview' ||
      clean === 'general overview' ||
      clean === 'tour summary' ||
      clean === 'about the tour' ||
      clean === 'about this tour' ||
      clean === 'program overview' ||
      clean === 'genel bakış' ||
      clean === 'tur genel bakışı' ||
      clean === 'tur özeti' ||
      clean === 'program özeti' ||
      clean === 'tur hakkında' ||
      clean === 'tur açıklaması' ||
      clean === 'tur tanıtımı' ||
      clean === 'özet'
    );
  };

  const isStopOverviewHeader = (l: string) => {
    const lower = l.toLowerCase();
    return (
      dayRegex.test(l) ||
      lower.includes('included services') ||
      lower.includes('excluded services') ||
      lower.includes('dahil olan') ||
      lower.includes('dahil olmayan') ||
      lower.includes('travel recommendations') ||
      lower.includes('seyahat tavsiye') ||
      lower.includes('important information') ||
      lower.includes('önemli bilgi') ||
      lower.includes('optional experiences') ||
      lower.includes('opsiyonel deneyim') ||
      lower.includes('per person') ||
      lower.includes('kişi başı') ||
      lower.includes('hotel options') ||
      lower.includes('fiyat') ||
      lower.includes('price')
    );
  };

  lines.forEach((l) => {
    if (isOverviewHeader(l)) {
      inOverviewSection = true;
      return;
    }
    if (inOverviewSection) {
      if (isStopOverviewHeader(l) || isAgentLine(l)) {
        inOverviewSection = false;
        return;
      }
      const clean = l.replace(/^[#*\-•►\s]+/, '').trim();
      if (clean.length > 15) {
        explicitOverviewLines.push(clean);
      }
    }
  });

  // If no explicit heading, check for narrative intro paragraphs before Day 1
  if (explicitOverviewLines.length === 0 && dayIndices.length > 0) {
    const firstDayLine = dayIndices[0].lineIndex;
    for (let i = 0; i < firstDayLine; i++) {
      const l = lines[i];
      if (
        !isAgentLine(l) &&
        l !== tourTitle &&
        !l.match(/€|\$|per person|kişi başı|hotel|otel/i) &&
        !l.match(/^(?:tour|itinerary|program|travel|voyra)\b/i) &&
        l.length > 35 &&
        !l.includes('...')
      ) {
        explicitOverviewLines.push(l);
      }
    }
  }

  const documentExtractedOverview = explicitOverviewLines.join('\n\n').trim();

  // Language check of document
  const isTurkishDocument = (() => {
    const trSample = rawText.toLowerCase();
    const trLetters = (trSample.match(/[çğıöşü]/g) || []).length;
    const trWords = (trSample.match(/\b(ve|ile|gün|tur|fiyat|otel|dahil|gezisi|turu|saat|havalimanı|programı)\b/g) || []).length;
    return trLetters > 8 || trWords > 4;
  })();

  const durationDays = itinerary.length > 0 ? itinerary.length : 2;
  const durationNights = Math.max(1, durationDays - 1);

  // Day-by-day summaries from actual itinerary
  const daySummaryEn = itinerary.map((d) => `Day ${d.day}: ${d.title}`).join('; ');
  const daySummaryTr = itinerary
    .map((d) => `${d.day}. Gün: ${d.titleTr.replace(/^\d+\.\s*Gün(?:\s*Programı)?[:\s]*/i, '') || d.title}`)
    .join('; ');

  const optionalExpTextEn = optionalExp.length > 0 ? `\n\nOptional Experiences: ${optionalExp.join(', ')}.` : '';
  const optionalExpTextTr = optionalExp.length > 0 ? `\n\nOpsiyonel Deneyimler: ${optionalExp.join(', ')}.` : '';
  const travelTipsTextEn = travelTips.length > 0 ? `\n\nTravel Tips: ${travelTips.slice(0, 4).join(' • ')}.` : '';
  const travelTipsTextTr = travelTips.length > 0 ? `\n\nSeyahat Tavsiyeleri: ${travelTips.slice(0, 4).join(' • ')}.` : '';

  let overview = '';
  let overviewTr = '';

  if (documentExtractedOverview.length > 30) {
    if (isTurkishDocument) {
      // Turkish doc: use extracted narrative as primary overviewTr
      overviewTr = `${documentExtractedOverview}${
        itinerary.length > 0 ? `\n\nGünlük Program Akışı: ${daySummaryTr}.` : ''
      }${optionalExpTextTr}${travelTipsTextTr}`;

      overview = `Discover the enchanting highlights of ${destination} on this carefully planned ${durationDays}-day journey.${
        documentExtractedOverview.length < 250 ? ` ${documentExtractedOverview}` : ''
      }\n\nDaily Itinerary Overview: ${daySummaryEn}.\n\nFeatures ${hotelType}, licensed guiding, scheduled admissions, and private airport transfers.${optionalExpTextEn}${travelTipsTextEn}`;
    } else {
      // English doc: use extracted narrative as primary overview
      overview = `${documentExtractedOverview}${
        itinerary.length > 0 ? `\n\nDaily Itinerary: ${daySummaryEn}.` : ''
      }${optionalExpTextEn}${travelTipsTextEn}`;

      overviewTr = `${destinationTr} bölgesinin eşsiz güzelliklerini ve zengin tarihi dokusunu ${durationDays} günlük bu kapsamlı programla keşfedin.\n\nGünlük Program Akışı: ${daySummaryTr}.\n\nPaket dahilinde ${hotelTypeTr}, profesyonel lisanslı rehberlik, müze girişleri ve tüm transferler bulunmaktadır.${optionalExpTextTr}${travelTipsTextTr}`;
    }
  } else {
    // Synthesize directly from scanned itinerary and destinations
    overview = `Experience the rich history, culture, and stunning landscapes of ${destination} on this ${durationDays}-day boutique tour program.\n\nDaily Highlights:\n${itinerary
      .map((d) => `• Day ${d.day}: ${d.title}`)
      .join('\n')}\n\nIncludes ${hotelType}, licensed professional guide services, museum admissions, and round-trip transfers.${optionalExpTextEn}${travelTipsTextEn}`;

    overviewTr = `${destinationTr} bölgesinin büyüleyici tarihini, zengin kültürünü ve eşsiz manzaralarını ${durationDays} günlük bu özel tur programı ile keşfedin.\n\nGünlük Tur Akışı:\n${itinerary
      .map((d) => `• ${d.day}. Gün: ${d.titleTr.replace(/^\d+\.\s*Gün(?:\s*Programı)?[:\s]*/i, '') || d.title}`)
      .join('\n')}\n\nProgram dahilinde ${hotelTypeTr}, profesyonel lisanslı rehberlik hizmeti, müze/örenyeri girişleri ve konforlu transferler yer almaktadır.${optionalExpTextTr}${travelTipsTextTr}`;
  }

  // 8. 5-6 TOUR HIGHLIGHTS (DYNAMIC FROM DOCUMENT)
  const highlights: string[] = [];
  const highlightsTr: string[] = [];

  // Extract from daily itinerary
  itinerary.forEach((d) => {
    if (d.title && !highlights.some((h) => h.toLowerCase() === d.title.toLowerCase())) {
      highlights.push(d.title);
      highlightsTr.push(d.titleTr.replace(/^\d+\.\s*Gün(?:\s*Programı)?[:\s]*/i, '') || d.title);
    }
    if (d.highlights && Array.isArray(d.highlights)) {
      d.highlights.forEach((dh, idx) => {
        if (dh && dh.length > 5 && !highlights.includes(dh)) {
          highlights.push(dh);
          highlightsTr.push(d.highlightsTr?.[idx] || dh);
        }
      });
    }
  });

  // Complement with detected region popular highlights
  if (detectedRegions.length > 0) {
    detectedRegions.forEach((reg) => {
      reg.popularHighlights.forEach((ph, idx) => {
        if (highlights.length < 6 && !highlights.includes(ph)) {
          highlights.push(ph);
          highlightsTr.push(reg.popularHighlightsTr[idx] || ph);
        }
      });
    });
  }

  // Add hotel highlight if room
  if (highlights.length < 5 && hotelType) {
    highlights.push(`${hotelType} with daily breakfast`);
    highlightsTr.push(`${hotelTypeTr} ve açık büfe kahvaltı`);
  }

  if (highlights.length === 0) {
    highlights.push(
      `Guided exploration of ${destination}`,
      'Licensed professional tour guide throughout the program',
      'All scheduled museum and archaeological site entrances',
      'Comfortable private airport and intercity transfers',
      `${hotelType} accommodation with daily breakfast`
    );
    highlightsTr.push(
      `${destinationTr} kapsamlı rehberli gezi programı`,
      'Program boyunca lisanslı profesyonel turist rehberi',
      'Tüm planlı müze ve örenyeri giriş ücretleri',
      'Konforlu havalimanı ve şehirlerarası transferler',
      `${hotelTypeTr} konaklama ve kahvaltı`
    );
  }

  const cleanSlug = tourTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || `tour-${Date.now()}`;

  const tourId = `${cleanSlug}-${Date.now().toString().slice(-4)}`;

  let departure = 'Istanbul (Round-trip Flights & Transfers Included)';
  let departureTr = 'İstanbul (Gidiş-Dönüş Uçuşlar ve Transferler Dahil)';
  if (destination.toLowerCase().includes('istanbul') && !destination.toLowerCase().includes('cappadocia') && !destination.toLowerCase().includes('pamukkale')) {
    departure = 'Istanbul Airport / Central Hotels';
    departureTr = 'İstanbul Havalimanı / Merkezi Oteller';
  }

  return {
    id: tourId,
    slug: tourId,
    title: tourTitle,
    titleTr: tourTitle,
    subtitle: `${durationDays}-Day Private & Boutique Experience`,
    subtitleTr: `${durationDays} Günlük Özel & Butik Deneyim`,
    destination,
    destinationTr,
    region,
    durationDays,
    durationNights,
    priceEUR,
    originalPriceEUR,
    rating: 5.0,
    reviewsCount: 18,
    groupType: 'Small Group',
    groupTypeTr: 'Küçük Grup',
    heroImage: 'https://raw.githubusercontent.com/yamanozgur/voyratours/main/asset/default.jpg',
    galleryImages: [
      'https://raw.githubusercontent.com/yamanozgur/voyratours/main/asset/default.jpg',
      'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=85'
    ],
    badge: 'Bestseller',
    badgeTr: 'Çok Satan',
    featured: true, // Always show in popular tours!
    overview,
    overviewTr,
    highlights,
    highlightsTr,
    included,
    includedTr: included,
    excluded,
    excludedTr: excluded,
    itinerary,
    hotelType,
    hotelTypeTr,
    departure,
    departureTr,
    importantInfo: optionalExp.length > 0 ? `Optional Experiences:\n${optionalExp.map(e => `• ${e}`).join('\n')}` : undefined,
    importantInfoTr: optionalExp.length > 0 ? `Opsiyonel Deneyimler:\n${optionalExp.map(e => `• ${e}`).join('\n')}` : undefined,
    travelRecommendations: travelTips.length > 0 ? travelTips : undefined,
    travelRecommendationsTr: travelTips.length > 0 ? travelTips : undefined
  };
}
