/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['public.blob.vercel-storage.com'],
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
