import { GroupedAnnouncements } from "../../types/index";
import { useContext } from "react"
import { LanguageContext } from "@/context/Lan"
import AnnouncementComponent from "./Announcement";
import Discover from "../Discover";
import { ArrowLeft, ArrowRight } from "lucide-react";
import AnnouncementSkeleton from "./AnnouncementSkeleton";
import { TranslateText } from "@/lib/translatetext"

type Props = {
    announcements: GroupedAnnouncements[];
    onNextPage: () => void;
    onPrevPage: () => void;
    currentPage: number;
    totalPages: number;
    IsLoading: boolean;
};

const GroupOfAnnouncement: React.FC<Props> = ({
    IsLoading,
    announcements,
    currentPage,
    totalPages,
    onNextPage,
    onPrevPage,
}) => {
    const { language } = useContext(LanguageContext)
    return (
        <div className="w-[85%] mx-auto pt-10">
            <div className="flex flex-col md:flex-row gap-4 items-center md:items-start relative min-h-[400px]">
                {IsLoading ? (
                    <>
                        {Array.from({ length: 2 }).map((_, i) => (
                            <div key={i} className="flex-1">
                                <AnnouncementSkeleton />
                            </div>
                        ))}
                    </>
                ) : announcements.length === 0 ? (
                    <div className="flex-1">
                        <p className="text-[#E0614B]">No Announcement Found</p>
                    </div>
                ) : (
                    announcements.map((announcement, i) => (
                        <div key={i} className="relative flex-1">
                            <AnnouncementComponent Announcement={announcement.announcements} />
                            {i === announcements.length - 1 && (
                                <div className=" hidden absolute -top-10 right-0 md:flex gap-3 items-center">
                                    <button
                                        onClick={onPrevPage}
                                        className="p-2 rounded-full hover:bg-gray-100 transition"
                                    >
                                        <ArrowLeft className="h-6 text-[#E0614B]" />
                                    </button>
                                    <span className="text-sm text-gray-600">
                                        {TranslateText[language].PAGE} {currentPage}  {TranslateText[language].OF} {totalPages}
                                    </span>
                                    <button
                                        onClick={onNextPage}
                                        className="p-2 rounded-full hover:bg-gray-100 transition"
                                    >
                                        <ArrowRight className="h-6 text-[#E0614B]" />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}

                <Discover />
            </div>
        </div>
    );
};

export default GroupOfAnnouncement;
