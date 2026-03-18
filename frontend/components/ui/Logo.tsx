import React from 'react'

const Logo: React.FC = () => {
    return (
        <svg
            viewBox="0 0 280 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="IndianGovToday"
            style={{
                width: 'clamp(160px, 30vw, 280px)',
                height: 'auto',
            }}
        >

            {/* Animated chakra mark */}
            <g className="igt-spin">
                <circle cx="40" cy="40" r="30" stroke="#0C1F4A" strokeWidth="1.6" fill="none" />
                {/* 4 cardinal spokes */}
                <line x1="40" y1="10" x2="40" y2="70" stroke="#0C1F4A" strokeWidth="1.3" />
                <line x1="10" y1="40" x2="70" y2="40" stroke="#0C1F4A" strokeWidth="1.3" />
                {/* 4 diagonal spokes */}
                <line x1="18.8" y1="18.8" x2="61.2" y2="61.2" stroke="#0C1F4A" strokeWidth="1.3" />
                <line x1="61.2" y1="18.8" x2="18.8" y2="61.2" stroke="#0C1F4A" strokeWidth="1.3" />
                {/* Tip dots */}
                <circle cx="40" cy="10" r="2.8" fill="#0C1F4A" />
                <circle cx="40" cy="70" r="2.8" fill="#0C1F4A" />
                <circle cx="10" cy="40" r="2.8" fill="#0C1F4A" />
                <circle cx="70" cy="40" r="2.8" fill="#0C1F4A" />
                <circle cx="18.8" cy="18.8" r="2.8" fill="#0C1F4A" />
                <circle cx="61.2" cy="61.2" r="2.8" fill="#0C1F4A" />
                <circle cx="61.2" cy="18.8" r="2.8" fill="#0C1F4A" />
                <circle cx="18.8" cy="61.2" r="2.8" fill="#0C1F4A" />
            </g>

            {/* Static hub */}
            <circle cx="40" cy="40" r="7" fill="#0C1F4A" />
            <circle cx="40" cy="40" r="3.2" fill="#EEF4FB" />

            {/* Wordmark */}
            <text
                x="92" y="32"
                fontFamily="-apple-system,'Helvetica Neue',Arial,sans-serif"
                fontSize="10"
                fontWeight="500"
                fill="#3A5FAA"
                letterSpacing="3.5"
            >
                INDIAN
            </text>
            <text
                x="90" y="56"
                fontFamily="-apple-system,'Helvetica Neue',Arial,sans-serif"
                fontSize="24"
                fontWeight="500"
                fill="#0C1F4A"
                letterSpacing="0.5"
            >
                GovToday
            </text>

            {/* Underline */}
            <line x1="90" y1="62" x2="276" y2="62" stroke="#3A5FAA" strokeWidth="1.2" />
        </svg>
    )
}

export default Logo