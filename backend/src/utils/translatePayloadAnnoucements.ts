export function PrasePayloadAnnouncements(states: string) {
    let selectedStates: string[] = [];

    if (typeof states === 'string') {
        try {
            const parsed = JSON.parse(states);
            selectedStates = Array.isArray(parsed) ? parsed : [states];
        } catch {
            selectedStates = [states];
        }
    } else if (Array.isArray(states)) {
        selectedStates = states as string[];
    }

    return selectedStates;
}

