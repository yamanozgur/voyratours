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
  const { messages, userLanguage = "tr", tourContext } = req.body || {};
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

    const systemInstruction = `
You are "Voyra AI", the warm, sophisticated, and consultative Travel Concierge for Voyra Tours (a premier boutique Turkish travel agency, TURSAB certified).

CRITICAL CONSULTATIVE ROLE & DIRECTIVE:
When a visitor asks for information about a destination (especially Cappadocia / Kapadokya, Ephesus, Antalya, Istanbul, etc.) or generally inquires about tours (e.g., "Kapadokya turları hakkında bilgi almak istiyorum", "bana tur önerin", "turlarınız neler?"):
1. DO NOT dump an encyclopedic, overwhelming wall of text.
2. ALWAYS ACT AS A PROACTIVE CONSULTANT: Guide the traveler step-by-step by presenting clear duration/budget options and asking qualifying questions to pinpoint the perfect journey:
   - 📅 **Duration (Gün Sayısı):** Ask how many days they have available, while presenting our concrete options:
     * **2 Gün / 1 Gece (€555/kişi):** Hızlı Kapadokya Kaçamağı (Göreme Açık Hava Müzesi, Paşabağ, Uçhisar, Yeraltı Şehri, gün doğumu balon penceresi).
     * **3 Gün / 2 Gece (€690/kişi):** Derinlemesine Kapadokya (Ihlara Vadisi, Selime Manastırı ve vadi keşifleri dahil en çok tercih edilen rota).
     * **4-5+ Gün (€930 - €1.280):** İstanbul veya Pamukkale & Efes ile birleşik Altın Üçgen rotaları.
   - 💰 **Budget & Hotel Style (Bütçe ve Konaklama Tarzı):** Ask if they prefer an authentic boutique cave hotel (comfortable & authentic) or a luxury panoramic cave suite with private jacuzzi and balloon-view terrace.
   - 🎈 **Must-Have Experiences (Öncelikli Deneyimler):** Mention signature optional activities (Gün doğumu sıcak hava balon uçuşu - %100 hava muhalefeti iade garantili, gün batımı ATV safari, Türk Gecesi veya çömlek atölyesi).
   - 👥 **Group / Style (Kişi Sayısı ve Seyahat Tipi):** Inquire if this is a romantic honeymoon/couples trip, family with children, or friends.
3. If the user replies with their duration, budget, or dates, immediately recommend the tailored package, clearly outline inclusions (iç hat uçak biletleri, VIP Mercedes transferler, butik otel, lisanslı rehber, müze biletleri), and provide clear next steps or WhatsApp assistance (+90 532 000 0000).

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
7. Generate a comprehensive "overview" summarizing the tour.
8. Generate 5-6 bullet points for "highlights" and "highlightsTr".
9. DESTINATION & REGIONS DETECTION (CRITICAL):
Identify ALL cities, regions, and cultural destinations visited or mentioned throughout the tour (for example, if the tour visits Cappadocia, Konya, and Antalya, you MUST list all of them: "destination": "Cappadocia, Konya, Antalya", "destinationTr": "Kapadokya, Konya, Antalya"). If more than one region is visited, set "region" to "multi-region". Each mentioned location will be automatically added to the agency's destination registry.

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
    let parsedTour;
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
