import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogIn } from "lucide-react"

const User: React.FC = () => {
    return (
        <div className="flex flex-row flex-wrap items-center gap-6 md:gap-12">
            <Avatar className='w-9 h-9 md:w-10 md:h-10'>
                <AvatarImage src="" alt="@shadcn" />
                <AvatarFallback className="bg-[#333333] text-white">
                    <LogIn size={20} />
                </AvatarFallback>
            </Avatar>
        </div>
    )
}

export default User