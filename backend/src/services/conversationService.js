import { generateReply } from "../ai/ollama.js";

export const SYSTEM_PROMPT = `You are Maaz's personal AI phone receptionist.

You are NOT Maaz.

You are an automated assistant answering calls on Maaz's behalf.

Your job is to collect useful information from callers.

Speak naturally in Hinglish unless the caller clearly prefers English.

Be concise and conversational.

Never claim to be Maaz.

Never invent information about Maaz.

When appropriate, collect:
- caller name
- reason for calling
- important details
- urgency
- whether a callback is requested

Example opening:
'Hi, Maaz abhi call nahi le paa rahe hain. Aap bataiye, kya hua? Main unko message de dunga.'

Do not repeatedly ask for information that the caller has already provided.

Do not behave like a generic chatbot.`;

// In-memory store for active sessions
const sessions = new Map();

/**
 * Get or initialize a session
 */
function getOrCreateSession(sessionId) {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, {
      id: sessionId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
      ],
    });
  }
  return sessions.get(sessionId);
}

/**
 * Handle incoming user message for a session and get AI response
 */
export async function handleChatMessage(sessionId, message) {
  if (!sessionId || typeof sessionId !== "string" || !sessionId.trim()) {
    const error = new Error("Invalid or missing sessionId. Must be a non-empty string.");
    error.status = 400;
    throw error;
  }

  if (!message || typeof message !== "string" || !message.trim()) {
    const error = new Error("Invalid or missing message. Must be a non-empty string.");
    error.status = 400;
    throw error;
  }

  const cleanSessionId = sessionId.trim();
  const cleanMessage = message.trim();

  const session = getOrCreateSession(cleanSessionId);

  // Append user message
  const userEntry = {
    role: "user",
    content: cleanMessage,
    timestamp: new Date().toISOString(),
  };
  session.messages.push(userEntry);

  try {
    // Pass entire chat history (system + past user/assistant turns) to Ollama
    const messagesForOllama = session.messages.map(({ role, content }) => ({ role, content }));
    const reply = await generateReply(messagesForOllama);

    // Append assistant reply
    const assistantEntry = {
      role: "assistant",
      content: reply,
      timestamp: new Date().toISOString(),
    };
    session.messages.push(assistantEntry);
    session.updatedAt = new Date().toISOString();

    // Return conversational turns (excluding internal system prompt)
    const publicConversation = session.messages
      .filter((m) => m.role !== "system")
      .map(({ role, content, timestamp }) => ({ role, content, timestamp }));

    return {
      sessionId: cleanSessionId,
      reply,
      conversation: publicConversation,
    };
  } catch (err) {
    // If generation fails, remove the un-replied user message so retry works cleanly
    session.messages.pop();
    throw err;
  }
}

/**
 * Get session conversation
 */
export function getSessionConversation(sessionId) {
  if (!sessionId || !sessions.has(sessionId)) {
    return [];
  }
  const session = sessions.get(sessionId);
  return session.messages
    .filter((m) => m.role !== "system")
    .map(({ role, content, timestamp }) => ({ role, content, timestamp }));
}

/**
 * Clear a session conversation
 */
export function clearSession(sessionId) {
  if (sessionId && sessions.has(sessionId)) {
    sessions.delete(sessionId);
    return true;
  }
  return false;
}
