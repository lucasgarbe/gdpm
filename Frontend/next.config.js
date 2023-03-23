/** @type {import('next').NextConfig} */
const nextConfig = {
                     reactStrictMode: false,
                     swcMinify: true,
                     output: "standalone",
                     typescript: {
                       ignoreBuildErrors: true,
                     },
                   };

module.exports = nextConfig;

