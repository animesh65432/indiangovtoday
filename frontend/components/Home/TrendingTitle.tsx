import React, { useContext } from "react"
import { motion } from "framer-motion"
import data from "@/data.json"
import { useRouter } from "next/navigation"
import { LanguageContext } from "@/context/Lan"

const TrendingTitle: React.FC = () => {
    const router = useRouter()
    const { language } = useContext(LanguageContext)
    return (
        <div className="w-[93vw] xl:w-[85vw] mx-auto border-t border-b border-black overflow-hidden">

            <motion.div
                className="flex whitespace-nowrap p-1"
                animate={{ x: ["0%", "-100%"] }}
                transition={{
                    repeat: Infinity,
                    duration: 20,
                    ease: "linear",
                }}
            >
                {[...data, ...data].map((item, index) => (
                    <span
                        key={index}
                        onClick={() => router.push(`/announcement?id=${item.announcementId}&lan=${language}`)}
                        className="[font-family:var(--font-inter)] font-semibold  leading-5 text-[0.9rem] hover:cursor-pointer border-r bg-pink-100 border-black px-6 py-2 text-black"
                    >
                        {item.title}
                    </span>
                ))}
            </motion.div>

        </div>
    )
}

export default TrendingTitle