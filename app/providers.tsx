'use client'

/**
 * Telemetry, through the ONE client.
 *
 * `@hanzo/event` posts to api.hanzo.ai/v1/event and that is the only collector
 * this site has. No second script, no vendor tag, no pixel. Cloudflare tries to
 * inject its own beacon at the edge and the CSP in universe refuses it — that
 * refusal is deliberate, not an oversight.
 *
 * `autoPageview` counts the initial load. There is no route change to follow on
 * a one-page export, so no usePageview() call — it would double-count.
 */

import { AnalyticsProvider, ErrorBoundary } from '@hanzo/event/react'

/**
 * The publishable ingest key. Write-only, and REQUIRED for anonymous traffic:
 * the reserved tenant that once caught keyless beacons is retired server-side,
 * so an event lands in the org a credential names or it is refused. Prefix is
 * `pk-`; no other prefix is read as a key.
 *
 * DECLARED, not fetched. It ships in the client bundle by construction, so it
 * is site identity rather than a secret, and a value every visitor already
 * holds gains nothing from a lookup. Declaring it is also lane-proof: a build
 * arg only reaches the lanes that remember to pass it, which is how hanzo.ai
 * once shipped a bundle keyed to a deleted project. An env var still wins, so a
 * lane can override without a code change.
 *
 * IT IS EMPTY, AND THAT IS THE HONEST STATE. Minting one is
 * `POST /v1/keys {"type":"publishable"}` against api.hanzo.ai, which needs a
 * cloud principal — an IAM password grant through a confidential client whose
 * secret is in KMS. Neither the in-cluster forge token nor the Sites deploy key
 * can mint it. Until a hanzo-ventures PROJECT key is pasted here (or set as
 * NEXT_PUBLIC_PUBLISHABLE_KEY on the deploy lane) this page reports nothing.
 *
 * A project key, NOT the org-wide `pk-live-*` one: cloud files a project key's
 * events under that project and the org-wide key's with product empty, so the
 * shared key costs exactly the attribution a fund page wants.
 */
const INGEST_KEY = process.env.NEXT_PUBLIC_PUBLISHABLE_KEY || ''

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AnalyticsProvider
      config={{
        product: 'site',
        // Passed explicitly rather than left to the SDK's own env read, so the
        // key this surface uses has one visible source instead of two.
        ...(INGEST_KEY ? { publishableKey: INGEST_KEY } : {}),
      }}
    >
      {/* React swallows render errors before window.onerror sees them, so the
          boundary is the only way they are ever reported. It renders its
          children unchanged when nothing throws. */}
      <ErrorBoundary>{children}</ErrorBoundary>
    </AnalyticsProvider>
  )
}
