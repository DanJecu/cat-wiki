import React, { useState } from 'react';
import styled from 'styled-components';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Header from '../../components/Header';
import CatInfo from '../../components/CatInfo';
import NavigateButton from '../../components/NavigateButton';
import Footer from '../../components/Footer';
import Modal from '../../components/Modal';
import { pop, reveal } from '../../animations/variants';
import { motion } from 'framer-motion';
import FadeIn from '../../animations/FadeIn';

interface BreedData {
    name: string;
    description: string;
    temperament: string;
    origin: string;
    life_span: number;
    adaptability: number;
    affection_level: number;
    child_friendly: number;
    dog_friendly: number;
    energy_level: number;
    grooming: number;
    health_issues: number;
    intelligence: number;
    shedding_level: number;
    social_needs: number;
    stranger_friendly: number;
    vocalisation: number;
    wikipedia_url: string;
}

interface ImageData {
    url: string;
    width: number;
    height: number;
}

interface CatProps {
    breedData: BreedData;
    imagesData: ImageData[];
}

export const getStaticProps: GetStaticProps<CatProps> = async ({ params }) => {
    if (!params || params.id === 'mala') {
        //Thise ID is not working
        return {
            notFound: true,
        };
    }

    // Fetch breed information
    const breedReq = await fetch(
        `https://api.thecatapi.com/v1/breeds/${params.id}`
    );
    const breedData: BreedData = await breedReq.json();

    // Fetch images for the breed
    const imagesReq = await fetch(
        `https://api.thecatapi.com/v1/images/search?breed_id=${params.id}&api_key=${process.env.CAT_API_KEY}&limit=30`
    );
    const imagesData: ImageData[] = await imagesReq.json();

    return {
        props: {
            breedData,
            imagesData,
        },
    };
};

export const getStaticPaths: GetStaticPaths = async () => {
    const req = await fetch(
        `https://api.thecatapi.com/v1/breeds?api_key=${process.env.CAT_API_KEY}`
    );
    const data = await req.json();

    const paths = data.map((cat: { id: string }) => {
        return { params: { id: cat.id } };
    });

    return {
        paths,
        fallback: false,
    };
};

