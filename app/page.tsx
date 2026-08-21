import { Chrome } from '@/components/Chrome'
import { built, worked, type Holding } from '@/src/portfolio'

/** The real application, on hanzo.ai. There is exactly one, and this page
 *  links to it rather than standing up a second one — a fund with two intake
 *  forms loses half of what it is sent. */
const APPLY = 'https://hanzo.ai/startups'

/** Techstars '17, as our own blog recorded it at the time. The claim on this
 *  page is a link to that post, not an assertion beside a logo. */
const TECHSTARS = 'https://blog.hanzo.ai/blog/2017-06-08-techstars-17/'

function Card({ h }: { h: Holding }) {
  return (
    <a className="holding" href={h.href}>
      <div className="top">
        {/* A monogram plate, identical for every entry. We hold no
            redistribution licence for other companies' marks, and a look-alike
            pictograph is not a licence. */}
        <span className="plate" aria-hidden="true">
          {h.mark}
        </span>
        <div>
          <h3>{h.name}</h3>
          <span className="addr">{h.entity ?? h.at}</span>
        </div>
      </div>
      <p>{h.what}</p>
      <span className="tag">{h.at} →</span>
    </a>
  )
}

export default function Page() {
  return (
    <>
      <Chrome />

      <header className="hero">
        <div className="wrap">
          <h1>
            We fund startups. <em>We also build them.</em>
          </h1>
          <p className="lede">
            Hanzo Ventures backs founders working on AI infrastructure, decentralized systems, and
            the tooling underneath both. We are operators before we are investors — Hanzo AI, Lux
            and Zoo are ours — so what we bring is the platform, the engineers who built it, and a
            straight answer about what does not work yet.
          </p>
          <div className="btns">
            <a className="btn solid" href={APPLY}>
              Apply to the program
            </a>
            <a className="btn" href="#portfolio">
              See the portfolio
            </a>
          </div>
          <ul className="stamp">
            <li>
              <a href={TECHSTARS}>Hanzo AI is Techstars ’17</a>
            </li>
          </ul>
        </div>
      </header>

      <main className="wrap">
        <section className="group">
          <div className="grouphead">
            <h2>What we fund</h2>
            <p>
              We invest where we have run the code ourselves. That is a narrow band, and saying so
              is more useful to a founder than a broad thesis nobody can act on.
            </p>
          </div>
          <div className="cards">
            <div className="card">
              <h3>AI infrastructure</h3>
              <p>
                Inference, agents, retrieval, evaluation — the plumbing under the models rather than
                another wrapper on top of them. We run this in production at hanzo.ai.
              </p>
            </div>
            <div className="card">
              <h3>Decentralized systems</h3>
              <p>
                Chains, identity, post-quantum cryptography, settlement. Lux is our own work in this
                area, so we can read your protocol rather than take your word for it.
              </p>
            </div>
            <div className="card">
              <h3>Developer tools</h3>
              <p>
                Things engineers choose on a Tuesday without asking permission. If adoption depends
                on a procurement cycle, we are the wrong fund.
              </p>
            </div>
            <div className="card">
              <h3>Open weights and open source</h3>
              <p>
                We publish the Zen weights and most of our stack. We are comfortable with companies
                whose core is readable, and we know how those businesses actually make money.
              </p>
            </div>
          </div>
        </section>

        <section className="group">
          <div className="grouphead">
            <h2>The Hanzo Startup Program</h2>
            <p>
              The program is run by Hanzo AI and the application lives at hanzo.ai/startups. It is
              open whether or not we ever invest — the credits are not a term sheet and carry no
              equity.
            </p>
          </div>
          <div className="steps">
            <div className="step">
              <b>Start free</b>
              <p>
                An account costs nothing. Add funds when you are ready and pay for what you use — no
                subscription, no minimum, no call with anybody.
              </p>
            </div>
            <div className="step">
              <b>Bring your own compute</b>
              <p>
                Connect GPUs and machines you already have. We meter the platform, not your iron, so
                a rack in a closet stays cheap to run.
              </p>
            </div>
            <div className="step">
              <b>Up to $150,000 in credits</b>
              <p>
                For venture-backed teams. An application is required and tier-one backing is a
                condition of the credits tier specifically.
              </p>
            </div>
            <div className="step">
              <b>Techstars founders</b>
              <p>
                Hanzo is a Techstars company. We match perks to each portfolio brand — name your
                batch in the application and we will honour it.
              </p>
            </div>
          </div>
          <div className="btns" style={{ marginTop: '2rem' }}>
            <a className="btn" href={APPLY}>
              Apply for credits
            </a>
            <a className="btn" href="https://console.hanzo.ai">
              Start building free
            </a>
          </div>
        </section>

        <section className="group" id="portfolio">
          <div className="grouphead">
            <h2>Portfolio — built and operated</h2>
            <p>
              Companies, networks and model families we founded and still run. Legal entities are
              quoted from our own brand registry; every address below answers, and a gate on every
              publish re-checks that it still does.
            </p>
          </div>
          <div className="folio">
            {built.map((h) => (
              <Card key={h.at} h={h} />
            ))}
          </div>
        </section>

        <section className="group">
          <div className="grouphead">
            <h2>Companies we have built for</h2>
            <p>
              Operating work — engineering, launches, go-to-market — for companies we do not own.
              These are clients, not investments, and each link goes to our own written account of
              the work so you can judge it rather than take a logo on trust.
            </p>
          </div>
          <div className="folio">
            {worked.map((h) => (
              <Card key={h.href} h={h} />
            ))}
          </div>
        </section>

        <section className="apply">
          <h2>Building something?</h2>
          <p>
            Send what you have running to <a href="mailto:ventures@hanzo.ai">ventures@hanzo.ai</a>.
            A repo and a paragraph beats a deck — we would rather read the code than the projection.
          </p>
          <p>
            If you want platform credits rather than capital, that is a different door and it is
            open on its own: the program application is at hanzo.ai/startups and does not route
            through us.
          </p>
          <div className="btns">
            <a className="btn solid" href="mailto:ventures@hanzo.ai">
              Send us what you have
            </a>
            <a className="btn" href={APPLY}>
              Apply to the program
            </a>
          </div>
        </section>

        <footer>
          <div className="fmap">
            <div>
              <b>Hanzo</b>
              <a href="https://hanzo.ai">hanzo.ai</a>
              <a href="https://console.hanzo.ai">Console</a>
              <a href="https://hanzo.works">Works</a>
              <a href="https://blog.hanzo.ai">Blog</a>
            </div>
            <div>
              <b>Networks</b>
              <a href="https://lux.network">Lux Network</a>
              <a href="https://zoo.ngo">Zoo</a>
              <a href="https://pars.network">Pars Network</a>
              <a href="https://zenlm.org">Zen</a>
            </div>
            <div>
              <b>Founders</b>
              <a href={APPLY}>Startup program</a>
              <a href="mailto:ventures@hanzo.ai">ventures@hanzo.ai</a>
              <a href={TECHSTARS}>Techstars ’17</a>
            </div>
          </div>
          <div className="fend">
            Hanzo AI, Inc. · Nothing on this page is an offer to sell or a solicitation to buy any
            security.
          </div>
        </footer>
      </main>
    </>
  )
}
