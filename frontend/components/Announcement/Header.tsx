import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";


export default function Header() {
    const router = useRouter()

    return (
        <header className="w-[85%] mx-auto pt-8" onClick={() => router.push("/")}>
            <nav className="relative h-[10vh] w-[43vw] sm:w-[32vw] lg:h-[70px] lg:w-[230px] xl:h-[82px] xl:w-[265px]">
                <Image
                    alt="logo"
                    src="/Logo.png"
                    fill
                    className=" object-fill lg:object-contain"
                />
            </nav>
        </header>
    );
}