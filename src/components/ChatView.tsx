import { useEffect, useRef } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import MessageBubble from "./MessageBubble";
import type { Message } from "../types";

const STARTERS = [
  "Explain how streaming replies work",
  "Show me a code example",
  "Give me tips for a mobile layout",
  "Show me what a failed reply looks like"
];

interface Props {
  messages: Message[];
  busy: boolean;
  demo: boolean;
  providerName: string;
  onSend: (text: string) => void;
  onRegenerate: () => void;
}

export default function ChatView({ messages, busy, demo, providerName, onSend, onRegenerate }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  return (
    <Box ref={ref} aria-live="polite" sx={{ flex: 1, overflowY: "auto", px: 2, py: 2.5, display: "flex", flexDirection: "column", gap: 3 }}>
      {messages.length === 0 ? (
        <Box sx={{ m: "auto", textAlign: "center", maxWidth: 420 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Ask anything
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2.5 }}>
            {demo
              ? "Demo mode: replies are fake. Add a free API key in Settings for real answers."
              : `Connected to ${providerName}.`}
          </Typography>
          <Stack spacing={1}>
            {STARTERS.map((s) => (
              <Button key={s} variant="outlined" color="inherit" onClick={() => onSend(s)} sx={{ justifyContent: "flex-start", textTransform: "none", py: 1.25 }}>
                {s}
              </Button>
            ))}
          </Stack>
        </Box>
      ) : (
        messages.map((m, i) => (
          <MessageBubble key={m.id} message={m} isLast={i === messages.length - 1} busy={busy} onRegenerate={onRegenerate} />
        ))
      )}
    </Box>
  );
}
