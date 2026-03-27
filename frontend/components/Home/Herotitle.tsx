import React, { useContext } from "react";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { LanguageContext } from "@/context/Lan";
import { motion } from "framer-motion";

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
                    Find Government{" "}
                </span>

                {/* subtle hover effect instead of animation */}
                <span className="block md:inline text-[#ff3333] transition-all duration-300 hover:tracking-wide">
                    Updates That Matter
                </span>
            </h1>

            <TextGenerateEffect
                words={"to You"}
                className="text-center font-bold text-2xl md:text-4xl font-satoshi text-[#ff3333]"
                duration={0.6}
            />
        </motion.div>
    );
};

export default Herotitle;