import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Helper to get Gemini client
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Resilient helper to call Gemini with automatic fallback for high-demand 503 / 429 spikes
async function generateWithFallback(
  ai: GoogleGenAI,
  params: {
    contents: any;
    systemInstruction?: string;
    temperature?: number;
  }
) {
  // Primary model: gemini-3.8-flash, Secondary fallback: gemini-3.1-flash-lite
  const models = ["gemini-3.8-flash", "gemini-3.1-flash-lite"];
  let lastError: any = null;

  for (const model of models) {
    try {
      const config: any = {};
      if (params.systemInstruction) config.systemInstruction = params.systemInstruction;
      if (params.temperature !== undefined) config.temperature = params.temperature;

      const response = await ai.models.generateContent({
        model,
        contents: params.contents,
        config: Object.keys(config).length > 0 ? config : undefined,
      });

      if (response && response.text) {
        return response;
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`[Gemini API] Model ${model} encountered an issue (${err?.status || err?.message || 'Error'}). Trying fallback...`);
    }
  }

  throw lastError || new Error("All AI models currently unavailable.");
}

// API endpoint for Voyra AI Travel Concierge chat
app.post("/api/ai-chat", async (req, res) => {
  const {
    messages,
    userLanguage = "tr",
    tourContext,
    availableTours,
    destinationsCatalog,
  } = req.body || {};
  const isTr = userLanguage === "tr";

  const defaultWelcomeFallback = isTr
    ? "Merhaba! Voyra Tours Seyahat Danışmanına hoş geldiniz. Şu anda sistemimizde kısa süreli bir yoğunluk yaşanıyor, ancak seyahat uzmanlarımıza doğrudan WhatsApp (+90 532 000 0000) üzerinden dilediğiniz an yazabilir veya tur detaylarını inceleyebilirsiniz. Size nasıl yardımcı olabilirim?"
    : "Hello! Welcome to Voyra Tours Travel Concierge. Our travel specialists are also readily available on WhatsApp (+90 532 000 0000) to assist you with custom quotes, balloon flights, and tour packages. How may I help you today?";

  try {
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({ reply: defaultWelcomeFallback, isFallback: true });
    }

    const ai = getGenAI();

    // Dynamically format available website tours for Gemini's grounding
    let catalogSection = "";
    if (Array.isArray(availableTours) && availableTours.length > 0) {
      const tourLines = availableTours
        .map(
          (t: any) =>
            `• [ID: ${t.id}] "${t.titleTr || t.title}" (EN: "${t.title}") | Süre: ${t.durationDays} Gün (${t.durationNights || t.durationDays - 1} Gece) | Bölgeler: ${t.destinationTr || t.destination || t.region} | Fiyat: €${t.priceEUR}/kişi başı | Öne Çıkanlar: ${(t.highlightsTr || t.highlights || []).slice(0, 3).join(', ')}`
        )
        .join('\n');
      catalogSection = `
=== SİTEDE MEVCUT TÜM TUR PAKETLERİ (LIVE WEBSITE TOURS CATALOG) ===
Ziyaretçi herhangi bir şehir, bölge, gün sayısı veya tur adı sorduğunda AŞAĞIDAKİ GERÇEK VE GÜNCEL TURLARIMIZDAN referans ver, tam fiyat ve gün sayısını belirt:
${tourLines}
`;
    }

    let destSection = "";
    if (Array.isArray(destinationsCatalog) && destinationsCatalog.length > 0) {
      const destLines = destinationsCatalog
        .map(
          (d: any) =>
            `• ${d.nameTr || d.name} (Slug: ${d.id}, Aktif Tur Sayısı: ${d.toursCount || '1+'}): ${d.taglineTr || d.tagline || ''}`
        )
        .join('\n');
      destSection = `
=== SİTEDE MEVCUT DESTİNASYONLAR & BÖLGELER ===
${destLines}
`;
    }

    const systemInstruction = `
You are "Voyra AI", the warm, sophisticated, and consultative Travel Concierge for Voyra Tours (a premier boutique Turkish travel agency, TURSAB certified).

CRITICAL CONSULTATIVE ROLE & DIRECTIVE:
When a visitor asks for information about a destination (especially Cappadocia, Ephesus, Antalya, Istanbul, Konya, Mardin, Pamukkale, etc.) or generally inquires about tours (e.g., "Kapadokya turları hakkında bilgi almak istiyorum", "bana tur önerin", "turlarınız neler?", "Konya turunuz var mı?"):
1. ALWAYS scan the live website tour catalog provided below to see all matching tours, durations, and exact prices.
2. DO NOT dump an encyclopedic, overwhelming wall of text.
3. ALWAYS ACT AS A PROACTIVE CONSULTANT: Guide the traveler step-by-step by presenting clear duration/budget options and asking qualifying questions to pinpoint the perfect journey:
   - 📅 **Duration (Gün Sayısı):** Ask how many days they have available, while presenting our concrete options:
     * **2 Gün / 1 Gece (€555/kişi):** Hızlı Kapadokya Kaçamağı (Göreme Açık Hava Müzesi, Paşabağ, Uçhisar, Yeraltı Şehri, gün doğumu balon penceresi).
     * **3 Gün / 2 Gece (€690/kişi):** Derinlemesine Kapadokya (Ihlara Vadisi, Selime Manastırı ve vadi keşifleri dahil en çok tercih edilen rota).
     * **4-5+ Gün (€930 - €1.280):** İstanbul veya Pamukkale & Efes ile birleşik Altın Üçgen rotaları.
   - 💰 **Budget & Hotel Style (Bütçe ve Konaklama Tarzı):** Ask if they prefer an authentic boutique cave hotel (comfortable & authentic) or a luxury panoramic cave suite with private jacuzzi and balloon-view terrace.
   - 🎈 **Must-Have Experiences (Öncelikli Deneyimler):** Mention signature optional activities (Gün doğumu sıcak hava balon uçuşu - %100 hava muhalefeti iade garantili, gün batımı ATV safari, Türk Gecesi veya çömlek atölyesi).
   - 👥 **Group / Style (Kişi Sayısı ve Seyahat Tipi):** Inquire if this is a romantic honeymoon/couples trip, family with children, or friends.
4. If the user replies with their duration, budget, or dates, immediately recommend the tailored package, clearly outline inclusions (iç hat uçak biletleri, VIP Mercedes transferler, butik otel, lisanslı rehber, müze biletleri), and provide clear next steps or WhatsApp assistance (+90 532 000 0000).

${catalogSection}
${destSection}

Core Inclusions in All Voyra Packages:
- All domestic flight tickets within Turkey.
- Private Mercedes Vito/Sprinter airport & tour VIP transfers.
- Boutique 4*/5* cave hotels (Cappadocia) and historic heritage hotels.
- Licensed professional tour guides (historians & locals).
- Museum & heritage entrance fees (skip-the-line).
- Artisan daily breakfasts and authentic local lunches on touring days.
(Exclusions: International flights, dinners, personal shopping, optional balloon/ATV activities).

Signature Packages by Duration:
- 2 Days: Cappadocia Express (€555), Ephesus & Pamukkale Express (€490), Gallipoli & Troy (€460), Istanbul Essentials (€420).
- 3 Days: Cappadocia In-Depth (€690), Imperial Istanbul & Bosphorus Yachting (€580).
- 4 Days: Best of Istanbul & Cappadocia Highlights (€930).
- 5 Days: The Golden Triangle (Cappadocia, Pamukkale, Ephesus - €1.280).
- 6 Days: Grand Classic Turkey (Istanbul, Cappadocia, Pamukkale, Ephesus - €1.520).
- 7 Days: Turquoise Coast & Lycian Wonders (Antalya, Kekova Sunken City, Kas, Oludeniz - €1.680).
- 8 Days: Grand Anatolian & Aegean Journey (€1.890).
- 9 Days: Ultimate Grand Turkey Loop (€2.150).
- 100% Bespoke / Custom planning for any duration (1-20 days).

Language & Tone:
- ALWAYS reply in the exact language the user addresses you in (fluent, friendly, elegant Turkish if Turkish, polished English if English).
- Welcoming, consultative, warm, and structured. Use clean bullet points, bold highlights, and friendly questions. Keep it inviting and easy to scan!
${tourContext ? `Current Tour Context: The user is currently browsing "${tourContext.title || ''}" (${tourContext.durationDays || ''} Days, Price: €${tourContext.priceEUR || ''}). Keep this in mind if they ask about "this tour".` : ""}
`;

    // Format previous messages for Gemini contents
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" || m.role === "model" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const response = await generateWithFallback(ai, {
      contents,
      systemInstruction,
      temperature: 0.7,
    });

    const reply = response.text || defaultWelcomeFallback;
    res.json({ reply });
  } catch (error: any) {
    console.warn("[/api/ai-chat] Graceful fallback activated due to:", error?.message || error);
    // Return 200 with graceful assistant reply rather than 500 error
    res.json({
      reply: defaultWelcomeFallback,
      isFallback: true,
    });
  }
});

