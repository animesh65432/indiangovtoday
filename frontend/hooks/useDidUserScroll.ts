'use client'

import { useEffect, useState } from 'react'
import { useScroll, useTransform, MotionValue } from 'framer-motion'

interface HeroScrollValues {
    scrolled: boolean
    titleY: MotionValue<number>
    titleOpacity: MotionValue<number>
    inputY: MotionValue<number>
    inputScale: MotionValue<number>
}

const SCROLL_THRESHOLD = 100

const TITLE_CONFIG = {
    y: { input: [0, 200], output: [0, -80] },
    opacity: { input: [0, 150], output: [1, 0] },
}

const INPUT_CONFIG = {
    y: { input: [0, 200], output: [0, -60] },
    scale: { input: [0, 200], output: [1, 1.04] },
}

export const useHeroScroll = (): HeroScrollValues => {
    const [scrolled, setScrolled] = useState(false)
    const { scrollY } = useScroll()

    useEffect(() => {
        return scrollY.on('change', (latest) => setScrolled(latest > SCROLL_THRESHOLD))
    }, [scrollY])

    const titleY = useTransform(scrollY, TITLE_CONFIG.y.input, TITLE_CONFIG.y.output)
    const titleOpacity = useTransform(scrollY, TITLE_CONFIG.opacity.input, TITLE_CONFIG.opacity.output)
    const inputY = useTransform(scrollY, INPUT_CONFIG.y.input, INPUT_CONFIG.y.output)
    const inputScale = useTransform(scrollY, INPUT_CONFIG.scale.input, INPUT_CONFIG.scale.output)

    return { scrolled, titleY, titleOpacity, inputY, inputScale }
}