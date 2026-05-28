type FlagCategory = "runtime" | "gc" | "memory" | "performance" | "diagnostic" | "compatibility"

type CoreTag = "bukkit" | "spigot" | "paper" | "folia" | "waterfall" | "velocity" | "forge"

type FlagTag =
  | "recommended"
  | "legacy"
  | CoreTag

type Flag = {
  id: string
  value: string
  name: string
  description: string
  category: FlagCategory
  tags: FlagTag[]
  configurable?: {
    valueTemplate: string
    defaultValue: number | string
    min?: number
    max?: number
    step?: number
    unit?: string
  }
}

type PresetFlag = {
  id: string
  value?: number | string
}

type Preset = {
  id: string
  name: string
  description: string
  flags: PresetFlag[]
  coreTags: CoreTag[]
}

type PlatformId = "windows" | "unix" | "docker-compose"

type DownloadFormat = "bat" | "sh" | "yml"

type Platform = {
  id: PlatformId
  name: string
  downloadFileName: string
  downloadFormat: DownloadFormat
}

type RestartMode = "none" | "press" | "auto"

type LaunchOptionId = "gui" | "no-jline" | "press-restart" | "auto-restart"

type LaunchOption = {
  id: LaunchOptionId
  name: string
  description: string
  defaultChecked: boolean
}

type FilterId = "all" | FlagCategory | FlagTag

type FlagFilter = {
  id: FilterId
  name: string
}
export type {
  CoreTag,
  DownloadFormat,
  FilterId,
  Flag,
  FlagCategory,
  FlagFilter,
  FlagTag,
  LaunchOption,
  LaunchOptionId,
  Platform,
  PlatformId,
  Preset,
  PresetFlag,
  RestartMode,
}
