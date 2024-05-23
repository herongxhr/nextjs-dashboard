/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  env: {
    NEXT_PUBLIC_HOSTNAME: process.env.NEXT_PUBLIC_HOSTNAME,
    NEXT_PUBLIC_PORT: process.env.NEXT_PUBLIC_PORT,
  },
  /* config options here */
};

export default nextConfig;
