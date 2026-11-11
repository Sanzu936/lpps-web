// Ruta base opcional para publicar la web dentro de una subcarpeta (p. ej. una demo en
// https://dominio/abc123/): BASE_PATH=/abc123 npm run build. Sin ella, la web va en la raíz.
const basePath = (process.env.BASE_PATH || "").replace(/\/$/, "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
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
