import React, { useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import { NextComponentType, NextPageContext } from 'next';

import GlobalStyles from '../styles/global';
import theme from '../styles/themes';

// AnimatePresence exit animation
const pageVariants = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
        transition: {
            duration: 0.3,
        },
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.3,
        },
    },
};

interface AppProps {
    Component: NextComponentType<NextPageContext, any, {}>;
    pageProps: any;
    router: any;
}

const App: React.FC<AppProps> = ({ Component, pageProps, router }) => {
    const [loading, setLoading] = useState(false);
    const controls = useAnimation();

    useEffect(() => {
        const startLoading = () => {
            setLoading(true);
        };

        const stopLoading = () => {
            setLoading(false);
        };

        router.events.on('routeChangeStart', startLoading);
        router.events.on('routeChangeComplete', stopLoading);
        router.events.on('routeChangeError', stopLoading);

        return () => {
            router.events.off('routeChangeStart', startLoading);
            router.events.off('routeChangeComplete', stopLoading);
            router.events.off('routeChangeError', stopLoading);
        };
    }, []);

    useEffect(() => {
        if (loading) {
            controls.start({ width: '100%' });
        } else {
            controls.start({ width: '0%' });
        }
    }, [loading, controls]);

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyles />
            <AnimatePresence mode='wait'>
                <motion.div
                    key={router.route}
                    initial='initial'
                    animate='animate'
                    exit='exit'
                    variants={pageVariants}
                >
                    <Component {...pageProps} />
                </motion.div>
                <motion.div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        height: '0.18rem',
                        backgroundColor: '#FDBA74',
                        width: '0%',
                    }}
                    initial={false}
                    animate={controls}
                    transition={{ duration: 0.3 }}
                />
            </AnimatePresence>
        </ThemeProvider>
    );
};

export default App;
