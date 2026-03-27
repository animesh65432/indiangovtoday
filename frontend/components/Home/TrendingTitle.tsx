import React, { useContext, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { TrendingAnnouncementTypes, ResponseTrendingAnnouncementTypes } from "@/types"
import { LanguageContext } from "@/context/Lan"
import { GetTrendingIndiaAnnnouncements } from "@/api/announcements"
import { IsLoadingContext } from "@/context/IsLoading"



const TrendingTitle: React.FC = () => {
    const router = useRouter()
    const { SetIsLoading } = useContext(IsLoadingContext)
    const [TrendingAnnouncements, SetTrendingAnnouncements] = useState<TrendingAnnouncementTypes[]>([]);
    const { language } = useContext(LanguageContext)

    useEffect(() => {
        const controller = new AbortController();

        const fetchTrendingAnnouncements = async () => {
            SetIsLoading(true);
            try {
                const response = await GetTrendingIndiaAnnnouncements(
                    language, controller.signal
                ) as ResponseTrendingAnnouncementTypes;

                if (!controller.signal.aborted) {
                    SetTrendingAnnouncements(response.data);
                }
            } catch (error: unknown) {
                if (error instanceof Error &&
                    (error.name === 'AbortError' || (error as { code?: string }).code === 'ERR_CANCELED')) {
                    return;
                }
            } finally {
                if (!controller.signal.aborted) {
                    SetIsLoading(false);
                }
            }
        };

        fetchTrendingAnnouncements();
        return () => controller.abort();

    }, [language]);

    return (
        <div className="w-[93vw] xl:w-[90%] mx-auto border-t border-b border-black overflow-hidden">

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