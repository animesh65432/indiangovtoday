import React, { useEffect, useRef, useCallback, useContext } from "react";
import L from "leaflet";
import { randomPoint } from "@turf/random";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { GetAllCountAnnouncements } from "@/api/announcements";
import "leaflet/dist/leaflet.css";
import { TranslateText } from "@/lib/translatetext";
import { GetStateCode } from "@/lib/GetStateCode";
import { Announcement, ResponseCountAnnouncementTypes, CountAnnouncementTypes } from "@/types";
import {
    getStateColor, getStateFillOpacity, getStateBorder,
    getStateWeight, normalizeGeoName, checkIfStateSelected,
    injectMapStyles, makeNameLabel,
    MapStyle
} from "./utils";
import { ThemeContext } from "@/context/Theme";
import { LanguageContext } from "@/context/Lan";
import { Currentdate } from "@/context/Currentdate";
import { buildCacheKey, withCache } from "@/lib/lsCache";
import { categoryStyles } from "@/lib/categoryStyles";

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


function findStateData(
    countData: CountAnnouncementTypes[],
    stateCode: string,
    rawName: string
): CountAnnouncementTypes | undefined {
    let found = countData.find(s => s.state === stateCode);
    if (found) return found;


    const norm = normalizeGeoName(rawName).toLowerCase();
    found = countData.find(s => s.state.toLowerCase() === norm);
    if (found) return found;

    found = countData.find(s =>
        stateCode.toLowerCase().includes(s.state.toLowerCase()) ||
        s.state.toLowerCase().includes(stateCode.toLowerCase())
    );
    return found;
}


function pointInFeature(pt: any, feature: any): boolean {
    try {
        if (feature.geometry.type === "MultiPolygon") {
            return feature.geometry.coordinates.some((polygonCoords: any) => {
                const polygon = { type: "Feature", geometry: { type: "Polygon", coordinates: polygonCoords } };
                return booleanPointInPolygon(pt, polygon as any);
            });
        }
        return booleanPointInPolygon(pt, feature);
    } catch {
        return false;
    }
}

function randomPointInFeature(
    feature: any,
    bbox: [number, number, number, number],
    attempts = 30
): [number, number] | null {
    for (let i = 0; i < attempts; i++) {
        const candidate = randomPoint(1, { bbox });
        const pt = candidate.features[0];
        if (pointInFeature(pt, feature)) {
            return [pt.geometry.coordinates[1], pt.geometry.coordinates[0]];
        }
    }
    return [(bbox[1] + bbox[3]) / 2, (bbox[0] + bbox[2]) / 2];
}

