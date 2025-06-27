import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  ...(!process.env.TURBOPACK && {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
          path: false,
          os: false,
        };
      }
      if (isServer) {
        config.externals = config.externals || [];
        config.externals.push('@xenova/transformers');
      }
      
      return config;
    },
  }),
  
  serverExternalPackages: ['@xenova/transformers'],
  
  env: {
    TRANSFORMERS_CACHE: './.cache/transformers',
  },
};

export default nextConfig;