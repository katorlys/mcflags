import type { LaunchOptionId, PlatformId, RestartMode } from '@/data'
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
  const getLaunchOptionChecked = (optionId: LaunchOptionId) => {
    switch (optionId) {
      case "gui":
        return gui
      case "no-jline":
        return noJline
      case "press-restart":
        return restartMode === "press"
      case "auto-restart":
        return restartMode === "auto"
    }
  }
  const handleLaunchOptionChange = (optionId: LaunchOptionId, checked: boolean) => {
    switch (optionId) {
      case "gui":
        setGui(checked)
        break
      case "no-jline":
        setNoJline(checked)
        break
      case "press-restart":
        setRestartMode(checked ? "press" : "none")
        break
      case "auto-restart":
        setRestartMode(checked ? "auto" : "none")
        break
    }
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
