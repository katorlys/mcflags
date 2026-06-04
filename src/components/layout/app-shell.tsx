import { BasicCard } from '@/components/app/basic-card'
import { FlagsPanel } from '@/components/app/flags-panel'
import { OptionsCard } from '@/components/app/options-card'
import { ResultPanel } from '@/components/app/result-panel'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { flags } from '@/data'
import { useFlagSelection } from '@/hooks/use-flag-selection'
import { useLaunchSettings } from '@/hooks/use-launch-settings'
import { useResultEditor } from '@/hooks/use-result-editor'
import { parseJavaCommand } from '@/lib/parser'
import { generateCommand } from '@/lib/generator'
import { useTranslation } from 'react-i18next'

function AppShell() {
  const { t } = useTranslation()
  const launch = useLaunchSettings()
  const flagSelection = useFlagSelection()
  const generatedCommand = generateCommand({
    platformId: launch.platformId,
    jarName: launch.jarName,
    memory: {
      minGb: launch.memory[0],
      maxGb: launch.memory[1],
    },
    selectedFlags: flagSelection.selectedFlags,
    availableFlags: flags,
    noJline: launch.noJline,
    nogui: !launch.gui,
    restartMode: launch.restartMode,
  })
  const applyParsedCommand = (content: string) => {
    const parsed = parseJavaCommand(content, flags)
    if (!parsed) return
    if (parsed.minMemory !== undefined && parsed.maxMemory !== undefined) {
      launch.setMemory([parsed.minMemory, parsed.maxMemory])
    } else if (parsed.minMemory !== undefined) {
      launch.setMemory(([_, max]) => [parsed.minMemory!, max])
    } else if (parsed.maxMemory !== undefined) {
      launch.setMemory(([min]) => [min, parsed.maxMemory!])
    }
    if (parsed.jarName) launch.setJarName(parsed.jarName)
    flagSelection.setSelectedPresetId("custom")
    flagSelection.setSelectedFlags(parsed.selectedFlags)
    launch.setNoJline(parsed.noJline)
    launch.setGui(!parsed.nogui)
  }
  const result = useResultEditor({ generatedCommand, t, applyParsedCommand })

  return (
    <main className="mx-auto box-border flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid min-w-0 gap-3">
        <div className="grid min-w-0 gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="space-y-3">
            <h1 className="w-full text-3xl font-semibold tracking-tight sm:text-4xl lg:max-w-4xl">{t("app.title")}</h1>
          </div>
          <Button className="w-fit" onClick={result.handleDownload}>{t("result.download")}</Button>
        </div>
      </section>
      <section className="grid min-w-0 gap-6">
        <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Card className="min-w-0">
            <CardHeader>
              <CardTitle>{t("basic.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <BasicCard
                jarName={launch.jarName}
                memory={launch.memory}
                maxMemory={launch.maxMemory}
                selectedPresetId={flagSelection.selectedPresetId}
                onJarNameChange={launch.setJarName}
                onMemoryChange={launch.setMemory}
                onMaxMemoryChange={launch.handleMaxMemoryChange}
                onPresetChange={flagSelection.handlePresetChange}
              />
            </CardContent>
          </Card>
          <aside className="grid gap-6 lg:self-start">
            <Card className="min-w-0">
              <CardHeader>
                <CardTitle>{t("options.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <OptionsCard getChecked={launch.getLaunchOptionChecked} onChange={launch.handleLaunchOptionChange} />
              </CardContent>
            </Card>
          </aside>
        </div>
        <div className="grid min-w-0 gap-6">
          <FlagsPanel
            flags={flags}
            selectedFlags={flagSelection.selectedFlags}
            onFlagToggle={flagSelection.handleFlagToggle}
            onFlagValueChange={flagSelection.handleFlagValueChange}
          />
          <ResultPanel
            platformId={launch.platformId}
            resultContent={result.resultContent}
            copyLabel={result.copyLabel}
            resultRows={result.resultRows}
            completionOptions={result.completionOptions}
            completionQuery={result.completionQuery}
            completionPosition={result.completionPosition}
            completionMaxHeight={result.completionMaxHeight}
            activeCompletionIndex={result.activeCompletionIndex}
            textareaRef={result.resultTextareaRef}
            onCopy={result.handleCopy}
            onDownload={result.handleDownload}
            onPlatformChange={launch.setPlatformId}
            onResultInputChange={result.handleResultInputChange}
            onResultKeyDown={result.handleResultKeyDown}
            onCompletionUpdate={result.updateCompletion}
            onCompletionApply={result.applyCompletion}
          />
        </div>
      </section>
    </main>
  )
}
export { AppShell }
