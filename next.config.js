const isDevelopment = process.env.NODE_ENV === "development";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep HMR output separate from production builds so concurrent commands
  // cannot remove each other's generated CSS and JavaScript assets.
  distDir: isDevelopment ? ".next-dev" : ".next"
};

module.exports = nextConfig;
