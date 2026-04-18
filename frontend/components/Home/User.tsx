import { useContext } from 'react'
import { Settings2, Sun, Moon, Search } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { LanguageContext } from '@/context/Lan'
import { Currentdate } from '@/context/Currentdate'
import { ThemeContext } from '@/context/Theme'
import MobileSearchInput from './MobileSearchInput'
import { optionsforLanguages } from '@/lib/lan'
import { cn } from '@/lib/utils'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import { Input } from '../ui/input'
import { TranslateText } from '@/lib/translatetext'

type Props = {
    sheetOpen: boolean
    setSheetOpen: React.Dispatch<React.SetStateAction<boolean>>
    StatesSelected: string[]
    SetStatesSelected: React.Dispatch<React.SetStateAction<string[]>>
    SearchQuery: string
    SetSearchQuery: React.Dispatch<React.SetStateAction<string>>
    handleSearch: () => void
}

const User: React.FC<Props> = ({
    sheetOpen,
    setSheetOpen,
    StatesSelected,
    SetStatesSelected,
    SearchQuery,
    SetSearchQuery,
    handleSearch
}) => {
    const { language, onSelectLanguage } = useContext(LanguageContext)
    const { startdate, endDate, onChangeStartDate, onChangeEndDate } = useContext(Currentdate)
    const { theme, onChangeTheme } = useContext(ThemeContext)

    const handleDateUpdate = ({ range }: { range: { from: Date; to?: Date } }) => {
        onChangeStartDate(range.from)
        if (range.to) onChangeEndDate(range.to)
    }

    return (
        <div>
            <div className='md:block hidden'>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className={cn(
                            'group relative flex h-8 w-8 items-center justify-center',
                            'rounded-lg bg-[#321F1F]',
                            'border border-[#4a2e2e]',
                            'transition-all duration-150',
                            'hover:bg-[#3d2525] hover:border-[#FF3333]/40',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3333]/30',
                            'shadow-sm'
                        )}>
                            <Settings2 className="h-3.5 w-3.5 text-white/70 group-hover:text-white/90 transition-colors" strokeWidth={1.8} />
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="end"
                        sideOffset={6}
                        className={cn(
                            'w-64 z-[900] overflow-hidden rounded-xl p-0',
                            'border border-[#3d2525]',
                            'bg-[#1e1414]',
                            'shadow-2xl shadow-black/40',
                        )}
                    >

                        {/* Theme toggle */}
                        <div className="px-4 pt-3 pb-2.5">
                            <label className="mb-1.5 block text-[9px] font-medium uppercase tracking-[0.2em] text-white/35">
                                Theme
                            </label>
                            <div className="flex rounded-md border border-[#4a2e2e] bg-[#2a1a1a] p-0.5">
                                <button
                                    onClick={() => onChangeTheme('light')}
                                    className={cn(
                                        'flex flex-1 items-center justify-center gap-1.5 rounded py-1.5',
                                        'text-[10px] font-medium font-satoshi tracking-wide',
                                        'transition-all duration-150',
                                        theme === 'light'
                                            ? 'bg-[#FF3333] text-white shadow-sm shadow-[#FF3333]/30'
                                            : 'text-white/35 hover:text-white/60'
                                    )}
                                >
                                    <Sun className="h-3 w-3" strokeWidth={2} />
                                    Light
                                </button>
                                <button
                                    onClick={() => onChangeTheme('dark')}
                                    className={cn(
                                        'flex flex-1 items-center justify-center gap-1.5 rounded py-1.5',
                                        'text-[10px] font-medium font-satoshi tracking-wide',
                                        'transition-all duration-150',
                                        theme === 'dark'
                                            ? 'bg-[#FF3333] text-white shadow-sm shadow-[#FF3333]/30'
                                            : 'text-white/35 hover:text-white/60'
                                    )}
                                >
                                    <Moon className="h-3 w-3" strokeWidth={2} />
                                    Dark
                                </button>
                            </div>
                        </div>

                        <div className="mx-4 h-px bg-[#3d2525]" />

                        {/* Language */}
                        <div className="px-4 pt-2.5 pb-2.5">
                            <label className="mb-1.5 block text-[9px] font-medium uppercase tracking-[0.2em] text-white/35">
                                Language
                            </label>
                            <LanguageSelect value={language} onChange={onSelectLanguage} />
                        </div>

                        <div className="mx-4 h-px bg-[#3d2525]" />
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className='md:hidden block'>
                <Sheet open={sheetOpen} onOpenChange={(open) => setSheetOpen(open)}>
                    <SheetTrigger className="w-full block lg:hidden">
                        <button
                            onClick={() => setSheetOpen(true)}
                            className={cn(
                                'group relative flex h-8 w-8 items-center justify-center',
                                'rounded-lg bg-[#321F1F]',
                                'border border-[#4a2e2e]',
                                'transition-all duration-150',
                                'hover:bg-[#3d2525] hover:border-[#FF3333]/40',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3333]/30',
                                'shadow-sm'
                            )}>
                            <Settings2 className="h-3.5 w-3.5 text-white/70 group-hover:text-white/90 transition-colors" strokeWidth={1.8} />
                        </button>
                    </SheetTrigger>
                    <SheetContent side='bottom' className='h-dvh z-600'>
                        <MobileSearchInput
                            StatesSelected={StatesSelected}
                            setSheetOpen={setSheetOpen}
                            searchQuery={SearchQuery}
                            setSearchQuery={SetSearchQuery}
                            handleSearch={handleSearch}
                            SetStatesSelected={SetStatesSelected}
                        />
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    )
}

// ─── Language Select ──────────────────────────────────────────────

const LanguageSelect = ({
    value,
    onChange,
}: {
    value: string
    onChange: (val: string) => void
}) => (
    <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={cn(
            'h-8 w-full rounded-md border border-[#4a2e2e] bg-[#2a1a1a] px-3',
            'text-[11px] font-medium text-white/80 font-satoshi',
            'transition-colors hover:border-[#FF3333]/30 hover:bg-[#321F1F]',
            'focus:ring-1 focus:ring-[#FF3333]/25',
            '[&>svg]:text-white/30'
        )}>
            <SelectValue placeholder="Select language" />
        </SelectTrigger>

        <SelectContent className={cn(
            'rounded-xl border border-[#3d2525] shadow-xl',
            'bg-[#1e1414] z-[900]'
        )}>
            {optionsforLanguages.map(({ label }) => (
                <SelectItem
                    key={label}
                    value={label}
                    className={cn(
                        'cursor-pointer rounded-lg text-[11px] font-satoshi',
                        'text-white/70 focus:bg-[#321F1F] focus:text-white/90'
                    )}
                >
                    {label}
                </SelectItem>
            ))}
        </SelectContent>
    </Select>
)

export default User