import React, { useEffect, useRef, useCallback, useContext } from "react";
import L from "leaflet";
import { GetAllCountAnnouncements } from "@/api/announcements";
import "leaflet/dist/leaflet.css";
import { TranslateText } from "@/lib/translatetext";
import { GetStateCode } from "@/lib/GetStateCode";
import { Announcement, ResponseCountAnnouncementTypes, CountAnnouncementTypes } from "@/types";
import {
    getStateColor, getStateFillOpacity, getStateBorder,
    getStateWeight, normalizeGeoName, checkIfStateSelected
} from "./utils";
import { LanguageContext } from "@/context/Lan";
import { Currentdate } from "@/context/Currentdate";

const GEOJSON_URL = "/india_states.geojson";

type Props = {
    ShowIndiaMap: boolean;
    SetShowIndiaMap: React.Dispatch<React.SetStateAction<boolean>>;
    announcements: Announcement[];
    selectedStates: string[];
    onStateClick: (state: string | null) => void;
}

// ── Injected once into <head> ──
const DARK_MAP_STYLE = `
/* Zoom controls */
.leaflet-top.leaflet-left { left: 10px !important; top: 10px !important; }
.leaflet-control-zoom .leaflet-bar { border: 1px solid #FF9933 !important; border-radius: 6px !important; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.6) !important; }
.leaflet-control-zoom a { background: #1A1A1A !important; color: #FF9933 !important; border-bottom: 1px solid #FF9933 !important; width: 26px !important; height: 26px !important; line-height: 26px !important; font-size: 15px !important; display: flex !important; align-items: center !important; justify-content: center !important; transition: background 0.15s; }
.leaflet-control-zoom a:hover { background: #FF9933 !important; color: #000 !important; }
.leaflet-control-zoom a:last-child { border-bottom: none !important; }
/* Hide attribution */
.leaflet-control-attribution { display: none !important; }
/* State label */
.state-label {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  pointer-events: none !important;
}
.state-label-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  transform: translate(-50%, -50%);
  white-space: nowrap;
}
.state-label-name {
  font-size: 8px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.03em;
  text-shadow: 0 1px 3px rgba(0,0,0,0.9), 0 0 6px rgba(0,0,0,0.8);
  line-height: 1.1;
  text-transform: uppercase;
}
.state-label-count {
  font-size: 9px;
  font-weight: 800;
  color: #FF9933;
  background: rgba(0,0,0,0.55);
  border: 1px solid #FF9933;
  border-radius: 10px;
  padding: 0px 5px;
  line-height: 1.5;
  text-shadow: none;
}
/* Tooltip on hover */
.govtrack-tooltip {
  background: #1A1A1A !important;
  border: 1px solid #FF9933 !important;
  border-radius: 8px !important;
  box-shadow: 0 2px 12px rgba(0,0,0,0.6) !important;
  padding: 6px 10px !important;
  color: white !important;
  font-size: 12px !important;
  font-family: sans-serif !important;
  pointer-events: none !important;
}
.govtrack-tooltip::before { display: none !important; }
`;

function injectMapStyles() {
    if (typeof document === "undefined") return;
    if (document.getElementById("dark-map-styles")) return;
    const el = document.createElement("style");
    el.id = "dark-map-styles";
    el.textContent = DARK_MAP_STYLE;
    document.head.appendChild(el);
}

// Build a DivIcon label for a state
function makeStateLabel(name: string, count: number): L.DivIcon {
    const countHtml = count > 0
        ? `<div class="state-label-count">${count}</div>`
        : "";
    return L.divIcon({
        className: "state-label",
        html: `<div class="state-label-inner">
                 <div class="state-label-name">${name}</div>
                 ${countHtml}
               </div>`,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
    });
}

