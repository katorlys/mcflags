import type { Platform } from './types'

const platforms = [
  {
    id: "windows",
    name: "Windows",
    downloadFileName: "start.bat",
    downloadFormat: "bat",
  },
  {
    id: "unix",
    name: "Linux/macOS",
    downloadFileName: "start.sh",
    downloadFormat: "sh",
  },
  {
    id: "docker-compose",
    name: "Docker Compose",
    downloadFileName: "docker-compose.yml",
    downloadFormat: "yml",
  },
] satisfies Platform[]

export { platforms }
