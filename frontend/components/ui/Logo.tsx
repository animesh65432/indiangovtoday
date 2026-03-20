import React from 'react'

const Logo: React.FC = () => {
    return (
        <svg
            viewBox="0 0 280 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: 'clamp(160px, 30vw, 280px)' }}
        >
            {/* Chakra */}
            <g>
                <circle cx="40" cy="40" r="30" stroke="#FF9933" strokeWidth="1.5" />

                {/* Spokes */}
                <line x1="40" y1="10" x2="40" y2="70" stroke="#FF9933" />
                <line x1="10" y1="40" x2="70" y2="40" stroke="#FF9933" />
                <line x1="18" y1="18" x2="62" y2="62" stroke="#FF9933" />
                <line x1="62" y1="18" x2="18" y2="62" stroke="#FF9933" />

                {/* Center */}
                <circle cx="40" cy="40" r="6" fill="#FF9933" />
            </g>

            {/* Text */}
            <text x="92" y="32" fontSize="10" fill="#FFD699" letterSpacing="3">
                INDIAN
            </text>

            <text x="92" y="56" fontSize="26" fill="#FFFFFF" fontWeight="600">
                GovToday
            </text>

            {/* Accent line */}
            <line x1="92" y1="62" x2="250" y2="62" stroke="#FF9933" />
        </svg>
    )
}

export default Logo