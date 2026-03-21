
import { STATES_CODES } from "@/lib/translatetext";
import L from "leaflet";

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
    "WestBengal": "West Bengal",
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

export const checkIfStateSelected = (state: string, selectedStates: string[]): boolean => {
    const normalizedState = normalizeGeoName(state);
    return selectedStates.some(selected => normalizeGeoName(selected) === normalizedState);
}

export const DARK_MAP_STYLE = `
.leaflet-top.leaflet-left { left: 10px !important; top: 10px !important; }
.leaflet-control-zoom .leaflet-bar { border: 1px solid #FF9933 !important; border-radius: 6px !important; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.6) !important; }
.leaflet-control-zoom a { background: #1A1A1A !important; color: #FF9933 !important; border-bottom: 1px solid #FF9933 !important; width: 26px !important; height: 26px !important; line-height: 26px !important; font-size: 15px !important; display: flex !important; align-items: center !important; justify-content: center !important; transition: background 0.15s; }
.leaflet-control-zoom a:hover { background: #FF9933 !important; color: #000 !important; }
.leaflet-control-zoom a:last-child { border-bottom: none !important; }
.leaflet-control-attribution { display: none !important; }
.state-label { background: transparent !important; border: none !important; box-shadow: none !important; pointer-events: none !important; }
.state-label-inner { display: flex; flex-direction: column; align-items: center; gap: 1px; transform: translate(-50%, -50%); white-space: nowrap; }
.state-label-name { font-size: 8px; font-weight: 700; color: #fff; letter-spacing: 0.03em; text-shadow: 0 1px 3px rgba(0,0,0,0.9), 0 0 6px rgba(0,0,0,0.8); line-height: 1.1; text-transform: uppercase; }
.state-label-count { font-size: 9px; font-weight: 800; color: #FF9933; background: rgba(0,0,0,0.55); border: 1px solid #FF9933; border-radius: 10px; padding: 0px 5px; line-height: 1.5; }
.govtrack-tooltip { background: #1A1A1A !important; border: 1px solid #FF9933 !important; border-radius: 8px !important; box-shadow: 0 2px 12px rgba(0,0,0,0.6) !important; padding: 6px 10px !important; color: white !important; font-size: 12px !important; pointer-events: none !important; }
.govtrack-tooltip::before { display: none !important; }
`;

export function injectMapStyles() {
    if (typeof document === "undefined") return;
    if (document.getElementById("dark-map-styles")) return;
    const el = document.createElement("style");
    el.id = "dark-map-styles";
    el.textContent = DARK_MAP_STYLE;
    document.head.appendChild(el);
}

export function makeStateLabel(name: string, count: number): L.DivIcon {
    const countHtml = count > 0 ? `<div class="state-label-count">${count}</div>` : "";
    return L.divIcon({
        className: "state-label",
        html: `<div class="state-label-inner"><div class="state-label-name">${name}</div>${countHtml}</div>`,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
    });
}