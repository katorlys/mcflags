import { Button } from '@/components/ui/button'
import type { Theme } from '@/hooks/use-theme'
import { FaGithub, FaGlobe, FaMoon, FaSun, FaDesktop } from 'react-icons/fa6'
import { FaTerminal } from 'react-icons/fa'

type HeaderProps = {
  theme: Theme
  onThemeChange: (theme: Theme) => void
}

function Header({ theme, onThemeChange }: HeaderProps) {
  const nextTheme = theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system'
  const ThemeIcon = theme === 'system' ? FaDesktop : theme === 'light' ? FaSun : FaMoon

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto box-border flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 font-semibold">
          <a href="https://katorly.com" target="_blank" rel="noreferrer" aria-label="Open Katorly Lab website">
            <img className="size-8 rounded-md" src="/katorlylab.svg" alt="Katorly Lab" />
          </a>
          <span className="text-muted-foreground" aria-hidden="true">/</span>
          <a href="/" className="flex items-center gap-2" aria-label="mcflags home">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <FaTerminal className="size-5" aria-hidden="true" />
            </span>
            <span className="text-lg">MCFlags</span>
          </a>
        </div>
        <nav className="flex items-center gap-2" aria-label="Site tools">
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Theme: ${theme}. Switch to ${nextTheme}.`}
            onClick={() => onThemeChange(nextTheme)}
          >
            <ThemeIcon className="size-5" aria-hidden="true" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Change language">
            <FaGlobe className="size-5" aria-hidden="true" />
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a href="https://github.com/katorlys/mcflags" target="_blank" rel="noreferrer" aria-label="Star us on GitHub">
              <FaGithub className="size-5" aria-hidden="true" />
            </a>
          </Button>
        </nav>
      </div>
    </header>
  )
}

export { Header }
