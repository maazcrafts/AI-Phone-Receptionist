# Architecture

## Phase 1 — Local voice prototype

```
Microphone
  ↓
faster-whisper
  ↓
Conversation manager
  ↓
Ollama
  ↓
Piper
  ↓
Speaker
```

## Phase 2 — Call intelligence

Add:

- structured caller information
- urgency detection
- callback preference
- summaries
- transcript storage

## Phase 3 — Telephony bridge

Investigate a cost-free or minimal-cost path from the Indian cellular network to the local application.

The AI application should remain provider-agnostic so the voice layer can be swapped later.
