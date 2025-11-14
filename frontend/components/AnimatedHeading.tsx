import React from 'react';
import { motion } from 'framer-motion';

const AnimatedHeading = ({ text }: { text: string }) => {
    const words = text.split(' ');

    return (
        <h1 className="text-center text-[#E0614B] text-[1.2rem] sm:text-[1.3rem] lg:text-[1.6rem] whitespace-normal break-normal max-w-[70vw] sm:max-w-none">
            {words.map((word, index) => (
                <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.5,
                        delay: index * 0.1,
                        ease: "easeOut"
                    }}
                    className="inline-block mr-1"
                >
                    {word}
                </motion.span>
            ))}
        </h1>
    );
};

export default AnimatedHeading