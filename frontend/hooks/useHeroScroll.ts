'use client'

import { useEffect, useState } from 'react'
import { useScroll, useTransform, useMotionTemplate, MotionValue } from 'framer-motion'

interface HeroScrollValues {
    scrolled: boolean
    titleOpacity: MotionValue<number>
    titleBlur: MotionValue<string>
    titleY: MotionValue<number>
    inputOpacity: MotionValue<number>
    inputY: MotionValue<number>
}

export const useHeroScroll = (): HeroScrollValues => {
    const [scrolled, setScrolled] = useState(false)
    const { scrollY } = useScroll()

    useEffect(() => {
        return scrollY.on('change', (v) => setScrolled(v > 100))
    }, [scrollY])

    const titleOpacity = useTransform(scrollY, [0, 120], [1, 0])
    const titleY = useTransform(scrollY, [0, 120], [0, -40])
    const blurPx = useTransform(scrollY, [0, 120], [0, 10])
    const titleBlur = useMotionTemplate`blur(${blurPx}px)`

    const inputOpacity = useTransform(scrollY, [0, 100], [1, 0])
    const inputY = useTransform(scrollY, [0, 100], [0, -24])

    return { scrolled, titleOpacity, titleBlur, titleY, inputOpacity, inputY }
}