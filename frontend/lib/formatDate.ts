// Updated formatDate utility with relative time
export const formatDateRelative = (dateString: string | Date | undefined, languageCode: string = 'en-US') => {
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
        if (diffMinutes < 1) return 'Just now';
        return `${diffMinutes} min ago`;
    }

    // Less than 24 hours
    if (diffHours < 24) {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    }

    // Less than 7 days
    if (diffDays < 7) {
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        return `${diffDays} days ago`;
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