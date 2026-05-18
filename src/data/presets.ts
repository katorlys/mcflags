import type { Preset } from './types'

const aikarFlagIds = [
  "always-pre-touch",
  "disable-explicit-gc",
  "parallel-ref-proc-enabled",
  "perf-disable-shared-mem",
  "unlock-experimental-vm-options",
  "use-g1gc",
  "g1-heap-region-size-8m",
  "g1-heap-waste-percent-5",
  "g1-max-new-size-percent-40",
  "g1-mixed-gc-count-target-4",
  "g1-mixed-gc-live-threshold-percent-90",
  "g1-new-size-percent-30",
  "g1-rset-updating-pause-time-percent-5",
  "g1-reserve-percent-20",
  "initiating-heap-occupancy-percent-15",
  "max-gc-pause-millis-200",
  "max-tenuring-threshold-1",
  "survivor-ratio-32",
  "using-aikars-flags",
  "aikars-new-flags",
]

const commonFlagIds = [
  "always-pre-touch",
  "disable-explicit-gc",
  "use-g1gc",
  "unlock-experimental-vm-options",
  "max-gc-pause-millis-45",
  "target-survivor-ratio-90",
  "g1-new-size-percent-50",
  "g1-max-new-size-percent-80",
  "initiating-heap-occupancy-percent-10",
  "g1-mixed-gc-live-threshold-percent-50",
  "fml-query-result-confirm",
]

const proxyFlagIds = [
  "use-g1gc",
  "g1-heap-region-size-4m",
  "unlock-experimental-vm-options",
  "parallel-ref-proc-enabled",
  "always-pre-touch",
  "max-inline-level-15",

]

const presets = [
  {
    id: "custom",
    name: "Custom",
    description: " ",
    flagIds: [],
    coreTags: [],
  },
  {
    id: "aikars",
    name: "Aikar's",
    description: "A set of JVM flags designed to improve server performance.",
    flagIds: aikarFlagIds,
    coreTags: ["bukkit", "spigot", "paper"],
  },
  {
    id: "common",
    name: "Common",
    description: "Another set of flags suitable for most Bukkit/Spigot/Paper servers.",
    flagIds: commonFlagIds,
    coreTags: ["bukkit", "spigot", "paper"],
  },
  {
    id: "waterfall-velocity",
    name: "Waterfall/Velocity",
    description: "Official Velocity flags that tunes the G1 garbage collector for Velocity's workload.",
    flagIds: proxyFlagIds,
    coreTags: ["waterfall", "velocity"],
  },
] satisfies Preset[]

export { presets }
