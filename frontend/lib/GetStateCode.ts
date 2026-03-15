import { STATES_CODES } from '@/lib/lan';

export const GetStateCode = (state_ut: string, target_lan: string = 'English'): string => {

    if (STATES_CODES[state_ut]) {
        return STATES_CODES[state_ut as keyof typeof STATES_CODES][target_lan] ||
            STATES_CODES[state_ut as keyof typeof STATES_CODES]['English'];
    }

    console.warn(`State/UT "${state_ut}" not found in STATES_CODES. Attempting fuzzy match...`);

    const normalized = state_ut.trim().replace(/ Pradesh$| State$| Islands$/i, '');
    for (const [key, value] of Object.entries(STATES_CODES)) {
        if (key.toLowerCase().includes(normalized.toLowerCase()) ||
            normalized.toLowerCase().includes(key.toLowerCase())) {
            return value[target_lan] || value['English'];
        }
    }

    console.warn(`No fuzzy match found for "${state_ut}". Defaulting to "IndianGovt".`);

    return 'IndianGovt';
};


export const getStateName = (
    englishKey: string,
    language: string = 'English'
): string => {
    return STATES_CODES[englishKey]?.[language]
        ?? STATES_CODES[englishKey]?.['English']
        ?? englishKey;
};

export const getEnglishKey = (translatedName: string): string => {
    const lower = translatedName.trim().toLowerCase();

    for (const [key, translations] of Object.entries(STATES_CODES)) {
        // Check against every language value
        for (const value of Object.values(translations)) {
            if (value.toLowerCase() === lower) return key;
        }
        // Also check the key itself
        if (key.toLowerCase() === lower) return key;
    }

    return 'IndianGovt'; // fallback
};


const GEO_ALIASES: Record<string, string> = {
    "andaman and nicobar": "Andaman and Nicobar Islands",
    "andaman & nicobar islands": "Andaman and Nicobar Islands",
    "orissa": "Odisha",
    "uttaranchal": "Uttarakhand",
    "j & k": "Jammu and Kashmir",
    "jammu & kashmir": "Jammu and Kashmir",
    "nct of delhi": "Delhi",
    "national capital territory of delhi": "Delhi",
    "dadra & nagar haveli": "Dadra and Nagar Haveli and Daman and Diu",
    "daman & diu": "Dadra and Nagar Haveli and Daman and Diu",
};

export const normalizeGeoName = (raw: string): string => {
    if (!raw) return "";
    const lower = raw.trim().toLowerCase();
    return GEO_ALIASES[lower] ?? raw.trim();
};


export const getStateCode = (rawGeoName: string, language: string = 'English'): string => {
    const normalized = normalizeGeoName(rawGeoName);


    if (STATES_CODES[normalized]) {
        return STATES_CODES[normalized][language]
            ?? STATES_CODES[normalized]['English'];
    }


    const lower = normalized.toLowerCase();
    for (const [key, value] of Object.entries(STATES_CODES)) {
        if (key.toLowerCase() === lower) {
            return value[language] ?? value['English'];
        }
    }

    return STATES_CODES['IndianGovt'][language] ?? 'IndianGovt';
};