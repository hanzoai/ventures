import type { Metadata } from 'next'
import { bootScript } from '@hanzo/appearance/state'
import { Providers } from './providers'
import './globals.css'

const title = 'Hanzo Ventures'
const description =
  'We fund startups building AI infrastructure, decentralized systems and the tooling underneath both. Operators first — Hanzo AI, Lux and Zoo are ours. Hanzo AI is Techstars ’17.'
const url = 'https://hanzo.ventures'

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: { default: title, template: '%s — Hanzo Ventures' },
  description,
  applicationName: title,
  alternates: { canonical: '/' },
  openGraph: { title, description, url, siteName: title, type: 'website' },
  twitter: { card: 'summary_large_image', title, description, site: '@hanzoai' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Paint the person's own type scale, density and accent BEFORE the
            stylesheet — the one thing a React component cannot do, because it
            mounts after the first paint. @hanzo/appearance owns the script; we
            only place it. */}
        <script dangerouslySetInnerHTML={{ __html: bootScript() }} />
        {/* Light/dark, before the stylesheet, or a reader who chose light gets
            a dark first frame.
            DARK IS THE DEFAULT AND IT DOES NOT FOLLOW THE OS. Measured on
            hanzo.ai under prefers-color-scheme dark, light and no-preference:
            rgb(10, 10, 10) in all three. The brand ground is a constant, not a
            preference, so only an EXPLICIT choice stored here moves it — a
            visitor on a light laptop still sees the brand.
            `hanzo_iam_theme` is the key @hanzo/iam/react's readThemeMode()
            reads, so this script and the toggle in Chrome.tsx read one value. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var l=localStorage.getItem('hanzo_iam_theme')==='light';var r=document.documentElement;r.setAttribute('data-theme',l?'light':'dark');r.classList.toggle('dark',!l);r.classList.toggle('light',l);r.style.colorScheme=l?'light':'dark'}catch(e){}})()`,
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
