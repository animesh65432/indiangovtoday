import React, { useContext, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { TrendingAnnouncementTypes, ResponseTrendingAnnouncementTypes } from "@/types"
import { LanguageContext } from "@/context/Lan"
import { GetTrendingIndiaAnnnouncements } from "@/api/announcements"
import { IsLoadingContext } from "@/context/IsLoading"

type Props = {
    StatesSelected: string[],
    DefaultsStatesApplied: string[]
}

const TrendingTitle: React.FC<Props> = ({ StatesSelected, DefaultsStatesApplied }) => {
    const router = useRouter()
    const { SetIsLoading } = useContext(IsLoadingContext)
    const [TrendingAnnouncements, SetTrendingAnnouncements] = useState<TrendingAnnouncementTypes[]>([]);
    const { language } = useContext(LanguageContext)

    const fetchTrendingAnnouncements = async () => {
        SetIsLoading(true);
        try {
            if (StatesSelected.length === 0) {
                const response = await GetTrendingIndiaAnnnouncements(language, DefaultsStatesApplied) as ResponseTrendingAnnouncementTypes;
                SetTrendingAnnouncements(response.data);
            } else {
                const response = await GetTrendingIndiaAnnnouncements(language, StatesSelected) as ResponseTrendingAnnouncementTypes;
                SetTrendingAnnouncements(response.data);
            }
        } finally {
            SetIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTrendingAnnouncements();
    }, [language, StatesSelected, DefaultsStatesApplied]);

    return (
        <div className="w-[93vw] xl:w-[85vw] mx-auto border-t border-b border-black overflow-hidden">

            <motion.div
                className="flex whitespace-nowrap p-2"
                animate={{ x: ["0%", "-100%"] }}
                transition={{
                    repeat: Infinity,
                    duration: 20,
                    ease: "linear",
                }}
            >
                {TrendingAnnouncements.map((item, index) => (
                    <h6
                        key={index}
                        onClick={() => router.push(`/announcement?id=${item.announcementId}&lan=${language}`)}
                        className="font-semibold  leading-5  hover:cursor-pointer  border-r bg-pink-100 border-black px-6 py-2 text-black"
                    >
                        {item.title}
                    </h6>
                ))}
            </motion.div>

        </div>
    )
}

export default TrendingTitle