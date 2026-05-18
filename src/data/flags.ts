import type { Flag } from './types'

const flags = [
  {
    id: "always-pre-touch",
    value: "-XX:+AlwaysPreTouch",
    name: "AlwaysPreTouch",
    description: "Enables touching of every page on the Java heap during JVM initialization.",
    category: "memory",
    tags: ["recommended"],
  },
] satisfies Flag[]

export { flags }
