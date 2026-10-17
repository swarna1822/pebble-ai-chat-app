import { PROVIDERS } from "./providers";
import type { ApiMessage, Settings } from "./types";

export const FAKE_REPLIES: string[] = [
  "Here’s a simple way to think about it: start small, then add one feature at a time.\n\n- **Message list** for the conversation\n- **Input box** with Enter to send\n- **Streaming** so replies appear as they’re written\n\nLearn more at [MDN](https://developer.mozilla.org).",
  "Here’s a tiny example of streaming text in TypeScript:\n\n```typescript\nasync function read(stream: ReadableStream<Uint8Array>) {\n  const reader = stream.getReader();\n  for (;;) {\n    const { done, value } = await reader.read();\n    if (done) break;\n    console.log(value);\n  }\n}\n```\n\nUse `getReader()` to pull chunks as they arrive.",
  "Keep mobile layouts simple:\n\n1. One column\n2. A sticky input at the bottom\n3. Generous spacing between messages\n\nThat keeps long answers easy to scan."
];

interface StreamOptions {
  onToken: (token: string) => void;
  signal: AbortSignal;
}

export async function fakeStream(
  reply: string,
  { onToken, signal, failAfter = Infinity }: StreamOptions & { failAfter?: number }
): Promise<void> {
  const sleep = (ms: number) =>
    new Promise<void>((resolve, reject) => {
      const t = setTimeout(resolve, ms);
      signal.addEventListener(
        "abort",
        () => {
          clearTimeout(t);
          reject(new DOMException("Aborted", "AbortError"));
        },
        { once: true }
      );
    });

  await sleep(700);
  let n = 0;
  for (const token of reply.match(/\S+\s*/g) ?? []) {
    if (n++ >= failAfter) throw new Error("Simulated network failure. Regenerate to try again.");
    onToken(token);
    await sleep(25 + Math.random() * 45 + (/[.!?:]\s*$/.test(token) ? 180 : 0));
  }
}

export async function realStream(
  messages: ApiMessage[],
  settings: Settings,
  { onToken, signal }: StreamOptions
): Promise<void> {
  const provider = PROVIDERS[settings.provider];
  if (!settings.apiKey) throw new Error("Add your API key in Settings first.");

  let res: Response;
  try {
    res = await fetch(provider.url, {
      method: "POST",
      signal,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${settings.apiKey}` },
      body: JSON.stringify({ model: settings.model || provider.defaultModel, messages, stream: true })
    });
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") throw e;
    throw new Error(`Couldn’t reach ${provider.name}. Check your connection.`);
  }

  if (!res.ok) {
    let detail = "";
    try {
      const j = (await res.json()) as { error?: { message?: string } };
      detail = j.error?.message ? ` Details: ${j.error.message}` : "";
    } catch {
      /* no readable error body */
    }
    if (res.status === 401 || res.status === 403) throw new Error(`The provider rejected your API key. Check it in Settings or .env.local.${detail}`);
    if (res.status === 429) throw new Error(`Free-tier limit reached. Wait a minute and regenerate.${detail}`);
    if (res.status === 400 || res.status === 404) throw new Error(`The provider doesn’t accept this request, often because the model name is out of date. Change it in Settings.${detail}`);
    throw new Error(`The provider returned an error (${res.status}).${detail}`);
  }
  if (!res.body) throw new Error("The provider sent an empty response.");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith("data:") || line.includes("[DONE]")) continue;
      try {
        const json = JSON.parse(line.slice(5)) as { choices?: { delta?: { content?: string } }[] };
        const token = json.choices?.[0]?.delta?.content;
        if (token) onToken(token);
      } catch {
        /* ignore partial or keep-alive lines */
      }
    }
  }
}
