import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route for Gemini chat
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { messages } = req.body; // Expecting array of { role, parts }

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid messages format" });
      }

      const formattedContents = messages.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      const chat = ai.chats.create({
        model: "gemini-3.5-flash",
        config: {
          systemInstruction: "You are a helpful AI assistant for this website. You speak fluent English and Bangla. Keep your responses concise and helpful. You can use markdown and code blocks if needed.",
        }
      });

      // To handle conversation history correctly with the SDK, we can either pass history or just send the latest message.
      // The `ai.chats.create` doesn't directly take a `history` array in the same format for starting a chat easily with full history,
      // wait, `ai.chats.create({ model, history: formattedContents })` might exist.
      // But we can also just use `generateContent` with the full history as `contents`.
      
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction: "You are a helpful AI assistant for this website. You speak fluent English and Bangla. Keep your responses concise and helpful. You can use markdown and code blocks if needed.",
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate response" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const disableHmr = process.env.DISABLE_HMR === 'true';
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        ...(disableHmr ? {
          hmr: false,
          watch: null
        } : {})
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