// API endpoint to parse a tour from Word document text using Gemini
app.post("/api/parse-tour-word", async (req, res) => {
  try {
    const { text, fileName } = req.body;
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Document text is required" });
    }

    const ai = getGenAI();
    const prompt = `
You are an expert AI tour parser for Voyra Tours (a boutique travel agency in Turkey).
Analyze the following raw text extracted from a Word document (.docx) containing tour details.

Document File Name: "${fileName || ''}"

Follow these strict rules:
1. Tour Title: Use the document file name without extension as the primary Tour Title (e.g. if fileName is "2 - day Cappadocia Tour.docx", title MUST BE "2-Day Cappadocia Tour"). If not available, use the main highlighted title in the text. NEVER use itinerary paragraphs or day 1 text as the tour title!
2. Ignore and skip any top Travel Agent metadata tables (e.g., Name & Surname, Travel Agent, Guest count, Phone, Email, Emergency Contact).
3. Extract all tour days starting with "Day 1", "Day 2", etc., into the itinerary array with titles and descriptions.
4. Extract pricing, Important Info (such as Optional Experiences like Hot Air Balloon, ATV Safari), and hotel options.
5. Extract Included and Excluded services accurately.
6. Extract Travel Recommendations and include them in the tour details or overview.
7. TOUR OVERVIEW (CRITICAL - DO NOT USE DEFAULTS):
Scan the entire document for any Tour Overview, Summary, or Introduction section. If present, extract and use it. If not present as a separate section, synthesize an engaging, detailed 2-3 paragraph tour overview strictly reflecting the ACTUAL places, monuments, daily itinerary, hotel accommodations, and destinations visited in THIS specific tour (for instance, if the tour is about Ephesus and Pamukkale, describe Ephesus, Library of Celsus, and Pamukkale terraces; NEVER mention Cappadocia or other unrelated places unless actually in the document!). Provide both "overview" (English) and "overviewTr" (Turkish).
8. HIGHLIGHTS (CRITICAL - STRICTLY FROM THIS TOUR):
Generate 5-6 bullet points for "highlights" (English) and "highlightsTr" (Turkish) based STRICTLY on the actual landmarks, ruins, activities, and experiences mentioned in THIS tour document (never use default or unrelated destinations).
9. DESTINATION DETECTION (STRICTLY ATOMIC SEPARATE LOCATIONS - BASE ON TOUR TITLE & ACTUAL SIGHTSEEING):
Destinations must be individual separate locations (e.g. "Antalya", "Efes", "Pamukkale", "Kapadokya", "İstanbul").
DO NOT use grouped/combined region names like "Antalya & Turkuaz Kıyı" or "Efes & Pamukkale".
- Base the locations primarily on the Tour Title if present! (e.g. If the tour title is "2 gün kapadokya & pamukkale" or "2-Day Ephesus & Pamukkale Tour", the visited locations are strictly the two individual locations: "Kapadokya" and "Pamukkale" or "Efes" and "Pamukkale").
- If the title is generic (e.g. "Boutique Anatolia Trip"), examine the actual sightseeing places on Day 1, Day 2, Day 3 (excluding departure/transit airports).
- Format:
  - "destination": comma-separated individual locations in English (e.g. "Cappadocia, Pamukkale" or "Ephesus, Pamukkale" or "Antalya")
  - "destinationTr": comma-separated individual locations in Turkish (e.g. "Kapadokya, Pamukkale" or "Efes, Pamukkale" or "Antalya")
  - "region": if only 1 location is visited, use its id: "cappadocia", "ephesus", "pamukkale", "antalya", "istanbul", etc. If 2 or more locations are visited, set region to "multi-region".
CRITICAL TRANSIT & FALSE POSITIVE RULES:
- Departure airports or transit transfer flights (e.g. "Early morning flight from Istanbul", "Fly into Izmir Airport ADB", "Transfer back to Kayseri Airport") are NOT tour destinations! NEVER include Istanbul or Izmir if they are only transit/flight departure points without sightseeing!
- NEVER include cities or regions that are not actually in this tour (e.g. Çeşme, Antalya, Bodrum have nothing to do with an Ephesus & Pamukkale tour!).

Extract and structure the tour into a valid JSON object matching this TypeScript TourPackage interface:

export interface TourPackage {
  id: string; // e.g. "cappadocia-deluxe-2d" (lowercase hyphenated)
  slug: string;
  title: string; // English title
  titleTr: string; // Turkish title
  subtitle: string; // English subtitle
  subtitleTr: string; // Turkish subtitle
  destination: string; // English destination e.g. "Cappadocia"
  destinationTr: string; // Turkish destination e.g. "Kapadokya"
  region: string; // e.g. "cappadocia", "istanbul", etc.
  durationDays: number;
  durationNights: number;
  priceEUR: number;
  originalPriceEUR: number;
  heroImage: string; // Unsplash URL
  gallery: string[]; // 3-4 Unsplash URLs
  overview: string; // English overview
  overviewTr: string; // Turkish overview
  highlights: string[]; // 5-6 items
  highlightsTr: string[]; // 5-6 items
  included: string[];
  includedTr: string[];
  excluded: string[];
  excludedTr: string[];
  hotelType: string;
  hotelTypeTr: string;
  departure: string;
  departureTr: string;
  importantInfo?: string; // Important info & optional activities found in document
  featured?: boolean;
  itinerary: Array<{
    day: number;
    title: string;
    titleTr: string;
    description: string;
    descriptionTr: string;
    meals?: string;
    highlights?: string[];
    overnight?: string;
  }>;
}

IMPORTANT: 
- Return ONLY valid JSON (no markdown wrappers like \`\`\`json, just raw JSON).
- If English or Turkish fields are not explicitly provided in the text, translate or generate professional travel agency descriptions in both languages.
- Ensure all numeric fields are numbers, and array fields are arrays of strings.

Raw Document Text:
"""
${text}
"""
`;

    const response = await generateWithFallback(ai, {
      contents: prompt,
    });

    let jsonStr = response.text || "{}";
    // Clean up markdown code blocks if present
    jsonStr = jsonStr.replace(/```json/g, "").replace(/```/g, "").trim();
    
    // Attempt parsing, if invalid JSON try to find JSON substring
    let parsedTour: any;
    try {
      parsedTour = JSON.parse(jsonStr);
    } catch (e) {
      const match = jsonStr.match(/\{[\s\S]*\}/);
      if (match) {
        parsedTour = JSON.parse(match[0]);
      } else {
        throw new Error("Could not parse JSON response from AI");
      }
    }

    if (parsedTour) {
      if (!parsedTour.heroImage || parsedTour.heroImage.includes('1570939274717-7eda259b50ed')) {
        parsedTour.heroImage = 'https://raw.githubusercontent.com/yamanozgur/voyratours/main/asset/default.jpg';
      }
      if (!parsedTour.galleryImages || !Array.isArray(parsedTour.galleryImages) || parsedTour.galleryImages.length === 0) {
        parsedTour.galleryImages = ['https://raw.githubusercontent.com/yamanozgur/voyratours/main/asset/default.jpg'];
      }
    }
    
    res.json({ success: true, tour: parsedTour });
  } catch (error: any) {
    console.error("Error parsing tour from Word doc:", error);
    res.status(500).json({ error: error.message || "Failed to parse tour document with AI" });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
