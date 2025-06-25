import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('@huggingface/transformers');
    }
    return config;
  },
  serverExternalPackages: ['@huggingface/transformers'],
  
  
};

export default nextConfig;
