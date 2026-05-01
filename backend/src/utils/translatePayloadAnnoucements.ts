export function PrasePayloadArray(states: string): string[] {
    if (!states) return [];
    try {
        if (Array.isArray(states)) return states;

        const parsed = JSON.parse(states);
        return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
        return states.includes(",")
            ? states.split(",").map(s => s.trim()).filter(Boolean)
            : [states.trim()];
    }
}