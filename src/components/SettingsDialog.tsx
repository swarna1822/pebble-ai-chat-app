import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField } from "@mui/material";
import { PROVIDERS } from "../providers";
import type { ProviderId, Settings, ThemeMode } from "../types";

interface Props {
  settings: Settings;
  onSave: (s: Settings) => void;
  onClose: () => void;
}

export default function SettingsDialog({ settings, onSave, onClose }: Props) {
  const [draft, setDraft] = useState<Settings>(settings);
  const real = draft.provider !== "mock";

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField select label="Models" value={draft.provider} onChange={(e) => setDraft({ ...draft, provider: e.target.value as ProviderId })}>
            {(Object.keys(PROVIDERS) as ProviderId[]).map((k) => (
              <MenuItem key={k} value={k}>
                {PROVIDERS[k].name}
              </MenuItem>
            ))}
          </TextField>
          {real && (
            <>
              <TextField
                label="API key"
                type="password"
                autoComplete="off"
                value={draft.apiKey}
                onChange={(e) => setDraft({ ...draft, apiKey: e.target.value })}
                helperText="Saved only in this browser. Never commit or share it."
              />
              <TextField
                label="Model"
                value={draft.model}
                onChange={(e) => setDraft({ ...draft, model: e.target.value })}
                placeholder={PROVIDERS[draft.provider].defaultModel}
                helperText="Leave blank for the default. Check the provider’s docs if you get a model error."
              />
            </>
          )}
          <TextField select label="Theme" value={draft.theme} onChange={(e) => setDraft({ ...draft, theme: e.target.value as ThemeMode })}>
            <MenuItem value="auto">Match device</MenuItem>
            <MenuItem value="light">Light</MenuItem>
            <MenuItem value="dark">Dark</MenuItem>
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={() => onSave(draft)}>
          Save settings
        </Button>
      </DialogActions>
    </Dialog>
  );
}
