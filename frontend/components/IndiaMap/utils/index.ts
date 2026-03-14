
import { STATES_CODES } from "@/lib/translatetext";

const GEO_NAME_MAP: Record<string, string> = {
    "Andaman and Nicobar": "Andaman and Nicobar Islands",
    "Andaman & Nicobar": "Andaman and Nicobar Islands",
    "Andaman & Nicobar Islands": "Andaman and Nicobar Islands",
    "Daman and Diu": "Dadra and Nagar Haveli and Daman and Diu",
    "Dadra and Nagar Haveli": "Dadra and Nagar Haveli and Daman and Diu",
    "Dadra and Nagar Haveli and Daman and Diu": "Dadra and Nagar Haveli and Daman and Diu",
    "Pondicherry": "Puducherry",
    "Orissa": "Odisha",
    "Uttaranchal": "Uttarakhand",
    "Jammu & Kashmir": "Jammu and Kashmir",
    "NCT of Delhi": "Delhi",
    "Delhi": "Delhi",
};

export function normalizeGeoName(name: string): string {
    if (!name) return name;
    return GEO_NAME_MAP[name] || name;
}

export function getStateColor(count: number, isSelected: boolean): string {
    if (isSelected) return "#FEF08A";
    if (count === 0) return "#E8E4DA";
    if (count === 1) return "#FDE68A";
    if (count === 2) return "#FBBF24";
    return "#F59E0B";
}

export function getStateBorder(count: number, isSelected: boolean): string {
    if (isSelected) return "#D97706";
    if (count === 0) return "#C9C3B5";
    return "#D97706";
}

export function getStateWeight(isSelected: boolean): number {
    return isSelected ? 3 : 1;
}

export function getStateFillOpacity(count: number, isSelected: boolean): number {
    if (isSelected) return 1;
    return count > 0 ? 0.85 : 0.65;
}

export const UNION_TERRITORIES = [
    "Puducherry",
    "Chandigarh",
    "Lakshadweep",
    "Andaman and Nicobar Islands",
    "Dadra and Nagar Haveli and Daman and Diu",
];


export const getTranslatedStateName = (
    englishName: string,
    language: string
): string => {
    const stateEntry = STATES_CODES[englishName];
    if (!stateEntry) return englishName;
    return stateEntry[language] ?? stateEntry["English"] ?? englishName;
};

export const getTooltipHTML = (
    name: string,
    count: number,
    language: string
): string => {
    const displayName = getTranslatedStateName(name, language);
    const hasCounts = count > 0;
    const countLabel = hasCounts
        ? `${count} announcement${count !== 1 ? "s" : ""}`
        : "No announcements";

    return `<div style="font-family:'Inter',-apple-system,sans-serif;min-width:155px;color:#141414;">
<span style="font-size:13px;font-weight:700;line-height:1.45;letter-spacing:-0.01em;color:#141414;margin-bottom:4px;">${displayName}</span>
<div style="font-size:13px;font-weight:700;color:#AAA;letter-spacing:0.08em; ${hasCounts ? "text-gray-500" : "text-red-500"}">${countLabel}</div>
<div style="font-size:12px;font-weight:700;color:#AAA;letter-spacing:0.08em;">${hasCounts ? "Click to filter" : "Click to select"}</div>
</div>`;
};