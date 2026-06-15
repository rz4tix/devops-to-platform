import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK lazily for safety
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required. Configure this key in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Host health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// AI Mentor chat endpoint
app.post("/api/mentor/chat", async (req, res) => {
  try {
    const { prompt, currentContext, history } = req.body;
    const ai = getGeminiClient();

    const systemInstruction = 
      "You are a friendly, deeply experienced Senior Site Reliability Engineer (SRE), Platform Engineer, and technical career coach named 'SRE Mentor'.\n" +
      "Your goal is to guide the user through their 5-month learning roadmap. Give practical, production-grounded advice, write high-quality CLI commands, write clean Kubernetes YAML resources or custom scripts, and help debug systems.\n" +
      "Keep responses highly structured, easy to read with markdown, and direct. Focus on industry workflows (like RED/USE methods, debugging with strace/nsenter, and GitOps pipelines).\n" +
      "If the user asks you to explain, generate, or simulate something, always relate it back to their current position in their 5-Month Roadmap.";

    // Format previous history for Gemini
    const contents: any[] = [];
    if (history && Array.isArray(history)) {
      history.forEach((h: { role: string; content: string }) => {
        contents.push({
          role: h.role === "assistant" ? "model" : "user",
          parts: [{ text: h.content }]
        });
      });
    }

    // Add current prompt
    contents.push({
      role: "user",
      parts: [{ text: `Current Roadmap Context: ${JSON.stringify(currentContext || {})}\n\nUser Question: ${prompt}` }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "An unexpected error occurred in SRE Mentor." });
  }
});

// Generate a random active-recall quiz based on SRE topics
app.post("/api/mentor/quiz", async (req, res) => {
  try {
    const { weekNum, theme } = req.body;
    const ai = getGeminiClient();

    const prompt = `Generate exactly 3 diverse, high-quality, practical active-recall quiz questions for an SRE student.
Theme of the week: "${theme || 'SRE Fundamentals'}" (Week ${weekNum || 1}).
Ensure questions focus on diagnostic reasoning, scenario triage, SRE math, or Linux kernel interfaces relative to this theme.
Output the questions and their correct detailed explanations in JSON matches the responseSchema exactly.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT" as any,
          properties: {
            questions: {
              type: "ARRAY" as any,
              items: {
                type: "OBJECT" as any,
                properties: {
                  id: { type: "NUMBER" as any },
                  question: { type: "STRING" as any, description: "The scenario or testing question." },
                  correctModelAnswer: { type: "STRING" as any, description: "Detailed SRE answer explanation." }
                },
                required: ["id", "question", "correctModelAnswer"]
              }
            }
          },
          required: ["questions"]
        }
      }
    });

    const textResult = response.text || "{}";
    res.json(JSON.parse(textResult));
  } catch (error: any) {
    console.error("Gemini Quiz Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate custom SRE quiz." });
  }
});

// Grade student answers
app.post("/api/mentor/grade", async (req, res) => {
  try {
    const { question, studentAnswer, correctModelAnswer } = req.body;
    const ai = getGeminiClient();

    const prompt = `Grade this SRE student response relative to the correct model answers.
Question: "${question}"
Correct Model Answer: "${correctModelAnswer}"
Student Answer: "${studentAnswer}"

Provide a constructive grading assessment:
1. Score from 0 to 100%.
2. Bulleted key technical points they answered correctly.
3. Critical gaps or concepts they missed.
4. An optimization tip (e.g. 'To make this production-ready, also consider configuring X...').
Output the results in JSON format matching the schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT" as any,
          properties: {
            score: { type: "INTEGER" as any },
            correctPoints: { type: "ARRAY" as any, items: { type: "STRING" as any } },
            missingGaps: { type: "ARRAY" as any, items: { type: "STRING" as any } },
            proTip: { type: "STRING" as any }
          },
          required: ["score", "correctPoints", "missingGaps", "proTip"]
        }
      }
    });

    const textResult = response.text || "{}";
    res.json(JSON.parse(textResult));
  } catch (error: any) {
    console.error("Gemini Grade Error:", error);
    res.status(500).json({ error: error.message || "Failed to evaluate SRE answer." });
  }
});

// Run simulated incident triage roleplay
app.post("/api/mentor/incident-simulate", async (req, res) => {
  try {
    const { scenarioType, currentStep, userResponse, history } = req.body;
    const ai = getGeminiClient();

    const systemInstruction = 
      "You are a Production SRE Incident Simulation Simulator.\n" +
      "You simulate high-severity outages (severity-1 notifications) over an interactive game-like round dialogue.\n" +
      "Types of scenarios: 'Database deadlock', 'OOM CPU saturation', 'Trace context propagation break', 'Canary roll-forward check failure'.\n" +
      "Keep calculations and outputs logical (e.g., CPU loads, latencies matching RED/USE signals).\n" +
      "Expose metrics, then ask the user what their immediate triage or diagnostic command is (e.g., running strace, evaluating PromQL, rolling back deploying versions).\n" +
      "Respond strictly as the simulation. Keep your response around 2 paragraphs, outlining current system readings, active error levels, and standard terminal feedback.";

    const contents: any[] = [];
    if (history && Array.isArray(history)) {
      history.forEach((h: { role: string; content: string }) => {
        contents.push({
          role: h.role === "assistant" ? "model" : "user",
          parts: [{ text: h.content }]
        });
      });
    }

    contents.push({
      role: "user",
      parts: [{ text: `Scenario Type: ${scenarioType}, Match Step: ${currentStep}. User mitigation: ${userResponse || 'Start scenario'}` }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.8,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Incident Error:", error);
    res.status(500).json({ error: error.message || "Failed to run SRE incident simulation." });
  }
});

// Vite middleware mounting and static file assets serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Loading development server with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving static production assets from dist...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SRE Portal Server running at http://localhost:${PORT}`);
  });
}

startServer();
