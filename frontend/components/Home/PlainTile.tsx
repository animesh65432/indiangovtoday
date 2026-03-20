import React, { useContext } from "react";
import { Announcement } from "@/types";
import { getCat, GRID_CLASSES, TileSize } from "@/lib/categoryStyles";
import { LanguageContext } from "@/context/Lan";
import { formatDateInLanguage } from "@/lib/formatDate";
import { tileVariants, tileTransition, arrowVariants, arrowTransition } from "../ui/animations";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation"
import Badge from "./Badge";

interface PlainTileProps {
    ann: Announcement;
    size: TileSize;
    index?: number;
}

export default function PlainTile({ ann, size, index = 0 }: PlainTileProps) {
    const cat = getCat(ann.category);
    const { language } = useContext(LanguageContext);
    const router = useRouter();

    return (
        <motion.div
            variants={tileVariants}
            initial="initial"
            animate="animate"
            whileHover="whileHover"
            transition={tileTransition(index)}
            className={`
        ${GRID_CLASSES[size]}
        rounded-2xl border border-black/[0.06] p-4
        flex flex-col gap-2 
        transition-all duration-200
        hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/80
      `}
            style={{ background: cat.tile }}
        >
            <Badge category={ann.category} />

            <h3 className={`
        font-satoshi font-semibold text-slate-800 leading-snug
        ${size === "big" ? "text-xl " : "text-xl "}
      `}>
                {ann.title}
            </h3>

            {size === "big" && (
                <p className="text-xs font-satoshi text-[1rem] text-slate-500 leading-3 xl:leading-4 py-2">
                    {ann.description}
                </p>
            )}


            <div className="flex items-center justify-between gap-2 pt-2 mt-auto border-t border-black/[0.05]">
                <div className="min-w-0">
                    <p className="text-[12px] md:text-[15px]  font-satoshi text-slate-600 truncate">{ann.department}</p>
                    <p className="text-[12px] md:text-[15px] font-satoshi text-slate-600">{formatDateInLanguage(ann.date, language)}</p>
                </div>
                <motion.div
                    whileHover={arrowVariants.whileHover}
                    whileTap={arrowVariants.whileTap}
                    transition={arrowTransition}
                    onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/announcement?id=${ann.announcementId}&lan=${language}`)
                    }}
                    className="w-10 h-10 hover:cursor-pointer flex-shrink-0 rounded-full flex items-center justify-center opacity-80"
                    style={{ background: cat.dot + "22" }}
                >
                    <svg className="w-5 h-5 md:w-6 md:h-6" style={{ color: cat.dot }} viewBox="0 0 16 16" fill="none">
                        <path d="M5.5 8h5M8.5 5.5l2.5 2.5-2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </motion.div>
            </div>
        </motion.div>
    );
}