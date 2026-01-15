"use client"
import React, { useContext, useEffect } from 'react'
import Main from './Main'
import { useSearchParams } from 'next/navigation'
import { Currentdate } from "@/context/Currentdate"
import HeroSection from './HeroSection'


export default function Home() {
    const { onChangeDate } = useContext(Currentdate);
    const searchParams = useSearchParams()
    const startdate = searchParams.get('startdate')
    const enddate = searchParams.get('enddate')

    useEffect(() => {
        if (startdate && enddate) {
            const StartDate = new Date(startdate + 'T00:00:00');
            const EndDate = new Date(enddate + 'T23:59:59');

            if (!isNaN(StartDate.getTime()) && !isNaN(EndDate.getTime())) {
                onChangeDate(StartDate, EndDate);
            } else {
                console.log("Invalid Date:", startdate, enddate);
            }
        }
    }, [startdate, enddate]);


    return (
        <Main />
    )
}


