import type { LaunchOption } from './types'

const launchOptions = [
  {
    id: "gui",
    name: "options.gui.name",
    description: "options.gui.description",
    defaultChecked: false,
  },
  {
    id: "no-jline",
    name: "options.noJline.name",
    description: "options.noJline.description",
    defaultChecked: true,
  },
  {
    id: "press-restart",
    name: "options.pressRestart.name",
    description: "options.pressRestart.description",
    defaultChecked: false,
  },
  {
    id: "auto-restart",
    name: "options.autoRestart.name",
    description: "options.autoRestart.description",
    defaultChecked: false,
  },
] satisfies LaunchOption[]

export { launchOptions }