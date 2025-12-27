import { useState, useEffect } from 'react';

const useDidUserScroll = (defaultPostion: number = 100) => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            console.log('🌀 Scroll event detected');
            console.log('Current scrollY position:', window.scrollY);
            const scrolled = window.scrollY > defaultPostion;
            setIsScrolled(scrolled);
        };

        window.addEventListener('scroll', handleScroll);
        console.log('✅ Scroll listener attached to window');


        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return { isScrolled };
};

export default useDidUserScroll;
