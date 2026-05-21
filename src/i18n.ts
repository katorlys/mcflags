import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
const languageStorageKey = "mcflags-language"
const supportedLanguages = ["en", "zh"] as const

function getInitialLanguage() {
  if (typeof window === "undefined") {
    return "en"
  }
  const storedLanguage = window.localStorage.getItem(languageStorageKey)
  if (storedLanguage && supportedLanguages.includes(storedLanguage as typeof supportedLanguages[number])) {
    return storedLanguage
  }
  const browserLanguage = window.navigator.language.toLowerCase()
  if (browserLanguage.startsWith("zh")) {
    return "zh"
  }
  return "en"
}

const resources = {
  en: {
    translation: {
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
    },
  },
  zh: {
    translation: {
      language: {
        name: "简体中文",
      },
      app: {
        title: "生成 Minecraft 服务器 JVM 启动参数",
      },
      nav: {
        theme: "当前主题：{{theme}}。切换到 {{nextTheme}}。",
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
    },
  },
}

i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
})
i18n.on("languageChanged", (language) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(languageStorageKey, language)
  }
})
export { i18n }
