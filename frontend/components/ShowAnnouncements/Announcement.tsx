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
import { formatSummaryToMarkdown } from "@/lib/formatSummaryToMarkdown"

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
            <CardHeader className="flex flex-col gap-1">
                {/* Title */}
                <p className="text-lg md:text-xl font-semibold text-[#E0614B] leading-snug">
                    {Announcement.title}
                </p>

                {/* Type + Date */}
                <div className="flex flex-col  justify-between text-sm text-gray-500">
                    <span className="capitalize hover:underline hover:cursor-pointer text-[0.9rem]">{Announcement.type}</span>
                    <span>
                        {formatDateInLanguage(
                            Announcement.created_at,
                            LANGUAGE_CODES[language]
                        )}
                    </span>
                </div>
            </CardHeader>

            <CardContent className="text-gray-700 text-sm md:text-base leading-relaxed whitespace-pre-line">
                {formatSummaryToMarkdown(Announcement.summary)}
            </CardContent>

            <CardFooter className="flex justify-end">
                <Button
                    onClick={() => redirectTo(Announcement._id)}
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
