
import type { FlagFilter } from './types'
const flagFilters = [
  { id: "all", name: "flagFilters.all" },
  { id: "recommended", name: "flagFilters.recommended" },
  { id: "runtime", name: "flagFilters.runtime" },
  { id: "gc", name: "flagFilters.gc" },
  { id: "memory", name: "flagFilters.memory" },
  { id: "performance", name: "flagFilters.performance" },
  { id: "diagnostic", name: "flagFilters.diagnostic" },
  { id: "velocity", name: "flagFilters.velocity" },
  { id: "forge", name: "flagFilters.forge" },
] satisfies FlagFilter[]

export { flagFilters }
