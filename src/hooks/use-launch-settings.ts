import type { PlatformId, RestartMode } from '@/data'
import { useState } from 'react'

function useLaunchSettings() {
  const [jarName, setJarName] = useState("server.jar")
  const [memory, setMemory] = useState([1, 8])
  const [maxMemory, setMaxMemory] = useState(32)
  const [platformId, setPlatformId] = useState<PlatformId>("windows")
  const [gui, setGui] = useState(false)
  const [noJline, setNoJline] = useState(true)
  const [restartMode, setRestartMode] = useState<RestartMode>("none")
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
    if (optionId === "gui") setGui(checked)
    if (optionId === "no-jline") setNoJline(checked)
    if (optionId === "press-to-restart") setRestartMode(checked ? "press" : "none")
    if (optionId === "auto-restart") setRestartMode(checked ? "auto" : "none")
  }

  return {
    jarName,
    memory,
    maxMemory,
    platformId,
    gui,
    noJline,
    restartMode,
    setJarName,
    setMemory,
    setPlatformId,
    setGui,
    setNoJline,
    handleMaxMemoryChange,
    getLaunchOptionChecked,
    handleLaunchOptionChange,
  }
}

export { useLaunchSettings }
