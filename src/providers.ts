import type { ProviderId } from "./types";

interface ProviderInfo {
  name: string;
  url: string;
  defaultModel: string;
}

// All three real providers expose an OpenAI-compatible chat endpoint.
// Model names change often: edit them here or in the Settings dialog.
export const PROVIDERS: Record<ProviderId, ProviderInfo> = {
  mock: { name: "Demo (fake replies)", url: "", defaultModel: "" },
  gemini: {
    name: "Google Gemini",
    url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    defaultModel: "gemini-flash-latest"
  },
  groq: {
    name: "Groq",
    url: "https://api.groq.com/openai/v1/chat/completions",
    defaultModel: "llama-3.3-70b-versatile"
  },
  openrouter: {
    name: "OpenRouter",
    url: "https://openrouter.ai/api/v1/chat/completions",
    defaultModel: "openrouter/free"
  }
};
