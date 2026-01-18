import React, { useContext } from "react";
import { Announcement as AnnouncementType } from "@/types";
import { useRouter } from "next/router";
import { LanguageContext } from "@/context/Lan";
import { formatDateRelative } from "@/lib/formatDate";
import { LANGUAGE_CODES } from "@/lib/lan";
import { Button } from "../ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Building2, Clock } from "lucide-react";
import { TranslateText } from "@/lib/translatetext";

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
        <article className="bg-white flex flex-col gap-4 p-5 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200">
            {/* Header: State and Date */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-gray-100">
                <Badge variant="secondary" className="px-3 py-1.5 text-xs font-medium w-fit">
                    {Announcement.department}
                </Badge>
                <span className="flex items-center gap-1.5 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    {formatDateRelative(Announcement.date, LANGUAGE_CODES[language], language)}
                </span>
            </div>

            {/* Title */}
            <div>
                <h3 className="text-gray-900 font-bold text-lg leading-snug">
                    {Announcement.title}
                </h3>
            </div>

            {/* Description */}
            <div className="text-gray-600 text-sm md:text-base leading-relaxed">
                <p className="leading-7 ">
                    {Announcement.description}
                </p>
            </div>

            {/* Footer: Department and Action */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-700 font-medium text-sm">
                        {Announcement.state}
                    </span>
                </div>

                <Button
                    onClick={redirectTo}
                    variant="ghost"
                    className="text-black font-semibold uppercase text-xs px-3 py-2 hover:bg-gray-100 transition-colors group w-fit"
                >
                    {TranslateText[language].SEE_DETAILS}
                    <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>
        </article>
    );
};

export default Announcement;