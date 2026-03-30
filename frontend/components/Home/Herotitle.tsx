import React, { useContext, useEffect, useState } from "react";
import { LanguageContext } from "@/context/Lan";
import { motion } from "framer-motion";
import { GetStats } from "@/api/announcements";
import { floatingIcons } from "@/lib/floatingIcons"
import AnimatedCounter from "./AnimatedCounter";
import { TranslateText } from "@/lib/translatetext";
import { buildCacheKey, withCache } from "@/lib/lsCache"


const Herotitle: React.FC = () => {
    const { language } = useContext(LanguageContext);
    const [totalDepartments, setTotalDepartments] = useState<number>(0);
    const [totalAnnouncements, setTotal] = useState<number>(0);

    useEffect(() => {
        (async () => {
            try {
                const cacheKey = buildCacheKey("Stats_Announcements", {});
                const response = await withCache(cacheKey, "Stats_Announcements", async () => {
                    return await GetStats() as { data: { totalAnnouncements: number, totalDepartments: number } };
                });
                console.log("Stats fetched:", response.data);
                setTotal(response.data.totalAnnouncements);
                setTotalDepartments(response.data.totalDepartments);
            } catch (err) {
                console.error("Failed to fetch stats:", err);
            }
        })();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col items-center gap-1.5 w-[95%] md:w-[80%] lg:w-[70%] mx-auto mt-3 text-center px-4"
        >

            {floatingIcons.map((icon, i) => (
                <motion.img
                    key={i}
                    src={icon.src}
                    className={`absolute ${icon.className} opacity-[0.09] pointer-events-none select-none ${icon.desktopOnly ? "hidden sm:block" : "block"
                        }`}
                    style={{
                        filter:
                            "invert(27%) sepia(95%) saturate(700%) hue-rotate(330deg) brightness(85%)",
                    }}
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                        duration: 3.5 + i * 0.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.45,
                    }}
                />
            ))}

            <h1 className="font-satoshi text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.12] tracking-tight text-[#321F1F]">
                {TranslateText[language].EVERY_INDIAN_GOVERNMENT}{" "}
                <span className="text-[#ff3333] transition-all duration-300 hover:tracking-wide">
                    {TranslateText[language].ANNOUNCEMENT},
                </span>{" "}
                <span className="italic text-[#ff3333]">{TranslateText[language].ONE_PLACE}</span>
            </h1>

            <p className="hidden sm:block text-[#888] font-satoshi max-w-xs leading-relaxed">
                {TranslateText[language].TRACKING_ANNOUNCEMENTS_FROM}{" "}
                <span className="text-[#321F1F] font-medium">{totalDepartments} {TranslateText[language].DEPARTMENTS}</span>{" "}
                {TranslateText[language].ACROSS_INDIA}.
            </p>

            {totalAnnouncements > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="flex  font-satoshi items-center gap-2 px-4 py-1.5 rounded-full border border-red-100 bg-white shadow-sm text-[#e74c3c] text-xs sm:text-sm font-semibold"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e74c3c] animate-pulse" />
                    <AnimatedCounter target={totalAnnouncements} />
                    <span className="text-[#888] font-normal text-xs">
                        {TranslateText[language].ANNOUNCEMENTS_TRACKED}
                    </span>
                </motion.div>
            )}
        </motion.div>
    );
};

export default Herotitle;