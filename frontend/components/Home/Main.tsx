import React, { useEffect, useState, useContext, useCallback, useRef } from 'react';
import { getAllAnnouncements } from "@/api/announcements";
import { Announcement as AnnouncementTypes, AnnouncementsResponse } from "@/types";
import { LanguageContext } from '@/context/Lan';
import { Currentdate } from "@/context/Currentdate";
import { useRouter } from "next/router"
import ShowAnnouncements from '../ShowAnnouncements';
import AnnoucementsHeader from '@/components/AnnoucementsHeader';
import { toast } from 'react-toastify';
import { motion } from "framer-motion"
import { fadeInContainer } from "@/lib/animations";


const Main: React.FC = () => {
    const [SearchInput, SetSearchInput] = useState<string>("")
    const [totalPages, settotalPages] = useState<number>(0)
    const [IsLoading, SetIsLoading] = useState<boolean>(false)
    const [IsLoadingMore, SetIsLoadingMore] = useState<boolean>(false)
    const [Announcements, SetAnnouncements] = useState<AnnouncementTypes[]>([])
    const { startdate, endDate } = useContext(Currentdate)
    const { language } = useContext(LanguageContext)
    const [page, Setpage] = useState<number>(1)
    const [limit] = useState<number>(10)
    const paramsRef = useRef({ language, startdate, endDate, limit, page })
    const router = useRouter()

    useEffect(() => {
        paramsRef.current = { language, startdate, endDate, limit, page }
    }, [language, startdate, endDate, limit, page])

    const fetchGetIndiaAnnouncements = useCallback(async (page: number = 0, append: boolean = false) => {

        if (append) {
            SetIsLoadingMore(true)
        } else {
            SetIsLoading(true)
        }

        try {
            const { language, startdate, endDate, limit } = paramsRef.current

            const IndiaAnnouncementsResponse = await getAllAnnouncements(
                language,
                startdate,
                endDate,
                page,
                limit,
            ) as AnnouncementsResponse


            const newAnnouncements = IndiaAnnouncementsResponse.data

            settotalPages(IndiaAnnouncementsResponse.pagination.totalPages)

            if (append) {
                SetAnnouncements(prev => [...prev, ...newAnnouncements])
            } else {
                SetAnnouncements(newAnnouncements)
            }

        } finally {
            SetIsLoading(false)
            SetIsLoadingMore(false)
        }
    }, [])


    useEffect(() => {
        Setpage(1)
        SetAnnouncements([])
        fetchGetIndiaAnnouncements(1, false)
    }, [language, startdate, endDate, fetchGetIndiaAnnouncements])

    useEffect(() => {
        if (page > 1) {
            fetchGetIndiaAnnouncements(page, true)
        }
    }, [page, fetchGetIndiaAnnouncements])


    const OnLoadMoredata = () => {
        if (page >= totalPages) {
            return;
        }
        else {
            Setpage((prev) => prev + 1)
        }
    }

    const handleEnterKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (SearchInput.trim() === "" || SearchInput.length < 3) {
                toast.info("Please enter at least 3 characters to search.");
                return;
            }
            router.push(`/announcements?SearchInput=${SearchInput}`);
        }
    };

    return (
        <motion.section
            id='announcements'
            className='flex bg-[#E6E6E6] flex-col h-screen overflow-x-hidden'
            variants={fadeInContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
        >
            <div className='flex flex-col '>
                <AnnoucementsHeader
                    SearchInput={SearchInput}
                    SetSearchInput={SetSearchInput}
                    handleEnterKeyPress={handleEnterKeyPress}
                    dontRedirect={false}
                />
                <ShowAnnouncements
                    LoadMoreData={OnLoadMoredata}
                    Announcements={Announcements}
                    IsLoading={IsLoading}
                    page={page}
                    totalpage={totalPages}
                    IsLoadingMore={IsLoadingMore}
                />
            </div>
        </motion.section>
    );
};

export default Main;