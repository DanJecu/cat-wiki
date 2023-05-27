/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['cdn2.thecatapi.com'],
    },
    compiler: {
        styledComponents: true,
    },
};

module.exports = nextConfig;
