import React, { useEffect, useRef, useState } from "react";

const SPOKES: [number, number][] = [
    [50, 4], [60.9, 5.6], [67.7, 7.4], [74.6, 11.7],
    [82.6, 17.4], [88.3, 25.4], [92.6, 32.3], [94.4, 39.1],
    [96, 50], [94.4, 60.9], [92.6, 67.7], [88.3, 74.6],
    [82.6, 82.6], [74.6, 88.3], [67.7, 92.6], [60.9, 94.4],
    [50, 96], [39.1, 94.4], [32.3, 92.6], [25.4, 88.3],
    [17.4, 82.6], [11.7, 74.6], [7.4, 67.7], [5.6, 60.9],
    [4, 50], [5.6, 39.1], [7.4, 32.3], [11.7, 25.4],
    [17.4, 17.4], [25.4, 11.7], [32.3, 7.4], [39.1, 5.6],
];

export default function GlobalLoader() {
    const [pct, setPct] = useState(0);
    const ivRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        ivRef.current = setInterval(() => {
            setPct(prev => {
                if (prev >= 95) {
                    clearInterval(ivRef.current!);
                    return 95;
                }
                return Math.min(prev + Math.random() * 4, 95);
            });
        }, 130);

        return () => clearInterval(ivRef.current!);
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-[#080808]">
            <svg
                className="animate-spin"
                style={{ animationDuration: "3s" }}
                width="72"
                height="72"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle cx="50" cy="50" r="46" stroke="#FF9933" strokeWidth="2.5" />
                <circle cx="50" cy="50" r="8" fill="#FF9933" />
                <circle cx="50" cy="50" r="4" fill="#080808" />
                <g stroke="#FF9933" strokeWidth="1.5" strokeLinecap="round">
                    {SPOKES.map(([x2, y2], i) => (
                        <line key={i} x1="50" y1="50" x2={x2} y2={y2} />
                    ))}
                </g>
            </svg>

            <div className="w-[120px] h-px bg-[#FF9933]/15">
                <div
                    className="h-full bg-[#FF9933] transition-all duration-300 ease-out"
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}