import { chromium } from '@playwright/test'
const URL = process.argv[2]
const TAG = process.argv[3] || 'live'
const b = await chromium.launch()
for (const [w, h, name] of [[390, 844, 'mobile-390'], [1280, 900, 'desktop-1280']]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2 })
  const p = await ctx.newPage()
  await p.goto(URL, { waitUntil: 'networkidle', timeout: 60000 })
  await p.waitForTimeout(1200)
  await p.screenshot({ path: `/tmp/ventures-${TAG}-${name}.png`, fullPage: false })
  if (w === 1280) {
    const m = await p.evaluate(() => {
      const cs = getComputedStyle(document.body)
      const g = (s) => { const e = document.querySelector(s); return e ? getComputedStyle(e).borderRadius : null }
      // every distinct colour actually painted
      const hues = new Set()
      for (const el of document.querySelectorAll('*')) {
        const c = getComputedStyle(el)
        for (const k of ['color','backgroundColor','borderTopColor']) {
          const mm = c[k].match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/)
          if (mm && !(mm[1]===mm[2] && mm[2]===mm[3])) hues.add(`${k}:${c[k]}`)
        }
      }
      return { bg: cs.backgroundColor, fg: cs.color,
               btn: g('.btn'), stamp: g('.stamp li'), plate: g('.plate'),
               card: g('.card'), holding: g('.holding'), apply: g('.apply'),
               svg: document.querySelectorAll('nav .brand svg').length,
               holdings: document.querySelectorAll('.holding').length,
               nonMonochrome: [...hues] }
    })
    console.log(JSON.stringify(m, null, 1))
  }
  await ctx.close()
}
await b.close()
