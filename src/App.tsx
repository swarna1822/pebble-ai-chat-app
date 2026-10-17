import { useEffect, useMemo, useRef, useState } from "react";
import { AppBar, Box, Chip, CssBaseline, Drawer, IconButton, ThemeProvider, Toolbar, Typography, useMediaQuery } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "./components/Sidebar";
import ChatView from "./components/ChatView";
import Composer from "./components/Composer";
import SettingsDialog from "./components/SettingsDialog";
import { PROVIDERS } from "./providers";
import { load, save } from "./storage";
import { makeTheme } from "./theme";
import { DEFAULT_SETTINGS, type Settings } from "./types";
import { useChats } from "./useChats";

const DRAWER_WIDTH = 280;

export default function App() {
  const [settings, setSettings] = useState<Settings>(() => {
    const merged: Settings = { ...DEFAULT_SETTINGS, ...load<Partial<Settings>>("ck.settings", {}) };
    // If an old saved setting has no key but .env.local has one, use the .env.local values.
    if (!merged.apiKey && DEFAULT_SETTINGS.apiKey) {
      return { ...merged, provider: DEFAULT_SETTINGS.provider, apiKey: DEFAULT_SETTINGS.apiKey };
    }
    return merged;
  });
  useEffect(() => save("ck.settings", settings), [settings]);

  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const mode = settings.theme === "auto" ? (prefersDark ? "dark" : "light") : settings.theme;
  const theme = useMemo(() => makeTheme(mode), [mode]);
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const chat = useChats(settings);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const newChatRef = useRef(chat.newChat);
  newChatRef.current = chat.newChat;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        newChatRef.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const provider = PROVIDERS[settings.provider];
  const close = () => setDrawerOpen(false);

  const sidebar = (
    <Sidebar
      chats={chat.chats}
      activeId={chat.activeId}
      onNew={() => { chat.newChat(); close(); }}
      onSelect={(id) => { chat.select(id); close(); }}
      onDelete={chat.remove}
      onSettings={() => { setShowSettings(true); close(); }}
    />
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", height: "100dvh" }}>
        <Drawer
          variant={isDesktop ? "permanent" : "temporary"}
          open={isDesktop || drawerOpen}
          onClose={close}
          ModalProps={{ keepMounted: true }}
          sx={{ width: isDesktop ? DRAWER_WIDTH : 0, flexShrink: 0, "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box" } }}
        >
          {sidebar}
        </Drawer>

        <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", maxWidth: 840, mx: "auto" }}>
          <AppBar position="static" color="transparent" elevation={2} sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Toolbar variant="dense">
              {!isDesktop && (
                <IconButton edge="start" aria-label="Open chat history" onClick={() => setDrawerOpen(true)} sx={{ mr: 1 }}>
                  <MenuIcon />
                </IconButton>
              )}
              <Typography variant="h6" sx={{ flex: 1, fontSize: 17, fontWeight: 600 }}>
                Pebble AI assitant
              </Typography>
              {/* <Chip size="small" label={provider.name} variant="outlined" /> */}
            </Toolbar>
          </AppBar>

          <ChatView
            messages={chat.messages}
            busy={chat.busy}
            demo={settings.provider === "mock"}
            providerName={provider.name}
            onSend={chat.send}
            onRegenerate={chat.regenerate}
          />
          <Composer busy={chat.busy} onSend={chat.send} onStop={chat.stop} />
        </Box>
      </Box>

      {showSettings && (
        <SettingsDialog
          settings={settings}
          onClose={() => setShowSettings(false)}
          onSave={(s) => { setSettings(s); setShowSettings(false); }}
        />
      )}
    </ThemeProvider>
  );
}
