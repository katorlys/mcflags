import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { flagFilters } from '@/data'
import type { FilterId, Flag, PresetFlag } from '@/data'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaArrowDownAZ, FaFilter, FaGrip, FaList, FaMagnifyingGlass } from 'react-icons/fa6'

const FLAGS_PER_PAGE = 9
const SUBMIT_FLAG_URL = "https://github.com/katorlys/mcflags/issues/new?template=1-submit-flag.yml"

type FlagSort = "default" | "az" | "za"
type FlagView = "cards" | "list"

type FlagsPanelProps = {
  flags: Flag[]
  selectedFlags: PresetFlag[]
  onFlagToggle: (flagId: string) => void
  onFlagValueChange: (flag: Flag, value: string) => void
}

function FlagsPanel({ flags, selectedFlags, onFlagToggle, onFlagValueChange }: FlagsPanelProps) {
  const { t } = useTranslation()
  const [flagSearch, setFlagSearch] = useState("")
  const [selectedFilterId, setSelectedFilterId] = useState<FilterId>("all")
  const [flagSort, setFlagSort] = useState<FlagSort>("default")
  const [flagView, setFlagView] = useState<FlagView>("cards")
  const [flagPage, setFlagPage] = useState(1)
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
  const totalFlagPages = Math.max(1, Math.ceil(visibleFlags.length / FLAGS_PER_PAGE))
  const currentFlagPage = Math.min(flagPage, totalFlagPages)
  const pagedFlags = visibleFlags.slice((currentFlagPage - 1) * FLAGS_PER_PAGE, currentFlagPage * FLAGS_PER_PAGE)
  const isFlagSelected = (flagId: string) => selectedFlags.some((flag) => flag.id === flagId)
  const getSelectedFlagValue = (flag: Flag) => selectedFlags.find((selectedFlag) => selectedFlag.id === flag.id)?.value ?? flag.configurable?.defaultValue ?? ""
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
  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>{t("flags.title")}</CardTitle>
        <CardDescription>{t("flags.description")}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_160px_180px_auto]">
          <div className="relative">
            <FaMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input className="pl-9" value={flagSearch} onChange={(event) => handleFlagSearchChange(event.target.value)} placeholder={t("flags.search")} aria-label={t("flags.search")} />
          </div>
          <Select value={flagSort} onValueChange={handleFlagSortChange}>
            <SelectTrigger>
              <span className="flex min-w-0 items-center gap-2">
                <FaArrowDownAZ className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <SelectValue placeholder={t("flags.sort")} />
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">{t("flags.defaultSort")}</SelectItem>
              <SelectItem value="az">{t("flags.az")}</SelectItem>
              <SelectItem value="za">{t("flags.za")}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedFilterId} onValueChange={handleFlagFilterChange}>
            <SelectTrigger>
              <span className="flex min-w-0 items-center gap-2">
                <FaFilter className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <SelectValue placeholder={t("flags.filter")} />
              </span>
            </SelectTrigger>
            <SelectContent>
              {flagFilters.map((filter) => (
                <SelectItem key={filter.id} value={filter.id}>{filter.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex h-9 w-fit justify-self-end overflow-hidden rounded-md border bg-background sm:justify-self-auto" role="group" aria-label="Flag view mode">
            <Button className="h-full w-10 rounded-none p-0" type="button" size="icon" variant={flagView === "cards" ? "secondary" : "ghost"} onClick={() => setFlagView("cards")} aria-label={t("flags.cardsView")} aria-pressed={flagView === "cards"}>
              <FaGrip className="size-4" aria-hidden="true" />
            </Button>
            <Button className="h-full w-10 rounded-none p-0" type="button" size="icon" variant={flagView === "list" ? "secondary" : "ghost"} onClick={() => setFlagView("list")} aria-label={t("flags.listView")} aria-pressed={flagView === "list"}>
              <FaList className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
        {flagView === "cards" ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {pagedFlags.map((flag) => (
              <button className={`flex flex-col items-start rounded-lg border p-4 text-left transition-colors hover:bg-accent ${isFlagSelected(flag.id) ? "border-primary bg-accent" : "bg-card"}`} key={flag.id} onClick={() => onFlagToggle(flag.id)} type="button" aria-pressed={isFlagSelected(flag.id)}>
                <div className="mb-2 grid gap-2">
                  <span className="block truncate font-medium" title={flag.value}>{flag.value}</span>
                  <span className="flex min-h-5 flex-wrap gap-1">
                    {flag.tags.map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{flag.description}</p>
                {flag.configurable && isFlagSelected(flag.id) ? (
                  <label className="mt-4 flex w-full items-center gap-2 text-sm" onClick={(event) => event.stopPropagation()}>
                    <span className="text-muted-foreground">{t("flags.value")}</span>
                    <Input className="h-8" value={getSelectedFlagValue(flag)} onChange={(event) => onFlagValueChange(flag, event.target.value)} inputMode="numeric" min={flag.configurable.min} max={flag.configurable.max} step={flag.configurable.step} type="number" aria-label={`${flag.name} value`} />
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
                <button className="grid w-full gap-3 p-4 text-left transition-colors hover:bg-accent md:grid-cols-[minmax(0,1fr)_auto] md:items-center" onClick={() => onFlagToggle(flag.id)} type="button" aria-pressed={isFlagSelected(flag.id)}>
                  <span className="grid min-w-0 gap-1">
                    <span className="truncate font-medium" title={flag.value}>{flag.value}</span>
                    <span className="text-sm text-muted-foreground">{flag.description}</span>
                  </span>
                  <span className="flex flex-wrap gap-1 md:justify-end">
                    {flag.tags.map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}
                  </span>
                </button>
                {flag.configurable && isFlagSelected(flag.id) ? (
                  <label className="flex items-center gap-2 px-4 pb-4 text-sm">
                    <span className="text-muted-foreground">{t("flags.value")}</span>
                    <Input className="h-8 max-w-40" value={getSelectedFlagValue(flag)} onChange={(event) => onFlagValueChange(flag, event.target.value)} inputMode="numeric" min={flag.configurable.min} max={flag.configurable.max} step={flag.configurable.step} type="number" aria-label={`${flag.name} value`} />
                    {flag.configurable.unit ? <span className="text-muted-foreground">{flag.configurable.unit}</span> : null}
                  </label>
                ) : null}
              </div>
            ))}
          </div>
        )}
        {visibleFlags.length === 0 ? <p className="rounded-lg border-dashed p-6 text-center text-sm text-muted-foreground">{t("flags.none")}</p> : null}
        {visibleFlags.length > 0 ? (
          <div className="grid gap-3 border-t pt-4 text-sm text-muted-foreground sm:grid-cols-[1fr_auto_1fr] sm:items-center">
            <span>{t("flags.showing", { start: (currentFlagPage - 1) * FLAGS_PER_PAGE + 1, end: Math.min(currentFlagPage * FLAGS_PER_PAGE, visibleFlags.length), total: visibleFlags.length })}</span>
            <div className="flex items-center justify-center gap-2">
              <Button type="button" size="sm" onClick={() => setFlagPage((page) => Math.max(1, page - 1))} disabled={currentFlagPage === 1}>{t("flags.previous")}</Button>
              <span className="min-w-20 text-center">{currentFlagPage} / {totalFlagPages}</span>
              <Button type="button" size="sm" onClick={() => setFlagPage((page) => Math.min(totalFlagPages, page + 1))} disabled={currentFlagPage === totalFlagPages}>{t("flags.next")}</Button>
            </div>
            <div className="flex justify-start sm:justify-end">
              <Button className="text-foreground" variant="outline" asChild>
                <a href={SUBMIT_FLAG_URL} target="_blank" rel="noreferrer">{t("flags.submit")}</a>
              </Button>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

export { FlagsPanel }
