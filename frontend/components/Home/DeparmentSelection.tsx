"use client";

import React, { useRef, useId, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
    DepartmentsOptions: string[];
    SetDepartmentsOptions: React.Dispatch<React.SetStateAction<string[]>>;
    DeparmentsSelected: string;
    SetDeparmentsSelected: React.Dispatch<React.SetStateAction<string>>;
};

const DeparmentSelection: React.FC<Props> = ({
    DepartmentsOptions,
    DeparmentsSelected,
    SetDeparmentsSelected,
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const layoutId = useId();
    const [hovered, setHovered] = useState<string | null>(null);

    const scrollLeft = () => scrollRef.current?.scrollBy({ left: -220, behavior: "smooth" });
    const scrollRight = () => scrollRef.current?.scrollBy({ left: 220, behavior: "smooth" });

    return (
        <div className="relative w-[93%] xl:w-[85%] mx-auto flex items-center">

            {/* Left Arrow */}
            <motion.button
                onClick={scrollLeft}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="left-0 flex items-center justify-center bg-white/90 rounded-full hover:scale-110 transition"
                aria-label="Scroll left"
            >
                <ChevronLeftIcon size={24} />
            </motion.button>

            {/* Scroll Container */}
            <div
                ref={scrollRef}
                className="flex items-center gap-8 px-10 py-2 overflow-x-auto w-full"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                onMouseLeave={() => setHovered(null)}
            >
                {DepartmentsOptions.map((dept, index) => {
                    const isActive = DeparmentsSelected === dept || (!DeparmentsSelected && index === 0);
                    const isHovered = hovered === dept;

                    return (
                        <motion.button
                            key={dept}
                            onClick={() => SetDeparmentsSelected(dept)}
                            onMouseEnter={() => setHovered(dept)}
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            whileTap={{ scale: 0.95 }}
                            className="relative whitespace-nowrap text-[1rem] font-semibold uppercase focus:outline-none pb-1"
                        >
                            {/* Sliding active underline */}
                            {isActive && (
                                <motion.span
                                    layoutId={`${layoutId}-underline`}
                                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-black"
                                    transition={{ type: "spring", stiffness: 420, damping: 36 }}
                                />
                            )}

                            {/* Hover underline */}
                            <AnimatePresence>
                                {isHovered && !isActive && (
                                    <motion.span
                                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-black/20"
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        exit={{ scaleX: 0 }}
                                        transition={{ duration: 0.15 }}
                                    />
                                )}
                            </AnimatePresence>

                            {/* Label */}
                            <motion.span
                                animate={{
                                    color: isActive ? "#000000" : isHovered ? "#333333" : "rgba(0,0,0,0.6)",
                                }}
                                transition={{ duration: 0.15 }}
                            >
                                {dept}
                            </motion.span>
                        </motion.button>
                    );
                })}
            </div>

            {/* Right Arrow */}
            <motion.button
                onClick={scrollRight}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="right-0 z-10 flex items-center justify-center bg-white/90 rounded-full p-2 hover:scale-110 transition"
                aria-label="Scroll right"
            >
                <ChevronRightIcon size={24} />
            </motion.button>
        </div>
    );
};

export default DeparmentSelection