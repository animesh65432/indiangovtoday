import React, { useContext } from 'react'
import { GroupedAnnouncement as AnnouncementsTypes } from "@/types"
import { useRouter } from 'next/router'
import { Button } from '../ui/button'
import { LanguageContext } from "@/context/Lan"
import { Card, CardContent, CardHeader, CardFooter } from '../ui/card'
import { ArrowRight, Bell } from "lucide-react"
import { TranslateText } from "@/lib/translatetext"
import { formatDate } from "@/lib/formatDate"


type Props = {
    Announcement: AnnouncementsTypes[]
}

const Announcement: React.FC<Props> = ({ Announcement }) => {
    const router = useRouter()
    const { language } = useContext(LanguageContext)

    const redirect_to = (id: string) => {
        router.push(`/announcement?id=${id}&lan=${language}`)
    }


    return (
        <Card className=' w-[75vw] md:w-full md:flex-1 flex flex-col h-full hover:shadow-lg transition-shadow duration-300'>
            <CardHeader className='pb-2'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-1'>
                        <div className='p-2 bg-[#E0614B]/10 rounded-lg'>
                            <Bell className='size-5 text-[#E0614B]' />
                        </div>
                        <div>
                            <p className='text-[#E0614B] text-lg font-semibold'>
                                {Announcement[0].type}
                            </p>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className='flex-1 space-y-1'>
                {Announcement.map((ann) => {
                    const formattedDate = formatDate(ann.created_at)

                    return (
                        <div
                            key={ann._id}
                            onClick={() => redirect_to(ann._id)}
                            className='p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group'
                        >
                            <div className='flex gap-3'>
                                <div className='mt-1.5 size-2 rounded-full bg-[#E0614B] flex-shrink-0' />
                                <div className='flex-1 min-w-0'>
                                    <p className='text-sm text-gray-800 line-clamp-2 group-hover:text-[#E0614B] transition-colors'>
                                        {ann.title}
                                    </p>
                                    {formattedDate && (
                                        <span className='text-xs text-gray-500 mt-1 block'>
                                            {formattedDate}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}

            </CardContent>

            <CardFooter className='pt-4 border-t'>
                <Button
                    onClick={() => router.push(`/announcements/${language === "English" ? Announcement[0].type : Announcement[0].original_type}`)}
                    className='bg-[#E0614B] ml-auto lg:w-[121px] hover:bg-[#dd8272] rounded-xl shadow-[4px_4px_0_0_#00000029]'
                >
                    {TranslateText[language].VIEW_ALL}
                    <ArrowRight className='size-4' />
                </Button>
            </CardFooter>
        </Card>
    )
}

export default Announcement