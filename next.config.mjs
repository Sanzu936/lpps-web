/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
  // CSS en línea en el HTML: sin peticiones que bloqueen el primer pintado
  experimental: { inlineCss: true },
  ...(process.env.PROFILE_BUILD
    ? {
        webpack: (config) => {
          config.optimization.minimize = false;
          return config;
        },
      }
    : {}),
};
export default nextConfig;
