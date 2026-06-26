/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@wellness/shared'],
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/node_modules/**', '**/.pnpm-store/**', '**/.next/**']
    };

    return config;
  }
};

export default nextConfig;
