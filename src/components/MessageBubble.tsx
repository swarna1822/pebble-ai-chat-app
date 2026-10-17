import { Alert, Avatar, Box, Button, CircularProgress, Paper, Typography } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import RefreshIcon from "@mui/icons-material/Refresh";
import Markdown from "./Markdown";
import type { Message } from "../types";

interface Props {
  message: Message;
  isLast: boolean;
  busy: boolean;
  onRegenerate: () => void;
}

export default function MessageBubble({ message, isLast, busy, onRegenerate }: Props) {
  if (message.role === "user") {
    return (
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Paper
          elevation={0}
          sx={{ bgcolor: "primary.main", color: "primary.contrastText", px: 2, py: 1.25, maxWidth: "80%", borderRadius: "18px 18px 4px 18px", whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}
        >
          {message.text}
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", gap: 1.5 }}>
      <Avatar sx={{ width: 28, height: 28, bgcolor: "secondary.main", mt: 0.25 }}>
        <AutoAwesomeIcon sx={{ fontSize: 16 }} />
      </Avatar>
      <Box sx={{ minWidth: 0, maxWidth: 680, flex: 1 }}>
        {message.text === "" && message.status === "streaming" ? (
          <CircularProgress size={16} aria-label="Assistant is typing" sx={{ mt: 1 }} />
        ) : (
          <Markdown text={message.text} />
        )}
        {message.status === "stopped" && (
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
            Stopped before finishing.
          </Typography>
        )}
        {message.status === "error" && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {message.error ?? "Couldn’t finish this reply."}
          </Alert>
        )}
        {isLast && !busy && (
          <Button size="small" startIcon={<RefreshIcon />} onClick={onRegenerate} sx={{ mt: 1 }}>
            Regenerate
          </Button>
        )}
      </Box>
    </Box>
  );
}
