import type { Preset } from './types'

const aikarFlags = [
  { id: "always-pre-touch" },
  { id: "disable-explicit-gc" },
  { id: "parallel-ref-proc-enabled" },
  { id: "perf-disable-shared-mem" },
  { id: "unlock-experimental-vm-options" },
  { id: "use-g1gc" },
  { id: "g1-heap-region-size", value: 8 },
  { id: "g1-heap-waste-percent", value: 5 },
  { id: "g1-max-new-size-percent", value: 40 },
  { id: "g1-mixed-gc-count-target", value: 4 },
  { id: "g1-mixed-gc-live-threshold-percent", value: 90 },
  { id: "g1-new-size-percent", value: 30 },
  { id: "g1-rset-updating-pause-time-percent", value: 5 },
  { id: "g1-reserve-percent", value: 20 },
  { id: "initiating-heap-occupancy-percent", value: 15 },
  { id: "max-gc-pause-millis", value: 200 },
  { id: "max-tenuring-threshold", value: 1 },
  { id: "survivor-ratio", value: 32 },
  { id: "using-aikars-flags" },
  { id: "aikars-new-flags" },
]

const commonFlags = [
  { id: "always-pre-touch" },
  { id: "disable-explicit-gc" },
  { id: "use-g1gc" },
  { id: "unlock-experimental-vm-options" },
  { id: "max-gc-pause-millis", value: 45 },
  { id: "target-survivor-ratio", value: 90 },
  { id: "g1-new-size-percent", value: 50 },
  { id: "g1-max-new-size-percent", value: 80 },
  { id: "initiating-heap-occupancy-percent", value: 10 },
  { id: "g1-mixed-gc-live-threshold-percent", value: 50 },
  { id: "fml-query-result-confirm" },
]

const proxyFlags = [
  { id: "use-g1gc" },
  { id: "g1-heap-region-size", value: 4 },
  { id: "unlock-experimental-vm-options" },
  { id: "parallel-ref-proc-enabled" },
  { id: "always-pre-touch" },
  { id: "max-inline-level", value: 15 },

]

const presets = [
  {
    id: "custom",
    name: "Custom",
    description: " ",
    flags: [],
    coreTags: [],
  },
  {
    id: "aikars",
    name: "Aikar's",
    description: "A set of JVM flags designed to improve server performance.",
    flags: aikarFlags,
    coreTags: ["bukkit", "spigot", "paper"],
  },
  {
    id: "common",
    name: "Common",
    description: "Another set of flags suitable for most Bukkit/Spigot/Paper servers.",
    flags: commonFlags,
    coreTags: ["bukkit", "spigot", "paper"],
  },
  {
    id: "waterfall-velocity",
    name: "Waterfall/Velocity",
    description: "Official Velocity flags that tunes the G1 garbage collector for Velocity's workload.",
    flags: proxyFlags,
    coreTags: ["waterfall", "velocity"],
  },
] satisfies Preset[]

export { presets }
