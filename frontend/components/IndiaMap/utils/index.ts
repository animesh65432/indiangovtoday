import { STATES_CODES } from "@/lib/translatetext";
import { categoryStyles } from "@/lib/categoryStyles"
import L from "leaflet";
import { formatDateInLanguage } from "@/lib/formatDate"

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

export function getStateColor(count: number, isSelected: boolean, theme: string): string {
    return "transparent";
}

export function getStateBorder(count: number, isSelected: boolean, theme: string): string {
    if (isSelected) return "#4a4a4a";
    return "#C9C3B5";
}

export function getStateWeight(isSelected: boolean): number {
    return isSelected ? 2 : 1;
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


export function makeStateDot(count: number, theme: string): L.DivIcon {
    const size = Math.min(8 + count * 1.5, 32); // scale dot by count, cap at 32px
    const color = count > 20 ? "#e63946" : count > 10 ? "#f4a261" : "#2a9d8f";
    return L.divIcon({
        className: "",
        html: `<div style="
            width:${size}px; height:${size}px;
            background:${color};
            border-radius:50%;
            border:2px solid ${theme === "dark" ? "#222" : "#fff"};
            box-shadow:0 1px 4px rgba(0,0,0,0.3);
            opacity:0.85;
        "></div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
    });
}

export const getTranslatedStateName = (
    englishName: string,
    language: string
): string => {
    const stateEntry = STATES_CODES[englishName];
    if (!stateEntry) return englishName;
    return stateEntry[language] ?? stateEntry["English"] ?? englishName;
};


export const checkIfStateSelected = (state: string, selectedStates: string[]): boolean => {
    const normalizedState = normalizeGeoName(state);
    return selectedStates.some(selected => normalizeGeoName(selected) === normalizedState);
}

export function injectMapStyles() {
    if (typeof document === "undefined") return;
    if (document.getElementById("dark-map-styles")) return;
    const el = document.createElement("style");
    el.id = "dark-map-styles";
    document.head.appendChild(el);
}

function makePieSlices(cats: { category: string; count: number }[], r: number, cx: number, cy: number, isDark: boolean): string {
    const total = cats.reduce((s, c) => s + c.count, 0);
    if (total === 0) return "";

    let startAngle = -Math.PI / 2; // 12 o'clock
    const slices: string[] = [];

    cats.forEach((c) => {
        const slice = (c.count / total) * 2 * Math.PI;
        const endAngle = startAngle + slice;

        const x1 = cx + r * Math.cos(startAngle);
        const y1 = cy + r * Math.sin(startAngle);
        const x2 = cx + r * Math.cos(endAngle);
        const y2 = cy + r * Math.sin(endAngle);
        const largeArc = slice > Math.PI ? 1 : 0;

        const color = categoryStyles[c.category]?.dot ?? "#78716C";

        slices.push(`
            <path
                d="M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2} Z"
                fill="${color}"
                opacity="0.9"
                stroke="${isDark ? "#1a1a1a" : "#ffffff"}"
                stroke-width="1"
            >
                <title>${c.category}: ${c.count}</title>
            </path>
        `);

        startAngle = endAngle;
    });

    return slices.join("");
}

export function makeNameLabel(name: string, isDark: boolean, zoom: number): L.DivIcon {

    const fontSize = zoom >= 7 ? 13 : zoom >= 6 ? 11 : 9;
    const opacity = zoom >= 7 ? 1 : zoom >= 6 ? 0.85 : 0.7;
    const visible = zoom >= 5 && zoom <= 8;

    return L.divIcon({
        className: "",
        html: `<span style="
            display: ${visible ? "inline" : "none"};
            white-space: nowrap;
            font-size: ${fontSize}px;
            font-weight: 700;
            opacity: ${opacity};
            letter-spacing: 0.05em;
            text-transform: uppercase;
            color: ${isDark ? "#f0f0f0" : "#1a1a1a"};
            text-shadow:
                -1px -1px 0 ${isDark ? "#000" : "#fff"},
                 1px -1px 0 ${isDark ? "#000" : "#fff"},
                -1px  1px 0 ${isDark ? "#000" : "#fff"},
                 1px  1px 0 ${isDark ? "#000" : "#fff"};
            pointer-events: none;
        ">${name}</span>`,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
    });
}
export const MapStyle = {
    light: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png",
    dark: "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
};

export const GetHoverContent = (
    announcements: { id: string, title: string; date: string; }[],
    color: string,
    count: number,
    theme?: string,
    language?: string,
) => {
    if (announcements.length === 0) return "";

    const top3 = announcements.slice(0, 3);
    const remaining = count - 3;

    const items = top3.map(a => `
        <div class="top-tooltip-item" onclick="window.open('announcement?id=${a.id}&lan=${language}', '_self')" style="cursor:pointer;">
            <div class="top-tooltip-item-title">${a.title}</div>
            <div class="top-tooltip-item-date">${formatDateInLanguage(a.date, language ?? "English")}</div>
        </div>
    `).join("");

    const footer = remaining > 0
        ? `<div class="tool-tip-footer">
               + ${remaining} more · <span style="color:${color};cursor:pointer;" >browse all →</span>
           </div>`
        : "";

    return `<div class="tool-bar-container">${items}${footer}</div>`;
};

export const GetSingleAnnouncementContent = (
    announcement: { id: string; title: string; date: string },
    color: string,
    theme?: string,
    language?: string,
): string => `
    <div class="tool-bar-container">
        <div
            class="top-tooltip-item"
            onclick="window.open('announcement?id=${announcement.id}&lan=${language}', '_self')"
            style="cursor:pointer;"
        >
            <div class="top-tooltip-item-title">${announcement.title}</div>
            <div class="top-tooltip-item-date">
                ${formatDateInLanguage(announcement.date, language ?? "English")}
            </div>
        </div>
    </div>`;