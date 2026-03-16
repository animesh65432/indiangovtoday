import React, { useEffect, useRef, useCallback, useContext } from "react";
import L from "leaflet";
import { GetAllCountAnnouncements } from "@/api/announcements";
import "leaflet/dist/leaflet.css";
import { TranslateText } from "@/lib/translatetext";
import { GetStateCode } from "@/lib/GetStateCode";
import { Announcement, ResponseCountAnnouncementTypes, CountAnnouncementTypes } from "@/types";
import { getStateColor, getStateFillOpacity, getStateBorder, getStateWeight, normalizeGeoName, getTooltipHTML, checkIfStateSelected } from "./utils";
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

export default function IndiaMap({ ShowIndiaMap, selectedStates, onStateClick }: Props) {
    const { language } = useContext(LanguageContext);
    const { startdate, endDate } = useContext(Currentdate);

    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const geojsonLayerRef = useRef<any>(null);
    const countAnnouncementsRef = useRef<CountAnnouncementTypes[]>([]);
    const updateLayerStylesRef = useRef<() => void>(() => { });

    // ✅ Refs so Leaflet event handlers always see current values
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

    // ✅ Keep getStateCountRef in sync with latest getStateCount
    useEffect(() => { getStateCountRef.current = getStateCount; }, [getStateCount]);

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
    }, [selectedStates, language, getStateCount]);

    useEffect(() => {
        updateLayerStylesRef.current = updateLayerStyles;
        updateLayerStyles();
    }, [updateLayerStyles]);

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        const map = L.map(mapRef.current, {
            center: [20, 82],
            zoom: 3.8,
            zoomControl: true,
            scrollWheelZoom: true,
            attributionControl: false,
        });

        L.tileLayer(
            "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
            { attribution: "© CartoDB", subdomains: "abcd", maxZoom: 19 }
        ).addTo(map);

        mapInstanceRef.current = map;

        fetch(GEOJSON_URL)
            .then(r => r.json())
            .then(data => {
                const geojsonLayer = L.geoJSON(data, {
                    style: (feature: any) => {
                        const rawName = feature?.properties?.NAME_1
                            || feature?.properties?.ST_NM
                            || feature?.properties?.name || "";
                        const stateCode = GetStateCode(normalizeGeoName(rawName), language);
                        // ✅ read through refs
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
                            // ✅ always current selectedStates
                            const isSel = checkIfStateSelected(stateCode, selectedStatesRef.current);
                            if (!isSel) {
                                layer.setStyle({ fillColor: "#FCD34D", weight: 2, color: "#D97706" });
                            }
                            // ✅ always current count
                            const liveCount = getStateCountRef.current(stateCode);
                            layer._tooltip = L.tooltip({
                                permanent: false,
                                direction: "top",
                                className: "govtrack-tooltip"
                            })
                                .setContent(getTooltipHTML(name, liveCount, language))
                                .setLatLng(e.latlng)
                                .addTo(map);
                        });

                        layer.on("mousemove", (e: any) => {
                            layer._tooltip?.setLatLng(e.latlng);
                        });

                        layer.on("mouseout", () => {
                            if (layer._tooltip) { map.removeLayer(layer._tooltip); layer._tooltip = null; }
                            // ✅ always current count + selection
                            const liveCount = getStateCountRef.current(stateCode);
                            const isSel = checkIfStateSelected(stateCode, selectedStatesRef.current);
                            layer.setStyle({
                                fillColor: getStateColor(liveCount, isSel),
                                fillOpacity: getStateFillOpacity(liveCount, isSel),
                                weight: getStateWeight(isSel),
                                color: getStateBorder(liveCount, isSel),
                            });
                        });

                        // ✅ always current callback
                        layer.on("click", () => onStateClickRef.current(stateCode));
                    },
                }).addTo(map);

                geojsonLayerRef.current = geojsonLayer;
                updateLayerStylesRef.current();

                const selectedLayers: any[] = [];
                geojsonLayer.eachLayer((layer: any) => {
                    const rawName = layer.feature?.properties?.NAME_1
                        || layer.feature?.properties?.ST_NM
                        || layer.feature?.properties?.name || "";
                    const stateCode = GetStateCode(normalizeGeoName(rawName), language);
                    // ✅ ref
                    if (selectedStatesRef.current.includes(stateCode)) selectedLayers.push(layer);
                });

                if (selectedLayers.length > 0) {
                    const bounds = selectedLayers.reduce(
                        (acc, l) => acc.extend(l.getBounds()),
                        selectedLayers[0].getBounds()
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
        };
    }, [language]); // ✅ language only — everything else through refs

    useEffect(() => {
        if (!ShowIndiaMap || !mapInstanceRef.current) return;
        setTimeout(() => {
            mapInstanceRef.current.invalidateSize();
            mapInstanceRef.current.setView(
                mapInstanceRef.current.getCenter(),
                mapInstanceRef.current.getZoom()
            );
        }, 310);
    }, [ShowIndiaMap]);

    useEffect(() => {
        GetAllCountAnnouncements(language, startdate, endDate)
            .then(res => {
                countAnnouncementsRef.current = (res as ResponseCountAnnouncementTypes).data;
                updateLayerStylesRef.current();
            })
            .catch(err => console.error("Error fetching count announcements:", err));
    }, [language, startdate, endDate]);

    return (
        <div className="flex flex-col w-full h-screen border-r border-[#E5E2D8]">
            <div className="hidden md:flex flex-col gap-1 px-3 py-2 border-b border-[#E5E2D8] bg-white">
                <span className="font-inter uppercase tracking-[0.14em] font-black" style={{ fontSize: 12, color: "#AAA" }}>
                    India Map
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-inter uppercase font-bold" style={{ fontSize: 12, letterSpacing: "0.08em", color: "#CCC" }}>
                        Announcements:
                    </span>
                    {[
                        { label: "None", color: "#E8E4DA" },
                        { label: "1", color: "#FDE68A" },
                        { label: "2", color: "#FBBF24" },
                        { label: "3+", color: "#F59E0B" },
                    ].map(({ label, color }) => (
                        <div key={label} className="flex items-center gap-1">
                            <span style={{ background: color }} className="inline-block w-2 h-2 border border-black/10" />
                            <span className="font-mono" style={{ fontSize: 12, color: "#999" }}>{label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div
                className="hidden md:flex items-center gap-1.5 mx-3 my-2 px-3 py-2 rounded-md border"
                style={{ background: "#FFFBEB", borderColor: "#FDE68A" }}
            >
                <span style={{ fontSize: 14 }}>👆</span>
                <span className="font-inter font-semibold leading-snug" style={{ fontSize: 11, color: "#92400E" }}>
                    Click any state on the map to filter announcements for that state
                </span>
            </div>

            <div className={`w-full md:w-[95%] mx-auto rounded-md overflow-hidden transition-all duration-300 ${ShowIndiaMap ? "h-[30vh] md:h-[75vh]" : "h-0"}`}>
                <div ref={mapRef} className="w-full h-full" />
            </div>
        </div>
    );
}