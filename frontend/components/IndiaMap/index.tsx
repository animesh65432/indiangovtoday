import React, { useEffect, useRef, useCallback, useContext, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { TranslateText } from "@/lib/translatetext"
import { useStateCode } from "@/lib/useStateCode"
import { Announcement } from "@/types"
import { getStateColor, getStateFillOpacity, getStateBorder, getStateWeight, normalizeGeoName } from "./utils";
import { LanguageContext } from "@/context/Lan"
import { getTooltipHTML } from "./utils"

const GEOJSON_URL = "/india_states.geojson";

type Props = {
    ShowIndiaMap: boolean;
    SetShowIndiaMap: React.Dispatch<React.SetStateAction<boolean>>;
    announcements: Announcement[];
    selectedStates: string[];
    onStateClick: (state: string | null) => void;
}


export default function IndiaMap({ ShowIndiaMap, SetShowIndiaMap, announcements, selectedStates, onStateClick }: Props) {
    const { language } = useContext(LanguageContext)
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const geojsonLayerRef = useRef<any>(null);


    const getStateCount = useCallback(
        (normalizedName: string) =>
            announcements.filter(a => a.state !== TranslateText[language].MULTISELECT_OPTIONS[TranslateText[language].MULTISELECT_OPTIONS.length - 1].value).length,
        [announcements, language]
    );

    const updateLayerStyles = useCallback(() => {
        if (!geojsonLayerRef.current) return;
        geojsonLayerRef.current.eachLayer((layer: any) => {
            const rawName = layer.feature?.properties?.NAME_1
                || layer.feature?.properties?.ST_NM
                || layer.feature?.properties?.name || "";
            const name = normalizeGeoName(rawName);
            const count = getStateCount(name);
            const stateCode = useStateCode(name);
            const isSel = selectedStates.includes(stateCode);
            console.log(selectedStates, stateCode)
            layer.setStyle({
                fillColor: getStateColor(count, isSel),
                fillOpacity: getStateFillOpacity(count, isSel),
                weight: getStateWeight(isSel),
                color: getStateBorder(count, isSel),
            });
        });
    }, [getStateCount, selectedStates]);

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        const initMap = () => {
            if (!L && !mapInstanceRef.current) return;
            if (!mapRef.current) return;

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

                            const name = normalizeGeoName(rawName);
                            const count = getStateCount(name);
                            const isSel = selectedStates.includes(name);

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
                            const count = getStateCount(name);

                            layer.on("mouseover", (e: any) => {
                                const isSel = selectedStates.includes(name);
                                if (!isSel) {
                                    layer.setStyle({ fillColor: "#FCD34D", weight: 2, color: "#D97706" });
                                }
                                const tooltip = L.tooltip({ permanent: false, direction: "top", className: "govtrack-tooltip" })
                                    .setContent(getTooltipHTML(name, count, language))
                                    .setLatLng(e.latlng).addTo(map);
                                layer._tooltip = tooltip;
                            });

                            layer.on("mousemove", (e: any) => {
                                if (layer._tooltip) layer._tooltip.setLatLng(e.latlng);
                            });

                            layer.on("mouseout", () => {
                                if (layer._tooltip) { map.removeLayer(layer._tooltip); layer._tooltip = null; }
                                const isSel = selectedStates.includes(name);
                                layer.setStyle({
                                    fillColor: getStateColor(count, isSel),
                                    fillOpacity: getStateFillOpacity(count, isSel),
                                    weight: getStateWeight(isSel),
                                    color: getStateBorder(count, isSel),
                                });
                            });

                            /* Allow clicking ANY state/UT — even those with 0 announcements */
                            layer.on("click", () => {
                                onStateClick(selectedStates.includes(name) ? null : name);
                            });
                        },
                    }).addTo(map);

                    geojsonLayerRef.current = geojsonLayer;
                    map.fitBounds(geojsonLayer.getBounds(), { padding: [8, 8] });
                })
                .catch(err => {
                    console.error("GeoJSON fetch failed:", err);
                });
        };

        if (L) {
            initMap();
        } else {
            const iv = setInterval(() => {
                if (L) { clearInterval(iv); initMap(); }
            }, 100);
            return () => clearInterval(iv);
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
                geojsonLayerRef.current = null;
            }
        };
    }, []);

    useEffect(() => { updateLayerStyles(); }, [updateLayerStyles]);

    useEffect(() => {
        if (ShowIndiaMap && mapInstanceRef.current) {
            setTimeout(() => {
                mapInstanceRef.current.invalidateSize();
                // force tile re-render for the current view
                mapInstanceRef.current.setView(
                    mapInstanceRef.current.getCenter(),
                    mapInstanceRef.current.getZoom()
                );
            }, 310);
        }
    }, [ShowIndiaMap]);

    return (
        <div className="flex flex-col w-full h-screen border-r border-[#E5E2D8] ">
            <div className=" hidden md:flex flex-col gap-1 px-3 py-2 border-b border-[#E5E2D8] bg-white">
                <div className="flex items-center ">
                    <span
                        className="font-inter uppercase tracking-[0.14em] font-black"
                        style={{ fontSize: 12, color: "#AAA" }}
                    >
                        India Map
                    </span>
                </div>

                {/* Legend */}
                <div className=" flex items-center gap-2 flex-wrap">
                    <span
                        className="font-inter uppercase font-bold"
                        style={{ fontSize: 12, letterSpacing: "0.08em", color: "#CCC" }}
                    >
                        Announcements:
                    </span>
                    {[
                        { label: "None", color: "#E8E4DA" },
                        { label: "1", color: "#FDE68A" },
                        { label: "2", color: "#FBBF24" },
                        { label: "3+", color: "#F59E0B" },
                    ].map(({ label, color }) => (
                        <div key={label} className="flex items-center gap-1">
                            <span
                                style={{ background: color }}
                                className="inline-block w-2 h-2 border border-black/10"
                            />
                            <span className="font-mono" style={{ fontSize: 12, color: "#999" }}>
                                {label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Hint */}
            <div
                className=" hidden md:flex items-center gap-1.5 mx-3 my-2 px-3 py-2 rounded-md border"
                style={{ background: "#FFFBEB", borderColor: "#FDE68A" }}
            >
                <span style={{ fontSize: 14 }}>👆</span>
                <span
                    className="font-inter font-semibold leading-snug"
                    style={{ fontSize: 11, color: "#92400E" }}
                >
                    Click any state on the map to filter announcements for that state
                </span>
            </div>

            {/* Map */}
            <div className={`w-full md:w-[95%] mx-auto rounded-md overflow-hidden transition-all duration-300 ${ShowIndiaMap ? "h-[30vh] md:h-[75vh]" : "h-0"
                }`}>
                <div ref={mapRef} className="w-full h-full" />
            </div>
        </div>
    );
}
