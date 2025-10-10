"use client"
import React from 'react'
import Header from './Header'
import Main from './Main'

export default function Home() {
    return (
        <div className="h-[100vh] w-[100vw] flex flex-col  bg-[url('/backgroundimage.png')] bg-no-repeat bg-cover  
            xl:bg-center">
            <Header />
            <Main />
        </div>
    )
}
