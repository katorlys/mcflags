const en = {
  language: {
    name: "English",
  },
  app: {
    title: "Generate Minecraft server JVM startup flags",
  },
  nav: {
    theme: "Theme: {{theme}}. Switch to {{nextTheme}}.",
    language: "Change language",
    github: "Star us on GitHub",
    home: "MCFlags homepage",
    lab: "Katorly Lab",
    tools: "Site tools",
  },
  basic: {
    title: "Basic",
    jarName: "Server core .jar name",
    memory: "Memory",
    maxMemory: "Maximum memory range in GB",
    presets: "Pre-made Flags",
    selectPreset: "Select preset",
    platform: "Platform",
    selectPlatform: "Select platform",
  },
  options: {
    title: "Options",
    gui: {
      name: "GUI",
      description: "Launches a built-in vanilla control panel for the server, which is a desktop-only feature.",
    },
    noJline: {
      name: "No JLine",
      description: "Disables Bukkit's JLine console, which is a Windows-only feature.",
    },
    pressRestart: {
      name: "Press to restart",
      description: "Press any key to restart the server.",
    },
    autoRestart: {
      name: "Auto-restart",
      description: "Automatically restarts the server after a countdown.",
    },
  },
  presets: {
    custom: {
      name: "Custom",
      description: "",
    },
    aikars: {
      name: "Aikar's",
      description: "A set of JVM flags designed to improve server performance.",
    },
    common: {
      name: "Common",
      description: "Another set of flags suitable for most Bukkit/Spigot/Paper servers.",
    },
    waterfallVelocity: {
      name: "Waterfall/Velocity",
      description: "Official Velocity flags that tune the G1 garbage collector for Velocity's workload.",
    },
  },
  flags: {
    title: "Flags",
    description: "You may select multiple flags",
    search: "Search flags",
    sort: "Sort",
    filter: "Filter",
    defaultSort: "Default",
    az: "A-Z",
    za: "Z-A",
    cardsView: "Show flags as cards",
    listView: "Show flags as list",
    value: "Value",
    none: "No flags found.",
    showing: "Showing {{start}}-{{end}} of {{total}} flags",
    previous: "Previous",
    next: "Next",
    submit: "Submit flags",
  },
  result: {
    title: "Result",
    copy: "Copy",
    copied: "Copied!",
    copyCode: "Copy code",
    output: "Output result",
    download: "Download",
    submit: "Submit your flag set",
  },
  footer: {
    made: "Made with ❤ by Minecraft enthusiasts.",
  },
}

export { en }
