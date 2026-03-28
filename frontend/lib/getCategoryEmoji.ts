export const getCategoryEmoji = (category: string) => {
    const cat = category?.toLowerCase() || ''
    if (cat.includes("health")) return "🏥"
    if (cat.includes("education")) return "🎓"
    if (cat.includes("finance")) return "💰"
    if (cat.includes("agriculture")) return "🌾"
    if (cat.includes("transport")) return "🚌"
    if (cat.includes("defence")) return "🛡️"
    if (cat.includes("law")) return "⚖️"
    return "🏛️"
}