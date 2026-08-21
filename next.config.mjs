/** @type {import('next').NextConfig} */
//
// Plain ESM with a JSDoc type, the house choice across hanzo.ai, hanzo.works
// and hanzo.industries: the config is a plain object and never needed the
// TypeScript compiler API to load it.
//
// This site is a STATIC EXPORT and must not grow a server. It is a fund's
// front page — there is no signed-in state to hold, so there is nothing here
// for a server to do. The export ships to the Sites plane:
// POST /v1/projects/hanzo-ventures/deployments.
//
// `trailingSlash: true` makes the export a tree of directory indexes
// (`out/portfolio/index.html`) rather than flat siblings, and a directory
// index is what a plain file server resolves.
//
// Response headers are NOT here. `headers()` is silently inert under
// `output: export` — Next says so on every build — so a block here would read
// as a security control and enforce nothing. They are the
// `hanzo-ventures-headers` middleware in universe, which is what actually
// serves. A `public/_headers` file is dead config on this plane.

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  poweredByHeader: false,
  images: { unoptimized: true },
  productionBrowserSourceMaps: false,
}

export default nextConfig
