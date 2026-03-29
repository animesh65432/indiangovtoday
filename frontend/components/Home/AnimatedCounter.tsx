import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import React, { useEffect } from 'react'


const AnimatedCounter: React.FC<{ target: number }> = ({ target }) => {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (v) => Math.round(v).toLocaleString("en-IN"));

    useEffect(() => {
        if (target === 0) return;
        const controls = animate(count, target, { duration: 2, ease: [0.16, 1, 0.3, 1] });
        return controls.stop;
    }, [target]);

    return <motion.span>{rounded}</motion.span>;
};

export default AnimatedCounter