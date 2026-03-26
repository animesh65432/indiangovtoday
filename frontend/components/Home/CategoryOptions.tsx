import React, { useContext, useEffect } from 'react'
import { LanguageContext } from "@/context/Lan"
import { TranslateText } from "@/lib/translatetext"
import { Currentdate } from '@/context/Currentdate'
import { GetAllCategoriesAnnouncements } from "@/api/announcements"
import { IsLoadingContext } from '@/context/IsLoading'
import { withCache, buildCacheKey } from "@/lib/lsCache"
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

type Props = {
    categoryOptions: string[]
    setCategoryOptions: React.Dispatch<React.SetStateAction<string[]>>
    CategorySelected: string
    SetCategorySelected: React.Dispatch<React.SetStateAction<string>>
}

const CategoryOptions: React.FC<Props> = ({
    categoryOptions,
    setCategoryOptions,
    CategorySelected,
    SetCategorySelected
}) => {
    const { SetIsLoading } = useContext(IsLoadingContext)
    const { language } = useContext(LanguageContext)
    const { startdate, endDate } = useContext(Currentdate)


    useEffect(() => {
        const controller = new AbortController();

        const fetchCategoriesAnnouncements = async () => {
            SetIsLoading(true);
            setCategoryOptions([]);
            try {
                console.log(language, startdate, endDate, "fetching categories")

                const key = buildCacheKey("categories", { language, startdate, endDate });

                const response = await withCache(key, "categories", () =>
                    GetAllCategoriesAnnouncements(language, startdate, endDate, controller.signal)
                ) as { data: string[] };


                if (!controller.signal.aborted) {
                    setCategoryOptions([TranslateText[language].ALL_DEPARMENTS, ...response.data]);
                }
            } catch (error: unknown) {
                if (error instanceof Error &&
                    (error.name === 'AbortError' || (error as { code?: string }).code === 'ERR_CANCELED')) {
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

    }, [language]);

    return (
        <div className='w-[95%] md:w-[80%] mx-auto mt-2'>
            <Swiper
                className="w-full"
                spaceBetween={8}
                slidesPerView="auto"
                freeMode={true}
                grabCursor={true}
            >
                {categoryOptions.map((category, index) => (
                    <SwiperSlide
                        key={category}
                        className="w-auto! flex items-center py-2"
                        onClick={() => SetCategorySelected(category)}
                    >
                        <div
                            className={`
          px-3 md:px-4 py-2 mx-1
          rounded-full
          whitespace-nowrap

          font-satoshi font-semibold
          text-[0.75rem] md:text-[0.9rem]
          uppercase font-medium tracking-wide

          ${CategorySelected === category
                                    ? "bg-[#321F1F] text-white shadow-sm"
                                    : "text-[#321F1F] hover:bg-[#321F1F]/10"
                                }

          transition-all duration-200
          cursor-pointer
        `}
                        >
                            {category}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div >
    )
}

export default CategoryOptions