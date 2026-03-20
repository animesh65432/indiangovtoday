import React from "react";
import { motion } from "framer-motion";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

const Hero: React.FC = () => {
    return (
        <div className="ml-4">
            <div className="space-y-1 flex flex-col">
                <TextGenerateEffect
                    words="All government announcements in one place"
                    className="text-2xl md:text-3xl font-satoshi font-semibold text-[#FF9933]"
                    duration={0.6}
                />

                <motion.span
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
                    className="text-sm md:text-base text-[#EAEAEA] font-satoshi"
                >
                    Every ministry. Every state. Plain language.
                </motion.span>
            </div>
        </div>
    );
};

export default Hero;