import { STATES_CODES } from '@/lib/lan';

export const useStateCode = (state_ut: string, target_lan: string = 'English'): string => {

    if (STATES_CODES[state_ut]) {
        return STATES_CODES[state_ut as keyof typeof STATES_CODES][target_lan] ||
            STATES_CODES[state_ut as keyof typeof STATES_CODES]['English'];
    }

    const normalized = state_ut.trim().replace(/ Pradesh$| State$| Islands$/i, '');
    for (const [key, value] of Object.entries(STATES_CODES)) {
        if (key.toLowerCase().includes(normalized.toLowerCase()) ||
            normalized.toLowerCase().includes(key.toLowerCase())) {
            return value[target_lan] || value['English'];
        }
    }

    return 'IndianGovt';
};
