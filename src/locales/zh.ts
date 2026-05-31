const zh = {
  language: {
    name: "简体中文",
  },
  app: {
    title: "生成 Minecraft 服务器 JVM 启动参数",
  },
  nav: {
    theme: "当前主题: {{theme}}. 切换到 {{nextTheme}}",
    language: "切换语言",
    github: "在 GitHub 上给我们星标",
    home: "MCFlags 首页",
    lab: "Katorly Lab",
    tools: "站点工具",
  },
  basic: {
    title: "基础",
    jarName: "服务端核心 .jar 名称",
    memory: "内存",
    maxMemory: "最大可调内存范围 (GB)",
    presets: "预设参数",
    selectPreset: "选择预设",
    platform: "平台",
    selectPlatform: "选择平台",
  },
  options: {
    title: "选项",
    gui: {
      name: "GUI",
      description: "启动服务端自带的原版控制面板，仅桌面环境可用。",
    },
    noJline: {
      name: "禁用 JLine",
      description: "禁用 Bukkit 的 JLine 控制台，仅 Windows 平台可用。",
    },
    pressRestart: {
      name: "按下重启",
      description: "服务器关闭后，按任意键重启服务器。",
    },
    autoRestart: {
      name: "自动重启",
      description: "服务器关闭后，倒计时结束自动重启服务器。",
    },
  },
  presets: {
    custom: {
      name: "自定义",
      description: "",
    },
    aikars: {
      name: "Aikar's",
      description: "一组用于改善服务器性能的参数集。",
    },
    common: {
      name: "通用",
      description: "另一组适合大多数 Bukkit/Spigot/Paper 服务器的参数集。",
    },
    waterfallVelocity: {
      name: "Waterfall/Velocity",
      description: "Velocity 官方的针对 Velocity 的负载调整 G1 垃圾收集器的参数集。",
    },
  },
  flags: {
    title: "参数",
    description: "可选择多个参数",
    search: "搜索参数",
    sort: "排序",
    filter: "筛选",
    defaultSort: "默认",
    az: "A-Z",
    za: "Z-A",
    cardsView: "以卡片显示参数",
    listView: "以列表显示参数",
    value: "值",
    none: "没有找到参数",
    showing: "显示 {{start}}-{{end}}，共 {{total}} 个参数",
    previous: "上一页",
    next: "下一页",
    submit: "提交参数",
  },
  result: {
    title: "结果",
    copy: "复制",
    copied: "已复制!",
    copyCode: "复制代码",
    output: "输出结果",
    download: "下载",
    submit: "提交你的参数集",
  },
  footer: {
    made: "由 Minecraft 爱好者制作",
  },
}

export { zh }
