import React, { useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { getCategoryStyle } from "@/lib/categoryStyles";
import "swiper/css";
import { ThemeContext } from "@/context/Theme";
import { LanguageContext } from "@/context/Lan";
import { TranslateText } from "@/lib/translatetext";

type Props = {
    CategoriesOptions: string[];
    CategorySelected: string;
    SetCategorySelected: React.Dispatch<React.SetStateAction<string>>;
};

const CategoryOptions: React.FC<Props> = ({
    CategorySelected,
    SetCategorySelected,
    CategoriesOptions = []
}) => {
    const { theme } = useContext(ThemeContext);
    const { language } = useContext(LanguageContext);
    const isDark = theme === "dark";
    const AddCategoriesOptions = [TranslateText[language].ALL_DEPARMENTS, ...CategoriesOptions]

    return (
        <div className={`w-full ${isDark ? "bg-[#050505]" : "bg-white"} py-2 border-b ${isDark ? "border-white/10" : "border-gray-200"}`}>
            <Swiper
                className="w-full"
                spaceBetween={8}
                slidesPerView="auto"
                freeMode={true}
                grabCursor={true}
            >
                {AddCategoriesOptions.map((category, index) => {
                    const isActive = CategorySelected === category;

                    return (
                        <SwiperSlide
                            key={`${category}-${index}`}
                            className="w-auto! flex items-center py-2"
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
                                {getCategoryStyle(language, category)?.dot && (
                                    <span
                                        className="inline-block w-2 h-2 rounded-full shrink-0"
                                        style={{
                                            backgroundColor: getCategoryStyle(language, category)?.dot,
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