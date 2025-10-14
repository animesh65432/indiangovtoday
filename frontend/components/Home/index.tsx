"use client"
import React, { useContext, useEffect } from 'react'
import Header from './Header'
import Main from './Main'
import { useSearchParams } from 'next/navigation'
import { Currentdate } from "@/context/Currentdate"

export default function Home() {
    const { onChangeDate } = useContext(Currentdate)
    const searchParams = useSearchParams()
    const dateSearch = searchParams.get('date')

    useEffect(() => {
        if (dateSearch) {
            const selectedDate = new Date(dateSearch);
            if (!isNaN(selectedDate.getTime())) {
                onChangeDate(selectedDate, selectedDate)
            } else {
                console.log("Invalid Date:", dateSearch);
            }
        }
    }, [dateSearch]);


    return (
        <div className="h-[100vh] w-[100vw] flex flex-col ">
            <Header />
            <Main />
        </div>
    )
}


