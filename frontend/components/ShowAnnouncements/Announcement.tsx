import React, { useContext } from "react";
import { Announcement as AnnouncementType } from "@/types";
import { useRouter } from "next/router";
import { Button } from "../ui/button";
import { LanguageContext } from "@/context/Lan";
import { Card, CardContent, CardHeader, CardFooter } from "../ui/card";
import { ArrowRight } from "lucide-react";
import { TranslateText } from "@/lib/translatetext";
import { formatDateInLanguage } from "@/lib/formatDate";
import { LANGUAGE_CODES } from "@/lib/lan";
import { LayoutGrid, Calendar, MapPin } from "lucide-react"

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
        <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-200 bg-white">
            <CardHeader className="flex flex-col gap-4">
                <div className="flex flex-row items-center gap-2 ">
                    <LayoutGrid className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">
                        {Announcement.category}
                    </span>
                </div>
                <p className="text-lg md:text-xl font-semibold text-[#E0614B] leading-snug">
                    {Announcement.title}
                </p>
            </CardHeader>

            <CardContent className="text-gray-700 text-sm md:text-base leading-relaxed whitespace-pre-line">
                {Announcement.description}

                <div className="flex flex-col gap-1 pt-2  justify-between  text-gray-500 text-[0.9rem]">
                    <span className="capitalize hover:underline hover:cursor-pointer  flex items-center gap-2">
                        <MapPin className="h-4 w-4" />{Announcement.state}
                    </span>
                    <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDateInLanguage(
                            Announcement.date,
                            LANGUAGE_CODES[language]
                        )}
                    </span>
                </div>
            </CardContent>


            <CardFooter className="flex justify-end">

                <Button
                    onClick={() => redirectTo(Announcement.announcementId)}
                    className="bg-[#E0614B] hover:bg-[#dd8272] hover:cursor-pointer text-white rounded-xl shadow-[4px_4px_0_0_#00000029] flex items-center gap-2"
                >
                    {TranslateText[language].SEE_DETAILS}
                    <ArrowRight className="w-4 h-4" />
                </Button>
            </CardFooter>
        </Card>
    );
};

export default Announcement;
