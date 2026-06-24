import { autopilotConfig } from "./config.mjs";

export async function fetchSource(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "ToolHive-Autopilot/1.0 (+https://toolhive.in)",
        Accept: "text/html,application/rss+xml,application/xml,text/plain",
      },
    });

    const text = await response.text();
    return {
      url,
      ok: response.ok,
      status: response.status,
      title: extractTitle(text) || url,
      text: cleanText(text).slice(0, autopilotConfig.maxFetchedChars),
    };
  } catch (error) {
    return { url, ok: false, status: 0, title: url, text: "", error: String(error) };
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchSources(urls) {
  return Promise.all(urls.map(fetchSource));
}

export function cleanText(input) {
  return input
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTitle(input) {
  const match = input.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? cleanText(match[1]) : "";
}
