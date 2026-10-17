import { useEffect, useRef, useState } from "react";
import { FAKE_REPLIES, fakeStream, realStream } from "./stream";
import { load, save } from "./storage";
import type { ApiMessage, Chat, Message, Settings } from "./types";

const uid = () => Math.random().toString(36).slice(2, 9);

function loadChats(): Chat[] {
  return load<Chat[]>("ck.chats", []).map((c) => ({
    ...c,
    messages: c.messages.map((m) => (m.status === "streaming" ? { ...m, status: "stopped" as const } : m))
  }));
}

export function useChats(settings: Settings) {
  const [chats, setChats] = useState<Chat[]>(loadChats);
  const [activeId, setActiveId] = useState<string | null>(() => loadChats()[0]?.id ?? null);
  const [busy, setBusy] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const turn = useRef(0);

  const active = chats.find((c) => c.id === activeId) ?? null;
  const messages = active?.messages ?? [];

  useEffect(() => save("ck.chats", chats), [chats]);
  useEffect(() => () => abortRef.current?.abort(), []);

  const patchChat = (id: string, fn: (c: Chat) => Chat) =>
    setChats((cs) => cs.map((c) => (c.id === id ? fn(c) : c)));

  const stop = () => abortRef.current?.abort();

  async function run(chatId: string, history: Message[], retrying: boolean) {
    const aiId = uid();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    patchChat(chatId, (c) => ({
      ...c,
      messages: [...history, { id: aiId, role: "ai", text: "", status: "streaming" }]
    }));
    setBusy(true);

    const patch = (p: Partial<Message>) =>
      patchChat(chatId, (c) => ({ ...c, messages: c.messages.map((m) => (m.id === aiId ? { ...m, ...p } : m)) }));

    let acc = "";
    const onToken = (t: string) => {
      acc += t;
      patch({ text: acc });
    };

    try {
      if (settings.provider === "mock") {
        const last = history[history.length - 1].text;
        await fakeStream(FAKE_REPLIES[turn.current++ % FAKE_REPLIES.length], {
          signal: ctrl.signal,
          onToken,
          failAfter: !retrying && /error|fail/i.test(last) ? 12 : Infinity
        });
      } else {
        const api: ApiMessage[] = history
          .filter((m, i) => {
            if (!m.text) return false;
            const next = history[i + 1];
            const failed = next && next.role === "ai" && !next.text && next.status !== "streaming";
            return !(m.role === "user" && failed);
          })
          .map((m) => ({ role: m.role === "ai" ? "assistant" : "user", content: m.text }));
        await realStream(api, settings, { signal: ctrl.signal, onToken });
      }
      patch({ status: "done" });
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") patch({ status: "stopped" });
      else patch({ status: "error", error: e instanceof Error ? e.message : "Something went wrong." });
    } finally {
      if (abortRef.current === ctrl) {
        abortRef.current = null;
        setBusy(false);
      }
    }
  }

  function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    let id = activeId;
    if (!active) {
      id = uid();
      const created: Chat = { id, title: q.slice(0, 40), messages: [] };
      setChats((cs) => [created, ...cs]);
      setActiveId(id);
    }
    run(id!, [...messages, { id: uid(), role: "user", text: q }], false);
  }

  function regenerate() {
    if (busy || !activeId) return;
    let u = messages.length - 1;
    while (u >= 0 && messages[u].role !== "user") u--;
    if (u >= 0) run(activeId, messages.slice(0, u + 1), true);
  }

  const newChat = () => {
    stop();
    setActiveId(null);
  };
  const select = (id: string) => {
    stop();
    setActiveId(id);
  };
  const remove = (id: string) => {
    if (id === activeId) {
      stop();
      setActiveId(null);
    }
    setChats((cs) => cs.filter((c) => c.id !== id));
  };

  return { chats, activeId, messages, busy, send, regenerate, stop, newChat, select, remove };
}
