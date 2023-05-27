import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

import styled from 'styled-components';
import breeds from '../../utils/breeds';
import { motion } from 'framer-motion';
import { reveal } from '../../animations/variants';

const randomCat = (): string => {
    const randomIndex = Math.floor(Math.random() * 66);
    return breeds.breeds[randomIndex];
};

const Random: React.FC = () => {
    const router = useRouter();

    useEffect(() => {
        const random = randomCat();
        router.push(`/cats/${random}`);
    }, []);

    return (
        <Container
            initial='exit'
            animate='enter'
            exit='exit'
            variants={reveal}
            key='page-random'
        >
            <LogoWrapper>
                <Image src='/images/logo.svg' alt='Cat Wiki Logo' fill />
            </LogoWrapper>
        </Container>
    );
};

export default Random;

const Container = styled(motion.div)`
    display: flex;
    align-items: center;
    justify-content: center;

    height: 100vh;
    width: 100%;
`;

const LogoWrapper = styled.div`
    position: relative;
    width: 180px;
    height: 80px;

    @media ${props => props.theme.devices.tablet} {
        width: 300px;
        height: 100px;
    }
`;
