import React from 'react'
import { LanguageContext } from "@/context/Lan"
import { useContext } from 'react'
import data from "@/data.json"
import Image from 'next/image'
import { motion } from "framer-motion"

const Hero: React.FC = () => {
    const { language } = useContext(LanguageContext);
    return (
        <div></div>
    )
}

export default Hero