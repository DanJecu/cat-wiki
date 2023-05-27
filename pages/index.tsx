import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Head from 'next/head';
import Hero from '../components/Hero';
import MainArticle from '../components/MainArticle';
import FeaturedArticle from '../components/FeaturedArticle';
import Footer from '../components/Footer';
import { reveal } from '../animations/variants';
import AnimateIntro from '../animations/AnimateIntro';

interface HomeProps {
    catList: any[];
}

export async function getStaticProps() {
    const req = await fetch(
        `https://api.thecatapi.com/v1/breeds?api_key=${process.env.CAT_API_KEY}`
    );
    const data = await req.json();

    return {
        props: { catList: data },
    };
}

const Home: React.FC<HomeProps> = ({ catList }) => {
    return (
        <>
            <Head>
                <title>Cat Wiki - Home</title>
                <link rel='icon' href='/favicon.ico' />

                <meta property='og:title' content='Cat Wiki - Home' />
            </Head>

            <Container
                id='root-home'
                initial='exit'
                animate='enter'
                exit='exit'
                variants={reveal}
            >
                <Hero catList={catList} />
                <AnimateIntro left>
                    <MainArticle />
                </AnimateIntro>
                <AnimateIntro right>
                    <FeaturedArticle />
                </AnimateIntro>
                <Footer />
            </Container>
        </>
    );
};

const Container = styled(motion.div)`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    overflow-x: hidden;
`;

export default Home;
