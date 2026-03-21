import React, { useContext } from "react";
import { motion } from "framer-motion";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { LanguageContext } from "@/context/Lan";
import { TranslateText } from "@/lib/translatetext";

const Hero: React.FC = () => {
    const { language } = useContext(LanguageContext)
    return (
        <div className="ml-4">
            <div className="space-y-1 flex flex-col">
                <TextGenerateEffect
                    words={TranslateText[language].ALL_GOVERNMENT_ANNOUNCEMENTS_IN_ONE_PLACE}
                    className="text-2xl md:text-3xl font-satoshi font-semibold text-[#FF9933]"
                    duration={0.6}
                />

                <motion.span
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
                    className="text-sm md:text-base text-[#EAEAEA] font-satoshi"
                >
                    {TranslateText[language].EVERY_MINISTRY_EVERY_STATE_PLAIN_LANGUAGE}
                </motion.span>
            </div>
        </div>
    );
};

export default Hero;