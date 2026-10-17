import { createTheme } from "@mui/material/styles";

export function makeTheme(mode: "light" | "dark") {
  return createTheme({
    palette: {
      mode,
      primary: { main: mode === "dark" ? "#8f9bff" : "#2f3a8f" },
      secondary: { main: "#1f9e8f" },
      background:
        mode === "dark"
          ? { default: "#141a26", paper: "#1e2636" }
          : { default: "#eef1f6", paper: "#ffffff" }
    },
    shape: { borderRadius: 12 },
    typography: { fontFamily: '"Instrument Sans", system-ui, -apple-system, "Segoe UI", sans-serif' }
  });
}
