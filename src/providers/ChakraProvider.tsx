"use client";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    heading: "'DB HelveThaiCA X', 'Sarabun', 'Noto Sans Thai', sans-serif",
    body: "'DB HelveThaiCA X', 'Sarabun', 'Noto Sans Thai', sans-serif",
  },
  colors: {
    brand: {
      50: "#f0f9ff",
      100: "#e0f2fe",
      200: "#bae6fd",
      300: "#7dd3fc",
      400: "#38bdf8",
      500: "#0ea5e9", // Primary blue
      600: "#0284c7",
      700: "#0369a1",
      800: "#075985",
      900: "#0c4a6e",
    },
    secondary: {
      50: "#fffbeb",
      100: "#fef3c7",
      200: "#fde68a",
      300: "#fcd34d",
      400: "#fbbf24",
      500: "#f59e0b", // Primary orange
      600: "#d97706",
      700: "#b45309",
      800: "#92400e",
      900: "#78350f",
    },
    gray: {
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a",
    },
  },
  styles: {
    global: {
      body: {
        fontFamily:
          "'DB HelveThaiCA X', 'Sarabun', 'Noto Sans Thai', sans-serif",
        bg: "gray.50",
        color: "gray.800",
      },
    },
  },
  components: {
    Button: {
      defaultProps: {
        fontWeight: "500",
      },
    },
    Heading: {
      defaultProps: {
        fontWeight: "700",
      },
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
