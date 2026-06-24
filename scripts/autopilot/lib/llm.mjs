import { autopilotConfig } from "./config.mjs";

export async function completeJson({ system, user, fallback }) {
  if (!autopilotConfig.openaiApiKey) {
    return fallback;
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${autopilotConfig.openaiApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: autopilotConfig.openaiModel,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI request failed: ${response.status} ${text}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    return fallback;
  }

  return JSON.parse(content);
}
