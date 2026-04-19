import { TranslateText } from "../lib/translatetext"

export function timeAgo(dateStr: string, language: string): string {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
    if (diff < 3600) return `${Math.floor(diff / 60)}${TranslateText[language].M_AGO}`
    if (diff < 86400) return `${Math.floor(diff / 3600)}${TranslateText[language].HR_AGO}`
    return `${Math.floor(diff / 86400)}${TranslateText[language].D_AGO}`
}