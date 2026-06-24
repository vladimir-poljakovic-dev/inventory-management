/** @type {import('next').NextConfig} */
const nextConfig = {
  // Transpile the shared workspace package so its source resolves cleanly.
  transpilePackages: ['@repo/types'],
};

module.exports = nextConfig;
