import { flags, presets } from '@/data'
import type { Flag, PresetFlag, PresetId } from '@/data'
import { useState } from 'react'

function useFlagSelection() {
  const customPreset = presets[0]
  const [selectedPresetId, setSelectedPresetId] = useState<PresetId>("custom")
  const [selectedFlags, setSelectedFlags] = useState<PresetFlag[]>(customPreset.flags)
  const handlePresetChange = (presetId: string) => {
    const preset = presets.find((item) => item.id === presetId) ?? customPreset
    setSelectedPresetId(preset.id)
    setSelectedFlags(preset.flags)
  }
  const handleFlagToggle = (flagId: string) => {
    setSelectedPresetId("custom")
    setSelectedFlags((currentFlags) => {
      if (currentFlags.some((flag) => flag.id === flagId)) {
        return currentFlags.filter((flag) => flag.id !== flagId)
      }
      const flag = flags.find((item) => item.id === flagId)
      return [...currentFlags, { id: flagId, value: flag?.configurable?.defaultValue }]
    })
  }
  const handleFlagValueChange = (flag: Flag, value: string) => {
    setSelectedPresetId("custom")
    setSelectedFlags((currentFlags) => currentFlags.map((selectedFlag) => selectedFlag.id === flag.id ? { ...selectedFlag, value } : selectedFlag))
  }

  return {
    selectedPresetId,
    selectedFlags,
    setSelectedPresetId,
    setSelectedFlags,
    handlePresetChange,
    handleFlagToggle,
    handleFlagValueChange,
  }
}

export { useFlagSelection }
