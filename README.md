# ☎️ AI Phone Receptionist

> **A local-first, privacy-first AI receptionist that answers the calls you can't.**

An experimental personal AI phone receptionist designed to run **locally on your own machine** instead of sending conversations to paid AI APIs.

The long-term goal is simple:

**Your phone rings → you don't answer → AI takes over → AI talks to the caller in Hinglish → collects the important details → summarizes the call → stores the history → you get the message.**

---

<div align="center">

### 🧠 LOCAL AI • 🎙️ VOICE • ☎️ TELEPHONY • 🔒 PRIVACY

**Built around the idea of ₹0 recurring AI/API cost**

</div>

---

## ⚡ What is this?

Imagine someone calls you while you're in class, at the gym, sleeping, or simply unable to pick up.

Instead of:

> 📞 *Ring... Ring... Ring...*  
> ❌ *Call missed*

The target experience is:

> 📞 **Incoming call**  
> ↓  
> ⏳ **No answer**  
> ↓  
> 🤖 **AI Receptionist answers**  
> ↓  
> 🗣️ **"Hi, Maaz abhi call nahi le paa rahe hain. Aap bataiye, kya hua?"**  
> ↓  
> 🧾 **Collects name + reason + details + urgency**  
> ↓  
> 🧠 **Generates a structured summary**  
> ↓  
> 📲 **Notifies Maaz**

The project is being built in stages so the **AI brain stays independent from the phone/telephony layer**.

---

# 🏗️ Architecture

The system is intentionally split into layers:

```
                         ☎️ PHONE / GSM
                              │
                              ▼
                     ┌─────────────────┐
                     │  TELEPHONY      │
                     │     BRIDGE      │
                     └────────┬────────┘
                              │
                              ▼
                     🎙️ AUDIO STREAM
                              │
                              ▼
                     ┌─────────────────┐
                     │  faster-whisper │
                     │      STT        │
                     └────────┬────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │  CONVERSATION   │
                     │     ENGINE      │
                     └────────┬────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │     Ollama      │
                     │   Qwen 2.5 3B  │
                     └────────┬────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │      Piper      │
                     │      TTS        │
                     └────────┬────────┘
                              │
                              ▼
                         🔊 AUDIO OUT
```

### The important part

The **AI receptionist does not depend on a specific phone provider**.

The intended architecture is:

```
PHONE LAYER
     ↓
VOICE LAYER
     ↓
AI RECEPTIONIST
     ↓
CALL INTELLIGENCE
     ↓
STORAGE / NOTIFICATION
```

That means the telephony layer can change without rewriting the receptionist's brain.

---

# 🧩 Tech Stack

| Layer | Technology |
|---|---|
| 🖥️ Frontend | React 19 + Vite |
| ⚙️ Backend | Node.js + Express |
| 🧠 Local LLM | Ollama |
| 🤖 Current model | Qwen 2.5 3B |
| 🎙️ Speech-to-Text | faster-whisper |
| 🔊 Text-to-Speech | Piper |
| 🗄️ Database | PostgreSQL |
| 🔌 Real-time layer | Socket.IO |
| ☎️ Telephony | Experimental / provider-agnostic |
| 🐧 Development | Linux / Ubuntu |
| 💰 AI API cost | **₹0 target** |

---

# 🚦 Development Status

### Phase 1A — Local AI Conversation

**Status: ✅ Working**

Current pipeline:

```
React
  ↓
Node.js / Express
  ↓
Ollama
  ↓
Qwen 2.5 3B
  ↓
Response
  ↓
React
```

The current prototype can:

- 💬 Maintain a conversation session
- 🧠 Send conversation context to the local LLM
- 🤖 Generate receptionist responses
- 🧹 Clear a conversation
- ❤️ Check backend/AI health
- 🖥️ Provide a browser-based testing console
- 🔒 Keep the LLM local

---

### Phase 1B — Local Voice

**Status: 🚧 Next**

Target pipeline:

```
🎙️ Microphone
      ↓
faster-whisper
      ↓
🧠 Ollama / Qwen
      ↓
Piper
      ↓
🔊 Speaker
```

No phone network involved yet.

This phase proves that the receptionist can actually **listen → think → speak**.

---

### Phase 2 — Call Intelligence

Planned:

- 👤 Caller name extraction
- 📞 Caller number metadata
- 📝 Reason for calling
- 🚨 Urgency detection
- 🔁 Callback preference
- 🧾 Structured summaries
- 💬 Transcript storage
- 🗂️ Call history
- 🔔 Notifications

Example:

```text
CALL SUMMARY
────────────────────────────

Caller: Rahul
Reason: Project discussion
Urgency: High

Details:
Needs to discuss the project review
before tomorrow's meeting.

Callback:
Requested

Transcript:
Stored locally
```

---

### Phase 3 — Real Phone Calls

**Status: 🔬 Research / Experimental**

The final challenge is connecting a real cellular call to the local AI.

Target:

```
📱 Incoming cellular call
        ↓
⏳ No-answer forwarding
        ↓
☎️ GSM / SIP bridge
        ↓
🎙️ AI voice pipeline
        ↓
🤖 Receptionist
        ↓
🗣️ Caller
```

This part is intentionally being developed separately because a normal Android application cannot simply access and inject arbitrary cellular call audio.

The project therefore keeps the AI core **telephony-agnostic**.

---

# 💡 Example Conversation

### Caller

> Maaz se baat karni thi.

### AI Receptionist

> Hi, Maaz abhi call nahi le paa rahe hain. Aap bataiye, kya hua? Main unko message de dunga.

### Caller

