import React, { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { revealStill } from '../animations/variants';

interface ModalProps {
    targetId: string;
    onClickOutside: () => void;
    children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({
    targetId,
    onClickOutside,
    children,
}) => {
    useEffect(() => {
        const targetElement = document.getElementById(targetId) as HTMLElement;
        targetElement.style.position = 'relative';
        return () => {
            targetElement.style.position = '';
        };
    }, [targetId]);

    function handleClick(e: React.MouseEvent<HTMLDivElement>) {
        if (e.target === e.currentTarget) {
            onClickOutside();
        }
    }

    const targetElement = document.getElementById(targetId) as HTMLElement;

    return createPortal(
        <AnimatePresence>
            <Overlay
                initial='exit'
                animate='enter'
                exit='exit'
                variants={revealStill as Variants}
                onClick={handleClick}
            >
                {children}
            </Overlay>
        </AnimatePresence>,
        targetElement
    );
};

export default Modal;

const Overlay = styled(motion.div)`
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(3px);

    display: flex;
    justify-content: center;
    padding: 1rem 0;

    @media ${props => props.theme.devices.tablet} {
        padding: 2rem;
    }
`;
