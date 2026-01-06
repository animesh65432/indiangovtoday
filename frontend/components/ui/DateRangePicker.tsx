/* eslint-disable max-lines */
'use client'

import React, { type FC, useState, useEffect, useRef, JSX, useContext } from 'react'
import { Button } from './button'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Calendar } from './calendar'
import { DateInput } from './DateInput'
import { Label } from './label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from './select'
import { Switch } from './switch'
import { CheckIcon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { LanguageContext } from "@/context/Lan"
import { Locale } from 'date-fns'
import { enUS, hi, bn, ta, te, gu, kn } from 'date-fns/locale'

// Update the getDateFnsLocale function to return the locale object
const getDateFnsLocale = (languageCode: string): Locale => {
    const localeMap: Record<string, Locale> = {
        'हिन्दी': hi,
        'বাংলা': bn,
        'தமிழ்': ta,
        'తెలుగు': te,
        'मराठी': enUS, // Fallback to English (not available in date-fns)
        'ગુજરાતી': gu,
        'ಕನ್ನಡ': kn,
        'മലയാളം': enUS, // Fallback to English (not available in date-fns)
        'اُردُو': enUS, // Fallback to English (not available in date-fns)
        'English': enUS
    }
    return localeMap[languageCode] || enUS
}

export interface DateRangePickerProps {
    /** Click handler for applying the updates from DateRangePicker. */
    onUpdate?: (values: { range: DateRange, rangeCompare?: DateRange }) => void
    /** Initial value for start date */
    initialDateFrom?: Date | string
    /** Initial value for end date */
    initialDateTo?: Date | string
    /** Initial value for start date for compare */
    initialCompareFrom?: Date | string
    /** Initial value for end date for compare */
    initialCompareTo?: Date | string
    /** Alignment of popover */
    align?: 'start' | 'center' | 'end'
    /** Option for locale */
    locale?: string
    /** Option for showing compare feature */
    showCompare?: boolean
}

// Helper function to map language codes to locale strings
const getLocaleFromLanguage = (languageCode: string): string => {
    const localeMap: Record<string, string> = {
        'हिन्दी': 'hi-IN',
        'বাংলা': 'bn-IN',
        'தமிழ்': 'ta-IN',
        'తెలుగు': 'te-IN',
        'मराठी': 'mr-IN',
        'ગુજરાતી': 'gu-IN',
        'ಕನ್ನಡ': 'kn-IN',
        'മലയാളം': 'ml-IN',
        'اُردُو': 'ur-IN',
        'English': 'en-US'
    }
    return localeMap[languageCode] || 'en-US'
}

const formatDate = (date: Date, locale: string = 'en-US'): string => {
    return date.toLocaleDateString(locale, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}

const getDateAdjustedForTimezone = (dateInput: Date | string): Date => {
    if (typeof dateInput === 'string') {
        const parts = dateInput.split('-').map((part) => parseInt(part, 10))
        const date = new Date(parts[0], parts[1] - 1, parts[2])
        return date
    } else {
        return dateInput
    }
}

interface DateRange {
    from: Date
    to: Date | undefined
}

interface Preset {
    name: string
    label: string
}

// Preset translations for multiple languages
const PRESET_TRANSLATIONS: Record<string, Record<string, string>> = {
    'today': {
        English: 'Today',
        हिन्दी: 'आज',
        বাংলা: 'আজ',
        தமிழ்: 'இன்று',
        తెలుగు: 'ఈరోజు',
        मराठी: 'आज',
        ગુજરાતી: 'આજે',
        ಕನ್ನಡ: 'ಇಂದು',
        മലയാളം: 'ഇന്ന്',
        اُردُو: 'آج'
    },
    'yesterday': {
        English: 'Yesterday',
        हिन्दी: 'कल',
        বাংলা: 'গতকাল',
        தமிழ்: 'நேற்று',
        తెలుగు: 'నిన్న',
        मराठी: 'काल',
        ગુજરાતી: 'ગઈકાલે',
        ಕನ್ನಡ: 'ನಿನ್ನೆ',
        മലയാളം: 'ഇന്നലെ',
        اُردُو: 'کل'
    },
    'last7': {
        English: 'Last 7 days',
        हिन्दी: 'पिछले 7 दिन',
        বাংলা: 'গত ৭ দিন',
        தமிழ்: 'கடந்த 7 நாட்கள்',
        తెలుగు: 'గత 7 రోజులు',
        मराठी: 'मागील 7 दिवस',
        ગુજરાતી: 'છેલ્લા 7 દિવસ',
        ಕನ್ನಡ: 'ಕಳೆದ 7 ದಿನಗಳು',
        മലയാളം: 'കഴിഞ്ഞ 7 ദിവസം',
        اُردُو: 'پچھلے 7 دن'
    },
    'last14': {
        English: 'Last 14 days',
        हिन्दी: 'पिछले 14 दिन',
        বাংলা: 'গত ১৪ দিন',
        தமிழ்: 'கடந்த 14 நாட்கள்',
        తెలుగు: 'గత 14 రోజులు',
        मराठी: 'मागील 14 दिवस',
        ગુજરાતી: 'છેલ્લા 14 દિવસ',
        ಕನ್ನಡ: 'ಕಳೆದ 14 ದಿನಗಳು',
        മലയാളം: 'കഴിഞ്ഞ 14 ദിവസം',
        اُردُو: 'پچھلے 14 دن'
    },
    'last30': {
        English: 'Last 30 days',
        हिन्दी: 'पिछले 30 दिन',
        বাংলা: 'গত ৩০ দিন',
        தமிழ்: 'கடந்த 30 நாட்கள்',
        తెలుగు: 'గత 30 రోజులు',
        मराठी: 'मागील 30 दिवस',
        ગુજરાતી: 'છેલ્લા 30 દિવસ',
        ಕನ್ನಡ: 'ಕಳೆದ 30 ದಿನಗಳು',
        മലയാളം: 'കഴിഞ്ഞ 30 ദിവസം',
        اُردُو: 'پچھلے 30 دن'
    },
    'thisWeek': {
        English: 'This Week',
        हिन्दी: 'इस सप्ताह',
        বাংলা: 'এই সপ্তাহ',
        தமிழ்: 'இந்த வாரம்',
        తెలుగు: 'ఈ వారం',
        मराठी: 'या आठवड्यात',
        ગુજરાતી: 'આ અઠવાડિયે',
        ಕನ್ನಡ: 'ಈ ವಾರ',
        മലയാളം: 'ഈ ആഴ്ച',
        اُردُو: 'اس ہفتے'
    },
    'lastWeek': {
        English: 'Last Week',
        हिन्दी: 'पिछले सप्ताह',
        বাংলা: 'গত সপ্তাহ',
        தமிழ்: 'கடந்த வாரம்',
        తెలుగు: 'గత వారం',
        मराठी: 'मागील आठवडा',
        ગુજરાતી: 'ગયા અઠવાડિયે',
        ಕನ್ನಡ: 'ಕಳೆದ ವಾರ',
        മലയാളം: 'കഴിഞ്ഞ ആഴ്ച',
        اُردُو: 'پچھلے ہفتے'
    },
    'thisMonth': {
        English: 'This Month',
        हिन्दी: 'इस महीने',
        বাংলা: 'এই মাস',
        தமிழ்: 'இந்த மாதம்',
        తెలుగు: 'ఈ నెల',
        मराठी: 'या महिन्यात',
        ગુજરાતી: 'આ મહિને',
        ಕನ್ನಡ: 'ಈ ತಿಂಗಳು',
        മലയാളം: 'ഈ മാസം',
        اُردُو: 'اس مہینے'
    },
    'lastMonth': {
        English: 'Last Month',
        हिन्दी: 'पिछले महीने',
        বাংলা: 'গত মাস',
        தமிழ்: 'கடந்த மாதம்',
        తెలుగు: 'గత నెల',
        मराठी: 'मागील महिना',
        ગુજરાતી: 'ગયા મહિને',
        ಕನ್ನಡ: 'ಕಳೆದ ತಿಂಗಳು',
        മലയാളം: 'കഴിഞ്ഞ മാസം',
        اُردُو: 'پچھلے مہینے'
    },
    'compare': {
        English: 'Compare',
        हिन्दी: 'तुलना करें',
        বাংলা: 'তুলনা করুন',
        தமிழ்: 'ஒப்பிடுக',
        తెలుగు: 'పోల్చండి',
        मराठी: 'तुलना करा',
        ગુજરાતી: 'સરખામણી કરો',
        ಕನ್ನಡ: 'ಹೋಲಿಸಿ',
        മലയാളം: 'താരതമ്യം ചെയ്യുക',
        اُردُو: 'موازنہ کریں'
    },
    'cancel': {
        English: 'Cancel',
        हिन्दी: 'रद्द करें',
        বাংলা: 'বাতিল',
        தமிழ்: 'ரத்து செய்',
        తెలుగు: 'రద్దు చేయండి',
        मराठी: 'रद्द करा',
        ગુજરાતી: 'રદ કરો',
        ಕನ್ನಡ: 'ರದ್ದುಮಾಡಿ',
        മലയാളം: 'റദ്ദാക്കുക',
        اُردُو: 'منسوخ کریں'
    },
    'update': {
        English: 'Update',
        हिन्दी: 'अपडेट करें',
        বাংলা: 'আপডেট',
        தமிழ்: 'புதுப்பிக்கவும்',
        తెలుగు: 'నవీకరించండి',
        मराठी: 'अद्यतनित करा',
        ગુજરાતી: 'અપડેટ કરો',
        ಕನ್ನಡ: 'ನವೀಕರಿಸಿ',
        മലയാളം: 'അപ്ഡേറ്റ് ചെയ്യുക',
        اُردُو: 'اپ ڈیٹ کریں'
    },
    'vs': {
        English: 'vs.',
        हिन्दी: 'बनाम',
        বাংলা: 'বনাম',
        தமிழ்: 'எதிராக',
        తెలుగు: 'వర్సెస్',
        मराठी: 'विरुद्ध',
        ગુજરાતી: 'વિરુદ્ધ',
        ಕನ್ನಡ: 'ವಿರುದ್ಧ',
        മലയാളം: 'എതിരെ',
        اُردُو: 'بمقابلہ'
    }
}

const getTranslation = (key: string, languageCode: string): string => {
    return PRESET_TRANSLATIONS[key]?.[languageCode] || PRESET_TRANSLATIONS[key]?.['en'] || key
}

// Define presets
const PRESETS: Preset[] = [
    { name: 'today', label: 'Today' },
    { name: 'yesterday', label: 'Yesterday' },
    { name: 'last7', label: 'Last 7 days' },
    { name: 'last14', label: 'Last 14 days' },
    { name: 'last30', label: 'Last 30 days' },
    { name: 'thisWeek', label: 'This Week' },
    { name: 'lastWeek', label: 'Last Week' },
    { name: 'thisMonth', label: 'This Month' },
    { name: 'lastMonth', label: 'Last Month' }
]

/** The DateRangePicker component allows a user to select a range of dates */
export const DateRangePicker: FC<DateRangePickerProps> & {
    filePath: string
} = ({
    initialDateFrom = new Date(new Date().setHours(0, 0, 0, 0)),
    initialDateTo,
    initialCompareFrom,
    initialCompareTo,
    onUpdate,
    align = 'end',
    locale = 'en-US',
    showCompare = true
}): JSX.Element => {
        const [isOpen, setIsOpen] = useState(false)
        const { language } = useContext(LanguageContext)

        // Get the locale based on the current language
        const currentLocale = getLocaleFromLanguage(language)

        const dateFnsLocale = getDateFnsLocale(language)


        const [range, setRange] = useState<DateRange>({
            from: getDateAdjustedForTimezone(initialDateFrom),
            to: initialDateTo
                ? getDateAdjustedForTimezone(initialDateTo)
                : getDateAdjustedForTimezone(initialDateFrom)
        })
        const [rangeCompare, setRangeCompare] = useState<DateRange | undefined>(
            initialCompareFrom
                ? {
                    from: new Date(new Date(initialCompareFrom).setHours(0, 0, 0, 0)),
                    to: initialCompareTo
                        ? new Date(new Date(initialCompareTo).setHours(0, 0, 0, 0))
                        : new Date(new Date(initialCompareFrom).setHours(0, 0, 0, 0))
                }
                : undefined
        )

        const openedRangeRef = useRef<DateRange | undefined>(undefined)
        const openedRangeCompareRef = useRef<DateRange | undefined>(undefined)

        const [selectedPreset, setSelectedPreset] = useState<string | undefined>(undefined)

        const [isSmallScreen, setIsSmallScreen] = useState(
            typeof window !== 'undefined' ? window.innerWidth < 960 : false
        )

        useEffect(() => {
            const handleResize = (): void => {
                setIsSmallScreen(window.innerWidth < 960)
            }

            window.addEventListener('resize', handleResize)

            return () => {
                window.removeEventListener('resize', handleResize)
            }
        }, [])

        useEffect(() => {
            setRange({
                from: getDateAdjustedForTimezone(initialDateFrom),
                to: initialDateTo
                    ? getDateAdjustedForTimezone(initialDateTo)
                    : getDateAdjustedForTimezone(initialDateFrom)
            })
        }, [initialDateFrom, initialDateTo])

        const getPresetRange = (presetName: string): DateRange => {
            const preset = PRESETS.find(({ name }) => name === presetName)
            if (!preset) throw new Error(`Unknown date range preset: ${presetName}`)
            const from = new Date()
            const to = new Date()
            const first = from.getDate() - from.getDay()

            switch (preset.name) {
                case 'today':
                    from.setHours(0, 0, 0, 0)
                    to.setHours(23, 59, 59, 999)
                    break
                case 'yesterday':
                    from.setDate(from.getDate() - 1)
                    from.setHours(0, 0, 0, 0)
                    to.setDate(to.getDate() - 1)
                    to.setHours(23, 59, 59, 999)
                    break
                case 'last7':
                    from.setDate(from.getDate() - 6)
                    from.setHours(0, 0, 0, 0)
                    to.setHours(23, 59, 59, 999)
                    break
                case 'last14':
                    from.setDate(from.getDate() - 13)
                    from.setHours(0, 0, 0, 0)
                    to.setHours(23, 59, 59, 999)
                    break
                case 'last30':
                    from.setDate(from.getDate() - 29)
                    from.setHours(0, 0, 0, 0)
                    to.setHours(23, 59, 59, 999)
                    break
                case 'thisWeek':
                    from.setDate(first)
                    from.setHours(0, 0, 0, 0)
                    to.setHours(23, 59, 59, 999)
                    break
                case 'lastWeek':
                    from.setDate(from.getDate() - 7 - from.getDay())
                    to.setDate(to.getDate() - to.getDay() - 1)
                    from.setHours(0, 0, 0, 0)
                    to.setHours(23, 59, 59, 999)
                    break
                case 'thisMonth':
                    from.setDate(1)
                    from.setHours(0, 0, 0, 0)
                    to.setHours(23, 59, 59, 999)
                    break
                case 'lastMonth':
                    from.setMonth(from.getMonth() - 1)
                    from.setDate(1)
                    from.setHours(0, 0, 0, 0)
                    to.setDate(0)
                    to.setHours(23, 59, 59, 999)
                    break
            }

            return { from, to }
        }

        const setPreset = (preset: string): void => {
            const range = getPresetRange(preset)
            setRange(range)
            if (rangeCompare) {
                const rangeCompare = {
                    from: new Date(
                        range.from.getFullYear() - 1,
                        range.from.getMonth(),
                        range.from.getDate()
                    ),
                    to: range.to
                        ? new Date(
                            range.to.getFullYear() - 1,
                            range.to.getMonth(),
                            range.to.getDate()
                        )
                        : undefined
                }
                setRangeCompare(rangeCompare)
            }
        }

        const checkPreset = (): void => {
            for (const preset of PRESETS) {
                const presetRange = getPresetRange(preset.name)

                const normalizedRangeFrom = new Date(range.from);
                normalizedRangeFrom.setHours(0, 0, 0, 0);
                const normalizedPresetFrom = new Date(
                    presetRange.from.setHours(0, 0, 0, 0)
                )

                const normalizedRangeTo = new Date(range.to ?? 0);
                normalizedRangeTo.setHours(0, 0, 0, 0);
                const normalizedPresetTo = new Date(
                    presetRange.to?.setHours(0, 0, 0, 0) ?? 0
                )

                if (
                    normalizedRangeFrom.getTime() === normalizedPresetFrom.getTime() &&
                    normalizedRangeTo.getTime() === normalizedPresetTo.getTime()
                ) {
                    setSelectedPreset(preset.name)
                    return
                }
            }

            setSelectedPreset(undefined)
        }

        const resetValues = (): void => {
            setRange({
                from:
                    typeof initialDateFrom === 'string'
                        ? getDateAdjustedForTimezone(initialDateFrom)
                        : initialDateFrom,
                to: initialDateTo
                    ? typeof initialDateTo === 'string'
                        ? getDateAdjustedForTimezone(initialDateTo)
                        : initialDateTo
                    : typeof initialDateFrom === 'string'
                        ? getDateAdjustedForTimezone(initialDateFrom)
                        : initialDateFrom
            })
            setRangeCompare(
                initialCompareFrom
                    ? {
                        from:
                            typeof initialCompareFrom === 'string'
                                ? getDateAdjustedForTimezone(initialCompareFrom)
                                : initialCompareFrom,
                        to: initialCompareTo
                            ? typeof initialCompareTo === 'string'
                                ? getDateAdjustedForTimezone(initialCompareTo)
                                : initialCompareTo
                            : typeof initialCompareFrom === 'string'
                                ? getDateAdjustedForTimezone(initialCompareFrom)
                                : initialCompareFrom
                    }
                    : undefined
            )
        }

        useEffect(() => {
            checkPreset()
        }, [range])

        const PresetButton = ({
            preset,
            label,
            isSelected
        }: {
            preset: string
            label: string
            isSelected: boolean
        }): JSX.Element => (
            <Button
                className={cn(isSelected && 'pointer-events-none')}
                variant="ghost"
                onClick={() => {
                    setPreset(preset)
                }}
            >
                <>
                    <span className={cn('pr-2 opacity-0', isSelected && 'opacity-70')}>
                        <CheckIcon width={18} height={18} />
                    </span>
                    {getTranslation(label, language)}
                </>
            </Button>
        )

        const areRangesEqual = (a?: DateRange, b?: DateRange): boolean => {
            if (!a || !b) return a === b
            return (
                a.from.getTime() === b.from.getTime() &&
                (!a.to || !b.to || a.to.getTime() === b.to.getTime())
            )
        }

        useEffect(() => {
            if (isOpen) {
                openedRangeRef.current = range
                openedRangeCompareRef.current = rangeCompare
            }
        }, [isOpen])

        return (
            <Popover
                modal={true}
                open={isOpen}
                onOpenChange={(open: boolean) => {
                    if (!open) {
                        resetValues()
                    }
                    setIsOpen(open)
                }}
            >
                <PopoverTrigger asChild>
                    <Button size={'lg'} className='border border-[#000000] text-[#000000] rounded-none' >
                        <div className="text-left">
                            <div className="py-1 flex items-center gap-2 whitespace-nowrap">
                                <Image alt='logo' width={18} height={18} src="/Calendar.svg" className='text-black' />
                                <div className='font-semibold text-[#000000]'>{`${formatDate(range.from, currentLocale)}${range.to != null ? ' - ' + formatDate(range.to, currentLocale) : ''
                                    }`}</div>
                            </div>
                            {rangeCompare != null && (
                                <div className="opacity-60 text-xs -mt-1 whitespace-nowrap">
                                    <>
                                        {getTranslation('vs', language)} {formatDate(rangeCompare.from, currentLocale)}
                                        {rangeCompare.to != null
                                            ? ` - ${formatDate(rangeCompare.to, currentLocale)}`
                                            : ''}
                                    </>
                                </div>
                            )}
                        </div>
                    </Button>
                </PopoverTrigger>
                <PopoverContent align={align} className="w-auto ">
                    <div className="flex py-2">
                        <div className="flex">
                            <div className="flex flex-col">
                                <div className="flex flex-col lg:flex-row gap-2 px-3 justify-end items-center lg:items-start pb-4 lg:pb-0">
                                    {showCompare && (
                                        <div className="flex items-center space-x-2 pr-4 py-1">
                                            <Switch
                                                defaultChecked={Boolean(rangeCompare)}
                                                onCheckedChange={(checked: boolean) => {
                                                    if (checked) {
                                                        if (!range.to) {
                                                            setRange({
                                                                from: range.from,
                                                                to: range.from
                                                            })
                                                        }
                                                        setRangeCompare({
                                                            from: new Date(
                                                                range.from.getFullYear(),
                                                                range.from.getMonth(),
                                                                range.from.getDate() - 365
                                                            ),
                                                            to: range.to
                                                                ? new Date(
                                                                    range.to.getFullYear() - 1,
                                                                    range.to.getMonth(),
                                                                    range.to.getDate()
                                                                )
                                                                : new Date(
                                                                    range.from.getFullYear() - 1,
                                                                    range.from.getMonth(),
                                                                    range.from.getDate()
                                                                )
                                                        })
                                                    } else {
                                                        setRangeCompare(undefined)
                                                    }
                                                }}
                                                id="compare-mode"
                                            />
                                            <Label htmlFor="compare-mode">{getTranslation('compare', language)}</Label>
                                        </div>
                                    )}
                                    <div className="flex flex-col gap-2">
                                        <div className="flex gap-2">
                                            <DateInput
                                                value={range.from}
                                                onChange={(date) => {
                                                    const toDate =
                                                        range.to == null || date > range.to ? date : range.to
                                                    setRange((prevRange) => ({
                                                        ...prevRange,
                                                        from: date,
                                                        to: toDate
                                                    }))
                                                }}
                                            />
                                            <div className="py-1">-</div>
                                            <DateInput
                                                value={range.to}
                                                onChange={(date) => {
                                                    const fromDate = date < range.from ? date : range.from
                                                    setRange((prevRange) => ({
                                                        ...prevRange,
                                                        from: fromDate,
                                                        to: date
                                                    }))
                                                }}
                                            />
                                        </div>
                                        {rangeCompare != null && (
                                            <div className="flex gap-2">
                                                <DateInput
                                                    value={rangeCompare?.from}
                                                    onChange={(date) => {
                                                        if (rangeCompare) {
                                                            const compareToDate =
                                                                rangeCompare.to == null || date > rangeCompare.to
                                                                    ? date
                                                                    : rangeCompare.to
                                                            setRangeCompare((prevRangeCompare) => ({
                                                                ...prevRangeCompare,
                                                                from: date,
                                                                to: compareToDate
                                                            }))
                                                        } else {
                                                            setRangeCompare({
                                                                from: date,
                                                                to: new Date()
                                                            })
                                                        }
                                                    }}
                                                />
                                                <div className="py-1">-</div>
                                                <DateInput
                                                    value={rangeCompare?.to}
                                                    onChange={(date) => {
                                                        if (rangeCompare && rangeCompare.from) {
                                                            const compareFromDate =
                                                                date < rangeCompare.from
                                                                    ? date
                                                                    : rangeCompare.from
                                                            setRangeCompare({
                                                                ...rangeCompare,
                                                                from: compareFromDate,
                                                                to: date
                                                            })
                                                        }
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {isSmallScreen && (
                                    <Select defaultValue={selectedPreset} onValueChange={(value) => { setPreset(value) }}>
                                        <SelectTrigger className="w-[180px] mx-auto mb-2">
                                            <SelectValue placeholder="Select..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PRESETS.map((preset) => (
                                                <SelectItem key={preset.name} value={preset.name}>
                                                    {getTranslation(preset.name, language)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                                <div className='text-black'>
                                    <Calendar
                                        mode="range"
                                        onSelect={(value: { from?: Date, to?: Date } | undefined) => {
                                            if (value?.from != null) {
                                                setRange({ from: value.from, to: value?.to })
                                            }
                                        }}
                                        selected={range}
                                        numberOfMonths={isSmallScreen ? 1 : 2}
                                        defaultMonth={
                                            new Date(
                                                new Date().setMonth(
                                                    new Date().getMonth() - (isSmallScreen ? 0 : 1)
                                                )
                                            )
                                        }
                                        locale={dateFnsLocale}
                                    />
                                </div>
                            </div>
                        </div>
                        {!isSmallScreen && (
                            <div className="flex flex-col items-end gap-1 pr-2 pl-6 pb-6">
                                <div className="flex w-full flex-col items-end gap-1 pr-2 pl-6 pb-6">
                                    {PRESETS.map((preset) => (
                                        <PresetButton
                                            key={preset.name}
                                            preset={preset.name}
                                            label={preset.name}
                                            isSelected={selectedPreset === preset.name}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end gap-2 py-2 pr-4">
                        <Button
                            className='text-black rounded-none border border-black'
                            onClick={() => {
                                setIsOpen(false)
                                resetValues()
                            }}
                            variant="ghost"
                        >
                            {getTranslation('cancel', language)}
                        </Button>
                        <Button
                            className='text-black rounded-none border border-black'
                            onClick={() => {
                                setIsOpen(false)
                                if (
                                    !areRangesEqual(range, openedRangeRef.current) ||
                                    !areRangesEqual(rangeCompare, openedRangeCompareRef.current)
                                ) {
                                    onUpdate?.({ range, rangeCompare })
                                }
                            }}
                        >
                            {getTranslation('update', language)}
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        )
    }

DateRangePicker.displayName = 'DateRangePicker'
DateRangePicker.filePath =
    'libs/shared/ui-kit/src/lib/date-range-picker/date-range-picker.tsx'