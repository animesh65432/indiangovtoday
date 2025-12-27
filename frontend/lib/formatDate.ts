export const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return null
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return null

    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays} days ago`

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
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
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC',
        ...options
    };

    console.log('Formatting date:', parsedDate, 'with language code:', languageCode, 'and options:', defaultOptions);

    return new Intl.DateTimeFormat(languageCode, defaultOptions).format(parsedDate);
};
