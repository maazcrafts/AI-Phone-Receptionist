import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

const DEFAULT_SESSION_ID = "test-session";

function App() {
  const [sessionId] = useState(DEFAULT_SESSION_ID);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState("checking"); // checking | connected | error
  const [ollamaStatus, setOllamaStatus] = useState("unknown");
  const [errorMessage, setErrorMessage] = useState("");
  const chatBottomRef = useRef(null);
  const inputRef = useRef(null);

  // Check backend & Ollama status on mount and periodically
  const checkHealth = async () => {
    try {
      const res = await fetch("/api/health");
      if (res.ok) {
        const data = await res.json();
        setBackendStatus("connected");
        setOllamaStatus(data.ollama?.connected ? "online" : "offline");
        return true;
      }
    } catch {
      // If vite proxy fails or direct port 5000 is needed
      try {
        const directRes = await fetch("http://localhost:5000/api/health");
        if (directRes.ok) {
          const data = await directRes.json();
          setBackendStatus("connected");
          setOllamaStatus(data.ollama?.connected ? "online" : "offline");
          return true;
        }
      } catch {
        // failed both
      }
    }
    setBackendStatus("error");
    setOllamaStatus("offline");
    return false;
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  // Fetch existing session messages on load if any
  useEffect(() => {
    const loadSession = async () => {
      try {
        const res = await fetch(`/api/chat/${sessionId}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.conversation) && data.conversation.length > 0) {
            setMessages(data.conversation);
          }
        }
      } catch (err) {
        console.debug("No previous conversation found or backend unreachable:", err);
      }
    };
    loadSession();
  }, [sessionId]);

  // Auto-scroll when messages update
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (messageText) => {
    const textToSend = (messageText || inputMessage).trim();
    if (!textToSend || loading) return;

    setErrorMessage("");
    const userMsg = {
      role: "user",
      content: textToSend,
      timestamp: new Date().toISOString(),
    };

    // Optimistic UI update
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setLoading(true);

    try {
      let res;
      try {
        res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            message: textToSend,
          }),
        });
      } catch {
        // Fallback directly to port 5000 if proxy failed
        res = await fetch("http://localhost:5000/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            message: textToSend,
          }),
        });
      }

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${res.status}: Failed to get reply from AI receptionist.`);
      }

      const data = await res.json();
      if (Array.isArray(data.conversation)) {
        setMessages(data.conversation);
      } else if (data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.reply,
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    } catch (err) {
      console.error("Chat error:", err);
      setErrorMessage(err.message || "Failed to reach AI receptionist.");
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleClear = async () => {
    if (loading) return;
    setErrorMessage("");
    try {
      await fetch("/api/chat/clear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      }).catch(() => {});
    } catch (err) {
      console.debug("Backend clear error:", err);
    }
    setMessages([]);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const quickPrompts = [
    "Maaz se baat karni thi",
    "Urgent kaam hai, kya Maaz available hai?",
    "Hello, this is Dr. Verma calling regarding the project files.",
    "Main kal 4 baje call karu ya unhe message denge aap?",
  ];

  const formatTime = (isoString) => {
    if (!isoString) return "";
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    } catch {
      return "";
    }
  };

  return (
    <div className="console-app">
      {/* Header */}
      <header className="console-header">
        <div className="header-left">
          <h1 className="brand-title">
            AI Phone Receptionist
            <span className="badge-tag">PHASE 1A</span>
          </h1>
          <span className="badge-local-ai">
            <span
              className={`status-dot ${
                ollamaStatus === "online" ? "" : ollamaStatus === "offline" ? "offline" : "checking"
              }`}
            />
            Local AI • Ollama
          </span>
        </div>

        <div className="header-right">
          <div className="status-indicator">
            <span
              className={`status-dot ${
                backendStatus === "connected"
                  ? ""
                  : backendStatus === "error"
                  ? "offline"
                  : "checking"
              }`}
            />
            <span>
              {backendStatus === "connected"
                ? "Backend Connected"
                : backendStatus === "error"
                ? "Backend Offline"
                : "Checking..."}
            </span>
          </div>

          <button
            type="button"
            className="btn btn-danger"
            onClick={handleClear}
            disabled={messages.length === 0 && !loading}
            title="Reset conversation state"
          >
            Clear conversation
          </button>
        </div>
      </header>

      {/* Meta Bar */}
      <div className="meta-bar">
        <div className="meta-info">
          <span className="meta-item">
            Session: <strong className="session-badge">{sessionId}</strong>
          </span>
          <span className="meta-item">
            Model: <strong>qwen2.5:3b</strong>
          </span>
          <span className="meta-item">
            Target: <strong>Local CPU (₹0 API cost)</strong>
          </span>
        </div>
        <div className="meta-info">
          <span>Hinglish & English Caller Testing Console</span>
        </div>
      </div>

      {/* Error message */}
      {errorMessage && (
        <div className="error-banner">
          <span>⚠️ {errorMessage}</span>
          <button type="button" onClick={() => setErrorMessage("")}>
            ✕
          </button>
        </div>
      )}

      {/* Conversation Viewport */}
      <main className="conversation-viewport">
        {messages.length === 0 ? (
          <div className="empty-state">
            <h3>Testing Console Ready</h3>
            <p>
              Type a caller simulation message below to test the AI Receptionist's natural Hinglish
              handling, unavailable explanation, and information collection.
            </p>
            <div className="prompt-suggestions">
              <span className="prompt-label">Quick Test Prompts</span>
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="prompt-chip"
                  onClick={() => handleSend(prompt)}
                  disabled={loading}
                >
                  💬 {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isUser = msg.role === "user";
            return (
              <div key={index} className={`message-row ${isUser ? "user" : "assistant"}`}>
                <div className="message-meta">
                  <span className={`role-tag ${isUser ? "caller" : "receptionist"}`}>
                    {isUser ? "Caller" : "AI Receptionist"}
                  </span>
                  <span>{formatTime(msg.timestamp)}</span>
                </div>
                <div className="message-bubble">{msg.content}</div>
              </div>
            );
          })
        )}

        {loading && (
          <div className="thinking-indicator">
            <span className="pulse-spinner" />
            <span>AI Receptionist is generating response with Ollama...</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </main>

      {/* Input Area */}
      <footer className="console-input-area">
        <form
          className="input-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <input
            ref={inputRef}
            type="text"
            className="console-input"
            placeholder="Type caller message (e.g. 'Maaz se baat karni thi')... [Enter to send]"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={loading}
            autoFocus
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!inputMessage.trim() || loading}
          >
            {loading ? "Generating..." : "Send"}
          </button>
        </form>
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
