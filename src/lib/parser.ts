import type { Flag, PresetFlag } from '@/data'

type ParsedCommand = {
  jarName?: string
  minMemory?: number
  maxMemory?: number
  selectedFlags: PresetFlag[]
  noJline: boolean
  nogui: boolean
}

const parseMemory = (value: string) => {
  const match = value.match(/^-Xm[sx](\d+)([mMgG])$/)
  if (!match) return null
  const amount = Number(match[1])
  const unit = match[2].toLowerCase()
  return unit === "m" ? amount / 1024 : amount
}

const findFlagFromToken = (token: string, flags: Flag[]): PresetFlag | null => {
  for (const flag of flags) {
    if (!flag.configurable && flag.value === token) {
      return { id: flag.id }
    }
    if (flag.configurable) {
      const [prefix, suffix = ""] = flag.configurable.valueTemplate.split("{value}")
      if (token.startsWith(prefix) && token.endsWith(suffix)) {
        return { id: flag.id, value: token.slice(prefix.length, token.length - suffix.length) }
      }
    }
  }
  return null
}

const findJavaTokens = (content: string) => {
  const javaLine = content.split("\n").map((line) => line.trim()).find((line) => line.startsWith("java "))
  if (javaLine) {
    return javaLine.match(/"[^"]*"|"[^"]*"|\S+/g)?.map((token) => token.slice(0, 1) === '"' && token.slice(-1) === '"' ? token.slice(1, -1) : token) ?? []
  }
  const commandLine = content.split("\n").map((line) => line.trim()).find((line) => line.startsWith("command:"))
  const commandValue = commandLine?.replace(/^command:\s*/, "")
  if (!commandValue) return []
  try {
    const parsedCommand = JSON.parse(commandValue.replace(/"/g, '"'))
    if (Array.isArray(parsedCommand) && parsedCommand[0] === "java") {
      return parsedCommand.map(String)
    }
  } catch {
    return []
  }
  return []
}

const parseJavaCommand = (content: string, flags: Flag[]): ParsedCommand | null => {
  const tokens = findJavaTokens(content)
  if (tokens.length === 0) return null
  const selectedFlags: PresetFlag[] = []
  const parsed: ParsedCommand = {
    selectedFlags,
    noJline: tokens.includes("--nojline"),
    nogui: tokens.includes("nogui"),
  }
  tokens.forEach((token, index) => {
    if (token.startsWith("-Xms")) {
      const memory = parseMemory(token)
      if (memory !== null) parsed.minMemory = memory
    }
    if (token.startsWith("-Xmx")) {
      const memory = parseMemory(token)
      if (memory !== null) parsed.maxMemory = memory
    }
    if (token === "-jar" && tokens[index + 1]) {
      parsed.jarName = tokens[index + 1]
    }
    const parsedFlag = findFlagFromToken(token, flags)
    if (parsedFlag && !selectedFlags.some((flag) => flag.id === parsedFlag.id)) {
      selectedFlags.push(parsedFlag)
    }
  })
  return parsed
}

export { parseJavaCommand }
export type { ParsedCommand }
