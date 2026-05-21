import { Button } from '@/components/ui/button'
import type { Theme } from '@/hooks/use-theme'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaCheck, FaGithub, FaGlobe, FaMoon, FaSun, FaDesktop } from 'react-icons/fa6'
import { FaTerminal } from 'react-icons/fa'

type HeaderProps = {
  theme: Theme
  onThemeChange: (theme: Theme) => void
}

function Header({ theme, onThemeChange }: HeaderProps) {
  const { i18n, t } = useTranslation()
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false)
  const languageMenuRef = useRef<HTMLDivElement>(null)
  const nextTheme = theme === "system" ? "light" : theme === "light" ? "dark" : "system"
  const ThemeIcon = theme === "system" ? FaDesktop : theme === "light" ? FaSun : FaMoon
  const currentLanguage = i18n.language.startsWith("zh") ? "zh" : "en"
  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language)
    setLanguageMenuOpen(false)
  }

  useEffect(() => {
    if (!languageMenuOpen) return
    const handlePointerDown = (event: PointerEvent) => {
      if (!languageMenuRef.current?.contains(event.target as Node)) {
        setLanguageMenuOpen(false)
      }
    }
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setLanguageMenuOpen(false)
      }
    }
    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [languageMenuOpen])

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto box-border flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 font-semibold">
          <a href="https://katorly.com" target="_blank" rel="noreferrer" aria-label={t("nav.lab")}>
            <img className="size-8 rounded-md" src="/katorlylab.svg" alt="Katorly Lab" />
          </a>
          <span className="text-muted-foreground" aria-hidden="true">/</span>
          <a href="/" className="flex items-center gap-2" aria-label={t("nav.home")}>
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <FaTerminal className="size-5" aria-hidden="true" />
            </span>
            <span className="text-lg">MCFlags</span>
          </a>
        </div>
        <nav className="flex items-center gap-2" aria-label={t("nav.tools")}>
          <Button
            variant="ghost"
            size="icon"
            aria-label={t("nav.theme", { theme, nextTheme })}
            onClick={() => onThemeChange(nextTheme)}
          >
            <ThemeIcon className="size-5" aria-hidden="true" />
          </Button>
          <div className="relative" ref={languageMenuRef}>
            <Button
              variant="ghost"
              size="icon"
              aria-label={t("nav.language")}
              aria-haspopup="listbox"
              aria-expanded={languageMenuOpen}
              onClick={() => setLanguageMenuOpen((open) => !open)}
            >
              <FaGlobe className="size-5" aria-hidden="true" />
            </Button>
            {languageMenuOpen ? (
              <div className="absolute right-0 top-14 z-50 min-w-44 rounded-lg border bg-popover p-1 text-popover-foreground shadow-lg" role="listbox" aria-label={t("nav.language")}>
                {[
                  ["en", i18n.getResource("en", "translation", "language.name")],
                  ["zh", i18n.getResource("zh", "translation", "language.name")],
                ].map(([language, label]) => (
                  <button
                    className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-accent ${currentLanguage === language ? "bg-accent" : ""}`}
                    key={language}
                    type="button"
                    role="option"
                    aria-selected={currentLanguage === language}
                    onClick={() => handleLanguageChange(language)}
                  >
                    <span>{label}</span>
                    {currentLanguage === language ? <FaCheck className="size-4" aria-hidden="true" /> : null}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <Button variant="ghost" size="icon" asChild>
            <a href="https://github.com/katorlys/mcflags" target="_blank" rel="noreferrer" aria-label={t("nav.github")}>
              <FaGithub className="size-5" aria-hidden="true" />
            </a>
          </Button>
        </nav>
      </div>
    </header>
  )
}

export { Header }
