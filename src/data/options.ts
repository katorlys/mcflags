import type { LaunchOption } from './types'

const launchOptions = [
  {
    id: "gui",
    name: "GUI",
    description: "Launches a built-in vanilla control panel for the server, which is a desktop-only feature.",
    defaultChecked: false,
  },
  {
    id: "no-jline",
    name: "No JLine",
    description: "Disables Bukkit's JLine console, which is a Windows-only feature.",
    defaultChecked: true,
  },
  {
    id: "press-restart",
    name: "Press to restart",
    description: "Press any key to restart the server.",
    defaultChecked: false,
  },
  {
    id: "auto-restart",
    name: "Auto-restart",
    description: " Automatically restarts the server after a countdown.",
    defaultChecked: false,
  },
] satisfies LaunchOption[]

export { launchOptions }