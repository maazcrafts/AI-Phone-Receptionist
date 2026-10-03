CREATE TABLE IF NOT EXISTS calls (
  id UUID PRIMARY KEY,
  caller_number TEXT,
  caller_name TEXT,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  status TEXT,
  urgency TEXT,
  callback_requested BOOLEAN,
  summary TEXT,
  recording_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS call_messages (
  id UUID PRIMARY KEY,
  call_id UUID NOT NULL REFERENCES calls(id) ON DELETE CASCADE,
  speaker TEXT NOT NULL CHECK (speaker IN ('caller', 'assistant', 'system')),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_calls_created_at
  ON calls(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_call_messages_call_id
  ON call_messages(call_id);