> Mera naam Rahul hai. Project review ke liye call kiya tha.

### AI

> Okay Rahul. Project review ke baare mein kya discuss karna tha?

### Caller

> Kal submission hai, ek important issue aa raha hai.

### AI

> Samajh gaya. Main Maaz ko bata dunga ki project submission se pehle ek important issue discuss karna hai. Kya aap chahte hain ki woh aapko callback karein?

---

# 🔐 Privacy by Design

This project is designed around **local processing**.

The intended AI pipeline does not require sending the conversation to a commercial AI API.

```
❌ Paid cloud LLM
❌ Mandatory external transcription API
❌ Mandatory external TTS API
❌ Cloud-first architecture

             VS

✅ Ollama
✅ Local LLM
✅ faster-whisper
✅ Local TTS
✅ Local database
✅ Local development
```

### Never commit

```
.env
backend/.env
API keys
private phone numbers
call recordings
private transcripts
personal caller information
local model files
```

---

# 📁 Project Structure

```
AI-Phone-Receptionist/
│
├── backend/
│   ├── src/
│   │   ├── ai/
│   │   │   └── ollama.js
│   │   ├── services/
│   │   │   └── conversationService.js
│   │   └── server.js
│   │
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   └── package.json
│
├── database/
│   └── schema.sql
│
├── docs/
│   └── architecture.md
│
├── .env.example
├── .gitignore
└── README.md
```

---

# 🚀 Run Locally

## 1. Clone

```bash
git clone https://github.com/maazcrafts/AI-Phone-Receptionist.git
cd AI-Phone-Receptionist
```

## 2. Install backend

```bash
cd backend
npm install
```

## 3. Install frontend

```bash
cd ../frontend
npm install
```

## 4. Install Ollama

Install Ollama on your machine, then pull the local model:

```bash
ollama pull qwen2.5:3b
```

Start Ollama if the system service is not already running:

```ollama list
```

You should see the model listed.

---

# ▶️ Start the Backend

From the project root:

```bash
cd backend
npm run dev
```

Backend:

```
http://localhost:5000
```

Health check:

```
GET /api/health
```

---

# ▶️ Start the Frontend

In another terminal:

```bash
cd frontend
npm run dev
```

Open:

```
http://127.0.0.1:5173
```

You now have the local AI receptionist testing console.

---

# 🧪 API

### Health

```http
GET /api/health
```

### Send message

```http
POST /api/chat
Content-Type: application/json

{
  "sessionId": "demo-session",
  "message": "Maaz se baat karni thi"
}
```

### Get conversation

```http
GET /api/chat/demo-session
```

### Clear conversation

```http
POST /api/chat/clear
Content-Type: application/json

{
  "sessionId": "demo-session"
}
```

---

# 🧠 Design Principles

### 01 — Local first

If something can run locally, prefer the local implementation.

### 02 — Provider agnostic

The AI receptionist should not be tightly coupled to one telephony provider.

### 03 — Privacy first

Caller conversations can contain sensitive information. Local processing is the default direction.

### 04 — Modular voice stack

STT, LLM and TTS should be replaceable independently.

### 05 — Build in layers

Don't start with the hardest part.

```
TEXT
 ↓
VOICE
 ↓
CALL INTELLIGENCE
 ↓
TELEPHONY
 ↓
NOTIFICATIONS
```

---

# 🗺️ Roadmap

```
[✅] Repository + architecture
        │
        ▼
[✅] Local Ollama integration
        │
        ▼
[✅] Browser conversation prototype
        │
        ▼
[🚧] Local speech recognition
        │
        ▼
[🚧] Local text-to-speech
        │
        ▼
[ ] Full voice conversation
        │
        ▼
[ ] Caller information extraction
        │
        ▼
[ ] Call summaries
        │
        ▼
[ ] Local call history
        │
        ▼
[ ] Notifications
        │
        ▼
[🔬] GSM / SIP bridge research
        │
        ▼
[ ] Real incoming phone call
        │
        ▼
[ ] No-answer AI receptionist
```

---

# 🧪 Current Development Philosophy

This isn't being built as:

> "Let's connect a phone API and call an AI API."

It's being built as:

> **"Let's build the receptionist first, then give it ears, a voice, and finally a phone line."**

That makes every layer independently testable.

---

# ⚠️ Important Note

The **real cellular-call integration is not implemented yet**.

The browser application is currently a development interface for testing the AI receptionist.

A real phone call requires a telephony/audio bridge capable of passing the cellular call audio into the local voice pipeline. A standard Android app cannot be assumed to provide unrestricted access to cellular call audio.

Therefore:

**Do not treat the current browser prototype as a finished phone receptionist.**

It is the AI core being built toward one.

---

# 📌 Project Goal

Build a personal AI receptionist that can eventually handle an unanswered call without depending on expensive cloud AI services.

```
        YOUR PHONE
            │
            ▼
       📞 CALL RINGS
            │
            ▼
       NO ANSWER
            │
            ▼
    ┌─────────────────┐
    │ AI RECEPTIONIST  │
    └────────┬────────┘
             │
      ┌──────┼──────┐
      ▼      ▼      ▼
     🎙️     🧠     🔊
     STT    LLM    TTS
      │      │      │
      └──────┼──────┘
             ▼
       🧾 SUMMARY
             │
             ▼
        📲 NOTIFY YOU
```

### **The phone should ring. The AI should answer only when you don't.**

---

## 📜 License

This project is currently a personal experimental project.

---

<div align="center">

**AI Phone Receptionist**  
*Local AI • Voice • Telephony • Privacy*

</div>
