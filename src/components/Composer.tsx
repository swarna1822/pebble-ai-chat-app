import { useState } from "react";
import { Box, IconButton, InputBase, Paper, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import StopIcon from "@mui/icons-material/Stop";

interface Props {
  busy: boolean;
  onSend: (text: string) => void;
  onStop: () => void;
}

export default function Composer({ busy, onSend, onStop }: Props) {
  const [text, setText] = useState("");

  const submit = () => {
    const q = text.trim();
    if (!q || busy) return;
    onSend(q);
    setText("");
  };

  return (
    <Box sx={{ px: 2, pt: 1, pb: 2 }}>
      <Paper variant="outlined" sx={{ display: "flex", alignItems: "flex-end", gap: 1, p: 1, pl: 2, borderRadius: 4 }}>
        <InputBase
          multiline
          maxRows={6}
          fullWidth
          value={text}
          placeholder="Type a message"
          inputProps={{ "aria-label": "Message" }}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
        />
        {busy ? (
          <IconButton color="primary" onClick={onStop} aria-label="Stop generating">
            <StopIcon />
          </IconButton>
        ) : (
          <IconButton color="primary" onClick={submit} disabled={!text.trim()} aria-label="Send message">
            <SendIcon />
          </IconButton>
        )}
      </Paper>
      <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
        Enter to send, Shift+Enter for a new line, Ctrl/Cmd+K for a new chat.
      </Typography>
    </Box>
  );
}
