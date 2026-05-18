import { useEffect, useState } from 'react'

type Theme = "light" | "dark" | "system"
const storageKey = "mcflags-theme"
function getStoredTheme(): Theme {
  if (typeof window === "undefined") {
    return "system"
  }
  const value = window.localStorage.getItem(storageKey)
  if (value === "light" || value === "dark" || value === "system") {
    return value
  }
  return "system"
}

function getSystemTheme() {
  if (typeof window === "undefined") {
    return "light"
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function applyTheme(theme: Theme) {
  const resolvedTheme = theme === "system" ? getSystemTheme() : theme
  document.documentElement.classList.toggle("dark", resolvedTheme === "dark")
}

function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => getStoredTheme())
  useEffect(() => {
    applyTheme(theme)
    window.localStorage.setItem(storageKey, theme)
  }, [theme])
  useEffect(() => {
    if (theme !== "system") {
      return
    }
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => applyTheme("system")
    media.addEventListener("change", handleChange)
    return () => media.removeEventListener("change", handleChange)
  }, [theme])
  return {
    theme,
    setTheme: setThemeState,
    resolvedTheme: theme === "system" ? getSystemTheme() : theme,
  }
}

export { useTheme }
export type { Theme }
