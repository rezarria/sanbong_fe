// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/api/**",
      },
    ],
  },
  webpack(config) {
    const fileLoaderRule = config.module.rules.find(rule=> rule.test?.test?.('.svg'),)
    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: {
          not: [...fileLoaderRule.resourceQuery.not, /url/]
        },
        use: ['@svgr/webpack']
      }
    )
    return config
  }
}

module.exports = nextConfig
