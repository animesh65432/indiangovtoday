import React, { useContext } from "react";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { LanguageContext } from "@/context/Lan";
import { motion } from "framer-motion";
import { TranslateText } from "@/lib/translatetext";

const Herotitle: React.FC = () => {
    const { language } = useContext(LanguageContext);

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1], // very smooth (easeOutExpo feel)
            }}
            className="flex flex-col items-center gap-2 sm:gap-3 w-[95%] md:w-[80%] mx-auto mt-6 text-center"
        >
            <h1 className="font-satoshi text-3xl md:text-5xl font-bold leading-[1.15] tracking-tight text-[#321F1F]">
                <span className="block md:inline">
                    {TranslateText[language].FIND_GOVERNMENT}{" "}
                </span>

                {/* subtle hover effect instead of animation */}
                <span className="block md:inline text-[#ff3333] transition-all duration-300 hover:tracking-wide">
                    {TranslateText[language].UPDATES_THAT_MATTER}
                </span>
            </h1>

            <TextGenerateEffect
                words={TranslateText[language].TO_YOU}
                className="text-center font-bold text-2xl md:text-4xl font-satoshi text-[#ff3333]"
                duration={0.6}
            />
        </motion.div>
    );
};

export default Herotitle;