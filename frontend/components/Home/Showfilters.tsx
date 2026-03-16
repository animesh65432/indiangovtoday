import { LanguageContext } from '@/context/Lan'
import React, { useContext } from 'react'
import { X } from "lucide-react"
import { TranslateText } from '@/lib/translatetext'

type Props = {
    selectedDepartment: string,
    category: string,
    selectedStates: string[],
    SetStatesSelected: React.Dispatch<React.SetStateAction<string[]>>,
}

const Showfilters: React.FC<Props> = ({ SetStatesSelected, selectedDepartment, category, selectedStates }) => {
    const { language } = useContext(LanguageContext)

    const handleStateRemove = (state: string) => {
        SetStatesSelected((prev) => prev.filter((s) => s !== state));
    }

    const handleClearAll = () => {
        SetStatesSelected([]);
    }

    return (
        <div className='w-full border-t border-[#E8E4DA] flex  justify-between items-center pt-2'>
            <div className='flex gap-2 items-center flex-wrap'>
                <div className='flex  gap-2 items-center flex-wrap'>
                    {selectedStates.map((state) => {
                        return (
                            <>
                                {state !== TranslateText[language].MULTISELECT_OPTIONS[TranslateText[language].MULTISELECT_OPTIONS.length - 1].value && (
                                    <div onClick={() => handleStateRemove(state)} key={state} className='w-fit flex items-center text-[11px] font-poppins  text-[#92400E] font-semibold border border-[#F2C572] px-2 py-0.5 bg-[#FEF3C7] rounded'>
                                        {state}
                                        <span>
                                            <X
                                                size={12}
                                                strokeWidth={3}
                                                className="ml-1 cursor-pointer text-[#92400E]"
                                            />
                                        </span>
                                    </div>
                                )}
                            </>
                        )
                    })}
                    {selectedDepartment.length > 0 &&
                        <div className='w-fit flex items-center text-[11px] font-poppins  text-[#92400E] font-semibold border border-[#F2C572] px-2 py-0.5 bg-[#FEF3C7] rounded'>
                            {selectedDepartment}
                            <span>
                                <X
                                    size={12}
                                    strokeWidth={3}
                                    className="ml-1 cursor-pointer text-[#92400E]"
                                />
                            </span>
                        </div>
                    }
                    {category.length > 0 &&
                        <div className='w-fit flex items-center text-[11px] font-poppins  text-[#92400E] font-semibold border border-[#F2C572] px-2 py-0.5 bg-[#FEF3C7] rounded'>
                            {category}
                            <span>
                                <X
                                    size={12}
                                    strokeWidth={3}
                                    className="ml-1 cursor-pointer text-[#92400E]"
                                />
                            </span>
                        </div>
                    }
                </div>

            </div>
            <div onClick={handleClearAll} className='text-[#787373] text-[11px] underline font-poppins hover:cursor-pointer'>Clear all</div>
        </div>
    )
}

export default Showfilters