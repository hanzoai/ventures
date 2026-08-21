import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { built, worked } from '../src/portfolio'

// `__dirname`, not `import.meta`: Playwright transpiles specs to CJS, where
// `import.meta` is a syntax error and the whole file silently collects zero
// tests — a green run that measured nothing.
const LLMS = join(__dirname, '../public/llms.txt')

/**
 * The gates read the EXPORTED BYTES, in a real browser, because every one of
 * the things that can go wrong here is invisible in the source: a token bump
 * that reintroduces a hue, a button that stops computing to a pill, a
 * portfolio entry whose address quietly stopped resolving.
 *
 * They run in the job that PUBLISHES, not beside it — workflows sharing a
 * trigger do not order themselves, so a red gate in cicd.yml cannot stop a
 * publish in deploy.yml.
 */

/** Every colour a browser reports is `rgb(r, g, b)` or `rgba(r, g, b, a)`.
 *  Monochrome means the three channels are equal, whatever the alpha. */
function channels(css: string): [number, number, number] | null {
  const m = css.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('the page reads as a fund, not a placeholder', async ({ page }) => {
  await expect(page).toHaveTitle(/Hanzo Ventures/)
  await expect(page.locator('h1')).toContainText('We fund startups')

  // The stub this replaced had zero occurrences of any of these. The words are
  // the whole point of the rebuild, so they are gated rather than assumed.
  const text = (await page.locator('body').innerText()).toLowerCase()
  for (const word of ['fund', 'startup', 'portfolio', 'invest']) {
    expect(text, `the page must say "${word}"`).toContain(word)
  }

  // Techstars '17 is the one credential we can stand behind, and it is a link
  // to our own contemporaneous post rather than a logo asserting itself.
  const techstars = page.getByRole('link', { name: /Techstars/i }).first()
  await expect(techstars).toHaveAttribute('href', /blog\.hanzo\.ai/)
})

test('the palette is monochrome — no green, no hue at all', async ({ page }) => {
  const offenders = await page.evaluate(() => {
    const bad: string[] = []
    const rgb = (s: string) => s.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/)
    for (const el of Array.from(document.querySelectorAll('*'))) {
      const cs = getComputedStyle(el)
      for (const prop of ['color', 'backgroundColor', 'borderTopColor', 'borderBottomColor', 'outlineColor', 'textDecorationColor'] as const) {
        const m = rgb(cs[prop])
        if (!m) continue
        const [r, g, b] = [Number(m[1]), Number(m[2]), Number(m[3])]
        if (r !== g || g !== b) {
          bad.push(`${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ')[0]} ${prop}=${cs[prop]}`)
        }
      }
    }
    return Array.from(new Set(bad))
  })
  expect(offenders, `every colour must have equal channels; these do not:\n${offenders.join('\n')}`).toEqual([])
})

// Measured on hanzo.ai: rgb(10, 10, 10) under all three, because the brand
// ground is a constant and not an OS preference. This page holds the same
// invariant, and `no-preference` is the one that catches a regression to
// "follow the system" — it is what a headless browser reports by default.
for (const colorScheme of ['dark', 'light', 'no-preference'] as const) {
  test(`the ground is #0a0a0a under prefers-color-scheme: ${colorScheme}`, async ({ browser }) => {
    const ctx = await browser.newContext({ colorScheme })
    const p = await ctx.newPage()
    await p.goto('/')
    const body = await p.evaluate(() => {
      const cs = getComputedStyle(document.body)
      return { bg: cs.backgroundColor, fg: cs.color }
    })
    // #0a0a0a === rgb(10, 10, 10). The brief names this value, the token
    // supplies it, and this asserts the two still agree.
    expect(channels(body.bg)).toEqual([10, 10, 10])
    const fg = channels(body.fg)!
    expect(fg[0], 'the ink must be near-white').toBeGreaterThan(200)
    await ctx.close()
  })
}

test('buttons are pills and cards are 24px', async ({ page }) => {
  // hanzo.ai computes 9999px on a call to action. --radius-full is that value;
  // this proves the page actually resolved it rather than inheriting a default.
  for (const sel of ['.btn', '.stamp li', '.plate']) {
    const radius = await page.locator(sel).first().evaluate((el) => getComputedStyle(el).borderRadius)
    expect(radius, `${sel} must be a pill`).toBe('9999px')
  }
  // --radius-2xl is 1.5rem, and the root font-size is 16px, so 24px.
  for (const sel of ['.card', '.holding', '.apply']) {
    const radius = await page.locator(sel).first().evaluate((el) => getComputedStyle(el).borderRadius)
    expect(radius, `${sel} must be a 24px card`).toBe('24px')
  }
})

