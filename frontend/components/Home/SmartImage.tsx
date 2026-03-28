import React, { useState } from 'react'
import ImageFallback from './ImageFallback'

const SmartImage = ({ src, alt, category, fill, className, transformation, onError }: {
    src: string
    alt: string
    category?: string
    fill?: boolean
    className?: string
    transformation?: any[]
    onError?: () => void
}) => {
    const [broken, setBroken] = useState(!src)

    if (broken) return <ImageFallback category={category || ''} />

    return (
        <img
            src={src}
            alt={alt}
            className={`${fill ? 'absolute inset-0 w-full h-full object-cover' : ''} ${className ?? ''}`}
            onError={() => { setBroken(true); onError?.() }}
            loading="lazy"
            referrerPolicy="no-referrer"
        />
    )
}

export default SmartImage