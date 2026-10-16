import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Initialize Gemini AI client
  const getAiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // AI Business Assistant API endpoint
  app.post("/api/ai-assistant", async (req, res) => {
    try {
      const { prompt, history, contextData } = req.body;

      const ai = getAiClient();
      if (!ai) {
        return res.json({
          reply: `Welcome Esther! I am ready to assist you as Decent Collection's AI Manager.

*(Note: Live Gemini API Key is pending in workspace configuration, but I can directly analyze your live data locally and navigate dashboard tabs or generate Word & Excel reports for you!)*`
        });
      }

      const systemInstruction = `You are the dedicated AI Business Assistant for Super Administrator Esther Njoki Mbugua, Managing Director of Decent Collection (Men's Luxury Fashion & Footwear Enterprise in Kenya).
You have direct, real-time access to live business context (products, orders, customers, financial costs, gross revenue, net profit, low stock alerts, branches, M-Pesa payments).

Guidelines:
1. Respond warmly and professionally to Esther Njoki Mbugua. Address her as "Esther" or "Mrs. Mbugua".
2. Use exact calculations, percentages, and figures provided in the Context Data.
3. Keep responses structured, concise, and easy to read using clear bullet points.
4. Provide strategic advice on reordering low stock items, maximizing profit margins, and marketing high-converting items.
5. If Esther asks you to generate a report or open a section, inform her and embed one or more action tags at the end of your response text:
   - [ACTION:OPEN_TAB:costing]
   - [ACTION:OPEN_TAB:products]
   - [ACTION:OPEN_TAB:orders]
   - [ACTION:OPEN_TAB:inventory]
   - [ACTION:OPEN_TAB:reports]
   - [ACTION:OPEN_TAB:branches]
   - [ACTION:OPEN_TAB:settings]
   - [ACTION:GENERATE_EXCEL]
   - [ACTION:GENERATE_WORD]

Context Data:
${JSON.stringify(contextData, null, 2)}
`;

      const contents = [];
      if (history && Array.isArray(history)) {
        for (const msg of history) {
          if (msg.text) {
            contents.push({
              role: msg.role === "user" ? "user" : "model",
              parts: [{ text: msg.text }],
            });
          }
        }
      }

      contents.push({
        role: "user",
        parts: [{ text: prompt }],
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || "I have analyzed your business records and am ready to assist.";
      res.json({ reply: replyText });
    } catch (err: any) {
      console.error("AI Assistant Endpoint Error:", err);
      res.status(500).json({ error: err?.message || "Error processing AI request." });
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
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
