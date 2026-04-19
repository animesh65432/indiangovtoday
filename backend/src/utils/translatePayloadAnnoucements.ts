export function PrasePayloadArray(states: string) {
    let selectedStates: string[] = [];
    try {
        if (typeof states === "string") {
            const parsed = JSON.parse(states);

            if (Array.isArray(parsed)) {
                selectedStates = parsed;
            } else {
                selectedStates = [parsed];
            }
        } else if (Array.isArray(states)) {
            selectedStates = states;
        }
    } catch (err) {
        console.error("Invalid JSON in states:", states);
        selectedStates = [];
    }

    return selectedStates;
}

