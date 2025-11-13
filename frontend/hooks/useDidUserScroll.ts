import { useState, useEffect } from 'react';

const useDidUserScroll = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY > 100;
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
