import React, { useContext, useEffect } from "react";
import { LanguageContext } from "@/context/Lan";
import { TranslateText } from "@/lib/translatetext";
import { Currentdate } from "@/context/Currentdate";
import { GetAllCategoriesAnnouncements } from "@/api/announcements";
import { IsLoadingContext } from "@/context/IsLoading";
import { withCache, buildCacheKey } from "@/lib/lsCache";
import { Swiper, SwiperSlide } from "swiper/react";
import { categoryStyles } from "@/lib/categoryStyles";
import "swiper/css";
import { ThemeContext } from "@/context/Theme";

type Props = {
    categoryOptions: string[];
    setCategoryOptions: React.Dispatch<React.SetStateAction<string[]>>;
    CategorySelected: string;
    SetCategorySelected: React.Dispatch<React.SetStateAction<string>>;
};

const CategoryOptions: React.FC<Props> = ({
    categoryOptions,
    setCategoryOptions,
    CategorySelected,
    SetCategorySelected,
}) => {
    const { SetIsLoading } = useContext(IsLoadingContext);
    const { language } = useContext(LanguageContext);
    const { startdate, endDate } = useContext(Currentdate);
    const { theme } = useContext(ThemeContext);

    const isDark = theme === "dark";

    useEffect(() => {
        const controller = new AbortController();

        const fetchCategoriesAnnouncements = async () => {
            SetIsLoading(true);
            setCategoryOptions([]);

            try {
                const key = buildCacheKey("categories", {
                    language,
                    startdate,
                    endDate,
                });

                const response = (await withCache(key, "categories", () =>
                    GetAllCategoriesAnnouncements(
                        language,
                        startdate,
                        endDate,
                        controller.signal
                    )
                )) as { data: string[] };

                if (!controller.signal.aborted) {
                    setCategoryOptions([
                        TranslateText[language].ALL_DEPARMENTS,
                        ...response.data,
                    ]);
                }
            } catch (error: unknown) {
                if (
                    error instanceof Error &&
                    (error.name === "AbortError" ||
                        (error as { code?: string }).code === "ERR_CANCELED")
                ) {
                    return;
                }
            } finally {
                if (!controller.signal.aborted) {
                    SetIsLoading(false);
                }
            }
        };

        fetchCategoriesAnnouncements();
        return () => controller.abort();
    }, [language, startdate, endDate]);

    return (
        <div className="w-full">
            <Swiper
                className="w-full"
                spaceBetween={8}
                slidesPerView="auto"
                freeMode={true}
                grabCursor={true}
            >
                {categoryOptions.map((category, index) => {
                    const isActive = CategorySelected === category;

                    return (
                        <SwiperSlide
                            key={`${category}-${index}`}
                            className="!w-auto flex items-center py-2"
                            onClick={() => SetCategorySelected(category)}
                        >
                            <div
                                className={`
                  px-3 md:px-4 py-2 mx-1 rounded-full whitespace-nowrap
                  font-satoshi font-semibold text-[0.7rem] tracking-wide
                  flex items-center gap-1.5 cursor-pointer
                  transition-all duration-200
                  
                  ${isActive
                                        ? isDark
                                            ? "bg-white text-black shadow-sm scale-105"
                                            : "bg-[#321F1F]/10 text-black shadow-sm scale-105"
                                        : isDark
                                            ? "text-gray-300 hover:text-white hover:bg-white/10 hover:scale-[1.02]"
                                            : "text-[#321F1F] hover:bg-[#321F1F]/10 hover:scale-[1.02]"
                                    }
                `}
                            >
                                {/* Dot */}
                                {categoryStyles[category]?.dot && (
                                    <span
                                        className="inline-block w-2 h-2 rounded-full shrink-0"
                                        style={{
                                            backgroundColor: categoryStyles[category].dot,
                                        }}
                                    />
                                )}

                                {/* Label */}
                                {category}
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </div>
    );
};

export default CategoryOptions;