import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { flagFilters, flags, launchOptions, platforms, presets } from '@/data'
import type { FilterId, Flag, PlatformId, PresetFlag, PresetId, RestartMode } from '@/data'
import { generateCommand } from '@/lib/generator'
import { useState } from 'react'
import { FaArrowDownAZ, FaCopy, FaDocker, FaFilter, FaGrip, FaLinux, FaList, FaMagnifyingGlass, FaWindows } from 'react-icons/fa6'

const platformIcons = {
  windows: FaWindows,
  unix: FaLinux,
  "docker-compose": FaDocker,
}

const flagsPerPage = 9
type FlagSort = "default" | "az" | "za"
type FlagView = "cards" | "list"

function AppShell() {
  const customPreset = presets[0]
  const [jarName, setJarName] = useState("server.jar")
  const [memory, setMemory] = useState([1, 8])
  const [maxMemory, setMaxMemory] = useState(32)
  const [selectedPresetId, setSelectedPresetId] = useState<PresetId>("custom")
  const [selectedFlags, setSelectedFlags] = useState<PresetFlag[]>(customPreset.flags)
  const [platformId, setPlatformId] = useState<PlatformId>("windows")
  const [gui, setGui] = useState(false)
  const [noJline, setNoJline] = useState(true)
  const [restartMode, setRestartMode] = useState<RestartMode>("none")
  const [flagSearch, setFlagSearch] = useState("")
  const [selectedFilterId, setSelectedFilterId] = useState<FilterId>("all")
  const [flagSort, setFlagSort] = useState<FlagSort>("default")
  const [flagView, setFlagView] = useState<FlagView>("cards")
  const [flagPage, setFlagPage] = useState(1)
  const selectedPreset = presets.find((preset) => preset.id === selectedPresetId) ?? presets[0]
  const normalizedFlagSearch = flagSearch.trim().toLowerCase()
  const visibleFlags = flags.filter((flag) => {
    const matchesSearch = normalizedFlagSearch.length === 0
      || flag.name.toLowerCase().includes(normalizedFlagSearch)
      || flag.value.toLowerCase().includes(normalizedFlagSearch)
      || flag.description.toLowerCase().includes(normalizedFlagSearch)
      || flag.tags.some((tag) => tag.toLowerCase().includes(normalizedFlagSearch))
    const matchesFilter = selectedFilterId === "all"
      || flag.category === selectedFilterId
      || flag.tags.some((tag) => tag === selectedFilterId)
    return matchesSearch && matchesFilter
  }).sort((firstFlag, secondFlag) => {
    if (flagSort === "az") {
      return firstFlag.name.localeCompare(secondFlag.name)
    }
    if (flagSort === "za") {
      return secondFlag.name.localeCompare(firstFlag.name)
    }
    return 0
  })
  const totalFlagPages = Math.max(1, Math.ceil(visibleFlags.length / flagsPerPage))
  const currentFlagPage = Math.min(flagPage, totalFlagPages)
  const pagedFlags = visibleFlags.slice((currentFlagPage - 1) * flagsPerPage, currentFlagPage * flagsPerPage)
  const formatMemory = (value: number) => value < 1 ? `${value * 1024}MB` : `${value}GB`
  const generatedCommand = generateCommand({
    platformId,
    jarName,
    memory: {
      minGb: memory[0],
      maxGb: memory[1],
    },
    selectedFlags,
    availableFlags: flags,
    noJline,
    nogui: !gui,
    restartMode,
  })
  const resultRows = Math.max(8, generatedCommand.content.split("\n").length)
  const handlePresetChange = (presetId: string) => {
    const preset = presets.find((item) => item.id === presetId) ?? customPreset
    setSelectedPresetId(preset.id)
    setSelectedFlags(preset.flags)
  }
  const handleMaxMemoryChange = (value: string) => {
    const nextMaxMemory = Number.parseInt(value, 10)
    if (!Number.isInteger(nextMaxMemory) || nextMaxMemory < 1) {
      return
    }
    setMaxMemory(nextMaxMemory)
    setMemory(([min, max]) => [Math.min(min, nextMaxMemory), Math.min(max, nextMaxMemory)])
  }
  const getLaunchOptionChecked = (optionId: string) => {
    if (optionId === "gui") return gui
    if (optionId === "no-jline") return noJline
    if (optionId === "press-to-restart") return restartMode === "press"
    if (optionId === "auto-restart") return restartMode === "auto"
    return false
  }
  const handleLaunchOptionChange = (optionId: string, checked: boolean) => {
    if (optionId === "gui") {
      setGui(checked)
    }
    if (optionId === "no-jline") {
      setNoJline(checked)
    }
    if (optionId === "press-to-restart") {
      setRestartMode(checked ? "press" : "none")
    }
    if (optionId === "auto-restart") {
      setRestartMode(checked ? "auto" : "none")
    }
  }
  const isFlagSelected = (flagId: string) => selectedFlags.some((flag) => flag.id === flagId)
  const getSelectedFlagValue = (flag: Flag) => selectedFlags.find((selectedFlag) => selectedFlag.id === flag.id)?.value ?? flag.configurable?.defaultValue ?? ""
  const handleFlagToggle = (flagId: string) => {
    setSelectedPresetId("custom")
    setSelectedFlags((currentFlags) => {
      if (currentFlags.some((flag) => flag.id === flagId)) {
        return currentFlags.filter((flag) => flag.id !== flagId)
      }
      const flag = flags.find((item) => item.id === flagId)
      return [
        ...currentFlags,
        {
          id: flagId,
          value: flag?.configurable?.defaultValue,
        },
      ]
    })
  }
  const handleFlagSearchChange = (value: string) => {
    setFlagSearch(value)
    setFlagPage(1)
  }
  const handleFlagFilterChange = (value: string) => {
    setSelectedFilterId(value as FilterId)
    setFlagPage(1)
  }
  const handleFlagSortChange = (value: string) => {
    setFlagSort(value as FlagSort)
    setFlagPage(1)
  }
  const handleFlagValueChange = (flag: Flag, value: string) => {
    setSelectedPresetId("custom")
    setSelectedFlags((currentFlags) => currentFlags.map((selectedFlag) => selectedFlag.id === flag.id ? { ...selectedFlag, value } : selectedFlag))
  }
  return (
    <main className="mx-auto box-border flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid min-w-0 gap-3">
        <div className="grid min-w-0 gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="space-y-3">
            <h1 className="w-full text-3xl font-semibold tracking-tight sm:text-4xl lg:max-w-3xl">
              Generate Minecraft server JVM startup flags
            </h1>
          </div>
          <Button className="w-fit">Download</Button>
        </div>
      </section>
      <section className="grid min-w-0 gap-6">
        <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Card className="min-w-0">
            <CardHeader>
              <CardTitle>Basic</CardTitle>
            </CardHeader>
            <CardContent className="grid items-start gap-6 md:grid-cols-2">
              <div className="grid content-start gap-2">
                <Label htmlFor="jar-name">Server core .jar name</Label>
                <Input id="jar-name" value={jarName} onChange={(event) => setJarName(event.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Memory</Label>
                <div className="pt-4">
                  <Slider value={memory} onValueChange={setMemory} min={0.5} max={maxMemory} step={0.5} formatValue={formatMemory} aria-label="Memory range" />
                </div>
                <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                  <span>512MB</span>
                  <label className="flex items-center gap-1.5">
                    <Input
                      className="h-7 w-20 text-xs text-foreground"
                      value={maxMemory}
                      onChange={(event) => handleMaxMemoryChange(event.target.value)}
                      inputMode="numeric"
                      min={1}
                      step={1}
                      type="number"
                      aria-label="Maximum memory range in GB"
                    />
                    <span>GB</span>
                  </label>
                </div>
              </div>
              <div className="grid content-start gap-2">
                <Label>Pre-made Flags</Label>
                <Select value={selectedPresetId} onValueChange={handlePresetChange}>
                  <SelectTrigger className="h-9 overflow-hidden text-left [&>span:first-child]:min-w-0 [&>span:first-child]:flex-1 [&>span:first-child]:overflow-hidden">
                    <SelectValue placeholder="Select preset">{selectedPreset.name}</SelectValue>
                  </SelectTrigger>
                  <SelectContent className="w-(--radix-select-trigger-width) max-w-[calc(100vw-2rem)]">
                    {presets.map((preset) => (
                      <SelectItem className="min-w-0" key={preset.id} value={preset.id}>
                        <span className="grid min-w-0 max-w-full gap-0.5 text-left">
                          <span className="truncate">{preset.name}</span>
                          {preset.description ? (
                            <span className="whitespace-normal wrap-break-word text-xs leading-5 text-muted-foreground">{preset.description}</span>
                          ) : null}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Platform</Label>
                <Select value={platformId} onValueChange={(value) => setPlatformId(value as PlatformId)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map((platform) => {
                      const PlatformIcon = platformIcons[platform.id]
                      return (
                        <SelectItem key={platform.id} value={platform.id}>
                          <span className="flex items-center gap-2">
                            <PlatformIcon className="size-4" aria-hidden="true" />
                            {platform.name}
                          </span>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          <aside className="grid gap-6 lg:self-start">
            <Card className="min-w-0">
              <CardHeader>
                <CardTitle>Options</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                {launchOptions.map((option) => (
                  <Label className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 rounded-md px-1 py-1.5" key={option.id}>
                    <Checkbox checked={getLaunchOptionChecked(option.id)} onCheckedChange={(checked) => handleLaunchOptionChange(option.id, checked === true)} />
                    <span>{option.name}</span>
                    <span className="col-start-2 text-xs leading-5 text-muted-foreground">{option.description}</span>
                  </Label>
                ))}
              </CardContent>
            </Card>
          </aside>
        </div>
        <div className="grid min-w-0 gap-6">
          <Card className="min-w-0">
            <CardHeader>
              <CardTitle>Flags</CardTitle>
              <CardDescription>You may select multiple flags</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-3 sm:grid-cols-[1fr_160px_180px_auto]">
                <div className="relative">
                  <FaMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                  <Input className="pl-9" value={flagSearch} onChange={(event) => handleFlagSearchChange(event.target.value)} placeholder="Search flags" aria-label="Search flags" />
                </div>
                <Select value={flagSort} onValueChange={handleFlagSortChange}>
                  <SelectTrigger>
                    <span className="flex min-w-0 items-center gap-2">
                      <FaArrowDownAZ className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                      <SelectValue placeholder="Sort" />
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="az">A-Z</SelectItem>
                    <SelectItem value="za">Z-A</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedFilterId} onValueChange={handleFlagFilterChange}>
                  <SelectTrigger>
                    <span className="flex min-w-0 items-center gap-2">
                      <FaFilter className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                      <SelectValue placeholder="Filter" />
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    {flagFilters.map((filter) => (
                      <SelectItem key={filter.id} value={filter.id}>{filter.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex h-9 w-fit justify-self-end overflow-hidden rounded-md border bg-background sm:justify-self-auto" role="group" aria-label="Flag view mode">
                  <Button
                    className="h-full w-10 rounded-none p-0"
                    type="button"
                    size="icon"
                    variant={flagView === "cards" ? "secondary" : "ghost"}
                    onClick={() => setFlagView("cards")}
                    aria-label="Show flags as cards"
                    aria-pressed={flagView === "cards"}
                  >
                    <FaGrip className="size-4" aria-hidden="true" />
                  </Button>
                  <Button
                    className="h-full w-10 rounded-none p-0"
                    type="button"
                    size="icon"
                    variant={flagView === "list" ? "secondary" : "ghost"}
                    onClick={() => setFlagView("list")}
                    aria-label="Show flags as list"
                    aria-pressed={flagView === "list"}
                  >
                    <FaList className="size-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
              {flagView === "cards" ? (
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {pagedFlags.map((flag) => (
                    <button
                      className={`flex flex-col items-start rounded-lg border p-4 text-left transition-colors hover:bg-accent ${isFlagSelected(flag.id) ? "border-primary bg-accent" : "bg-card"}`}
                      key={flag.id}
                      onClick={() => handleFlagToggle(flag.id)}
                      type="button"
                      aria-pressed={isFlagSelected(flag.id)}
                    >
                      <div className="mb-2 grid gap-2">
                        <span className="block truncate font-medium" title={flag.value}>
                          {flag.value}
                        </span>
                        <span className="flex min-h-5 flex-wrap gap-1">
                          {flag.tags.map((tag) => (
                            <Badge key={tag} variant="outline">{tag}</Badge>
                          ))}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{flag.description}</p>
                      {flag.configurable && isFlagSelected(flag.id) ? (
                        <label className="mt-4 flex w-full items-center gap-2 text-sm" onClick={(event) => event.stopPropagation()}>
                          <span className="text-muted-foreground">Value</span>
                          <Input
                            className="h-8"
                            value={getSelectedFlagValue(flag)}
                            onChange={(event) => handleFlagValueChange(flag, event.target.value)}
                            inputMode="numeric"
                            min={flag.configurable.min}
                            max={flag.configurable.max}
                            step={flag.configurable.step}
                            type="number"
                            aria-label={`${flag.name} value`}
                          />
                          {flag.configurable.unit ? <span className="text-muted-foreground">{flag.configurable.unit}</span> : null}
                        </label>
                      ) : null}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="overflow-hidden rounded-lg border">
                  {pagedFlags.map((flag) => (
                    <div className={`border-b last:border-b-0 ${isFlagSelected(flag.id) ? "bg-accent" : "bg-card"}`} key={flag.id}>
                      <button
                        className="grid w-full gap-3 p-4 text-left transition-colors hover:bg-accent md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
                        onClick={() => handleFlagToggle(flag.id)}
                        type="button"
                        aria-pressed={isFlagSelected(flag.id)}
                      >
                        <span className="grid min-w-0 gap-1">
                          <span className="truncate font-medium" title={flag.value}>{flag.value}</span>
                          <span className="text-sm text-muted-foreground">{flag.description}</span>
                        </span>
                        <span className="flex flex-wrap gap-1 md:justify-end">
                          {flag.tags.map((tag) => (
                            <Badge key={tag} variant="outline">{tag}</Badge>
                          ))}
                        </span>
                      </button>
                      {flag.configurable && isFlagSelected(flag.id) ? (
                        <label className="flex items-center gap-2 px-4 pb-4 text-sm">
                          <span className="text-muted-foreground">Value</span>
                          <Input
                            className="h-8 max-w-40"
                            value={getSelectedFlagValue(flag)}
                            onChange={(event) => handleFlagValueChange(flag, event.target.value)}
                            inputMode="numeric"
                            min={flag.configurable.min}
                            max={flag.configurable.max}
                            step={flag.configurable.step}
                            type="number"
                            aria-label={`${flag.name} value`}
                          />
                          {flag.configurable.unit ? <span className="text-muted-foreground">{flag.configurable.unit}</span> : null}
                        </label>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
              {visibleFlags.length === 0 ? (
                <p className="rounded-lg border-dashed p-6 text-center text-sm text-muted-foreground">No flags found.</p>
              ) : null}
              {visibleFlags.length > 0 ? (
                <div className="grid gap-3 border-t pt-4 text-sm text-muted-foreground sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                  <span>
                    Showing {(currentFlagPage - 1) * flagsPerPage + 1}-{Math.min(currentFlagPage * flagsPerPage, visibleFlags.length)} of {visibleFlags.length} flags
                  </span>
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => setFlagPage((page) => Math.max(1, page - 1))}
                      disabled={currentFlagPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="min-w-20 text-center">
                      {currentFlagPage} / {totalFlagPages}
                    </span>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => setFlagPage((page) => Math.min(totalFlagPages, page + 1))}
                      disabled={currentFlagPage === totalFlagPages}
                    >
                      Next
                    </Button>
                  </div>
                  <div className="flex justify-start sm:justify-end">
                    <Button className="text-foreground" variant="outline">Submit flags</Button>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
          <Card className="min-w-0">
            <CardHeader>
              <CardTitle>Result</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="relative min-w-0 overflow-hidden rounded-lg border bg-muted">
                <div className="group absolute right-3 top-3 z-10 flex items-center">
                  <span className="pointer-events-none mr-2 hidden rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground shadow-sm group-hover:block">
                    Copy
                  </span>
                  <Button size="icon" variant="secondary" aria-label="Copy code">
                    <FaCopy className="size-4" aria-hidden="true" />
                  </Button>
                </div>
                <textarea
                  className="w-full resize-none bg-transparent p-4 pr-24 text-sm text-foreground outline-none"
                  value={generatedCommand.content}
                  aria-label="Output result"
                  rows={resultRows}
                  spellCheck={false}
                  readOnly
                />
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                <Button>Download</Button>
                <Button variant="outline">Submit your flag set</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}

export { AppShell }
