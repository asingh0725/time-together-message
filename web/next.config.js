const { withSentryConfig } = require('@sentry/nextjs')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = withSentryConfig(nextConfig, {
  // Sentry organization and project (from .env or environment)
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Only upload source maps during CI builds with auth token set
  silent: !process.env.CI,
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Disable source map upload if no auth token (local/dev builds)
  sourcemaps: {
    disable: !process.env.SENTRY_AUTH_TOKEN,
  },

  // Suppress verbose Sentry build output
  hideSourceMaps: true,
})
