
import type { FlagFilter } from './types'
const flagFilters = [
  { id: "all", name: "All" },
  { id: "recommended", name: "Recommended" },
  { id: "runtime", name: "Runtime" },
  { id: "gc", name: "Garbage Collection" },
  { id: "memory", name: "Memory" },
  { id: "performance", name: "Performance" },
  { id: "diagnostic", name: "Diagnostic" },
  { id: "velocity", name: "Velocity" },
  { id: "forge", name: "Forge" },
] satisfies FlagFilter[]

export { flagFilters }
