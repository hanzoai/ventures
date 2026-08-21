'use client'

/**
 * Telemetry, through the ONE client.
 *
 * `@hanzo/event` posts to api.hanzo.ai/v1/event and that is the only collector
 * this site has. No second script, no vendor tag, no pixel — a page that
 * measures itself twice reports two different numbers and neither can be
 * trusted.
 *
 * NO KEY IS WRITTEN HERE. The client reads NEXT_PUBLIC_PUBLISHABLE_KEY from the
 * inlined build env when the deployment carries one, and reports for whoever is
 * signed in when it does not. Hard-coding a `pk-` would freeze one org's key
 * into the bundle forever; leaving it to the env is the fleet's one spelling.
 *
 * `autoPageview` counts the initial load. There is no route change to follow on
 * a one-page export, so no usePageview() call — it would double-count.
 */

import { AnalyticsProvider, ErrorBoundary } from '@hanzo/event/react'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AnalyticsProvider config={{ product: 'site' }}>
      {/* React swallows render errors before window.onerror sees them, so the
          boundary is the only way they are ever reported. It renders its
          children unchanged when nothing throws. */}
      <ErrorBoundary>{children}</ErrorBoundary>
    </AnalyticsProvider>
  )
}
