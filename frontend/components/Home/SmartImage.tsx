import React, { useState } from 'react'
import { buildSrc } from "@imagekit/next"
import NextImage from 'next/image'
import ImageFallback from './ImageFallback'
import { NEXT_PUBLIC_IMAGEKIT_URL } from '@/config'

const SmartImage = ({
    src,
    alt,
    category,
    fill,
    className,
    transformation,
    onError
}: {
    src: string
    alt: string
    category?: string
    fill?: boolean
    className?: string
    transformation?: any[]
    onError?: () => void
}) => {
    const [broken, setBroken] = useState(false)

    if (broken) return <ImageFallback category={category || ''} />

    // ✅ Use buildSrc — official utility for generating ImageKit URLs
    const optimizedSrc = buildSrc({
        urlEndpoint: NEXT_PUBLIC_IMAGEKIT_URL,
        src: src,  // pass raw external URL directly — buildSrc handles encoding
        transformation: transformation
    })

    return (
        <NextImage  // ✅ use next/image directly — no SDK component issues
            src={optimizedSrc}
            alt={alt}
            fill={fill}
            className={className}
            unoptimized  // ✅ already optimized by ImageKit
            onError={() => {
                setBroken(true)
                onError?.()
            }}
        />
    )
}

export default SmartImage