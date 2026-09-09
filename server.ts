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

// API endpoint for Voyra AI Travel Concierge chat
app.post("/api/ai-chat", async (req, res) => {
  try {
    const { messages, userLanguage = "tr", tourContext } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback graceful response if API key is not yet set
      const isTr = userLanguage === "tr";
      const fallbackReply = isTr
        ? "Merhaba! Voyra Tours Seyahat Danışmanına hoş geldiniz. Şu anda sistemimiz aktif ancak seyahat uzmanlarımızla WhatsApp üzerinden de anında görüşebilirsiniz (+90 532 000 0000). Kapadokya balon turları, 2-9 günlük paketlerimiz ve özel rotalarımız için size nasıl yardımcı olabilirim?"
        : "Hello! Welcome to Voyra Tours Travel Concierge. You can also chat with our travel designers directly on WhatsApp (+90 532 000 0000). How can I assist you with your Turkey travel plans today?";
      return res.json({ reply: fallbackReply });
    }

    const ai = getGenAI();

    const systemInstruction = `
You are "Voyra AI", the warm, sophisticated, and expert Travel Concierge for Voyra Tours (a premier boutique Turkish travel agency).
Your mission is to warmly welcome visitors, inspire them, and provide helpful, accurate, and detailed answers to all their questions regarding Turkey tours, custom travel planning, destinations, pricing, logistics, and experiences.

About Voyra Tours:
- Official boutique travel agency in Turkey (TURSAB member).
- Core promise: Seamless journeys with boutique 4*/5* cave hotels in Cappadocia and authentic boutique heritage hotels in Istanbul, Ephesus, and Antalya.
- Every package includes:
  * Private VIP airport transfers with Mercedes Vito/Sprinter vehicles.
  * Licensed professional English/multilingual tour guides (historians & locals).
  * Domestic flight tickets within Turkey (Istanbul - Cappadocia - Izmir/Ephesus - Antalya).
  * Museum & heritage site entrance fees.
  * Delicious authentic local lunches on full-day tour days.
  * Daily artisan breakfast at hotels.
- Exclusions: International flights to/from Turkey, dinners (unless specified), personal shopping/expenses, and optional adventure activities.
- Optional Signature Activities:
  * Cappadocia Sunrise Hot Air Balloon Flight (one of Turkey's greatest highlights! Operated early morning at sunrise, 100% weather-dependent. If cancelled by civil aviation due to wind, guests receive a 100% full refund).
  * Cappadocia Sunset ATV / Quad Safari across Swords & Red Valleys.
  * Traditional Whirling Dervishes Sema ceremony.
  * Turkish Night dinner & cultural show in a rock-carved cave restaurant.
  * Private Bosphorus Yacht Cruise in Istanbul.
- Tour Packages by Duration (2 to 9 Days):
  * 2 Days: Cappadocia Express, Ephesus & Pamukkale Express, Gallipoli & Troy, Istanbul Essentials.
  * 3 Days: Imperial Istanbul & Bosphorus Yachting, Cappadocia In-Depth.
  * 4 Days: Best of Istanbul & Cappadocia Highlights.
  * 5 Days: The Golden Triangle Circuit (Cappadocia, Pamukkale, Ephesus).
  * 6 Days: Grand Classic Turkey (Istanbul, Cappadocia, Pamukkale, Ephesus).
  * 7 Days: Turquoise Coast & Lycian Wonders (Antalya, Kekova Sunken City, Kas, Oludeniz).
  * 8 Days: Grand Anatolian & Aegean Journey (Istanbul, Cappadocia, Pamukkale, Ephesus).
  * 9 Days: Ultimate Grand Turkey Loop (Comprehensive round-trip of Turkey's finest jewels).
- 100% Bespoke / Tailor-Made Planning:
  * If a guest wants a custom duration (e.g. 10 days, 12 days, honeymoon, family with young kids, luxury private tour), Voyra crafts 100% tailor-made itineraries within 24 hours.
- WhatsApp Direct Assistance:
  * Guests can also talk directly to a human travel specialist via WhatsApp (+90 532 000 0000) or email (info@voyratours.com) for fast reservations or custom quote requests.

${tourContext ? `Current Tour Context: The user is currently browsing "${tourContext.title || ''}" (${tourContext.durationDays || ''} Days, Price: €${tourContext.priceEUR || ''}). Keep this in mind if they ask about "this tour".` : ""}

Interaction Guidelines:
- Language: ALWAYS reply in the language the user addresses you in. If they write in Turkish, reply in fluent, natural Turkish. If English, in polished English.
- Tone: Welcoming, courteous, expert, and friendly. Avoid robotic repetition.
- Formatting: Use concise paragraphs and clean bullet points for readability. Keep it engaging and avoid huge walls of text.
- Encouragement: When relevant, warmly encourage them to check out our specific tour packages or connect with us on WhatsApp for custom booking assistance.
`;

    // Format previous messages for Gemini contents
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" || m.role === "model" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || (userLanguage === "tr"
      ? "Üzgünüm, şu an yanıt oluşturulamadı. Lütfen tekrar deneyin veya WhatsApp üzerinden bize ulaşın."
      : "I apologize, but I could not generate a response right now. Please try again or reach out on WhatsApp.");

    res.json({ reply });
  } catch (error: any) {
    console.error("Error in /api/ai-chat:", error);
    const isTr = req.body?.userLanguage === "tr";
    res.status(500).json({
      error: error.message || "Failed to generate AI response",
      fallbackReply: isTr
        ? "Bağlantıda küçük bir aksaklık oldu. Lütfen tekrar sorabilir veya doğrudan WhatsApp hattımızdan (+90 532 000 0000) bize yazabilirsiniz."
        : "There was a brief glitch connecting to the travel concierge. Please try again or message us on WhatsApp (+90 532 000 0000).",
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

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
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
