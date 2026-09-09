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
    const { text } = req.body;
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Document text is required" });
    }

    const ai = getGenAI();
    const prompt = `
You are an expert AI tour parser for Voyra Tours (a boutique travel agency in Turkey).
Analyze the following raw text extracted from a Word document (.docx) containing tour details.
Extract and structure the tour into a valid JSON object matching this TypeScript TourPackage interface:

export interface TourPackage {
  id: string; // e.g. "cappadocia-deluxe-3d" (lowercase hyphenated)
  slug: string;
  title: string; // English title
  titleTr: string; // Turkish title
  subtitle: string; // English subtitle
  subtitleTr: string; // Turkish subtitle
  destination: string; // English destination e.g. "Cappadocia"
  destinationTr: string; // Turkish destination e.g. "Kapadokya"
  region: string; // e.g. "cappadocia", "aegean-ephesus", "istanbul", "antalya", etc.
  durationDays: number;
  durationNights: number;
  priceEUR: number;
  originalPriceEUR: number;
  heroImage: string; // Use a stunning Unsplash image URL suitable for this tour if not present in text
  gallery: string[]; // 3-4 stunning Unsplash image URLs
  overview: string; // English overview
  overviewTr: string; // Turkish overview
  highlights: string[]; // English highlights array
  highlightsTr: string[]; // Turkish highlights array
  included: string[]; // English included items array
  includedTr: string[]; // Turkish included items array
  excluded: string[]; // English excluded items array
  excludedTr: string[]; // Turkish excluded items array
  hotelType: string;
  hotelTypeTr: string;
  departure: string;
  departureTr: string;
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
- If English or Turkish fields are not explicitly provided in the text, translate or generate professional professional travel agency descriptions in both languages.
- Ensure all numeric fields are numbers, and array fields are arrays of strings.

Raw Document Text:
"""
${text}
"""
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let jsonStr = response.text || "{}";
    // Clean up markdown code blocks if present
    jsonStr = jsonStr.replace(/```json/g, "").replace(/```/g, "").trim();
    
    const parsedTour = JSON.parse(jsonStr);
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
