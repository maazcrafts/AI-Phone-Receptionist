import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import {
  handleChatMessage,
  getSessionConversation,
  clearSession,
} from "./services/conversationService.js";

const app = express();
const server = http.createServer(app);

const port = Number(process.env.PORT || 5000);

// Enable CORS for local Vite frontend and developer tooling
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

// Health & status check
app.get("/api/health", async (_req, res) => {
  const ollamaHost = process.env.OLLAMA_HOST || "http://127.0.0.1:11434";
  const ollamaModel = process.env.OLLAMA_MODEL || "qwen2.5:3b";
  let ollamaOk = false;

  try {
    const check = await fetch(`${ollamaHost}/api/tags`, { signal: AbortSignal.timeout(2000) });
    ollamaOk = check.ok;
  } catch {
    ollamaOk = false;
  }

  res.json({
    ok: true,
    service: "ai-phone-receptionist-backend",
    ollama: {
      connected: ollamaOk,
      host: ollamaHost,
      model: ollamaModel,
    },
  });
});

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  const { sessionId, message } = req.body || {};

  if (!sessionId || typeof sessionId !== "string" || !sessionId.trim()) {
    return res.status(400).json({
      ok: false,
      error: "Field 'sessionId' is required and must be a non-empty string.",
    });
  }

  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({
      ok: false,
      error: "Field 'message' is required and must be a non-empty string.",
    });
  }

  try {
    const result = await handleChatMessage(sessionId, message);
    return res.json(result);
  } catch (err) {
    console.error(`[Chat Error] sessionId=${sessionId}:`, err.message);
    const statusCode = err.status || (err.message.includes("Ollama") ? 502 : 500);
    return res.status(statusCode).json({
      ok: false,
      error: err.message || "Failed to process chat message with Ollama.",
    });
  }
});

// Get conversation history for a session
app.get("/api/chat/:sessionId", (req, res) => {
  const { sessionId } = req.params;
  const conversation = getSessionConversation(sessionId);
  res.json({
    sessionId,
    conversation,
  });
});

// Clear conversation for a session
app.post("/api/chat/clear", (req, res) => {
  const { sessionId } = req.body || {};
  if (!sessionId) {
    return res.status(400).json({ ok: false, error: "Field 'sessionId' is required." });
  }
  clearSession(sessionId);
  res.json({
    ok: true,
    sessionId,
    message: "Conversation cleared successfully.",
  });
});

app.delete("/api/chat/:sessionId", (req, res) => {
  const { sessionId } = req.params;
  clearSession(sessionId);
  res.json({
    ok: true,
    sessionId,
    message: "Conversation cleared successfully.",
  });
});

// Socket.io for real-time events (Phase 1 voice pipeline foundation)
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

server.listen(port, () => {
  console.log(`AI Phone Receptionist API running on http://localhost:${port}`);
});
