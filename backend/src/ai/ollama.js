import process from "node:process";

export async function generateReply(messages, model = process.env.OLLAMA_MODEL || "qwen2.5:3b") {
  const baseUrl = process.env.OLLAMA_HOST || "http://127.0.0.1:11434";

  if (!model) {
    throw new Error("OLLAMA_MODEL is not configured.");
  }

  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      stream: false,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Ollama request failed: ${response.status} ${body}`);
  }

  const data = await response.json();
  return data.message?.content || "";
}
