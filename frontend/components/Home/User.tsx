import { useContext } from 'react'
import { Settings2, Sun, Moon } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { LanguageContext } from '@/context/Lan'
import { ThemeContext } from '@/context/Theme'
import MobileSearchInput from './MobileSearchInput'
import { cn } from '@/lib/utils'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import LanguageSelect from '../LanguageSelect'

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
    const { theme, onChangeTheme } = useContext(ThemeContext)

    const IsDark = theme === "dark"

    return (
        <div>
            {/* Desktop */}
            <div className='md:block hidden'>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className={cn(
                            IsDark ? 'bg-black border-white/20' : 'bg-white border-black/20',
                            'group relative flex h-8 w-8 items-center justify-center',
                            'rounded-lg',
                            'border',
                            'transition-all duration-150',
                            IsDark
                                ? 'hover:bg-white/10 hover:border-white/40'
                                : 'hover:bg-black/5 hover:border-black/40',
                            'focus-visible:outline-none focus-visible:ring-2',
                            IsDark
                                ? 'focus-visible:ring-white/30'
                                : 'focus-visible:ring-black/20',
                            'shadow-sm'
                        )}>
                            <Settings2
                                className={cn(
                                    'h-3.5 w-3.5 transition-colors',
                                    IsDark
                                        ? 'text-white/70 group-hover:text-white/90'
                                        : 'text-black/60 group-hover:text-black/90'
                                )}
                                strokeWidth={1.8}
                            />
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="end"
                        sideOffset={6}
                        className={cn(
                            'w-64 z-[900] overflow-hidden rounded-xl p-0',
                            IsDark
                                ? 'border border-white/15 bg-[#111111]'
                                : 'border border-black/10 bg-white',
                            'shadow-2xl shadow-black/20',
                        )}
                    >
                        {/* Theme toggle */}
                        <div className="px-4 pt-3 pb-2.5">
                            <label className={cn(
                                'mb-1.5 block text-[9px] font-medium uppercase tracking-[0.2em]',
                                IsDark ? 'text-white/35' : 'text-black/35'
                            )}>
                                Theme
                            </label>
                            <div className={cn(
                                'flex rounded-md p-0.5',
                                IsDark
                                    ? 'border border-white/15 bg-white/5'
                                    : 'border border-black/10 bg-black/5'
                            )}>
                                <button
                                    onClick={() => onChangeTheme('light')}
                                    className={cn(
                                        'flex flex-1 items-center justify-center gap-1.5 rounded py-1.5',
                                        'text-[10px] font-medium font-satoshi tracking-wide',
                                        'transition-all duration-150',
                                        theme === 'light'
                                            ? 'bg-black text-white shadow-sm'
                                            : IsDark
                                                ? 'text-white/35 hover:text-white/60'
                                                : 'text-black/35 hover:text-black/60'
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
                                            ? 'bg-white text-black shadow-sm'
                                            : IsDark
                                                ? 'text-white/35 hover:text-white/60'
                                                : 'text-black/35 hover:text-black/60'
                                    )}
                                >
                                    <Moon className="h-3 w-3" strokeWidth={2} />
                                    Dark
                                </button>
                            </div>
                        </div>

                        <div className={cn('mx-4 h-px', IsDark ? 'bg-white/10' : 'bg-black/10')} />

                        {/* Language */}
                        <div className="px-4 pt-2.5 pb-2.5">
                            <label className={cn(
                                'mb-1.5 block text-[9px] font-medium uppercase tracking-[0.2em]',
                                IsDark ? 'text-white/35' : 'text-black/35'
                            )}>
                                Language
                            </label>
                            <LanguageSelect value={language} onChange={onSelectLanguage} isDark={IsDark} />
                        </div>

                        <div className={cn('mx-4 h-px', IsDark ? 'bg-white/10' : 'bg-black/10')} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className='md:hidden block'>
                <Sheet open={sheetOpen} onOpenChange={(open) => setSheetOpen(open)}>

                    <SheetTrigger asChild>
                        <button
                            onClick={() => setSheetOpen(true)}
                            className={cn(
                                'group relative flex h-8 w-8 items-center justify-center',
                                'rounded-lg',
                                IsDark
                                    ? 'bg-white/10 border-white/20 hover:bg-white/15 hover:border-white/40'
                                    : 'bg-black/5 border-black/15 hover:bg-black/10 hover:border-black/30',
                                'border',
                                'transition-all duration-150',
                                'focus-visible:outline-none focus-visible:ring-2',
                                IsDark ? 'focus-visible:ring-white/20' : 'focus-visible:ring-black/15',
                                'shadow-sm'
                            )}
                        >
                            <Settings2
                                className={cn(
                                    'h-3.5 w-3.5 transition-colors',
                                    IsDark
                                        ? 'text-white/70 group-hover:text-white/90'
                                        : 'text-black/60 group-hover:text-black/90'
                                )}
                                strokeWidth={1.8}
                            />
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


export default User