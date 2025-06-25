import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Only use webpack config when not using Turbopack
  ...(!process.env.TURBOPACK && {
    webpack: (config, { isServer }) => {
      // Handle @xenova/transformers for client-side usage
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
          path: false,
          os: false,
        };
      }
      
      // Externalize for server-side to prevent server-side bundling issues
      if (isServer) {
        config.externals = config.externals || [];
        config.externals.push('@xenova/transformers');
      }
      
      return config;
    },
  }),
  
  // Server external packages (works with both webpack and Turbopack)
  serverExternalPackages: ['@xenova/transformers'],
  
  // Environment variables for transformers
  env: {
    TRANSFORMERS_CACHE: './.cache/transformers',
  },
};

export default nextConfig;