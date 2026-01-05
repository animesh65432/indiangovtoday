import { useState, useEffect } from 'react';

const useDidUserScroll = (defaultPostion: number = 100) => {
    const [isScrolled, setIsScrolled] = useState(false);

    console.log('🔍 useDidUserScroll initialized with defaultPostion:', defaultPostion);

    useEffect(() => {
        const handleScroll = () => {
            console.log('🌀 Scroll event detected');
            console.log('Current scrollY position:', window.scrollY, defaultPostion);
            const scrolled = window.scrollY > defaultPostion;
            setIsScrolled(scrolled);
        };

        window.addEventListener('scroll', handleScroll);
        console.log('✅ Scroll listener attached to window');


        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [defaultPostion]);

    return { isScrolled };
};

export default useDidUserScroll;
