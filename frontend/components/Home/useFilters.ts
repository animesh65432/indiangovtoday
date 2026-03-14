import { useState, useMemo } from "react";
export type SourceFilter = "all" | "central" | "states";

export function useFilters() {
    const [source, setSource] = useState<SourceFilter>("all");
    const [selectedMinistries, setMins] = useState<Ministry[]>([]);
    const [selectedKinds, setKinds] = useState<AnnouncementKind[]>([]);
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [search, setSearch] = useState("");
    const [selectedState, setSelectedState] = useState<string | null>(null);

    const toggleMinistry = (m: Ministry) =>
        setMins(p => p.includes(m) ? p.filter(x => x !== m) : [...p, m]);

    const toggleKind = (k: AnnouncementKind) =>
        setKinds(p => p.includes(k) ? p.filter(x => x !== k) : [...p, k]);

    const clearAll = () => {
        setSource("all");
        setMins([]);
        setKinds([]);
        setDateFrom("");
        setDateTo("");
        setSearch("");
        setSelectedState(null);
    };

    const filtered = useMemo(() => ANNOUNCEMENTS.filter(a => {
        if (source === "central" && a.type !== "central") return false;
        if (source === "states" && a.type !== "state") return false;
        if (selectedState && a.type === "state" && a.state !== selectedState) return false;
        if (selectedMinistries.length && a.type === "central" && (!a.ministry || !selectedMinistries.includes(a.ministry))) return false;
        if (selectedKinds.length && !selectedKinds.includes(a.kind)) return false;
        if (dateFrom && a.date < dateFrom) return false;
        if (dateTo && a.date > dateTo) return false;
        if (search) {
            const q = search.toLowerCase();
            return a.title.toLowerCase().includes(q)
                || (a.state || "").toLowerCase().includes(q)
                || (a.ministry || "").toLowerCase().includes(q)
                || a.kind.toLowerCase().includes(q)
                || a.description.toLowerCase().includes(q);
        }
        return true;
    }), [source, selectedState, selectedMinistries, selectedKinds, dateFrom, dateTo, search]);

    const hasActive = !!(
        source !== "all" ||
        selectedMinistries.length ||
        selectedKinds.length ||
        dateFrom || dateTo || search || selectedState
    );

    return {
        source, setSource,
        selectedMinistries, toggleMinistry,
        selectedKinds, toggleKind,
        dateFrom, setDateFrom,
        dateTo, setDateTo,
        search, setSearch,
        selectedState, setSelectedState,
        clearAll, filtered, hasActive,
    };
}