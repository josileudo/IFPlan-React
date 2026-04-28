import { useColorScheme } from "react-native";

export const lightTheme = {
  colors: {
    primary: "#059669",
    primaryDark: "#047857",
    secondary: "#10b981",
    background: "#F8FAFC",
    surface: "#ffffff",
    text: {
      primary: "#1e293b",
      secondary: "#64748b",
      placeholder: "#94a3b8",
      light: "#ffffff",
    },
    border: "#e2e8f0",
    error: "#ef4444",
    success: "#22c55e",
    warning: "#eab308",
    disabled: "#e2e8f0",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    "2xl": 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 24,
    full: 9999,
  },
  typography: {
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      "2xl": 24,
      "3xl": 32,
    },
    weights: {
      regular: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    } as const,
  },
  shadows: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4,
    },
    lg: {
      shadowColor: "#059669",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 8,
    },
  },
};

export const darkTheme = {
  ...lightTheme,
  colors: {
    primary: "#10b981",
    primaryDark: "#059669",
    secondary: "#34d399",
    background: "#0f172a",
    surface: "#1e293b",
    text: {
      primary: "#f8fafc",
      secondary: "#cbd5e1",
      placeholder: "#64748b",
      light: "#ffffff",
    },
    border: "#334155",
    error: "#f87171",
    success: "#4ade80",
    warning: "#facc15",
    disabled: "#334155",
  },
  shadows: {
    ...lightTheme.shadows,
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.6,
      shadowRadius: 12,
      elevation: 8,
    },
  }
};

// Retro-compatibility para componentes que ainda usam o theme diretamente
export const theme = lightTheme;

export function useTheme() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  
  return {
    isDark,
    theme: isDark ? darkTheme : lightTheme,
    colors: isDark ? darkTheme.colors : lightTheme.colors,
    spacing: lightTheme.spacing,
    borderRadius: lightTheme.borderRadius,
    typography: lightTheme.typography,
    shadows: isDark ? darkTheme.shadows : lightTheme.shadows,
  };
}
