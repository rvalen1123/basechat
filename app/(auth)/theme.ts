export const theme = {
  light: {
    background: "#ffffff",
    text: "#000000",
    primary: "#444444",
    buttonBackground: "#2c3e50",
    buttonText: "#ffffff",
    buttonHover: "#34495e",
    border: "#e5e7eb",
    error: "#dc2626",
    info: "#3b82f6",
  },
  dark: {
    background: "#1a1b22",
    text: "#ffffff",
    primary: "#ffffff",
    buttonBackground: "#2563eb",
    buttonText: "#ffffff",
    buttonHover: "#1d4ed8",
    border: "#374151",
    error: "#ef4444",
    info: "#60a5fa",
  },
};

export type Theme = typeof theme.light;
