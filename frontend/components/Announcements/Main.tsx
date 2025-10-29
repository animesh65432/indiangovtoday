import React from "react";
import { GetallGroupsIndiaAnnouncements as AnnouncementsTyps } from "@/types";

type Props = {
    Announcements: AnnouncementsTyps[];
};

const Main: React.FC<Props> = ({ Announcements }) => {
    if (Announcements.length === 0) {
        return (
            <div className="h-[70vh] w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center space-y-3">
                    <div className="text-6xl">📢</div>
                    <p className="text-2xl font-semibold text-gray-800">No Announcements Yet</p>
                    <p className="text-gray-500">Check back soon for updates</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen  py-12 overflow-x-auto">
            <div className="flex flex-col space-y-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
                {Announcements.map((group, groupIdx) => (
                    <div
                        key={group.type}
                        className="w-full flex flex-col space-y-6 animate-fade-in"
                        style={{ animationDelay: `${groupIdx * 100}ms` }}
                    >
                        {/* Group Title with Accent */}
                        <div className="flex items-center space-x-4">
                            <div className="h-12 w-1.5 bg-gradient-to-b from-[#E0614B] to-[#ff8c75] rounded-full"></div>
                            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#E0614B] to-[#ff8c75] bg-clip-text text-transparent">
                                {group.type}
                            </h2>
                        </div>

                        {/* Announcement Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {group.announcements.map((an, idx) => (
                                <div
                                    key={an._id || an.title}
                                    className="group relative bg-white hover:bg-gradient-to-br hover:from-white hover:to-orange-50 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-3xl p-6 border border-gray-100 hover:border-[#E0614B]/30 flex flex-col space-y-3 overflow-hidden transform hover:-translate-y-2"
                                    style={{ animationDelay: `${idx * 50}ms` }}
                                >
                                    {/* Decorative Element */}
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#E0614B]/10 to-transparent rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500"></div>

                                    {/* Card Number Badge */}
                                    <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-[#E0614B] to-[#ff8c75] rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">
                                        {idx + 1}
                                    </div>

                                    <a
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xl font-bold text-gray-800 hover:text-[#E0614B] transition-colors duration-300 pr-10 leading-tight group-hover:underline decoration-2 underline-offset-4"
                                    >
                                        {an.title}
                                    </a>

                                    <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                                        {an.summary || "No summary available."}
                                    </p>

                                    {/* View More Link */}
                                    <div className="flex items-center space-x-2 text-[#E0614B] font-medium text-sm pt-2 border-t border-gray-100 group-hover:border-[#E0614B]/30 transition-colors">
                                        <span>View Details</span>
                                        <svg
                                            className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Main;