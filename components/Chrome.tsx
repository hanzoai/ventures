'use client'

/**
 * The nav: the mark, the theme, and the way in.
 *
 * This module is the client boundary. `@hanzo/logo` ships no `"use client"`
 * directive of its own, so importing it from a Server Component fails — one
 * barrel here is the whole fix, and it is why the rest of the page stays a
 * Server Component that ships almost no JavaScript.
 *
 * Sign in is a LINK to the console, not a session minted here. A fund's front
 * page has no signed-in state to show, so an OAuth client of its own would buy
 * a name in the corner and cost a registration. The console signs people in
 * against Hanzo IAM, which is the one identity either way.
 */

import { useCallback, useEffect, useState } from 'react'
import { HanzoLogo } from '@hanzo/logo/react'
import { applyTheme, readThemeMode, type ThemeMode } from '@hanzo/iam/react'

/**
 * The design system is dark at `:root` and flips on `.light`; `applyTheme`
 * writes `data-theme` and the `dark` class. One control, so the two
 * conventions cannot disagree — this mirrors its ANSWER onto the class the
 * tokens actually read.
 */
function setTheme(mode: ThemeMode) {
  const resolved = applyTheme(mode)
  document.documentElement.classList.toggle('light', resolved === 'light')
}

/**
 * TWO states, not three. `system` is deliberately not offered: hanzo.ai serves
 * rgb(10, 10, 10) under prefers-color-scheme dark, light AND no-preference, so
 * the brand ground is a constant and "follow the OS" would hand a light laptop
 * a page that is off-brand by default. Dark unless somebody says otherwise.
 */
const NEXT: Record<'dark' | 'light', 'dark' | 'light'> = { dark: 'light', light: 'dark' }

export function Chrome() {
  const [mode, setMode] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    // Anything other than an explicit `light` is dark — the same rule the boot
    // script in app/layout.tsx applies, so the toggle's label and the painted
    // page cannot disagree on the first frame.
    setMode(readThemeMode() === 'light' ? 'light' : 'dark')
  }, [])

  const cycle = useCallback(() => {
    setMode((m) => {
      const next = NEXT[m]
      setTheme(next)
      try {
        localStorage.setItem('hanzo_iam_theme', next)
      } catch {
        /* a browser that refuses storage still gets the theme it asked for */
      }
      return next
    })
  }, [])

  return (
    <nav>
      <div className="in">
        <a className="brand" href="/">
          {/* The canonical mark from @hanzo/logo, never redrawn here.
              `variant="animated"` and NOT the `animated` motion shell: the
              shell brings its own wordmark that slides in and collapses, and
              the lockup beside it is already the wordmark. */}
          <HanzoLogo variant="animated" size={20} />
          <span>
            HANZO<i>VENTURES</i>
          </span>
        </a>
        <div className="navlinks">
          <button className="navlink" onClick={cycle} title={`Theme: ${mode}`} type="button">
            {mode}
          </button>
          <a className="navlink" href="#portfolio">
            Portfolio
          </a>
          <a className="navlink" href="https://hanzo.ai">
            hanzo.ai
          </a>
          <a className="navlink" href="https://console.hanzo.ai">
            Sign in
          </a>
        </div>
      </div>
    </nav>
  )
}
