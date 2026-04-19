import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { optionsforLanguages } from "@/lib/lan"

const LanguageSelect = ({
    value,
    onChange,
    isDark,
}: {
    value: string
    onChange: (val: string) => void
    isDark: boolean
}) => (
    <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={cn(
            'h-8 w-full rounded-md px-3',
            'text-[11px] font-medium font-satoshi',
            'transition-colors',
            isDark
                ? 'border border-white/15 bg-white/5 text-white/80 hover:border-white/30 hover:bg-white/10 focus:ring-1 focus:ring-white/20 [&>svg]:text-white/30'
                : 'border border-black/10 bg-black/5 text-black/80 hover:border-black/25 hover:bg-black/10 focus:ring-1 focus:ring-black/15 [&>svg]:text-black/30'
        )}>
            <SelectValue placeholder="Select language" />
        </SelectTrigger>

        <SelectContent className={cn(
            'rounded-xl shadow-xl z-[900]',
            isDark
                ? 'border border-white/15 bg-[#111111]'
                : 'border border-black/10 bg-white'
        )}>
            {optionsforLanguages.map(({ label }) => (
                <SelectItem
                    key={label}
                    value={label}
                    className={cn(
                        'cursor-pointer rounded-lg text-[13px] font-satoshi',
                        isDark
                            ? 'text-white/70 focus:bg-white/10 focus:text-white/90'
                            : 'text-black/70 focus:bg-black/5 focus:text-black/90'
                    )}
                >
                    {label}
                </SelectItem>
            ))}
        </SelectContent>
    </Select>
)

export default LanguageSelect