import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { flagFilters, flags, launchOptions, platforms, presets } from '@/data'
import { useState } from 'react'
import { FaCopy, FaDocker, FaLinux, FaWindows } from 'react-icons/fa6'

const platformIcons = {
  windows: FaWindows,
  unix: FaLinux,
  'docker-compose': FaDocker,
}

function AppShell() {
  const previewFlags = flags.slice(0, 6)
  const [selectedPresetId, setSelectedPresetId] = useState('custom')
  const selectedPreset = presets.find((preset) => preset.id === selectedPresetId) ?? presets[0]
  const formatMemory = (value: number) => value < 1 ? `${value * 1024}MB` : `${value}GB`
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
              <CardTitle>Server</CardTitle>
            </CardHeader>
            <CardContent className="grid items-start gap-6 md:grid-cols-2">
              <div className="grid content-start gap-2">
                <Label htmlFor="jar-name">Server core .jar name</Label>
                <Input id="jar-name" defaultValue="server.jar" />
              </div>
              <div className="grid gap-2">
                <Label>Memory</Label>
                <div className="pt-4">
                  <Slider defaultValue={[1, 8]} min={0.5} max={32} step={0.5} formatValue={formatMemory} aria-label="Memory range" />
                </div>
                <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                  <span>512MB</span>
                  <label className="flex items-center gap-1.5">
                    <Input
                      className="h-7 w-20 text-xs text-foreground"
                      defaultValue="32"
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
                <Select value={selectedPresetId} onValueChange={setSelectedPresetId}>
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
                <Select defaultValue="windows">
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
                    <Checkbox defaultChecked={option.defaultChecked} />
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
              <div className="grid gap-3 sm:grid-cols-[1fr_180px]">
                <Input placeholder="Search flags" aria-label="Search flags" />
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    {flagFilters.map((filter) => (
                      <SelectItem key={filter.id} value={filter.id}>{filter.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {previewFlags.map((flag) => (
                  <button
                    className="flex flex-col items-start rounded-lg border bg-card p-4 text-left transition-colors hover:bg-accent"
                    key={flag.id}
                    type="button"
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
                  </button>
                ))}
              </div>
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
                  className="min-h-40 w-full resize-y bg-transparent p-4 pr-24 text-sm text-foreground outline-none"
                  defaultValue="java -Xmx8G -Xms1G -jar server.jar --nojline nogui"
                  aria-label="Output result"
                  spellCheck={false}
                />
              </div>
              <div className="flex gap-2">
                <Button>Download</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}

export { AppShell }
