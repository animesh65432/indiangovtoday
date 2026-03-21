import React, { useEffect, useRef, useCallback, useContext } from "react";
import L from "leaflet";
import { GetAllCountAnnouncements } from "@/api/announcements";
import "leaflet/dist/leaflet.css";
import { TranslateText } from "@/lib/translatetext";
import { GetStateCode } from "@/lib/GetStateCode";
import { Announcement, ResponseCountAnnouncementTypes, CountAnnouncementTypes } from "@/types";
import {
    getStateColor, getStateFillOpacity, getStateBorder,
    getStateWeight, normalizeGeoName, checkIfStateSelected, DARK_MAP_STYLE, injectMapStyles,
    makeStateLabel
} from "./utils";
import { LanguageContext } from "@/context/Lan";
import { Currentdate } from "@/context/Currentdate";
import { ChevronDown, ChevronUp } from "lucide-react";
import { buildCacheKey, withCache } from "@/lib/lsCache";

const GEOJSON_URL = "/india_states.geojson";

type Props = {
    ShowIndiaMap: boolean;
    SetShowIndiaMap: React.Dispatch<React.SetStateAction<boolean>>;
    announcements: Announcement[];
    selectedStates: string[];
    onStateClick: (state: string | null) => void;
    IsMapLoading: boolean;
    SetIsMapLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function IndiaMap({ SetIsMapLoading, SetShowIndiaMap, ShowIndiaMap, selectedStates, onStateClick }: Props) {
    const { language } = useContext(LanguageContext);
    const { startdate, endDate } = useContext(Currentdate);

    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const geojsonLayerRef = useRef<any>(null);
    const labelLayerRef = useRef<L.LayerGroup | null>(null);
    const countAnnouncementsRef = useRef<CountAnnouncementTypes[]>([]);
    const updateLayerStylesRef = useRef<() => void>(() => { });
    const geoDataRef = useRef<any>(null);

    const selectedStatesRef = useRef<string[]>(selectedStates);
    const getStateCountRef = useRef<(stateCode: string) => number>(() => 0);
    const onStateClickRef = useRef(onStateClick);

    useEffect(() => { selectedStatesRef.current = selectedStates; }, [selectedStates]);
    useEffect(() => { onStateClickRef.current = onStateClick; }, [onStateClick]);

    const getStateCount = useCallback((stateCode: string) => {
        if (!countAnnouncementsRef.current?.length) return 0;
        if (stateCode === TranslateText[language].MULTISELECT_OPTIONS[TranslateText[language].MULTISELECT_OPTIONS.length - 1].value) return 0;
        return countAnnouncementsRef.current.find(item => item.state.toLowerCase() === stateCode.toLowerCase())?.count ?? 0;
    }, [language]);

    useEffect(() => { getStateCountRef.current = getStateCount; }, [getStateCount]);

    const redrawLabels = useCallback(() => {
        const map = mapInstanceRef.current;
        if (!map || !geoDataRef.current) return;
        if (labelLayerRef.current) {
            labelLayerRef.current.clearLayers();
        } else {
            labelLayerRef.current = L.layerGroup().addTo(map);
        }
        const geojsonLayer = L.geoJSON(geoDataRef.current);
        geojsonLayer.eachLayer((layer: any) => {
            const rawName = layer.feature?.properties?.NAME_1 || layer.feature?.properties?.ST_NM || layer.feature?.properties?.name || "";
            const name = normalizeGeoName(rawName);
            const stateCode = GetStateCode(name, language);
            const displayName = TranslateText[language].MULTISELECT_OPTIONS
                .find(o => o.value === stateCode)?.label ?? name;
            const count = getStateCountRef.current(stateCode);
            const bounds = (layer as any).getBounds();
            const center = bounds.getCenter();
            const marker = L.marker(center, { icon: makeStateLabel(displayName, count), interactive: false, zIndexOffset: 500 });
            labelLayerRef.current?.addLayer(marker);
        });
    }, [language]);

    const updateLayerStyles = useCallback(() => {
        if (!geojsonLayerRef.current) return;
        geojsonLayerRef.current.eachLayer((layer: any) => {
            const rawName = layer.feature?.properties?.NAME_1 || layer.feature?.properties?.ST_NM || layer.feature?.properties?.name || "";
            const stateCode = GetStateCode(normalizeGeoName(rawName), language);
            const count = getStateCount(stateCode);
            const isSel = checkIfStateSelected(stateCode, selectedStates);
            layer.setStyle({ fillColor: getStateColor(count, isSel), fillOpacity: getStateFillOpacity(count, isSel), weight: getStateWeight(isSel), color: getStateBorder(count, isSel) });
        });
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
            center: [20, 82], zoom: 3.8, zoomControl: false,
            scrollWheelZoom: true, attributionControl: false, preferCanvas: true,
        });

        L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png", { subdomains: "abcd", maxZoom: 19 }).addTo(map);
        L.control.zoom({ position: "topleft" }).addTo(map);

        mapInstanceRef.current = map;
        labelLayerRef.current = L.layerGroup().addTo(map);

        fetch(GEOJSON_URL)
            .then(r => r.json())
            .then(data => {
                if (!mapInstanceRef.current) return;
                geoDataRef.current = data;
                const geojsonLayer = L.geoJSON(data, {
                    style: (feature: any) => {
                        const rawName = feature?.properties?.NAME_1 || feature?.properties?.ST_NM || feature?.properties?.name || "";
                        const stateCode = GetStateCode(normalizeGeoName(rawName), language);
                        const count = getStateCountRef.current(stateCode);
                        const isSel = checkIfStateSelected(stateCode, selectedStatesRef.current);
                        return { fillColor: getStateColor(count, isSel), fillOpacity: getStateFillOpacity(count, isSel), weight: getStateWeight(isSel), color: getStateBorder(count, isSel) };
                    },
                    onEachFeature: (feature: any, layer: any) => {
                        const rawName = feature?.properties?.NAME_1 || feature?.properties?.ST_NM || feature?.properties?.name || "";
                        const name = normalizeGeoName(rawName);
                        const stateCode = GetStateCode(name, language);
                        layer.on("mouseover", () => {
                            const isSel = checkIfStateSelected(stateCode, selectedStatesRef.current);
                            if (!isSel) layer.setStyle({ fillColor: "#FCD34D", weight: 2, color: "#FF9933" });
                            layer.bringToFront();
                        });
                        layer.on("mouseout", () => {
                            const liveCount = getStateCountRef.current(stateCode);
                            const isSel = checkIfStateSelected(stateCode, selectedStatesRef.current);
                            layer.setStyle({ fillColor: getStateColor(liveCount, isSel), fillOpacity: getStateFillOpacity(liveCount, isSel), weight: getStateWeight(isSel), color: getStateBorder(liveCount, isSel) });
                        });
                        layer.on("click", () => onStateClickRef.current(stateCode));
                    },
                }).addTo(map);

                geojsonLayerRef.current = geojsonLayer;
                redrawLabels();

                const selLayers: any[] = [];
                geojsonLayer.eachLayer((layer: any) => {
                    const rawName = layer.feature?.properties?.NAME_1 || layer.feature?.properties?.ST_NM || layer.feature?.properties?.name || "";
                    const stateCode = GetStateCode(normalizeGeoName(rawName), language);
                    if (selectedStatesRef.current.includes(stateCode)) selLayers.push(layer);
                });

                if (selLayers.length > 0) {
                    const bounds = selLayers.reduce((acc, l) => acc.extend(l.getBounds()), selLayers[0].getBounds());
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

    // ── invalidate whenever show/hide toggles ──
    useEffect(() => {
        if (!mapInstanceRef.current) return;
        setTimeout(() => mapInstanceRef.current?.invalidateSize(), 310);
    }, [ShowIndiaMap]);

    async function initGetAllCountAnnouncements(lan: string, start: Date, end: Date) {
        SetIsMapLoading(true);
        try {
            const key = buildCacheKey("GetAllCountAnnouncements", { language: lan, startdate: start, endDate: end });
            const res = await withCache(key, "GetAllCountAnnouncements", async () => (
                await GetAllCountAnnouncements(lan, start, end) as ResponseCountAnnouncementTypes
            ));
            countAnnouncementsRef.current = res.data;
            updateLayerStylesRef.current();
        } catch (error) {
            console.error("Error initializing map:", error);
        } finally {
            SetIsMapLoading(false);
        }
    }

    useEffect(() => {
        initGetAllCountAnnouncements(language, startdate, endDate);
    }, [language, startdate, endDate]);

    const selectedCount = selectedStates.filter(
        s => s !== TranslateText[language].MULTISELECT_OPTIONS[TranslateText[language].MULTISELECT_OPTIONS.length - 1].value
    ).length;

    return (
        // ── root fills whatever height the parent column gives it ──
        <div className="flex flex-col h-full">

            {/* Legend */}
            <div className="hidden md:flex flex-col gap-1 px-3 py-2 flex-shrink-0">
                <span className="font-inter uppercase tracking-[0.14em] font-black" style={{ fontSize: 11, color: "#FF9933" }}>
                    {TranslateText[language].INDIA_MAP}
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-inter uppercase font-bold" style={{ fontSize: 11, letterSpacing: "0.08em", color: "#FF9933" }}>
                        {TranslateText[language].ANNOUNCEMENTS}:
                    </span>
                    {[
                        { label: `${TranslateText[language].NONE}`, color: "#2A2A2A", border: "#555" },
                        { label: "1", color: "#FDE68A", border: "#D97706" },
                        { label: "2", color: "#FBBF24", border: "#D97706" },
                        { label: "3+", color: "#F59E0B", border: "#D97706" },
                    ].map(({ label, color, border }) => (
                        <div key={label} className="flex items-center gap-1">
                            <span style={{ background: color, borderColor: border }} className="inline-block w-3 h-3 rounded-sm border" />
                            <span className="font-mono text-white/60" style={{ fontSize: 11 }}>{label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Info banner */}
            <div className="hidden md:flex items-center gap-2 mx-3 mb-2 px-3 py-2  border flex-shrink-0"
                style={{ background: "#1A1A1A", borderColor: "#FF9933" }}>
                <span style={{ fontSize: 13 }}>👆</span>
                <span className="font-satoshi font-semibold" style={{ fontSize: 11, color: "#FF9933" }}>
                    {TranslateText[language].CLICK_ANY_STATE_ON_THE_MAP_TO_FILTER_ANNOUNCEMENTS_FOR_THAT_STATE}
                </span>
            </div>
            <button
                onClick={() => SetShowIndiaMap(prev => !prev)}
                className="md:hidden flex items-center justify-between w-[98%] rounded-md mx-auto px-4 py-3 flex-shrink-0 border-b border-[#FF9933]/20 bg-[#1A1A1A] transition-colors hover:bg-[#1f1f1f]"
            >
                <div className="flex items-center gap-2">
                    {/* <Map className="w-4 h-4 text-[#FF9933]" /> */}
                    <span className="font-satoshi text-[13px] font-semibold text-white">
                        {TranslateText[language].FILTER_BY_STATE}
                    </span>
                    {/* Badge showing how many states are selected */}
                    {selectedCount > 0 && (
                        <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#FF9933] text-black text-[10px] font-bold">
                            {selectedCount}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-satoshi text-[11px] text-white/40">
                        {ShowIndiaMap ? `${TranslateText[language].TAP_TO_HIDE}` : `${TranslateText[language].TAP_TO_SHOW_MAP}`}
                    </span>
                    {ShowIndiaMap
                        ? <ChevronUp className="w-4 h-4 text-[#FF9933]" />
                        : <ChevronDown className="w-4 h-4 text-[#FF9933]" />
                    }
                </div>
            </button>
            <div
                className={`flex-1 min-h-0 mx-3 mb-3 rounded-md md:rounded-none overflow-hidden border border-[#FF9933] ${ShowIndiaMap ? "flex-1" : "h-0"}`}
                style={{ backgroundColor: "#111111" }}
            >
                <div ref={mapRef} className="w-full h-full" />
            </div>
        </div>
    );
}