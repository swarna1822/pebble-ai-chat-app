export type Role = "user" | "ai";
export type Status = "streaming" | "done" | "stopped" | "error";
export type ProviderId = "mock" | "gemini" | "groq" | "openrouter";
export type ThemeMode = "auto" | "light" | "dark";

export interface Message {
  id: string;
  role: Role;
  text: string;
  status?: Status;
  error?: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
}

export interface Settings {
  provider: ProviderId;
  apiKey: string;
  model: string;
  theme: ThemeMode;
}

export interface ApiMessage {
  role: "user" | "assistant";
  content: string;
}

const envKey = (import.meta.env.VITE_GEMENI_API_KEY as string | undefined) ?? "";

export const DEFAULT_SETTINGS: Settings = {
  provider: envKey ? "gemini" : "mock",
  apiKey: envKey,
  model: "",
  theme: "auto"
};
