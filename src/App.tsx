import { AppShell } from '@/components/layout/app-shell'
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { useTheme } from '@/hooks/use-theme'

function App() {
    const { theme, setTheme } = useTheme()

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header theme={theme} onThemeChange={setTheme} />
            <AppShell />
            <Footer />
        </div>
    )
}

export default App
