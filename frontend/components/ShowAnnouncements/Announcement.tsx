import React, { useContext } from "react";
import { Announcement as AnnouncementType } from "@/types";
import { useRouter } from "next/router";
import { LanguageContext } from "@/context/Lan";
import { formatDateInLanguage } from "@/lib/formatDate";
import { LANGUAGE_CODES } from "@/lib/lan";
import { Calendar, MapPin, Landmark } from "lucide-react"

type Props = {
    Announcement: AnnouncementType;
};

const Announcement: React.FC<Props> = ({ Announcement }) => {
    const router = useRouter();
    const { language } = useContext(LanguageContext);

    const redirectTo = (id: string) => {
        router.push(`/announcement?id=${id}&lan=${language}`);
    };

    return (
        <div
            onClick={() => redirectTo(Announcement.announcementId)}
            className="bg-transparent flex flex-col gap-4 w-[95%] sm:w-[85%] md:w-[65%] md:ml-[5%] hover:cursor-pointer hover:scale-105  transition-all duration-300 ease-in-out p-4 rounded-lg"
        >
            <div>
                <h3 className="text-[#2d2c2c]">
                    {Announcement.title}
                </h3>
            </div>

            <div className="text-gray-900 text-sm md:text-base leading-relaxed whitespace-pre-line">
                <p>
                    {Announcement.description}
                </p>

                <div className="flex flex-col gap-2 pt-2 justify-between text-gray-800 text-[0.9rem]">
                    <span className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />{Announcement.state}
                    </span>
                    <span className="flex items-center gap-2">
                        <Landmark className="w-4 h-4" />
                        {Announcement.department}
                    </span>
                    <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {formatDateInLanguage(
                            Announcement.date,
                            LANGUAGE_CODES[language]
                        )}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Announcement;