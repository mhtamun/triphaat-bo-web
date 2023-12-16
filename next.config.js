/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8079',
                pathname: '/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8081',
                pathname: '/**',
            },
            {
                protocol: 'http',
                hostname: '0.0.0.0',
                port: '8081',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'beta.s2.triphaat.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 's2.triphaat.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'beta.triphaat.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'triphaat.com',
                port: '',
                pathname: '/assets/images/**',
            },
            {
                protocol: 'https',
                hostname: 'images.pexels.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'a0.muscache.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'www.gstatic.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
};

module.exports = nextConfig;
