import React, { useContext } from "react";
import { Announcement as AnnouncementType } from "@/types";
import { useRouter } from "next/router";
import { LanguageContext } from "@/context/Lan";
import { formatDateInLanguage } from "@/lib/formatDate";
import { LANGUAGE_CODES } from "@/lib/lan";
import Image from "next/image";
import { Button } from "../ui/button";
import { TranslateText } from "@/lib/translatetext"

type Props = {
    Announcement: AnnouncementType;
};

const Announcement: React.FC<Props> = ({ Announcement }) => {
    const router = useRouter();
    const { language } = useContext(LanguageContext);

    const redirectTo = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (!Announcement?.announcementId) {
            console.error("No announcement ID found");
            return;
        }

        router.push(
            `/announcement?id=${Announcement.announcementId}&lan=${language}`
        );
    };


    return (
        <div
            className="bg-[#FFFFFF] flex flex-col gap-4   p-4 "
        >
            <div className="text-[#E04B4D] text-xl font-normal">{Announcement.department}</div>
            <div>
                <h3 className="text-black font-bold">
                    {Announcement.state}
                </h3>
            </div>

            <div className="text-[#4B4B4B] text-sm md:text-base leading-relaxed whitespace-pre-line flex flex-col gap-2">
                <p className="leading-7 lg:leading-8">
                    {Announcement.description}
                </p>
            </div>

            <div className="flex flex-col gap-3 sm:gap-0 sm:flex-row sm:justify-between text-[#777777]">
                <span className="flex items-center gap-1">
                    <div>
                        <Image
                            src="/TimeCircle.svg"
                            alt="source icon"
                            width={20}
                            height={20}
                        />
                    </div>
                    {formatDateInLanguage(
                        Announcement.date,
                        LANGUAGE_CODES[language]
                    )}
                </span>
                <Button
                    onClick={redirectTo}
                    className="text-black border w-fit  border-black rounded-none  hover:cursor-pointer">
                    {TranslateText[language].SEE_DETAILS}
                </Button>
            </div>
        </div>
    );
};

export default Announcement;