import React, { useContext } from "react";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { LanguageContext } from "@/context/Lan";
import { TranslateText } from "@/lib/translatetext";

const Herotitle: React.FC = () => {
    const { language } = useContext(LanguageContext)
    return (
        <div className="flex flex-col gap-1 sm:gap-2 w-[95%]  md:w-[80%] mx-auto">
            <span className="font-satoshi text-center text-2xl md:text-4xl font-bold leading-[1.2] tracking-tight">
                <span className="block md:inline">Find Government </span>
                <span className="block md:inline">Updates That Matter</span>
            </span>
            <TextGenerateEffect
                words={"to You"}
                className="text-center font-bold text-2xl md:text-4xl font-satoshi text-[#ff3333]"
                duration={0.6}
            />
        </div>
    );
};

export default Herotitle;