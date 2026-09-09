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
  return new GoogleGenAI({ apiKey });
}

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
      model: "gemini-1.5-flash",
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