const Cat: React.FC<CatProps> = ({ breedData, imagesData }) => {
    const cat = breedData;
    const [imageToDisplay, setImageToDisplay] = useState<string>();
    const [showModal, setShowModal] = useState(false);

    const images = imagesData.map((image: ImageData) => ({
        url: image.url,
        width: image.width,
        height: image.height,
    }));

    return (
        <>
            <Head>
                <title>{`${cat.name} - Cat Wiki`}</title>
            </Head>

            <Container
                id='root-cat'
                initial='exit'
                animate='enter'
                exit='exit'
                variants={reveal}
            >
                <Header />

                <div className='intro-container'>
                    <HeroImgWrapper
                        onClick={() => {
                            setImageToDisplay(images[0].url);
                            setShowModal(true);
                        }}
                    >
                        <Image
                            src={images[0].url}
                            className='main-img'
                            alt='Featured image of the breed'
                            fill
                            sizes='20vw'
                            priority
                        />
                    </HeroImgWrapper>

                    <Intro>
                        <Title>{cat.name}</Title>

                        <SectionTitle>Breed Overview</SectionTitle>
                        <p>{cat.description}</p>
                        <span>
                            <strong>Temperament: </strong>
                            {cat.temperament}
                        </span>
                        <span>
                            <strong>Origin: </strong>
                            {cat.origin}
                        </span>
                        <span>
                            <strong>Lifespan: </strong>
                            {cat.life_span} years
                        </span>
                    </Intro>
                </div>

                <div className='characteristics-container'>
                    <Characteristics>
                        <SectionTitle>Breed Characteristics</SectionTitle>

                        <StatsWrapper>
                            <CatInfo
                                title={'Adaptability'}
                                level={cat.adaptability}
                            />
                            <CatInfo
                                title={'Affection Level'}
                                level={cat.affection_level}
                            />
                            <CatInfo
                                title={'Child Friendly'}
                                level={cat.child_friendly}
                            />
                            <CatInfo
                                title={'Dog Friendly'}
                                level={cat.dog_friendly}
                            />
                            <CatInfo
                                title={'Energy Level'}
                                level={cat.energy_level}
                            />
                            <CatInfo title={'Grooming'} level={cat.grooming} />
                            <CatInfo
                                title={'Health Issues'}
                                level={cat.health_issues}
                            />
                            <CatInfo
                                title={'Intelligence'}
                                level={cat.intelligence}
                            />
                            <CatInfo
                                title={'Shedding Level'}
                                level={cat.shedding_level}
                            />
                            <CatInfo
                                title={'Social Needs'}
                                level={cat.social_needs}
                            />
                            <CatInfo
                                title={'Stranger Friendly'}
                                level={cat.stranger_friendly}
                            />
                            <CatInfo
                                title={'Vocalisation'}
                                level={cat.vocalisation}
                            />
                        </StatsWrapper>

                        <NavigateButton
                            text='Read more'
                            to={cat.wikipedia_url}
                        />
                    </Characteristics>
                </div>

                <div className='gallery-container'>
                    <Gallery>
                        <SectionTitle>Other Photos</SectionTitle>

                        <div className='images-container'>
                            {images.map((img: ImageData, index: number) => {
                                if (index === 0) return null;

                                return (
                                    <FadeIn key={`gallery-img-${index}`}>
                                        <div
                                            className='preview-img-wrapper'
                                            onClick={() => {
                                                setImageToDisplay(img.url);
                                                setShowModal(true);
                                            }}
                                        >
                                            <Image
                                                className='preview-img'
                                                src={img.url}
                                                alt='Photo of this breed of cat'
                                                fill
                                                sizes='20vw'
                                                priority
                                            />
                                        </div>
                                    </FadeIn>
                                );
                            })}
                        </div>
                    </Gallery>
                </div>

                <Footer />

                {showModal && (
                    <Modal
                        onClickOutside={() => setShowModal(false)}
                        targetId='root-cat'
                    >
                        <ModalContent
                            initial='exit'
                            animate='enter'
                            exit='exit'
                            variants={pop}
                        >
                            <div className='preview-img-wrapper'>
                                <Image
                                    className='preview-img'
                                    src={imageToDisplay || ''}
                                    alt='Photo of this breed of cat'
                                    fill
                                    sizes='20vw'
                                    priority
                                />
                            </div>

                            <button
                                className='close-btn'
                                onClick={() => setShowModal(false)}
                            >
                                X
                            </button>
                        </ModalContent>
                    </Modal>
                )}
            </Container>
        </>
    );
};

export default Cat;

const Container = styled(motion.main)`
    display: flex;
    flex-direction: column;
    align-items: center;

    background-color: ${props => props.theme.colors.bg};

    .intro-container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .characteristics-container,
    .gallery-container {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    @media ${props => props.theme.devices.tablet} {
        .intro-container {
            padding: 0 2rem;
            max-width: 1440px;
            flex-direction: row;
            justify-content: space-between;
        }

        .characteristics-container,
        .gallery-container {
            padding: 0 2rem;
            max-width: 1440px;
        }
    }
`;

const HeroImgWrapper = styled.div`
    position: relative;

    width: calc(100% - 4rem);
    max-width: 350px;
    min-height: 350px;

    .main-img {
        object-fit: cover;
        border-radius: 1rem;
    }

    &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: -10px;
        transform: translateY(-50%);

        border-radius: 1rem;
        background-color: ${props => props.theme.colors.accent.light};
        height: calc(100% - 2px);
        width: 100%;

        transition: all 0.4s;
    }

    @media ${props => props.theme.devices.tablet} {
        margin-left: 10px;
    }
`;