export default function IndiaMap({
    SetIsMapLoading, SetShowIndiaMap, ShowIndiaMap, selectedStates, onStateClick
}: Props) {
    const { language } = useContext(LanguageContext);
    const { startdate, endDate } = useContext(Currentdate);
    const { theme } = useContext(ThemeContext);
    const dotPositionsRef = useRef<Map<string, [number, number]>>(new Map());

    const mapWrapperRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const geojsonLayerRef = useRef<any>(null);
    const labelLayerRef = useRef<L.LayerGroup | null>(null);
    const dotsLayerRef = useRef<L.LayerGroup | null>(null);
    const geoDataRef = useRef<any>(null);
    const countAnnouncementsRef = useRef<CountAnnouncementTypes[]>([]);
    const updateLayerStylesRef = useRef<() => void>(() => { });
    const geoReadyRef = useRef(false);
    const countsReadyRef = useRef(false);

    const selectedStatesRef = useRef<string[]>(selectedStates);
    const getStateCountRef = useRef<(stateCode: string) => number>(() => 0);
    const onStateClickRef = useRef(onStateClick);

    useEffect(() => { selectedStatesRef.current = selectedStates; }, [selectedStates]);
    useEffect(() => { onStateClickRef.current = onStateClick; }, [onStateClick]);

    const redrawLabels = useCallback(() => {
        const map = mapInstanceRef.current;
        if (!map || !geoDataRef.current) return;

        if (labelLayerRef.current) labelLayerRef.current.clearLayers();
        else labelLayerRef.current = L.layerGroup().addTo(map);

        if (dotsLayerRef.current) dotsLayerRef.current.clearLayers();
        else dotsLayerRef.current = L.layerGroup().addTo(map);

        const isDark = theme === "dark";

        L.geoJSON(geoDataRef.current).eachLayer((layer: any) => {
            const rawName =
                layer.feature?.properties?.NAME_1 ||
                layer.feature?.properties?.ST_NM ||
                layer.feature?.properties?.name || "";

            const normalized = normalizeGeoName(rawName);
            const stateCode = GetStateCode(normalized, language);
            const displayName = TranslateText[language].MULTISELECT_OPTIONS
                .find(o => o.value === stateCode)?.label ?? normalized;

            const bounds = (layer as any).getBounds();
            const center = bounds.getCenter();

            labelLayerRef.current?.addLayer(
                L.marker(center, {
                    icon: makeNameLabel(displayName, isDark),
                    interactive: false,
                    zIndexOffset: 600,
                })
            );

            const stateData = findStateData(
                countAnnouncementsRef.current,
                stateCode,
                rawName
            );

            if (!stateData) return;

            const activeCats = stateData.categories.filter(c => c.count > 0);
            if (activeCats.length === 0) return;

            const bbox: [number, number, number, number] = [
                bounds.getWest(),
                bounds.getSouth(),
                bounds.getEast(),
                bounds.getNorth(),
            ];

            activeCats.forEach(cat => {
                const color = categoryStyles[cat.category]?.dot ?? "#6B6963";
                const radius = Math.min(Math.max(3 * 2.5, 5), 18);
                const posKey = `${stateCode}-${cat.category}`;
                let point = dotPositionsRef.current.get(posKey) ?? null;

                if (!point) {

                    point = randomPointInFeature(layer.feature, bbox);

                    if (point) dotPositionsRef.current.set(posKey, point);
                }


                if (!point) return;

                let dot;

                const AnnouncementsNumber = cat.count > 1 ? cat.count : null;
                const isStateSelected = selectedStatesRef.current.includes(stateCode);

                const getRippleHtml = (showNumber: boolean) => `
                <div style="position: relative; width: ${radius * 2}px; height: ${radius * 2}px;">
                    <span style="
                        position: absolute; inset: 0;
                        border-radius: 50%;
                        background-color: ${color};
                        animation: dotRipple 1.6s ease-out infinite;
                    "></span>
                    <span style="
                        position: absolute; inset: 0;
                        border-radius: 50%;
                        background-color: ${color};
                        animation: dotRipple 1.6s ease-out 0.8s infinite;
                    "></span>
                    <div style="
                        position: absolute; inset: 0;
                        border-radius: 50%;
                        background-color: ${color};
                        color: white;
                        font-size: ${Math.max(radius * 0.9, 8)}px;
                        font-weight: bold;
                        display: flex; align-items: center; justify-content: center;
                        box-sizing: border-box;
                        animation: dotPulse 1.6s ease-in-out infinite;
                    ">${showNumber ? (AnnouncementsNumber ?? "") : ""}</div>
                </div>`;

                const getStaticHtml = () => `
                <div style="
                    width: ${radius * 3}px; height: ${radius * 3}px;
                    border-radius: 50%;
                    background-color: ${color};
                    color: white;
                    font-size: ${Math.max(radius * 0.9, 8)}px;
                    font-weight: bold;
                    display: flex; align-items: center; justify-content: center;
                    border: 1.5px solid ${isDark ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.7)"};
                    box-sizing: border-box;
                ">${AnnouncementsNumber ?? ""}</div>`;

                dot = L.marker(point, {
                    icon: L.divIcon({
                        className: "",
                        html: isStateSelected
                            ? getRippleHtml(isStateSelected)             // show number only if state selected
                            : getStaticHtml(),
                        iconSize: [radius * 2, radius * 2],
                        iconAnchor: [radius, radius],
                    }),
                    interactive: true,
                });

                const spiderMarkers: L.Marker[] = [];
                let isOpen = false;

                dot.on("click", () => {
                    if (isOpen) {
                        spiderMarkers.forEach(m => dotsLayerRef.current?.removeLayer(m));
                        spiderMarkers.length = 0;
                        isOpen = false;
                        return;
                    }

                    isOpen = true;

                });

                dotsLayerRef.current?.addLayer(dot);
            });
        });
    }, [language, theme]);

    const updateLayerStyles = useCallback(() => {
        if (!geojsonLayerRef.current) return;
        geojsonLayerRef.current.eachLayer((layer: any) => {
            const rawName = layer.feature?.properties?.NAME_1 || layer.feature?.properties?.ST_NM || layer.feature?.properties?.name || "";
            const stateCode = GetStateCode(normalizeGeoName(rawName), language);
            const isSel = checkIfStateSelected(stateCode, selectedStates);
            layer.setStyle({
                fillColor: getStateColor(0, isSel, theme),
                fillOpacity: getStateFillOpacity(0, isSel),
                weight: getStateWeight(isSel),
                color: getStateBorder(0, isSel, theme),
            });
        });
        redrawLabels();
    }, [selectedStates, language, theme, redrawLabels]);

    useEffect(() => {
        updateLayerStylesRef.current = updateLayerStyles;
        updateLayerStyles();
    }, [updateLayerStyles]);

    const tryFinalize = useCallback(() => {
        if (geoReadyRef.current && countsReadyRef.current) {
            updateLayerStylesRef.current();
            SetIsMapLoading(false);
        }
    }, []);


    useEffect(() => {
        injectMapStyles();
        if (!mapRef.current || mapInstanceRef.current) return;

        const map = L.map(mapRef.current, {
            center: [20, 82],
            zoom: 4.8,
            zoomControl: false,
            scrollWheelZoom: true,
            attributionControl: false,
            preferCanvas: true,
        });

        L.tileLayer(MapStyle.light,
            { subdomains: "abcd", maxZoom: 29 })
            .addTo(map);

        mapInstanceRef.current = map;
        labelLayerRef.current = L.layerGroup().addTo(map);
        dotsLayerRef.current = L.layerGroup().addTo(map);

        map.on("zoom", () => {
            mapWrapperRef.current?.setAttribute("data-zoom", String(Math.floor(map.getZoom())));
        });

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
                        return {
                            // fillColor: getStateColor(count, isSel, theme),
                            fillOpacity: getStateFillOpacity(count, isSel),
                            weight: getStateWeight(isSel),
                            // color: getStateBorder(count, isSel, theme),
                        };
                    },
                    onEachFeature: (feature: any, layer: any) => {
                        const rawName = feature?.properties?.NAME_1 || feature?.properties?.ST_NM || feature?.properties?.name || "";
                        const stateCode = GetStateCode(normalizeGeoName(rawName), language);

                        layer.on("mouseover", () => {
                            const isSel = checkIfStateSelected(stateCode, selectedStatesRef.current);
                            if (!isSel) layer.setStyle({ weight: 1.5, color: "#4a4a4a" });
                            layer.bringToFront();
                        });

                        layer.on("mouseout", () => {
                            const liveCount = getStateCountRef.current(stateCode);
                            const isSel = checkIfStateSelected(stateCode, selectedStatesRef.current);
                            layer.setStyle({
                                fillColor: getStateColor(liveCount, isSel, theme),
                                fillOpacity: getStateFillOpacity(liveCount, isSel),
                                weight: getStateWeight(isSel),
                                color: getStateBorder(liveCount, isSel, theme),
                            });
                        });

                        layer.on("click", () => onStateClickRef.current(stateCode));
                    },
                }).addTo(map);

                geojsonLayerRef.current = geojsonLayer;
                geoReadyRef.current = true;
                tryFinalize();

                const selLayers: any[] = [];
                geojsonLayer.eachLayer((layer: any) => {
                    const rawName = layer.feature?.properties?.NAME_1 || layer.feature?.properties?.ST_NM || layer.feature?.properties?.name || "";
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
            dotsLayerRef.current = null;
        };
    }, [language]);


    useEffect(() => {
        if (!mapInstanceRef.current) return;
        setTimeout(() => mapInstanceRef.current?.invalidateSize(), 310);
    }, [ShowIndiaMap]);



    async function initGetAllCountAnnouncements(lan: string, start: Date, end: Date) {
        try {
            const key = buildCacheKey("GetAllCountAnnouncements", { language: lan, startdate: start, endDate: end });
            const res = await withCache(key, "GetAllCountAnnouncements", async () => (
                await GetAllCountAnnouncements(lan, start, end) as ResponseCountAnnouncementTypes
            ));
            countAnnouncementsRef.current = res.data;
            countsReadyRef.current = true;


            if (process.env.NODE_ENV === "development") {
                console.log("[IndiaMap] API state values:", res.data.map(d => d.state));
            }

            tryFinalize();
        } catch (error) {
            SetIsMapLoading(false);
            console.error("Error initializing map:", error);
        }
    }

    useEffect(() => {
        geoReadyRef.current = false;
        countsReadyRef.current = false;
        initGetAllCountAnnouncements(language, startdate, endDate);
    }, [language, startdate, endDate]);

    useEffect(() => {
        if (!geojsonLayerRef.current || !mapInstanceRef.current) return;

        const lastSelected = selectedStates[selectedStates.length - 1];

        if (!lastSelected) {
            mapInstanceRef.current.fitBounds(
                geojsonLayerRef.current.getBounds(),
                { padding: [8, 8] }
            );
            return;
        }

        geojsonLayerRef.current.eachLayer((layer: any) => {
            const rawName =
                layer.feature?.properties?.NAME_1 ||
                layer.feature?.properties?.ST_NM ||
                layer.feature?.properties?.name || "";
            const stateCode = GetStateCode(normalizeGeoName(rawName), language);

            if (stateCode === lastSelected) {
                mapInstanceRef.current.flyToBounds(
                    layer.getBounds(),
                    {
                        duration: 1,
                        paddingTopLeft: [620, 40],
                        paddingBottomRight: [40, 40],
                    }
                );
            }
        });

    }, [selectedStates]);


    return (
        <div className={`flex flex-col h-full ${theme}`}>
            <div
                ref={mapWrapperRef}
                data-zoom="4"
                className={`flex-1 min-h-0 rounded-md md:rounded-none overflow-hidden ${ShowIndiaMap ? "flex-1" : "h-0"}`}
                style={{ backgroundColor: theme === "dark" ? "#111111" : "#f5f3ef" }}
            >
                <div ref={mapRef} className="w-full h-full" />
            </div>
        </div>
    );
}