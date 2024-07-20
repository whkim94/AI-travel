const isStaticExport = 'false';

const nextConfig = {
  trailingSlash: true,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  env: {
    BUILD_STATIC_EXPORT: isStaticExport,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // domains: [
    //   'images.unsplash.com',
    //   'lh3.googleusercontent.com',
    //   'encrypted-tbn0.gstatic.com',
    //   'encrypted-tbn1.gstatic.com',
    //   'encrypted-tbn2.gstatic.com',
    //   'encrypted-tbn3.gstatic.com',
    // ],
  },
  reactStrictMode: true,
  swcMinify: true,
  modularizeImports: {
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
    '@mui/material': {
      transform: '@mui/material/{{member}}',
    },
    '@mui/lab': {
      transform: '@mui/lab/{{member}}',
    },
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  ...(isStaticExport === 'true' && {
    output: 'export',
  }),
};

export default nextConfig;
