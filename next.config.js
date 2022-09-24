/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

const withTM = require("next-transpile-modules")([
  "@pusher/push-notifications-web",
]);

module.exports = withTM(nextConfig);
