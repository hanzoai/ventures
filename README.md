# hanzo.ventures

The Hanzo Ventures site. A Next.js `output: export` served from the Hanzo
Sites plane — no container, no App CR, no Cloudflare Worker.

    pnpm install
    pnpm build      # -> out/
    pnpm gates      # playwright, over the exported bytes
    pnpm typecheck

## How it ships

`.hanzo/workflows/deploy.yml` runs the gates and then publishes `out/` with
`hanzoai/ci`'s `site` action: enqueue a deployment, POST the objects straight
to S3 under a short-lived prefix-scoped grant, complete. The route, the
response headers and the certificate live in `universe`.

## The rule for content

Every portfolio entry is real and its address answers — `src/portfolio.ts`
states the admission rule and `e2e/gates.spec.ts` enforces it on every publish,
along with the monochrome palette, the pill and card radii, and the ban on any
money figure we cannot source.
