import { createContext, useContext, useEffect, useState } from "react";
import { KEYS } from "../utils/storage.js";

const ThemeContext = createContext(null);

function initialTheme() {
  try {
    const saved = localStorage.getItem(KEYS.theme);
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(initialTheme);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try { localStorage.setItem(KEYS.theme, theme); } catch { /* storage unavailable */ }
  }, [theme]);
  const toggleTheme = () => setTheme(value => (value === "dark" ? "light" : "dark"));
  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}
export const useTheme = () => useContext(ThemeContext);
