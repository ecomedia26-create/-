import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Modality } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post("/api/generate-story", async (req, res) => {
    try {
      const { storyType, ageGroup, heroName, additionalDetails } = req.body;


      const prompt = `
אתה סופר ילדים מוכשר ומקסים. עליך לכתוב סיפור לילדים בעברית לפי ההנחיות הבאות:
סוג הסיפור: ${storyType}
גיל הילד/ה: ${ageGroup}
${heroName ? `שם הגיבור/ה: ${heroName}` : ""}
${additionalDetails ? `פרטים נוספים שיש לשלב בסיפור: ${additionalDetails}` : ""}

הנחיות כתיבה:
1. שפה: עברית תקינה, עשירה אך מותאמת לגיל הילד/ה.
2. אורך: סיפור קצר וקולע (כ-300 עד 500 מילים), מחולק לפסקאות קצרות.
3. טון: קסום, מעצים, מרגיע (במיוחד אם זה סיפור לפני השינה), מלא דמיון.
4. פורמט: החזר את הסיפור בפורמט Markdown. השתמש בכותרת (<h1> או #), והדגש (Bold) מילות מפתח קסומות או חשובות בסיפור. ניתן להוסיף אימוג'ים מתאימים כדי להפוך את הסיפור לחי יותר!

הקפד לא להוסיף הערות מקדימות, פשוט החזר את הסיפור עצמו.
`;

      // 1. Generate Story
      const textResponse = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt
      });
      
      const storyText = textResponse.text;

      res.json({ story: storyText, imageUrl: null });
    } catch (error) {
      console.error("Error generating story:", error);
      res.status(500).json({ error: "Failed to generate story." });
    }
  });

  app.post("/api/tts", async (req, res) => {
    try {
      const { text, voice } = req.body;
      
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-tts-preview",
        contents: [{ parts: [{ text: text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voice || "Kore" },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) {
        throw new Error("No audio data returned from Gemini TTS model");
      }

      res.json({ audio: base64Audio });
    } catch (error) {
      console.error("Error generating speech:", error);
      res.status(500).json({ error: "Failed to generate speech." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
