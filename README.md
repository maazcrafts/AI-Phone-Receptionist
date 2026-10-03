# AI Phone Receptionist

A local-first personal AI phone receptionist.

## Goal

When a call cannot be answered, the receptionist should:

1. Speak to the caller in natural Hinglish.
2. Explain that Maaz is currently unavailable.
3. Ask the caller's name and reason for calling.
4. Collect relevant details and callback preference.
5. Produce a structured call summary.
6. Store call history.
7. Eventually connect to real phone calls without relying on paid AI APIs.

## ₹0-first architecture

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Real-time:** WebSocket / Socket.IO
- **LLM:** Ollama (local)
- **Speech-to-text:** faster-whisper (local)
- **Text-to-speech:** Piper (local)
- **Database:** PostgreSQL
- **Deployment:** local development first

## Current phase

Phase 1 focuses on getting the local voice conversation working before integrating cellular telephony.

## Planned flow

```
Microphone
   ↓
Speech-to-text
   ↓
Local LLM
   ↓
Text-to-speech
   ↓
Speaker
```

## Security

Never commit:

- API keys
- .env files
- phone numbers
- call recordings
- private transcripts
- personal caller information

## Project status

🚧 Early development
