import { optionsforLanguages } from "./lan"

const DAY_TRANSLATIONS: Record<string, { day: string, days: string }> = {
    'English': { day: 'day', days: 'days' },
    'অসমীয়া': { day: 'দিন', days: 'দিন' },
    'বাংলা': { day: 'দিন', days: 'দিন' },
    'बर': { day: 'दिन', days: 'दिन' },
    'डोगरी': { day: 'दिन', days: 'दिन' },
    'ગુજरাती': { day: 'દિવસ', days: 'દિવસ' },
    'हिन्दी': { day: 'दिन', days: 'दिन' },
    'ಕನ್ನಡ': { day: 'ದಿನ', days: 'ದಿನಗಳು' },
    'कॉशुर': { day: 'دۆہ', days: 'دۆہ' },
    'मैथिली': { day: 'दिन', days: 'दिन' },
    'മലയാളം': { day: 'ദിവസം', days: 'ദിവസങ്ങൾ' },
    'ꯃꯩꯇꯩꯂꯣꯟ': { day: 'নুমিৎ', days: 'নুমিৎ' },
    'मराठी': { day: 'दिवस', days: 'दिवस' },
    'नेपाली': { day: 'दिन', days: 'दिन' },
    'ଓଡ଼ିଆ': { day: 'ଦିନ', days: 'ଦିନ' },
    'ਪੰਜਾਬੀ': { day: 'ਦਿਨ', days: 'ਦਿਨ' },
    'संस्कृतम्': { day: 'दिनम्', days: 'दिनानि' },
    'ᱥᱟᱱᱛᱟᱲᱤ': { day: 'ᱫᱤᱱ', days: 'ᱫᱤᱱ' },
    'سنڌي': { day: 'ڏينهن', days: 'ڏينهن' },
    'தமிழ்': { day: 'நாள்', days: 'நாட்கள்' },
    'తెలుగు': { day: 'రోజు', days: 'రోజులు' },
    'اردو': { day: 'دن', days: 'دن' },
}

export const formatDayRange = (
    from: Date,
    to: Date,
    language: string
): string => {
    const diffDays = Math.round(
        Math.abs(to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1

    const t = DAY_TRANSLATIONS[language] || DAY_TRANSLATIONS['English']
    const dayWord = diffDays === 1 ? t.day : t.days

    const localeCode = optionsforLanguages.find(o => o.label === language)?.value || 'en'
    const localNum = new Intl.NumberFormat(localeCode).format(diffDays)

    return `${localNum} ${dayWord}`
}