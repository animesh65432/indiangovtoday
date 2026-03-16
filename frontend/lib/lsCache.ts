const CACHE_PREFIX = "app_cache_";

const DEFAULT_TTL: Record<string, number> = {
    announcements: 5 * 60 * 1000,     // 5 min
    departments: 30 * 60 * 1000,       // 30 min
    categories: 30 * 60 * 1000,        // 30 min
    default: 15 * 60 * 1000,           // 15 min fallback
};

export function buildCacheKey(type: string, params: Record<string, unknown>): string {
    const sorted = Object.keys(params)
        .sort()
        .map((k) => {
            const v = params[k];

            // ✅ Normalize Date objects to YYYY-MM-DD only
            if (v instanceof Date) {
                return `${k}=${v.toISOString().split("T")[0]}`;
            }

            return `${k}=${Array.isArray(v) ? [...v].sort().join(",") : v}`;
        })
        .join("&");
    return `${CACHE_PREFIX}${type}_${sorted}`;
}

// ✅ Get from cache
export function lsGet<T>(key: string): T | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        const { data, timestamp, ttl } = JSON.parse(raw);
        if (Date.now() - timestamp > ttl) {
            localStorage.removeItem(key);
            return null;
        }
        return data as T;
    } catch {
        return null;
    }
}

// ✅ Set to cache
export function lsSet(
    key: string,
    data: unknown,
    type: keyof typeof DEFAULT_TTL = "default"
): void {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(
            key,
            JSON.stringify({
                data,
                timestamp: Date.now(),
                ttl: DEFAULT_TTL[type] ?? DEFAULT_TTL.default,
            })
        );
    } catch {
        lsClearExpired();
    }
}

// ✅ Delete one key
export function lsDelete(key: string): void {
    if (typeof window === "undefined") return;
    try {
        localStorage.removeItem(key);
    } catch { }
}

// ✅ Clear all expired entries
export function lsClearExpired(): void {
    if (typeof window === "undefined") return;
    try {
        Object.keys(localStorage)
            .filter((k) => k.startsWith(CACHE_PREFIX))
            .forEach((key) => {
                const raw = localStorage.getItem(key);
                if (!raw) return;
                const { timestamp, ttl } = JSON.parse(raw);
                if (Date.now() - timestamp > ttl) {
                    localStorage.removeItem(key);
                }
            });
    } catch { }
}

// ✅ Clear ALL app cache (useful on logout / language change)
export function lsClearAll(): void {
    if (typeof window === "undefined") return;
    try {
        Object.keys(localStorage)
            .filter((k) => k.startsWith(CACHE_PREFIX))
            .forEach((k) => localStorage.removeItem(k));
    } catch { }
}


export async function withCache<T>(
    key: string,
    type: keyof typeof DEFAULT_TTL,
    fetcher: () => Promise<T>
): Promise<T> {
    const cached = lsGet<T>(key);
    if (cached !== null) return cached;

    const data = await fetcher();
    lsSet(key, data, type);
    return data;
}