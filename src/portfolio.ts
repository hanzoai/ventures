/**
 * The portfolio, split by the CLAIM each entry actually supports.
 *
 * TWO exports, not one array, and that is the whole design. A single mixed
 * list is how a page ends up asserting things that are not true:
 * hanzo.ai/lib/constants/partner-logos.ts carries the post-mortem of exactly
 * that failure and prescribes this fix — separate the exports so a caller has
 * to pick the claim it means. "We built this" and "we did the work for this
 * company" are different sentences and they do not go in the same array.
 *
 * ADMISSION RULE: an entry goes in when its address ANSWERS. Verified with a
 * request before it was written here, and re-verified on every publish by the
 * `every address answers` gate in e2e/. Two candidates were dropped for
 * failing it — koan.zoo.ngo and yotoda.tech both NXDOMAIN.
 *
 * NO NUMBERS. There is no fund size, no AUM, no exit figure, no headcount and
 * no valuation anywhere in this file, because no verifiable record of any of
 * them exists in the estate. A fund page with an unverifiable number on it is
 * worse than one with none: it makes a reader discount the parts that are
 * true. The one number on this site is $150,000, which is the published
 * ceiling of a real program at hanzo.ai/startups.
 */

export interface Holding {
  /** The company or network, as it calls itself. */
  name: string
  /** Two letters for the monogram plate. Never a sourced trademark — see the
   *  plate rule in app/globals.css and hanzo.ai/scripts/gen-marks.mjs. */
  mark: string
  /** What it does, in plain words. */
  what: string
  /** The address as the reader reads it. */
  at: string
  /** Where the link goes. */
  href: string
  /** The registered entity, where one is on record in @hanzo/brand's registry.
   *  Optional on purpose: a field nobody can leave blank is a field somebody
   *  fills with a guess (oss-catalog.ts learned this by shipping nine invented
   *  repo addresses). Absent means "not on record", never "none". */
  entity?: string
}

/**
 * BUILT AND OPERATED BY US. Every one of these is a Hanzo-founded company,
 * network or model family that we still run. Legal entities are quoted from
 * the brand registry (@hanzo/brand), which is the fleet's own source of truth
 * and is gated by its own tests.
 */
export const built: Holding[] = [
  {
    name: 'Hanzo AI',
    mark: 'HA',
    entity: 'Hanzo AI Inc.',
    what: 'Enterprise AI infrastructure and frontier models. One API for inference, agents, storage and deploy — the platform this fund runs its own operations on.',
    at: 'hanzo.ai',
    href: 'https://hanzo.ai',
  },
  {
    name: 'Lux Network',
    mark: 'LX',
    entity: 'Lux Industries Inc.',
    what: 'High-performance, post-quantum blockchain infrastructure. A sovereign network for institutional-grade access to digital money and real world assets.',
    at: 'lux.network',
    href: 'https://lux.network',
  },
  {
    name: 'Zoo',
    mark: 'ZO',
    entity: 'Zoo Labs Foundation',
    what: 'An open, decentralized AI and science research network. A 501(c)(3) foundation funding work that does not have a commercial home yet.',
    at: 'zoo.ngo',
    href: 'https://zoo.ngo',
  },
  {
    name: 'Pars Network',
    mark: 'PA',
    entity: 'Parsis Foundation',
    what: 'A sovereign, verifiable identity layer for the Pars community.',
    at: 'pars.network',
    href: 'https://pars.network',
  },
  {
    name: 'Zen',
    mark: 'ZN',
    what: 'Our open-weight model family. The weights are published — you can run them on hardware you own, with nothing calling home.',
    at: 'zenlm.org',
    href: 'https://zenlm.org',
  },
  {
    name: 'Lux Fund',
    mark: 'LF',
    what: 'Digital asset management and a fund of funds, built for secure and sustainable returns.',
    at: 'lux.fund',
    href: 'https://lux.fund',
  },
  {
    name: 'Hanzo Agency',
    mark: 'AG',
    what: 'The creative arm. Design, content and marketing for brands, run with the same AI tooling we ship.',
    at: 'hanzo.agency',
    href: 'https://hanzo.agency',
  },
  {
    name: 'Sensei Group',
    mark: 'SG',
    what: 'A collective of fractional CXOs and operators who help enterprises actually land the technology they buy.',
    at: 'sensei.group',
    href: 'https://sensei.group',
  },
]

/**
 * COMPANIES WE HAVE BUILT FOR. Operating work — engineering, launches,
 * go-to-market — for companies we do NOT own and have NOT claimed to have
 * invested in.
 *
 * READ THIS BEFORE ADDING ONE. Every href points at OUR OWN published write-up
 * on blog.hanzo.ai, never at the company's site, and that is deliberate. It
 * keeps the page's claim exactly as strong as its evidence: we are saying "we
 * wrote this up and here it is", not "they endorse us". A reader can click
 * through and judge the work.
 *
 * NONE OF THESE IS AN INVESTMENT, and the page says so in as many words. No
 * file in the estate records a financial investment by Hanzo AI in an outside
 * company, so this site does not assert one.
 */
export const worked: Holding[] = [
  {
    name: 'Unikrn',
    mark: 'UK',
    what: 'Blockchain infrastructure and regulatory compliance across 15+ jurisdictions for the Unikoin Gold token launch.',
    at: 'Case study',
    href: 'https://blog.hanzo.ai/blog/2019-09-15-case-study-unikoin-gold/',
  },
  {
    name: 'Casper Labs',
    mark: 'CS',
    what: 'Architecture and launch of an enterprise blockchain — through the Rust pivot, mainnet, and the founding of DEVxDAO.',
    at: 'Case study',
    href: 'https://blog.hanzo.ai/blog/2020-11-20-case-study-casper-blockchain/',
  },
  {
    name: 'Damon Motorcycles',
    mark: 'DM',
    what: 'A demand campaign for their electric motorcycles.',
    at: 'Case study',
    href: 'https://blog.hanzo.ai/blog/2021-06-10-case-study-damon-motorcycles/',
  },
  {
    name: 'Bellabeat',
    mark: 'BB',
    what: 'CTO and CMO services, marketing automation and analytics for a women’s health wearable platform.',
    at: 'Case study',
    href: 'https://blog.hanzo.ai/blog/2022-04-15-case-study-bellabeat/',
  },
  {
    name: 'Personas Social',
    mark: 'PS',
    what: 'AI features built into the Keek social platform.',
    at: 'Case study',
    href: 'https://blog.hanzo.ai/blog/2025-01-10-case-study-keek-social/',
  },
]

/** Derived, never typed — a hand-kept count is a number that goes stale. */
export const builtCount = built.length
export const workedCount = worked.length
