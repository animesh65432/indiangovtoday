import React, { useState } from 'react'
import { Image } from "@imagekit/next"
import ImageFallback from './Home/ImageFallback'

type Props = {
    src: string
    alt: string
    category?: string
    transformation?: any[]
    className?: string
}

const ImageWithBlurBg: React.FC<Props> = ({ src, alt, category, transformation, className }) => {
    const [broken, setBroken] = useState(false)

    if (broken) return <ImageFallback category={category || ''} />

    return (
        <div className={`relative w-full h-full overflow-hidden rounded-md ${className}`}>

            {/* ✅ Blurred background — fills empty space */}
            <Image
                src={src}
                alt=""
                fill
                className="object-cover scale-110 blur-sm brightness-75"
                transformation={transformation}
                onError={() => setBroken(true)}
            />

            {/* ✅ Full image on top — nothing cut */}
            <Image
                src={src}
                alt={alt}
                fill
                className="object-contain relative z-10"
                transformation={transformation}
                onError={() => setBroken(true)}
            />
        </div>
    )
}

export default ImageWithBlurBg