// 390 is the iPhone measure and the narrowest thing anyone actually holds; the
// nav is a row of wide-tracked mono and is always what overflows first. This
// caught "SIGN IN" running off the right edge on the first published build.
for (const width of [320, 390, 768, 1280]) {
  test(`nothing overflows sideways at ${width}`, async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width, height: 900 } })
    const p = await ctx.newPage()
    await p.goto('/')
    const over = await p.evaluate((w) => {
      const bad: string[] = []
      for (const el of Array.from(document.querySelectorAll('*'))) {
        const r = el.getBoundingClientRect()
        if (r.width > 0 && Math.round(r.right) > w + 1) {
          bad.push(`${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ')[0]} right=${Math.round(r.right)}`)
        }
      }
      return { bad: Array.from(new Set(bad)).slice(0, 8), scroll: document.documentElement.scrollWidth }
    }, width)
    expect(over.scroll, 'the document must not scroll sideways').toBeLessThanOrEqual(width)
    expect(over.bad, `these run past the right edge:\n${over.bad.join('\n')}`).toEqual([])
    await ctx.close()
  })
}

test('the canonical Hanzo mark renders', async ({ page }) => {
  // From @hanzo/logo, never hand-drawn. It is an inline SVG inside the brand
  // link, so a broken import shows up here as zero nodes rather than as a
  // silently missing logo.
  const mark = page.locator('nav .brand svg')
  await expect(mark).toHaveCount(1)
  const box = await mark.boundingBox()
  expect(box!.width).toBeGreaterThan(8)
  expect(box!.height).toBeGreaterThan(8)
})

test('every portfolio entry is on the page with its address', async ({ page }) => {
  for (const h of [...built, ...worked]) {
    const card = page.locator('.holding', { hasText: h.name }).first()
    await expect(card, `${h.name} must be on the page`).toBeVisible()
    await expect(card).toHaveAttribute('href', h.href)
  }
})

test('llms.txt has not drifted from the portfolio', async () => {
  // Two files stating the same list is two files that disagree eventually.
  // This is the check that keeps the machine-facing copy honest.
  const txt = readFileSync(LLMS, 'utf8')
  for (const h of [...built, ...worked]) {
    expect(txt, `llms.txt must name ${h.name}`).toContain(h.name)
    expect(txt, `llms.txt must carry ${h.name}'s address`).toContain(h.href)
  }
})

test('no number on the page that we cannot source', async ({ page }) => {
  // The hard rule: if there is no real number, print no number. $150,000 is
  // the published ceiling of a real program and is the ONLY money figure
  // allowed. This fails on a fabricated AUM, fund size or exit the moment
  // somebody adds one.
  const text = await page.locator('body').innerText()
  const money = (text.match(/\$[\d][\d,.]*\s*(?:[MBK]\b|million|billion)?/gi) ?? []).map((s) =>
    s.trim(),
  )
  expect(Array.from(new Set(money))).toEqual(['$150,000'])
})

test('one collector, and it is ours', async ({ page }) => {
  // The page may talk to api.hanzo.ai and to nowhere else. This is what stops a
  // vendor tag, a pixel or a second analytics script arriving later and
  // splitting the numbers across two systems that never agree.
  //
  // It measures the EXPORT, served locally, so it sees only what this repo
  // ships. Cloudflare injects its own beacon at the edge on the live host; the
  // CSP in universe refuses that one, and refusing it is the same rule enforced
  // one layer out.
  const offsite: string[] = []
  page.on('request', (r) => {
    const u = new URL(r.url())
    if (u.hostname !== '127.0.0.1' && u.hostname !== 'localhost' && u.hostname !== 'api.hanzo.ai') {
      offsite.push(`${u.hostname}${u.pathname}`)
    }
  })
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  expect(Array.from(new Set(offsite)), 'the page must call no collector but ours').toEqual([])
})

test('the ingest key, if declared, is a real publishable key', async () => {
  // `pk-` is the only prefix cloud reads as a publishable key. A value of any
  // other shape is not a key that fails loudly — it is a bundle whose every
  // anonymous event is refused 401, which reads as "no traffic" rather than as
  // a broken deploy. Empty is the honest absent state and passes; malformed
  // does not.
  const src = readFileSync(join(__dirname, '../app/providers.tsx'), 'utf8')
  const declared = src.match(/NEXT_PUBLIC_PUBLISHABLE_KEY \|\| '([^']*)'/)
  expect(declared, 'providers.tsx must keep the declared-key shape').not.toBeNull()
  const key = declared![1]
  if (key !== '') expect(key, 'a declared key must carry the pk- prefix').toMatch(/^pk-[A-Za-z0-9_-]{20,}$/)
})

test('every address this page sends a reader to answers', async ({ page, request }) => {
  const hrefs = await page.locator('a[href^="https://"]').evaluateAll((els) =>
    Array.from(new Set(els.map((e) => (e as HTMLAnchorElement).href))),
  )
  expect(hrefs.length).toBeGreaterThan(10)
  const dead: string[] = []
  await Promise.all(
    hrefs.map(async (u) => {
      // GET, not HEAD: an origin can answer HEAD 200 for a path it 404s on GET.
      const r = await request.get(u, { timeout: 25_000, maxRedirects: 5 }).catch(() => null)
      if (!r || r.status() >= 400) dead.push(`${u} -> ${r ? r.status() : 'unreachable'}`)
    }),
  )
  expect(dead, `these addresses do not answer:\n${dead.join('\n')}`).toEqual([])
})
