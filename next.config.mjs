/** @type {import('next').NextConfig} */
const nextConfig = {
  // O lint corre à parte com `npm run lint` (eslint.config.mjs).
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
