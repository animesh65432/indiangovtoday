import React from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Loading: React.FC = () => {
    return (
        <div className="w-screen h-screen flex justify-center items-center bg-black">
            <DotLottieReact
                autoplay
                loop
                src="/Loading.json"
                style={{ width: "150px", height: "150px" }}
            />
        </div>
    )
}

export default Loading