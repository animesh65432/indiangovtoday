import { TranslateText } from "@/lib/translatetext"

export const formatDateRelative = (dateString: string | Date | undefined, languageCode: string = 'en-US', language: string) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    // Less than 1 hour
    if (diffMinutes < 60) {
        if (diffMinutes < 1) return `${TranslateText[language].JUST_NOW}`;
        return `${diffMinutes} ${TranslateText[language].MINUTES_AGO}`;
    }

    // Less than 24 hours
    if (diffHours < 24) {
        return `${diffHours} ${TranslateText[language].HOUR} ${language === "English" ? diffHours > 1 ? 's' : '' : ""} ${TranslateText[language].AGO}`;
    }

    // Less than 7 days
    if (diffDays < 7) {
        if (diffDays === 0) return `${TranslateText[language].TODAY}`;
        if (diffDays === 1) return `${TranslateText[language].YESTERDAY}`;
        return `${diffDays} ${TranslateText[language].DAYS_AGO}`;
    }

    // More than 7 days - show formatted date
    return new Intl.DateTimeFormat(languageCode, {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    }).format(date);
};

// Keep the full date formatter but with better defaults
export const formatDateInLanguage = (
    date: Date | string | number | undefined | null,
    languageCode: string,
    options?: Intl.DateTimeFormatOptions
): string => {
    if (!date) return '';

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return '';

    const defaultOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        ...options
    };

    return new Intl.DateTimeFormat(languageCode, defaultOptions).format(parsedDate);
};