import { useState, useEffect, useContext } from "react"
import { ChevronDown, Check, MapPin } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
    Command, CommandInput, CommandList,
    CommandEmpty, CommandGroup, CommandItem, CommandSeparator,
} from "@/components/ui/command"
import { LanguageContext } from "@/context/Lan"
import { TranslateText } from "@/lib/translatetext"
import { ThemeContext } from "@/context/Theme"

const RECENT_KEY = "state-selector-recents"
const MAX_RECENTS = 5

type Props = {
    selectedState: string
    onStateClick: (value: string) => void
}

export function StateSelector({ selectedState, onStateClick }: Props) {
    const { language } = useContext(LanguageContext)
    const { theme } = useContext(ThemeContext)
    const [recents, setRecents] = useState<string[]>([])
    const [open, setOpen] = useState(false)
    const isDark = theme === "dark"

    const options = TranslateText[language].MULTISELECT_OPTIONS.slice(0, 36)

    useEffect(() => {
        try {
            const stored = localStorage.getItem(RECENT_KEY)
            if (stored) setRecents(JSON.parse(stored))
        } catch { }
    }, [])

    const handleSelect = (value: string) => {
        onStateClick(value)
        setRecents(prev => {
            const updated = [value, ...prev.filter(r => r !== value)].slice(0, MAX_RECENTS)
            try { localStorage.setItem(RECENT_KEY, JSON.stringify(updated)) } catch { }
            return updated
        })
        setOpen(false)
    }

    const recentOptions = recents
        .map(v => options.find(o => o.value === v))
        .filter(Boolean) as typeof options

    const itemClass = (isDark: boolean) => `
        py-3 px-3 rounded-lg cursor-pointer transition-colors
        aria-selected:bg-[#c51057]/20 
        ${isDark ? "text-gray-200 hover:text-white" : "text-black"}
    `

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="flex items-center py-1 rounded-md hover:bg-[#321F1F]/10 transition-colors">
                <ChevronDown size={15} className="text-[#c51057]" />
            </SheetTrigger>

            <SheetContent
                responsiveSide
                side="center"
                className={`h-full ${isDark ? "bg-[#050505]" : "bg-white"} md:h-[60vh] w-screen md:w-[35vw] mx-auto z-500 font-satoshi border-t border-white/10 rounded-t-2xl`}
            >
                <Command className="bg-transparent h-full flex flex-col">
                    <CommandInput
                        isDark={isDark}
                        onClose={() => open && setOpen(false)}
                        placeholder="Search states..."
                        className={`${isDark ? "text-white" : "text-black"} placeholder:text-gray-500 h-12 font-satoshi border-b border-white/10`}
                    />

                    <CommandList className="flex-1 max-h-none overflow-y-auto px-1 py-2">
                        <CommandEmpty className="text-gray-500 py-8">
                            No state found.
                        </CommandEmpty>

                        {recentOptions.length > 0 && (
                            <>
                                <CommandGroup
                                    heading="Recent"
                                    className="
                                        [&_[cmdk-group-heading]]:text-[#c51057]
                                        [&_[cmdk-group-heading]]:flex
                                        [&_[cmdk-group-heading]]:items-center
                                        [&_[cmdk-group-heading]]:gap-1.5
                                        [&_[cmdk-group-heading]]:uppercase
                                        [&_[cmdk-group-heading]]:tracking-wider
                                        [&_[cmdk-group-heading]]:text-[11px]
                                    "
                                >
                                    {recentOptions.map(state => (
                                        <CommandItem
                                            key={`recent-${state.value}`}
                                            value={`recent-${state.value}`}
                                            keywords={[state.label]}
                                            onSelect={() => handleSelect(state.value)}
                                            className={itemClass(isDark)}
                                        >
                                            <MapPin size={14} className={`shrink-0 ${isDark ? "text-white" : "text-gray-400"}`} />
                                            {state.label}
                                            {selectedState === state.value && (
                                                <Check size={14} className="ml-auto text-[#c51057]" />
                                            )}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>

                                <CommandSeparator className={isDark ? "bg-white/5 my-1" : "bg-gray-200 my-1"} />
                            </>
                        )}

                        <CommandGroup
                            heading="All States & UTs"
                            className="[&_[cmdk-group-heading]]:text-gray-500 [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-[11px]"
                        >
                            {options.map(state => (
                                <CommandItem
                                    key={state.value}
                                    value={state.value}
                                    keywords={[state.label]}
                                    onSelect={() => handleSelect(state.value)}
                                    className={itemClass(isDark)}
                                >
                                    <MapPin size={14} className={`shrink-0 ${isDark ? "text-white" : "text-gray-400"}`} />
                                    {state.label}
                                    {selectedState === state.value && (
                                        <Check size={14} className="ml-auto text-[#c51057]" />
                                    )}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </SheetContent>
        </Sheet>
    )
}