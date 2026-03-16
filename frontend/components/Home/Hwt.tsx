import React from 'react'
import { Hwt as HwtData } from "@/lib/hwt"

const Hwt: React.FC = () => {
    return (
        <div className='bg-[#f8f7f2] flex w-[97%] mx-auto rounded-md border border-[#E8E4DA] divide-x divide-[#E8E4DA]'>
            {HwtData.map((item) => (
                <div key={item.title} className='flex-1 flex flex-col gap-1  px-2 py-1'>
                    <div className='flex items-center gap-2'>
                        <span>{item.Icon}</span>
                        <span className='text-[#FBBF24] font-mono text-xs font-bold'>{item.title}</span>
                    </div>

                    <div className='flex flex-col'>
                        <span className='text-[#333333] font-inter font-bold text-[12px]'>{item.select}</span>
                        <span className='font-inter text-xs text-[#aaaaaa]'>{item.des}</span>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Hwt