import { Box, Button, IconButton, List, ListItem, ListItemButton, ListItemText, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import type { Chat } from "../types";

interface Props {
  chats: Chat[];
  activeId: string | null;
  onNew: () => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onSettings: () => void;
}

export default function Sidebar({ chats, activeId, onNew, onSelect, onDelete, onSettings }: Props) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ p: 1.5 }}>
        <Button fullWidth variant="contained" startIcon={<AddIcon />} onClick={onNew}>
          New chat
        </Button>
      </Box>
      <List aria-label="Chat history" sx={{ flex: 1, overflowY: "auto", px: 1 }}>
        {chats.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ px: 1.5 }}>
            Your chats will appear here.
          </Typography>
        )}
        {chats.map((c) => (
          <ListItem
            key={c.id}
            disablePadding
            secondaryAction={
              <IconButton edge="end" size="small" aria-label={`Delete chat ${c.title}`} onClick={() => onDelete(c.id)}>
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            }
          >
            <ListItemButton selected={c.id === activeId} onClick={() => onSelect(c.id)} sx={{ borderRadius: 2, pr: 6 }}>
              <ListItemText primary={c.title} slotProps={{ primary: { noWrap: true } }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ p: 1.5, borderTop: 1, borderColor: "divider" }}>
        <Button fullWidth startIcon={<SettingsIcon />} onClick={onSettings}>
          Settings
        </Button>
      </Box>
    </Box>
  );
}
