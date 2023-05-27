import { useEffect } from 'react';
import { motion, useAnimation, AnimationControls } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface FadeInProps {
    children: React.ReactNode;
}

function FadeIn({ children }: FadeInProps) {
    const controls = useAnimation();
    const [ref, inView] = useInView({ threshold: 0.5 });

    useEffect(() => {
        if (inView) {
            controls.start('visible');
        }
    }, [controls, inView]);

    return (
        <motion.div
            ref={ref}
            animate={controls as AnimationControls}
            initial='hidden'
            transition={{ duration: 0.5 }}
            variants={{
                visible: { opacity: 1, scale: 1 },
                hidden: { opacity: 0, scale: 0.8 },
            }}
            style={{ width: '100%', height: '100%' }}
        >
            {children}
        </motion.div>
    );
}

export default FadeIn;