export default function IndiaMap({ ShowIndiaMap, selectedStates, onStateClick }: Props) {
    const { language } = useContext(LanguageContext);
    const { startdate, endDate } = useContext(Currentdate);

    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const geojsonLayerRef = useRef<any>(null);
    const labelLayerRef = useRef<L.LayerGroup | null>(null);
    const countAnnouncementsRef = useRef<CountAnnouncementTypes[]>([]);
    const updateLayerStylesRef = useRef<() => void>(() => { });
    const geoDataRef = useRef<any>(null); // cache geojson

    const selectedStatesRef = useRef<string[]>(selectedStates);
    const getStateCountRef = useRef<(stateCode: string) => number>(() => 0);
    const onStateClickRef = useRef(onStateClick);

    useEffect(() => { selectedStatesRef.current = selectedStates; }, [selectedStates]);
    useEffect(() => { onStateClickRef.current = onStateClick; }, [onStateClick]);

    const getStateCount = useCallback((stateCode: string) => {
        if (!countAnnouncementsRef.current?.length) return 0;
        if (stateCode === TranslateText[language].MULTISELECT_OPTIONS[
            TranslateText[language].MULTISELECT_OPTIONS.length - 1
        ].value) return 0;
        return countAnnouncementsRef.current.find(
            item => item.state.toLowerCase() === stateCode.toLowerCase()
        )?.count ?? 0;
    }, [language]);

    useEffect(() => { getStateCountRef.current = getStateCount; }, [getStateCount]);

    // ── Redraw all permanent labels ──
    const redrawLabels = useCallback(() => {
        const map = mapInstanceRef.current;
        if (!map || !geoDataRef.current) return;

        // clear old labels
        if (labelLayerRef.current) {
            labelLayerRef.current.clearLayers();
        } else {
            labelLayerRef.current = L.layerGroup().addTo(map);
        }

        const geojsonLayer = L.geoJSON(geoDataRef.current);
        geojsonLayer.eachLayer((layer: any) => {
            const rawName = layer.feature?.properties?.NAME_1
                || layer.feature?.properties?.ST_NM
                || layer.feature?.properties?.name || "";
            const name = normalizeGeoName(rawName);
            const stateCode = GetStateCode(name, language);
            const count = getStateCountRef.current(stateCode);

            // centroid of the polygon bounds
            const bounds = (layer as any).getBounds();
            const center = bounds.getCenter();

            const marker = L.marker(center, {
                icon: makeStateLabel(name, count),
                interactive: false,
                zIndexOffset: 500,
            });

            labelLayerRef.current?.addLayer(marker);
        });
    }, [language]);

    const updateLayerStyles = useCallback(() => {
        if (!geojsonLayerRef.current) return;
        geojsonLayerRef.current.eachLayer((layer: any) => {
            const rawName = layer.feature?.properties?.NAME_1
                || layer.feature?.properties?.ST_NM
                || layer.feature?.properties?.name || "";
            const stateCode = GetStateCode(normalizeGeoName(rawName), language);
            const count = getStateCount(stateCode);
            const isSel = checkIfStateSelected(stateCode, selectedStates);
            layer.setStyle({
                fillColor: getStateColor(count, isSel),
                fillOpacity: getStateFillOpacity(count, isSel),
                weight: getStateWeight(isSel),
                color: getStateBorder(count, isSel),
            });
        });
        // also refresh labels so counts stay in sync
        redrawLabels();
    }, [selectedStates, language, getStateCount, redrawLabels]);

    useEffect(() => {
        updateLayerStylesRef.current = updateLayerStyles;
        updateLayerStyles();
    }, [updateLayerStyles]);

    useEffect(() => {
        injectMapStyles();
        if (!mapRef.current || mapInstanceRef.current) return;

        const map = L.map(mapRef.current, {
            center: [20, 82],
            zoom: 3.8,
            zoomControl: false,
            scrollWheelZoom: true,
            attributionControl: false,
            preferCanvas: true,
        });

        // ── Dark tile layer ──
        L.tileLayer(
            "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
            { subdomains: "abcd", maxZoom: 19 }
        ).addTo(map);

        // ── Styled zoom ──
        L.control.zoom({ position: "topleft" }).addTo(map);

        mapInstanceRef.current = map;
        labelLayerRef.current = L.layerGroup().addTo(map);

        fetch(GEOJSON_URL)
            .then(r => r.json())
            .then(data => {
                geoDataRef.current = data; // cache for label redraws

                const geojsonLayer = L.geoJSON(data, {
                    style: (feature: any) => {
                        const rawName = feature?.properties?.NAME_1
                            || feature?.properties?.ST_NM
                            || feature?.properties?.name || "";
                        const stateCode = GetStateCode(normalizeGeoName(rawName), language);
                        const count = getStateCountRef.current(stateCode);
                        const isSel = checkIfStateSelected(stateCode, selectedStatesRef.current);
                        return {
                            fillColor: getStateColor(count, isSel),
                            fillOpacity: getStateFillOpacity(count, isSel),
                            weight: getStateWeight(isSel),
                            color: getStateBorder(count, isSel),
                        };
                    },
                    onEachFeature: (feature: any, layer: any) => {
                        const rawName = feature?.properties?.NAME_1
                            || feature?.properties?.ST_NM
                            || feature?.properties?.name || "";
                        const name = normalizeGeoName(rawName);
                        const stateCode = GetStateCode(name, language);

                        layer.on("mouseover", (e: any) => {
                            const isSel = checkIfStateSelected(stateCode, selectedStatesRef.current);
                            if (!isSel) {
                                layer.setStyle({ fillColor: "#FCD34D", weight: 2, color: "#FF9933" });
                            }
                            layer.bringToFront();
                        });

                        layer.on("mouseout", () => {
                            const liveCount = getStateCountRef.current(stateCode);
                            const isSel = checkIfStateSelected(stateCode, selectedStatesRef.current);
                            layer.setStyle({
                                fillColor: getStateColor(liveCount, isSel),
                                fillOpacity: getStateFillOpacity(liveCount, isSel),
                                weight: getStateWeight(isSel),
                                color: getStateBorder(liveCount, isSel),
                            });
                        });

                        layer.on("click", () => onStateClickRef.current(stateCode));
                    },
                }).addTo(map);

                geojsonLayerRef.current = geojsonLayer;

                // draw initial labels
                redrawLabels();

                // fit bounds
                const selLayers: any[] = [];
                geojsonLayer.eachLayer((layer: any) => {
                    const rawName = layer.feature?.properties?.NAME_1
                        || layer.feature?.properties?.ST_NM
                        || layer.feature?.properties?.name || "";
                    const stateCode = GetStateCode(normalizeGeoName(rawName), language);
                    if (selectedStatesRef.current.includes(stateCode)) selLayers.push(layer);
                });

                if (selLayers.length > 0) {
                    const bounds = selLayers.reduce(
                        (acc, l) => acc.extend(l.getBounds()),
                        selLayers[0].getBounds()
                    );
                    map.fitBounds(bounds, { padding: [40, 40] });
                } else {
                    map.fitBounds(geojsonLayer.getBounds(), { padding: [8, 8] });
                }
            })
            .catch(err => console.error("GeoJSON fetch failed:", err));

        return () => {
            mapInstanceRef.current?.remove();
            mapInstanceRef.current = null;
            geojsonLayerRef.current = null;
            labelLayerRef.current = null;
        };
    }, [language]);

    useEffect(() => {
        if (!ShowIndiaMap || !mapInstanceRef.current) return;
        setTimeout(() => {
            mapInstanceRef.current.invalidateSize();
        }, 310);
    }, [ShowIndiaMap]);

    useEffect(() => {
        GetAllCountAnnouncements(language, startdate, endDate)
            .then(res => {
                countAnnouncementsRef.current = (res as ResponseCountAnnouncementTypes).data;
                updateLayerStylesRef.current(); // redraws styles + labels
            })
            .catch(err => console.error("Error fetching count:", err));
    }, [language, startdate, endDate]);

    return (
        <div className="flex flex-col w-full h-screen">

            {/* ── Legend ── */}
            <div className="hidden md:flex flex-col gap-1 px-3 py-2">
                <span className="font-inter uppercase tracking-[0.14em] font-black"
                    style={{ fontSize: 11, color: "#FF9933" }}>
                    India Map
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-inter uppercase font-bold"
                        style={{ fontSize: 11, letterSpacing: "0.08em", color: "#FF9933" }}>
                        Announcements:
                    </span>
                    {[
                        { label: "None", color: "#2A2A2A", border: "#555" },
                        { label: "1", color: "#FDE68A", border: "#D97706" },
                        { label: "2", color: "#FBBF24", border: "#D97706" },
                        { label: "3+", color: "#F59E0B", border: "#D97706" },
                    ].map(({ label, color, border }) => (
                        <div key={label} className="flex items-center gap-1">
                            <span style={{ background: color, borderColor: border }}
                                className="inline-block w-3 h-3 rounded-sm border" />
                            <span className="font-mono text-white/60" style={{ fontSize: 11 }}>
                                {label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Info banner ── */}
            <div className="hidden md:flex items-center gap-2 mx-3 mb-2 px-3 py-2 rounded-md border"
                style={{ background: "#1A1A1A", borderColor: "#FF9933" }}>
                <span style={{ fontSize: 13 }}>👆</span>
                <span className="font-satoshi font-semibold"
                    style={{ fontSize: 11, color: "#FF9933" }}>
                    Click any state on the map to filter announcements for that state
                </span>
            </div>

            {/* ── Map ── */}
            <div
                className={`w-full md:w-[95%] mx-auto rounded-md overflow-hidden border border-[#FF9933] transition-all duration-300 ${ShowIndiaMap ? "h-[30vh] md:h-[75vh]" : "h-0"}`}
                style={{ backgroundColor: "#111111" }}
            >
                <div ref={mapRef} className="w-full h-full" />
            </div>
        </div>
    );
}