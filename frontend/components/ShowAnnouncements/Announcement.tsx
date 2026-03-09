import React, { useContext } from "react";
import { Announcement as AnnouncementType } from "@/types";
import { useRouter } from "next/router";
import { LanguageContext } from "@/context/Lan";
import { formatDateRelative } from "@/lib/formatDate";
import { LANGUAGE_CODES } from "@/lib/lan";
import { TranslateText } from "@/lib/translatetext";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";

type Props = {
    Announcement: AnnouncementType;
};

const Announcement: React.FC<Props> = ({ Announcement }) => {
    const router = useRouter();
    const { language } = useContext(LanguageContext);

    const redirectTo = () => {
        if (!Announcement?.announcementId) return;
        router.push(`/announcement?id=${Announcement.announcementId}&lan=${language}`);
    };

    return (
        <motion.article
            onClick={redirectTo}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            whileHover="hover"
            className="cursor-pointer group bg-white border border-black/10 overflow-hidden"
        >
            <div className="relative w-full h-[220px] overflow-hidden">
                <motion.div
                    variants={{ hover: { scale: 1.04 } }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full h-full"
                >
                    <Image
                        src={Announcement.image!}
                        alt={Announcement.title}
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        loading="lazy"
                    />
                </motion.div>
            </div>


            <div className="h-[2px] bg-black w-full" />


            <div className="p-5 flex flex-col gap-3">

                <div className="flex items-center justify-between">
                    <span className="text-[0.8rem] w-[70%] font-bold tracking-[0.18em] uppercase text-black/40">
                        {Announcement.department}
                    </span>
                    <span className="text-[0.8rem] italic text-black/40">
                        {formatDateRelative(Announcement.date, LANGUAGE_CODES[language], language)}
                    </span>
                </div>


                <h2 className="font-display text-black font-bold text-[1.15rem] leading-snug m-0">
                    {Announcement.title}
                </h2>

                <p className="font-body text-[13px] text-black/60 leading-relaxed">
                    {Announcement.description}
                </p>


                <motion.div
                    variants={{ hover: { x: 4 } }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-1 text-black font-body text-[0.9rem] sm:text-[1rem] font-bold tracking-[0.12em] uppercase mt-1 w-fit"
                >
                    {TranslateText[language].SEE_DETAILS}
                    <ArrowRight className="w-6 h-6" />
                </motion.div>
            </div>
        </motion.article>
    );
};

export default Announcement;