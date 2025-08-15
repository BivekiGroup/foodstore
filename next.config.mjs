/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['cdn.sanity.io'],
    },
    eslint: {
        // Avoid failing the production build on ESLint errors
        ignoreDuringBuilds: true,
    },
    typescript: {
        // Avoid failing the production build on type errors
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
