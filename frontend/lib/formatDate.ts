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
    date: Date | string | number,
    languageCode: string,
    options?: Intl.DateTimeFormatOptions
): string => {
    const defaultOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        ...options
    };

    return new Intl.DateTimeFormat(languageCode, defaultOptions).format(
        new Date(date)
    );
};

