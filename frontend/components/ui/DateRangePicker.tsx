'use client'

import React, { type FC, useState, useEffect, useRef, JSX, useContext } from 'react'
import { Button } from './button'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Calendar } from './calendar'
import { DateInput } from './DateInput'
import { CheckIcon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'
import { LanguageContext } from "@/context/Lan"
import { Calendar as CalendarIcon } from "lucide-react"
import { Locale } from 'date-fns'
import { enUS, hi, bn, ta, te, gu, kn } from 'date-fns/locale'

const getDateFnsLocale = (languageCode: string): Locale => {
    const localeMap: Record<string, Locale> = {
        'हिन्दी': hi,
        'বাংলা': bn,
        'தமிழ்': ta,
        'తెలుగు': te,
        'मराठी': enUS,
        'ગુજराती': gu,
        'ಕನ್ನಡ': kn,
        'മലayāḷam': enUS,
        'اُردُو': enUS,
        'English': enUS
    }
    return localeMap[languageCode] || enUS
}

export interface DateRangePickerProps {
    onUpdate?: (values: { range: DateRange, rangeCompare?: DateRange }) => void
    initialDateFrom?: Date | string
    initialDateTo?: Date | string
    initialCompareFrom?: Date | string
    initialCompareTo?: Date | string
    align?: 'start' | 'center' | 'end'
    locale?: string
    showCompare?: boolean
}

const getLocaleFromLanguage = (languageCode: string): string => {
    const localeMap: Record<string, string> = {
        'हिन्दी': 'hi-IN',
        'বাংলা': 'bn-IN',
        'தமிழ்': 'ta-IN',
        'తెలుగు': 'te-IN',
        'मराठी': 'mr-IN',
        'ગुजराती': 'gu-IN',
        'ಕನ್ನಡ': 'kn-IN',
        'മലayāḷam': 'ml-IN',
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

const PRESET_TRANSLATIONS: Record<string, Record<string, string>> = {
    'today': {
        English: 'Today', हिन्दी: 'आज', বাংলা: 'আজ', தமிழ்: 'இன்று',
        తెలుగు: 'ఈరోజు', मराठी: 'आज', ಕನ್ನಡ: 'ಇಂದು', اُردُو: 'آج'
    },
    'yesterday': {
        English: 'Yesterday', हिन्दी: 'कल', বাংলা: 'গতকাল', தமிழ்: 'நேற்று',
        తెలుగు: 'నిన్న', मराठी: 'काल', ಕನ್ನಡ: 'ನಿನ್ನೆ', اُردُو: 'کل'
    },
    'last7': {
        English: 'Last 7 days', हिन्दी: 'पिछले 7 दिन', বাংলা: 'গত ৭ দিন',
        தமிழ்: 'கடந்த 7 நாட்கள்', తెలుగు: 'గత 7 రోజులు', मराठी: 'मागील 7 दिवस',
        ಕನ್ನಡ: 'ಕಳೆದ 7 ದಿನಗಳು', اُردُو: 'پچھلے 7 دن'
    },
    'last14': {
        English: 'Last 14 days', हिन्दी: 'पिछले 14 दिन', বাংলা: 'গত ১৪ দিন',
        தமிழ்: 'கடந்த 14 நாட்கள்', తెలుగు: 'గత 14 రోజులు', मराठी: 'मागील 14 दिवस',
        ಕನ್ನಡ: 'ಕಳೆದ 14 ದಿನಗಳು', اُردُو: 'پچھلے 14 دن'
    },
    'last30': {
        English: 'Last 30 days', हिन्दी: 'पिछले 30 दिन', বাংলা: 'গত ৩০ দিন',
        தமிழ்: 'கடந்த 30 நாட்கள்', తెలుగు: 'గత 30 రోజులు', मराठी: 'मागील 30 दिवस',
        ಕನ್ನಡ: 'ಕಳೆದ 30 ದಿನಗಳು', اُردُو: 'پچھلے 30 دن'
    },
    'thisWeek': {
        English: 'This Week', हिन्दी: 'इस सप्ताह', বাংলা: 'এই সপ্তাহ',
        தமிழ்: 'இந்த வாரம்', తెలుగు: 'ఈ వారం', मराठी: 'या आठवड्यात',
        ಕನ್ನಡ: 'ಈ ವಾರ', اُردُو: 'اس ہفتے'
    },
    'lastWeek': {
        English: 'Last Week', हिन्दी: 'पिछले सप्ताह', বাংলা: 'গত সপ্তাহ',
        தமிழ்: 'கடந்த வாரம்', తెలుగు: 'గత వారం', मराठी: 'मागील आठवडा',
        ಕನ್ನಡ: 'ಕಳೆದ ವಾರ', اُردُو: 'پچھلے ہفتے'
    },
    'thisMonth': {
        English: 'This Month', हिन्दी: 'इस महीने', বাংলা: 'এই মাস',
        தமிழ்: 'இந்த மாதம்', తెలుగు: 'ఈ నెల', मराठी: 'या महिन्यात',
        ಕನ್ನಡ: 'ಈ ತಿಂಗಳು', اُردُو: 'اس مہینے'
    },
    'lastMonth': {
        English: 'Last Month', हिन्दी: 'पिछले महीने', বাংলা: 'গত মাস',
        தமிழ்: 'கடந்த மாதம்', తెలుగు: 'గత నెల', मराठी: 'मागील महिना',
        ಕನ್ನಡ: 'ಕಳೆದ ತಿಂಗಳು', اُردُو: 'پچھلے مہینے'
    },
    'cancel': {
        English: 'Cancel', हिन्दी: 'रद्द करें', বাংলা: 'বাতিল', தமிழ்: 'ரத்து செய்',
        తెలుగు: 'రద్దు చేయండి', मराठी: 'रद्द करा', ಕನ್ನಡ: 'ರದ್ದுಮಾಡಿ', اُردُو: 'منسوخ کریں'
    },
    'update': {
        English: 'Update', हिन्दी: 'अपडेट करें', বাংলা: 'আপডেট', தமிழ்: 'புதுப்பிக்கவும்',
        తెలుగు: 'నవీకరించండి', मराठी: 'अद्यतनित करा', ಕನ್ನಡ: 'ನವೀಕರಿಸಿ', اُردُو: 'اپ ڈیٹ کریں'
    },
    'vs': {
        English: 'vs.', हिन्दी: 'बनाम', বাংলা: 'বনাম', தமிழ்: 'எதிராக',
        తెలుగు: 'వర్సెస్', मराठी: 'विरुद्ध', ಕನ್ನಡ: 'ವಿರುದ್ಧ', اُردُو: 'بمقابلہ'
    }
}

const getTranslation = (key: string, languageCode: string): string => {
    return PRESET_TRANSLATIONS[key]?.[languageCode] || PRESET_TRANSLATIONS[key]?.['English'] || key
}

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

export const DateRangePicker: FC<DateRangePickerProps> & {
    filePath: string
} = ({
    initialDateFrom = new Date(new Date().setHours(0, 0, 0, 0)),
    initialDateTo,
    initialCompareFrom,
    initialCompareTo,
    onUpdate,
    align = 'center',
    locale = 'en-US',
    showCompare = true
}): JSX.Element => {
        const [isOpen, setIsOpen] = useState(false)
        const { language } = useContext(LanguageContext)

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
            const handleResize = (): void => { setIsSmallScreen(window.innerWidth < 960) }
            window.addEventListener('resize', handleResize)
            return () => { window.removeEventListener('resize', handleResize) }
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
                    from.setHours(0, 0, 0, 0); to.setHours(23, 59, 59, 999); break
                case 'yesterday':
                    from.setDate(from.getDate() - 1); from.setHours(0, 0, 0, 0)
                    to.setDate(to.getDate() - 1); to.setHours(23, 59, 59, 999); break
                case 'last7':
                    from.setDate(from.getDate() - 6); from.setHours(0, 0, 0, 0); to.setHours(23, 59, 59, 999); break
                case 'last14':
                    from.setDate(from.getDate() - 13); from.setHours(0, 0, 0, 0); to.setHours(23, 59, 59, 999); break
                case 'last30':
                    from.setDate(from.getDate() - 29); from.setHours(0, 0, 0, 0); to.setHours(23, 59, 59, 999); break
                case 'thisWeek':
                    from.setDate(first); from.setHours(0, 0, 0, 0); to.setHours(23, 59, 59, 999); break
                case 'lastWeek':
                    from.setDate(from.getDate() - 7 - from.getDay())
                    to.setDate(to.getDate() - to.getDay() - 1)
                    from.setHours(0, 0, 0, 0); to.setHours(23, 59, 59, 999); break
                case 'thisMonth':
                    from.setDate(1); from.setHours(0, 0, 0, 0); to.setHours(23, 59, 59, 999); break
                case 'lastMonth':
                    from.setMonth(from.getMonth() - 1); from.setDate(1); from.setHours(0, 0, 0, 0)
                    to.setDate(0); to.setHours(23, 59, 59, 999); break
            }
            return { from, to }
        }

        const setPreset = (preset: string): void => {
            const range = getPresetRange(preset)
            setRange(range)
            if (rangeCompare) {
                setRangeCompare({
                    from: new Date(range.from.getFullYear() - 1, range.from.getMonth(), range.from.getDate()),
                    to: range.to
                        ? new Date(range.to.getFullYear() - 1, range.to.getMonth(), range.to.getDate())
                        : undefined
                })
            }
        }

        const checkPreset = (): void => {
            for (const preset of PRESETS) {
                const presetRange = getPresetRange(preset.name)
                const normalizedRangeFrom = new Date(range.from); normalizedRangeFrom.setHours(0, 0, 0, 0)
                const normalizedPresetFrom = new Date(presetRange.from.setHours(0, 0, 0, 0))
                const normalizedRangeTo = new Date(range.to ?? 0); normalizedRangeTo.setHours(0, 0, 0, 0)
                const normalizedPresetTo = new Date(presetRange.to?.setHours(0, 0, 0, 0) ?? 0)
                if (
                    normalizedRangeFrom.getTime() === normalizedPresetFrom.getTime() &&
                    normalizedRangeTo.getTime() === normalizedPresetTo.getTime()
                ) {
                    setSelectedPreset(preset.name); return
                }
            }
            setSelectedPreset(undefined)
        }

        const resetValues = (): void => {
            setRange({
                from: typeof initialDateFrom === 'string' ? getDateAdjustedForTimezone(initialDateFrom) : initialDateFrom,
                to: initialDateTo
                    ? typeof initialDateTo === 'string' ? getDateAdjustedForTimezone(initialDateTo) : initialDateTo
                    : typeof initialDateFrom === 'string' ? getDateAdjustedForTimezone(initialDateFrom) : initialDateFrom
            })
            setRangeCompare(
                initialCompareFrom
                    ? {
                        from: typeof initialCompareFrom === 'string' ? getDateAdjustedForTimezone(initialCompareFrom) : initialCompareFrom,
                        to: initialCompareTo
                            ? typeof initialCompareTo === 'string' ? getDateAdjustedForTimezone(initialCompareTo) : initialCompareTo
                            : typeof initialCompareFrom === 'string' ? getDateAdjustedForTimezone(initialCompareFrom) : initialCompareFrom
                    }
                    : undefined
            )
        }

        useEffect(() => { checkPreset() }, [range])

        useEffect(() => {
            if (isOpen) {
                openedRangeRef.current = range
                openedRangeCompareRef.current = rangeCompare
            }
        }, [isOpen])

        // CHANGE 1: h-8 added — only height reduced, all other original styles kept
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
                className={cn('h-8 hover:bg-[#f0eaea] text-[#321F1F]', isSelected && 'pointer-events-none')}
                onClick={() => { setPreset(preset) }}
            >
                <>
                    <span className={cn('pr-2 opacity-0 text-white', isSelected && 'opacity-70')}>
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

        return (
            <Popover
                modal={true}
                open={isOpen}
                onOpenChange={(open: boolean) => {
                    if (!open) resetValues()
                    setIsOpen(open)
                }}
            >
                <PopoverTrigger asChild>
                    <Button size={'lg'} className=' text-[#321F1F] rounded-none' >
                        <div className="text-left">
                            <div className="py-1 flex items-center gap-2 whitespace-nowrap">
                                <CalendarIcon width={18} height={18} className='text-[#FF3333]' />
                                <div className=' text-[#321F1F] font-satoshi'>{`${formatDate(range.from, currentLocale)}${range.to != null ? ' - ' + formatDate(range.to, currentLocale) : ''}`}</div>
                            </div>
                            {rangeCompare != null && (
                                <div className="opacity-60 text-xs -mt-1 whitespace-nowrap">
                                    <>
                                        {getTranslation('vs', language)} {formatDate(rangeCompare.from, currentLocale)}
                                        {rangeCompare.to != null ? ` - ${formatDate(rangeCompare.to, currentLocale)}` : ''}
                                    </>
                                </div>
                            )}
                        </div>
                    </Button>
                </PopoverTrigger>

                <PopoverContent align={align} className="w-auto font-satoshi">
                    {/* CHANGE 2: py-2 → py-1 */}
                    <div className="flex py-1">
                        <div className="flex">
                            <div className="flex flex-col">
                                {/* CHANGE 3: pb-4 → pb-1 */}
                                <div className="flex flex-col lg:flex-row gap-2 px-3 justify-end items-center lg:items-start pb-1 lg:pb-0">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex gap-2">
                                            <DateInput
                                                value={range.from}
                                                onChange={(date) => {
                                                    const toDate = range.to == null || date > range.to ? date : range.to
                                                    setRange((prevRange) => ({ ...prevRange, from: date, to: toDate }))
                                                }}
                                            />
                                            <div className="py-1">-</div>
                                            <DateInput
                                                value={range.to}
                                                onChange={(date) => {
                                                    const fromDate = date < range.from ? date : range.from
                                                    setRange((prevRange) => ({ ...prevRange, from: fromDate, to: date }))
                                                }}
                                            />
                                        </div>
                                        {rangeCompare != null && (
                                            <div className="flex gap-2">
                                                <DateInput
                                                    value={rangeCompare?.from}
                                                    onChange={(date) => {
                                                        if (rangeCompare) {
                                                            const compareToDate = rangeCompare.to == null || date > rangeCompare.to ? date : rangeCompare.to
                                                            setRangeCompare((prevRangeCompare) => ({ ...prevRangeCompare, from: date, to: compareToDate }))
                                                        } else {
                                                            setRangeCompare({ from: date, to: new Date() })
                                                        }
                                                    }}
                                                />
                                                <div className="py-1">-</div>
                                                <DateInput
                                                    value={rangeCompare?.to}
                                                    onChange={(date) => {
                                                        if (rangeCompare && rangeCompare.from) {
                                                            const compareFromDate = date < rangeCompare.from ? date : rangeCompare.from
                                                            setRangeCompare({ ...rangeCompare, from: compareFromDate, to: date })
                                                        }
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>


                                {/* CHANGE 4: --rdp-cell-size overridden to 34px via inline style */}
                                <div
                                    className='text-[#321F1F]'
                                    style={{ '--rdp-cell-size': '34px' } as React.CSSProperties}
                                >
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
                                            new Date(new Date().setMonth(new Date().getMonth() - (isSmallScreen ? 0 : 1)))
                                        }
                                        locale={dateFnsLocale}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* CHANGE 5: pb-6 → pb-1 on both wrappers */}
                        {!isSmallScreen && (
                            <div className="flex flex-col items-end gap-1 pr-2 pl-6 pb-1">
                                <div className="flex w-full flex-col items-end gap-1 pr-2 pl-6 pb-1">
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

                    {/* CHANGE 6: py-2 → py-1 on footer */}
                    <div className="flex justify-end gap-2 py-1 pr-4">
                        <Button
                            className='text-white rounded-none bg-[#FF3333]'
                            onClick={() => { setIsOpen(false); resetValues() }}
                            variant="ghost"
                        >
                            {getTranslation('cancel', language)}
                        </Button>
                        <Button
                            className='text-white rounded-none bg-[#FF3333]'
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
DateRangePicker.filePath = 'libs/shared/ui-kit/src/lib/date-range-picker/date-range-picker.tsx'