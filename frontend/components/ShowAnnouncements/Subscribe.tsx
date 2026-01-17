import React from 'react'
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'

const Subscribe: React.FC = () => {
    return (
        <div className='bg-white w-full flex flex-col p-4 gap-5'>
            <div className='flex flex-col gap-2'>
                <h3 className='uppercase'>stay informed</h3>
                <span className='uppercase text-[0.8rem]'>direct notice to your inbox</span>
            </div>

            <Input
                type='email'
                placeholder='email adress'
                className='w-full  p-5 rounded-none border-b border-gray-300 placeholder:uppercase  '
            />

            <Button className='uppercase bg-yellow-600 text-black font-semibold'>subscribe now</Button>

        </div>
    )
}

export default Subscribe