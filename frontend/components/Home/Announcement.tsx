import React from 'react'
import { AnnouncementsTypes } from "@/types"
import { useRouter } from 'next/router'
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from '../ui/badge'

type Props = {
    Announcement: AnnouncementsTypes
}

const Announcement: React.FC<Props> = ({ Announcement }) => {
    const router = useRouter()

    const redirect_to = (id: string) => {
        router.push(`/Announcement?id=${id}`)
    }

    return (
        <Card
            onClick={() => redirect_to(Announcement._id)}
            className="cursor-pointer rounded-xl border w-[85%] mx-auto border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
        >
            <CardContent className="p-6 space-y-3">
                <Badge
                    variant="outline"
                    className="text-[0.7rem] sm:text-xs text-[#757575] break-words whitespace-normal max-w-[100%]"
                >
                    {Announcement.type}
                </Badge>


                <h2 className=" text-[0.9rem] sm:text-[1rem] md:text-xl font-semibold leading-snug">
                    {Announcement.title}
                </h2>
            </CardContent>
        </Card>
    )
}

export default Announcement