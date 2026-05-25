import { flags } from '@/data'
import type { Flag } from '@/data'
import type { GeneratedCommand } from '@/lib/generator'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import type { TFunction } from 'i18next'

type ApplyParsedCommand = (content: string) => void

type UseResultEditorInput = {
  generatedCommand: GeneratedCommand
  t: TFunction
  applyParsedCommand: ApplyParsedCommand
}

function useResultEditor({ generatedCommand, t, applyParsedCommand }: UseResultEditorInput) {
  const [copyLabel, setCopyLabel] = useState(t("result.copy"))
  const [resultContent, setResultContent] = useState("")
  const [completionQuery, setCompletionQuery] = useState("")
  const [completionStart, setCompletionStart] = useState<number | null>(null)
  const [completionPosition, setCompletionPosition] = useState({ left: 16, top: 48 })
  const [completionMaxHeight, setCompletionMaxHeight] = useState(176)
  const [activeCompletionIndex, setActiveCompletionIndex] = useState(0)
  const skipResultSync = useRef(false)
  const resultTextareaRef = useRef<HTMLTextAreaElement>(null)
  const resultRows = Math.max(8, resultContent.split("\n").length)
  const completionOptions = completionStart === null ? [] : flags
    .filter((flag) => flag.value.toLowerCase().startsWith(completionQuery.toLowerCase()))
    .slice(0, 8)
  useEffect(() => {
    if (skipResultSync.current) {
      skipResultSync.current = false
      return
    }
    setResultContent(generatedCommand.content)
  }, [generatedCommand.content])
  const handleCopy = async () => {
    await navigator.clipboard.writeText(resultContent)
    setCopyLabel(t("result.copied"))
    window.setTimeout(() => setCopyLabel(t("result.copy")), 1600)
  }
  const handleDownload = () => {
    const blob = new Blob([resultContent], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = generatedCommand.fileName
    document.body.append(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }
  const handleResultChange = (value: string) => {
    skipResultSync.current = true
    setResultContent(value)
    applyParsedCommand(value)
  }
  const updateCompletion = (value: string, cursorPosition: number) => {
    const beforeCursor = value.slice(0, cursorPosition)
    const currentTokenMatch = beforeCursor.match(/(?:^|\s)(-\S*)$/)
    if (!currentTokenMatch) {
      setCompletionStart(null)
      setCompletionQuery("")
      setActiveCompletionIndex(0)
      return
    }
    const query = currentTokenMatch[1]
    const textarea = resultTextareaRef.current
    const linesBeforeCursor = beforeCursor.split("\n")
    const lineIndex = linesBeforeCursor.length - 1
    const columnIndex = linesBeforeCursor[lineIndex]?.length ?? 0
    const lineHeight = 20
    const characterWidth = 8
    const padding = 16
    const textareaWidth = textarea?.clientWidth ?? 640
    const textareaHeight = textarea?.clientHeight ?? 176
    const popupWidth = Math.min(448, textareaWidth - padding * 2)
    const nextTop = padding + (lineIndex + 1) * lineHeight - (textarea?.scrollTop ?? 0)
    setCompletionStart(cursorPosition - query.length)
    setCompletionQuery(query)
    setCompletionPosition({
      left: Math.min(padding + columnIndex * characterWidth, Math.max(padding, textareaWidth - popupWidth - padding)),
      top: nextTop,
    })
    setCompletionMaxHeight(Math.max(48, Math.min(176, textareaHeight - nextTop - padding)))
    setActiveCompletionIndex(0)
  }
  const handleResultInputChange = (value: string, cursorPosition: number) => {
    handleResultChange(value)
    updateCompletion(value, cursorPosition)
  }
  const applyCompletion = (flag: Flag) => {
    if (completionStart === null) return
    const textarea = resultTextareaRef.current
    const cursorPosition = textarea?.selectionStart ?? resultContent.length
    const insertedValue = flag.configurable
      ? flag.configurable.valueTemplate.replace("{value}", String(flag.configurable.defaultValue))
      : flag.value
    const nextContent = `${resultContent.slice(0, completionStart)}${insertedValue}${resultContent.slice(cursorPosition)}`
    const nextCursorPosition = completionStart + insertedValue.length
    skipResultSync.current = true
    setResultContent(nextContent)
    applyParsedCommand(nextContent)
    setCompletionStart(null)
    setCompletionQuery("")
    window.requestAnimationFrame(() => {
      textarea?.focus()
      textarea?.setSelectionRange(nextCursorPosition, nextCursorPosition)
    })
  }
  const handleResultKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (completionOptions.length === 0) return
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActiveCompletionIndex((index) => (index + 1) % completionOptions.length)
    }
    if (event.key === "ArrowUp") {
      event.preventDefault()
      setActiveCompletionIndex((index) => (index - 1 + completionOptions.length) % completionOptions.length)
    }
    if (event.key === "Enter" || event.key === "Tab") {
      event.preventDefault()
      applyCompletion(completionOptions[activeCompletionIndex])
    }
    if (event.key === "Escape") {
      setCompletionStart(null)
      setCompletionQuery("")
    }
  }

  return {
    copyLabel,
    resultContent,
    resultRows,
    completionOptions,
    completionQuery,
    completionPosition,
    completionMaxHeight,
    activeCompletionIndex,
    resultTextareaRef,
    handleCopy,
    handleDownload,
    handleResultInputChange,
    handleResultKeyDown,
    updateCompletion,
    applyCompletion,
  }
}

export { useResultEditor }
