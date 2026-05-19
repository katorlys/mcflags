import type { Flag, PlatformId, PresetFlag, RestartMode } from '@/data'

type MemorySize = {
  minGb: number
  maxGb: number
}

type GenerateCommandInput = {
  platformId: PlatformId
  jarName: string
  memory: MemorySize
  selectedFlags: PresetFlag[]
  availableFlags: Flag[]
  noJline: boolean
  nogui: boolean
  restartMode: RestartMode
}

type GeneratedCommand = {
  content: string
  fileName: string
}

const formatMemory = (value: number) => {
  if (value < 1 || !Number.isInteger(value)) {
    return `${Math.round(value * 1024)}M`
  }
  return `${value}G`
}

const applyFlagValue = (presetFlag: PresetFlag, flag: Flag) => {
  if (!flag.configurable) {
    return flag.value
  }
  const value = presetFlag.value ?? flag.configurable.defaultValue
  return flag.configurable.valueTemplate.replace("{value}", String(value))
}

const buildJavaCommand = ({ jarName, memory, selectedFlags, availableFlags, noJline, nogui }: GenerateCommandInput) => {
  const flagById = new Map(availableFlags.map((flag) => [flag.id, flag]))
  const resolvedFlags = selectedFlags
    .map((presetFlag) => {
      const flag = flagById.get(presetFlag.id)
      return flag ? applyFlagValue(presetFlag, flag) : null
    })
    .filter((value): value is string => Boolean(value))
  return [
    "java",
    `-Xms${formatMemory(memory.minGb)}`,
    `-Xmx${formatMemory(memory.maxGb)}`,
    ...resolvedFlags,
    "-jar",
    jarName,
    noJline ? "--nojline" : null,
    nogui ? "nogui" : null,
  ]
    .filter((part): part is string => Boolean(part))
    .join(" ")
}

const buildWindowsScript = (javaCommand: string, restartMode: RestartMode) => {
  const lines = restartMode === "none" ? ["@echo OFF", "", javaCommand] : ["@echo OFF", ":restart", "", javaCommand]
  if (restartMode === "press") {
    lines.push(
      "",
      "echo Server closed.",
      "color f",
      "echo Press any key to restart!",
      "color f",
      "pause",
      "goto restart",
    )
  }
  if (restartMode === "auto") {
    lines.push(
      "",
      "echo Server closed.",
      "echo Restarting in 3 seconds...",
      "color f",
      "ping -n 2 -w 500 0.0.0.1>nul",
      "echo Restarting in 2 seconds...",
      "ping -n 2 -w 500 0.0.0.1>nul",
      "echo Restarting in 1 seconds...",
      "ping -n 2 -w 500 0.0.0.1>nul",
      "goto restart",
    )
  }
  return lines.join("\n")
}

const buildUnixScript = (javaCommand: string, restartMode: RestartMode) => {
  if (restartMode === "none") {
    return ["#!/bin/bash", "", javaCommand].join("\n")
  }
  const lines = ["#!/bin/bash", "", "while true; do", "", `  ${javaCommand}`]
  if (restartMode === "press") {
    lines.push('', '  echo "Server closed."', '  read -n 1 -s -r -p "Press any key to restart!"', '  echo')
  }
  if (restartMode === "auto") {
    lines.push('', '  echo "Server closed."', '  echo "Restarting in 3 seconds..."', '  sleep 3')
  }
  lines.push("done")
  return lines.join("\n")
}

const buildDockerCompose = (javaCommand: string) => {
  return [
    "services:",
    "  minecraft:",
    "    image: eclipse-temurin:21-jdk",
    "    container_name: minecraft-server",
    "    working_dir: /data",
    "    stdin_open: true",
    "    tty: true",
    "    ports:",
    "      - '25565:25565'",
    "    volumes:",
    "      - ./server:/data",
    `    command: ${JSON.stringify(javaCommand.split(" "))}`,
    "    restart: unless-stopped",
    "    stop_grace_period: 2m30s",
  ].join("\n")
}

const generateCommand = (input: GenerateCommandInput): GeneratedCommand => {
  const javaCommand = buildJavaCommand(input)
  if (input.platformId === "windows") {
    return {
      content: buildWindowsScript(javaCommand, input.restartMode),
      fileName: "start.bat",
    }
  }
  if (input.platformId === "docker-compose") {
    return {
      content: buildDockerCompose(javaCommand),
      fileName: "docker-compose.yml",
    }
  }
  return {
    content: buildUnixScript(javaCommand, input.restartMode),
    fileName: "start.sh",
  }
}

export { buildJavaCommand, generateCommand }
export type { GeneratedCommand, GenerateCommandInput, MemorySize }
