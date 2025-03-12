/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: "www.google.com" }, { hostname: "firebasestorage.googleapis.com" }],
  },
};

export default nextConfig;
