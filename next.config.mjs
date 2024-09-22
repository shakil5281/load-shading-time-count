/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      ignoreDuringBuilds: true,
    },
    images: {
      domains: ['static.vecteezy.com'], // Add the domain you want to allow
    },
  };
  
  export default nextConfig;
  