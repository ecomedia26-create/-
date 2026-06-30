import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post("/api/generate-story", async (req, res) => {
    try {
      const { storyType, ageGroup, heroName, additionalDetails, features } = req.body;

      const useThinking = features?.useThinking || false;
      const useSearch = features?.useSearch || false;
      const imageSize = features?.imageSize || "none";

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

      const textModel = useThinking ? "gemini-3.1-pro-preview" : (useSearch ? "gemini-3.5-flash" : "gemini-3.5-flash");
      const config: any = {};
      
      if (useThinking) {
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
      }
      
      if (useSearch) {
        config.tools = [{ googleSearch: {} }];
      }

      // 1. Generate Story
      const textResponse = await ai.models.generateContent({
        model: textModel,
        contents: prompt,
        config
      });
      
      const storyText = textResponse.text;
      
      // 2. Generate Image (if requested)
      let imageUrl = null;
      if (imageSize !== "none") {
        try {
          const imagePrompt = `A beautiful, magical children's book illustration for a story about: ${storyType}. ${heroName ? `The main character is named ${heroName}.` : ''} ${additionalDetails}. Vibrant colors, watercolor and digital art style, magical atmosphere, kids book illustration.`;
          
          const imgResponse = await ai.models.generateContent({
            model: "gemini-3-pro-image-preview",
            contents: imagePrompt,
            config: {
              imageConfig: {
                aspectRatio: "16:9",
                imageSize: imageSize // "1K", "2K", "4K"
              }
            }
          });
          
          for (const part of imgResponse.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
              imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
              break;
            }
          }
        } catch (imgErr) {
          console.error("Error generating image:", imgErr);
        }
      }

      res.json({ story: storyText, imageUrl });
    } catch (error) {
      console.error("Error generating story:", error);
      res.status(500).json({ error: "Failed to generate story." });
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
