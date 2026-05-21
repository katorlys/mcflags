import { useTranslation } from 'react-i18next'

function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()
  return (
    <footer className="mx-auto box-border flex w-full max-w-6xl flex-col items-center gap-2 px-4 py-8 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
      <p>{t("footer.made")}</p>
      <p>
        © 2026-{year}{" "}
        <a
          className="font-medium text-foreground underline-offset-4 hover:underline"
          href="https://katorly.com"
          target="_blank"
          rel="noreferrer"
        >
          Katorly Lab
        </a>
      </p>
    </footer>
  )
}

export { Footer }
