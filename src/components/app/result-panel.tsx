import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Flag } from '@/data'
import type { KeyboardEvent, RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import { FaCheck, FaCopy } from 'react-icons/fa6'

const SUBMIT_FLAG_SET_URL = "https://github.com/katorlys/mcflags/issues/new?template=2-submit-flag-set.yml"

type CompletionPosition = {
  left: number
  top: number
}

type ResultPanelProps = {
  resultContent: string
  copyLabel: string
  resultRows: number
  completionOptions: Flag[]
  completionQuery: string
  completionPosition: CompletionPosition
  completionMaxHeight: number
  activeCompletionIndex: number
  textareaRef: RefObject<HTMLTextAreaElement | null>
  onCopy: () => void
  onDownload: () => void
  onResultInputChange: (value: string, cursorPosition: number) => void
  onResultKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void
  onCompletionUpdate: (value: string, cursorPosition: number) => void
  onCompletionApply: (flag: Flag) => void
}

function ResultPanel({
  resultContent,
  copyLabel,
  resultRows,
  completionOptions,
  completionQuery,
  completionPosition,
  completionMaxHeight,
  activeCompletionIndex,
  textareaRef,
  onCopy,
  onDownload,
  onResultInputChange,
  onResultKeyDown,
  onCompletionUpdate,
  onCompletionApply,
}: ResultPanelProps) {
  const { t } = useTranslation()
  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>{t("result.title")}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="relative min-w-0 overflow-hidden rounded-lg border bg-muted">
          <div className="group absolute right-3 top-3 z-10 flex items-center">
            <span className="pointer-events-none mr-2 hidden rounded-md bg-primary px-2.5 py-1.5 text-xs whitespace-nowrap text-primary-foreground shadow-sm group-hover:block">
              {copyLabel}
            </span>
            <Button size="icon" variant="secondary" onClick={onCopy} aria-label={t("result.copyCode")}>
              {copyLabel === t("result.copied") ? <FaCheck className="size-4" aria-hidden="true" /> : <FaCopy className="size-4" aria-hidden="true" />}
            </Button>
          </div>
          <textarea
            ref={textareaRef}
            className="w-full resize-y bg-transparent p-4 pr-24 text-sm text-foreground outline-none"
            value={resultContent}
            onChange={(event) => onResultInputChange(event.target.value, event.target.selectionStart)}
            onKeyDown={onResultKeyDown}
            onClick={(event) => onCompletionUpdate(event.currentTarget.value, event.currentTarget.selectionStart)}
            aria-label={t("result.output")}
            rows={resultRows}
            spellCheck={false}
          />
          {completionOptions.length > 0 ? (
            <div
              className="absolute z-20 w-[min(28rem,calc(100%-2rem))] overflow-auto rounded-lg border bg-popover p-1 text-sm text-popover-foreground shadow-lg"
              style={{ left: completionPosition.left, top: completionPosition.top, maxHeight: completionMaxHeight }}
            >
              {completionOptions.map((flag, index) => {
                const completionValue = flag.configurable ? flag.configurable.valueTemplate.replace("{value}", String(flag.configurable.defaultValue)) : flag.value
                return (
                  <button
                    className={`w-full truncate rounded-md px-3 py-1.5 text-left ${index === activeCompletionIndex ? "bg-accent" : "hover:bg-accent"}`}
                    key={flag.id}
                    type="button"
                    onMouseDown={(event) => {
                      event.preventDefault()
                      onCompletionApply(flag)
                    }}
                  >
                    <span>{completionValue.slice(0, completionQuery.length)}</span>
                    <span className="text-muted-foreground">{completionValue.slice(completionQuery.length)}</span>
                  </button>
                )
              })}
            </div>
          ) : null}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          <Button onClick={onDownload}>{t("result.download")}</Button>
          <Button variant="outline" asChild>
            <a href={SUBMIT_FLAG_SET_URL} target="_blank" rel="noreferrer">{t("result.submit")}</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export { ResultPanel }
