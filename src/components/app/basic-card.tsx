import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { presets } from '@/data'
import type { PresetId } from '@/data'
import { useTranslation } from 'react-i18next'

type BasicSettingsCardProps = {
  jarName: string
  memory: number[]
  maxMemory: number
  selectedPresetId: PresetId
  onJarNameChange: (value: string) => void
  onMemoryChange: (value: number[]) => void
  onMaxMemoryChange: (value: string) => void
  onPresetChange: (value: string) => void
}

function BasicCard({
  jarName,
  memory,
  maxMemory,
  selectedPresetId,
  onJarNameChange,
  onMemoryChange,
  onMaxMemoryChange,
  onPresetChange,
}: BasicSettingsCardProps) {
  const { t } = useTranslation()
  const selectedPreset = presets.find((preset) => preset.id === selectedPresetId) ?? presets[0]
  const formatMemory = (value: number) => value < 1 ? `${value * 1024}MB` : `${value}GB`
  return (
    <div className="grid items-start gap-6 md:grid-cols-2">
      <div className="grid content-start gap-2">
        <Label htmlFor="jar-name">{t("basic.jarName")}</Label>
        <Input id="jar-name" value={jarName} onChange={(event) => onJarNameChange(event.target.value)} />
      </div>
      <div className="grid gap-2">
        <Label>{t("basic.memory")}</Label>
        <div className="pt-4">
          <Slider value={memory} onValueChange={onMemoryChange} min={0.5} max={maxMemory} step={0.5} formatValue={formatMemory} aria-label="Memory range" />
        </div>
        <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>512MB</span>
          <label className="flex items-center gap-1.5">
            <Input
              className="h-7 w-20 text-xs text-foreground"
              value={maxMemory}
              onChange={(event) => onMaxMemoryChange(event.target.value)}
              inputMode="numeric"
              min={1}
              step={1}
              type="number"
              aria-label={t("basic.maxMemory")}
            />
            <span>GB</span>
          </label>
        </div>
      </div>
      <div className="grid content-start gap-2">
        <Label>{t("basic.presets")}</Label>
        <Select value={selectedPresetId} onValueChange={onPresetChange}>
          <SelectTrigger className="h-9 overflow-hidden text-left [&>span:first-child]:min-w-0 [&>span:first-child]:flex-1 [&>span:first-child]:overflow-hidden">
            <SelectValue placeholder={t("basic.selectPreset")}>{t(selectedPreset.name)}</SelectValue>
          </SelectTrigger>
          <SelectContent className="w-(--radix-select-trigger-width) max-w-[calc(100vw-2rem)]">
            {presets.map((preset) => (
              <SelectItem className="min-w-0" key={preset.id} value={preset.id}>
                <span className="grid min-w-0 max-w-full gap-0.5 text-left">
                  <span className="truncate">{t(preset.name)}</span>
                  {t(preset.description) ? (
                    <span className="whitespace-normal wrap-break-word text-xs leading-5 text-muted-foreground">{t(preset.description)}</span>
                  ) : null}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export { BasicCard }