const Intro = styled.section`
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    width: 100%;
    padding: 3rem 2rem;
    margin-top: 10rem;
    border-radius: 2rem 2rem 0 0;

    background-color: ${props => props.theme.colors.grey[200]};
    position: relative;

    p {
        color: ${props => props.theme.colors.grey[500]};
        margin-bottom: 2rem;
    }

    span {
        color: ${props => props.theme.colors.bg};
        margin-bottom: 1rem;
    }

    @media ${props => props.theme.devices.tablet} {
        margin-top: 0;
        margin-left: 2rem;
        padding: 3rem 2rem 2rem 10rem;
        border-radius: 15rem 2rem 0 0;

        h2 {
            display: none;
        }
    }
`;

const Title = styled.h1`
    position: absolute;
    top: -7rem;
    left: 50%;
    transform: translateX(-50%);

    text-align: center;
    font-size: 2rem;
    font-weight: 600;

    @media ${props => props.theme.devices.tablet} {
        position: static;
        transform: none;
        color: ${props => props.theme.colors.bg};
        text-align: left;

        margin-bottom: 1rem;
    }
`;

const SectionTitle = styled.h2`
    font-size: 1.2rem;
    color: ${props => props.theme.colors.bg};
    margin-bottom: 2.5rem;

    position: relative;

    &::after {
        content: '';
        position: absolute;
        bottom: -0.5rem;
        left: 0;

        width: 50%;
        height: 4px;
        border-radius: 3px;
        background-color: ${props => props.theme.colors.accent.light};
    }
`;

const Characteristics = styled.section`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    align-self: center;

    width: 100%;
    padding: 0 2rem 2rem;
    border-radius: 0 0 2rem 2rem;

    background-color: ${props => props.theme.colors.grey[200]};
    position: relative;

    &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 4px;
        background-color: ${props => props.theme.colors.grey[200]};
        top: -2px;
        left: 0;
    }

    a {
        align-self: center;
    }

    @media ${props => props.theme.devices.tablet} {
        max-width: 1440px;
        padding: 3rem;
        border-radius: 2rem 0 0 0;
        background-color: #f3edea;

        &::before {
            display: none;
        }
    }
`;

const StatsWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 350px));
    gap: 2rem 4rem;
    width: 100%;
    margin-bottom: 3rem;
`;

const Gallery = styled.section`
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    width: 100%;
    min-height: 400px;
    padding: 3rem 2rem;
    margin: 3rem 0 1rem;
    border-radius: 2rem;

    background-color: ${props => props.theme.colors.grey[200]};
    position: relative;

    .images-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        grid-gap: 2rem;
        width: 100%;
    }

    .preview-img-wrapper {
        width: 100%;
        border-radius: 1rem;

        min-height: 300px;

        position: relative;
        cursor: pointer;

        .preview-img {
            object-fit: cover;
            border-radius: 1rem;
        }

        &::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);

            border-radius: 1rem;
            background-color: ${props => props.theme.colors.accent.light};
            height: 100%;
            width: 100%;

            transition: all 0.4s;
        }

        &:hover::before {
            transform: translateY(-50%) translateX(-10px);
        }
    }

    @media ${props => props.theme.devices.tablet} {
        margin: 0 0 2rem;
        padding: 3rem;
        border-radius: 0 0 2rem 2rem;
    }
`;

const ModalContent = styled(motion.div)`
    background-color: ${props => props.theme.colors.grey[50]};
    padding: 1rem;
    border-radius: 2rem;
    display: flex;
    flex-direction: column;

    width: calc(100% - 4rem);
    max-width: calc(1440px - 4rem);
    height: 100%;
    max-height: calc(100vh - 4rem);

    position: sticky;
    top: 2rem;
    left: 2rem;

    .preview-img-wrapper {
        width: 100%;
        border-radius: 1rem;

        height: 100%;

        position: relative;
        cursor: pointer;

        .preview-img {
            object-fit: contain;
            border-radius: 1rem;
        }
    }

    .close-btn {
        position: absolute;
        right: 1rem;
        top: 1rem;
        color: ${props => props.theme.colors.bg};

        font-size: 2rem;
        background: none;
        border: none;

        cursor: pointer;
    }

    @media ${props => props.theme.devices.tablet} {
        padding: 3rem;
    }
`;
