"use client"
import React, { useContext, useEffect } from 'react'
import Main from './Main'
import { useSearchParams } from 'next/navigation'
import { Currentdate } from "@/context/Currentdate"
import HeroSection from './HeroSection'


export default function Home() {
    const { onChangeDate } = useContext(Currentdate);
    const searchParams = useSearchParams()
    const dateSearch = searchParams.get('date')

    useEffect(() => {
        if (dateSearch) {
            const [year, month, day] = dateSearch.split('-').map(Number);
            const selectedDate = new Date(year, month - 1, day);

            if (!isNaN(selectedDate.getTime())) {
                onChangeDate(selectedDate, selectedDate);
            } else {
                console.log("Invalid Date:", dateSearch);
            }
        }
    }, [dateSearch]);

    return (
        <div className="flex flex-col min-h-dvh ">
            <HeroSection />
            <Main />
        </div>
    )
}


