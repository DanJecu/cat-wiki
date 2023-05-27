import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface AnimateIntroProps {
    children: React.ReactNode;
    left?: boolean;
    right?: boolean;
}

const AnimateIntro: React.FC<AnimateIntroProps> = ({
    children,
    left,
    right,
}) => {
    const controls = useAnimation();
    const [ref, inView] = useInView({ threshold: 0.4 });

    useEffect(() => {
        if (inView) {
            controls.start('visible');
        }
    }, [controls, inView]);

    const xValue = left ? '-90vw' : right ? '90vw' : 0;

    return (
        <div ref={ref} style={{ width: '100%', height: '100%' }}>
            <motion.div
                animate={controls}
                initial='hidden'
                transition={{ duration: 1 }}
                variants={{
                    visible: { x: 0, opacity: 1 },
                    hidden: { x: xValue, opacity: 0 },
                }}
                style={{ width: '100%', height: '100%' }}
            >
                {children}
            </motion.div>
        </div>
    );
};

export default AnimateIntro;
