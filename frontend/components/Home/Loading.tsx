import React from 'react'
import { LoaderCircle } from "lucide-react"

const Loading = () => {
    return (
        <div className="flex items-center justify-center h-dvh">
            <LoaderCircle className="animate-spin text-black w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20" />
        </div>
    )
}

export default Loading