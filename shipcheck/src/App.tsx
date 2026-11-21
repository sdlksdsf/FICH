import { useEffect, useState } from 'react'
import { FAQ, FAILURES, PROOF, TIERS } from './offer'
import { CONTACT_EMAIL, OWNER } from './config'
import Scanner from './components/Scanner'
import OrderForm from './components/OrderForm'
import { Check, Gauge, Section } from './components/ui'

export default function App() {
  const [scanned, setScanned] = useState(false)

  useEffect(() => {
    document.title =
      'ShipCheck — Get your AI-built app to production, in 5 days'
  }, [])

  return (
    <>
      <nav className="nav">
        <div className="wrap nav-in">
          <a href="#top" className="brand" style={{ textDecoration: 'none' }}>
            <span className="mark" aria-hidden="true">🛡️</span> ShipCheck
          </a>
          <div className="nav-links">
            <a href="#free-scan">Free scan</a>
            <a href="#pricing">Pricing</a>
            <a href="#how">How it works</a>
            <a href="#faq">FAQ</a>
            <a href="#order" className="btn btn-primary" style={{ padding: '9px 15px', fontSize: 14 }}>
              Start
            </a>
          </div>
        </div>
      </nav>

      <header className="hero" id="top">
        <div className="wrap hero-in">
          <div>
            <div className="eyebrow">
              <span className="dot" aria-hidden="true" /> 1 build slot open this week
            </div>
            <h1>
              You shipped the demo.
              <br />
              Now it has to <span className="grad">take money.</span>
            </h1>
            <p className="lede">
              You built it with Lovable, Bolt, Cursor or v0. It looks incredible in the preview — and it{' '}
              <strong>404s on refresh, leaks a key, or grants Pro to anyone who edits localStorage</strong>.
              ShipCheck finds every reason it cannot go live, then fixes them. Five working days, fixed price.
            </p>
            <div className="hero-cta">
              <a href="#free-scan" className="btn btn-primary btn-lg">
                Scan my app free — 30 seconds
              </a>
              <a href="#pricing" className="btn btn-ghost btn-lg">
                See the $1,000 launch pass
              </a>
            </div>
            <div className="trust">
              <span>
                <Check /> Runs in your browser
              </span>
              <span>
                <Check /> No card for the scan
              </span>
              <span>
                <Check /> Reply in 12 hours
              </span>
              <span>
                <a href="/sample-report.html" target="_blank" rel="noreferrer" style={{ color: '#9aa7b8' }}>
                  See a finished report →
                </a>
              </span>
            </div>
          </div>

          <div className="card report" aria-hidden="true">
            <div className="report-head">
              <Gauge score={31} />
              <div>
                <div className="report-title">Typical AI-built app, scan 1</div>
                <div className="report-sub">9 findings · 4 blockers · 41s</div>
              </div>
            </div>
            {[
              { t: 'Supabase service_role key in client code', s: 'blocker' },
              { t: 'Payment webhook accepts unverified requests', s: 'blocker' },
              { t: 'Database tables readable without RLS', s: 'blocker' },
              { t: 'Pro access granted from localStorage', s: 'blocker' },
              { t: 'Deep links 404 after deploy', s: 'high' },
            ].map((f, i) => (
              <div className="find" key={i}>
                <span className={`pill ${f.s}`}>{f.s === 'blocker' ? 'BLOCK' : 'HIGH'}</span>
                <div className="find-body">
                  <div className="find-t">{f.t}</div>
                  <div className="find-d">found without reading a single line first</div>
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, paddingTop: 14, borderTop: '1px solid #232a33' }}>
              <span style={{ fontSize: 12, color: '#6d7b8d' }}>
                This is not bad luck. It is five repeatable mistakes — and I have seen each one hundreds of times.
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="wrap">
        <div style={{ borderTop: '1px solid var(--line)' }} />
      </div>

      <Section
        id="free-scan"
        kicker="Free, instant, private"
        title="Find out what will break before a customer does"
        sub="Paste the files you are unsure about. You get the real findings, ranked, with the exact fix — no email wall, no signup. If it is clean, you owe nothing and I will tell you so."
      >
        <Scanner onFound={() => setScanned(true)} />
      </Section>

      <div className="divide" />

      <Section
        id="problem"
        kicker="Why AI-built apps stall at the finish line"
        title="Your app is not badly built. It is unfinished in five specific places."
        sub="Every one of these is invisible in the preview window and fatal in production. None of them are about design."
      >
        <div className="fails">
          {FAILURES.map((f) => (
            <div className="fail" key={f.k}>
              <div className="fail-k">{f.k}</div>
              <div className="fail-v">{f.v}</div>
            </div>
          ))}
        </div>
        <p style={{ color: '#9aa7b8', marginTop: 22, fontSize: 15, maxWidth: 720 }}>
          The AI got you 80% of the way in a weekend. That last 20% is the part that decides whether the app
          makes money or becomes another abandoned repo — and it is exactly the part AI cannot see about its own
          output.
        </p>
      </Section>

      <div className="divide" />

      <Section
        id="how"
        kicker="How it runs"
        title="Five days, four checkpoints, no surprises"
        sub="You always know what is happening and when your app goes live."
      >
        <div className="steps">
          {[
            {
              h: 'Day 0 — Scan & agree',
              p: 'You order, I read the code and send a written fixed scope with the exact list of what gets fixed. You approve before I take the deposit.',
            },
            {
              h: 'Day 1 — Triage',
              p: 'Every blocker confirmed and reproduced. Secrets rotated. Deploy pipeline standing up so nothing can hide until the last hour.',
            },
            {
              h: 'Day 2–4 — Fix & wire',
              p: 'Auth verified server-side, payments end-to-end with webhook checks, RLS policies written and tested with anonymous requests, error handling and monitoring.',
            },
            {
              h: 'Day 5 — Live',
              p: 'Production deploy, every route hard-refreshed, a test payment through the live path, then a handover doc and 14 days of fixes.',
            },
          ].map((s, i) => (
            <div className="step" key={s.h}>
              <div className="step-n">{i + 1}</div>
              <h4>{s.h}</h4>
              <p>{s.p}</p>
            </div>
          ))}
        </div>
      </Section>

      <div className="divide" />

      <Section id="proof" kicker="Why trust this" title="You are handing your launch to a stranger. Fair." sub="So here is the receipt.">
        <div className="stats">
          {PROOF.map((p) => (
            <div className="stat" key={p.n}>
              <b style={{ background: 'linear-gradient(120deg,#8fb8ff,#b39bff)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                {p.n}
              </b>
              <p>{p.l}</p>
            </div>
          ))}
        </div>
        <div className="card" style={{ padding: 24, marginTop: 20 }}>
          <p style={{ margin: 0, fontSize: 15, color: '#cdd7e3', lineHeight: 1.65 }}>
            I build and ship production apps on this exact stack — Vercel, Supabase Postgres, Upstash, edge
            functions — with real users and a public open-source release. Kimmino, a Chromium browser with an ad
            and tracker engine, shipped from this account to real downloads on Linux. That is the same discipline
            your app is about to get: <strong style={{ color: '#fff' }}>nothing reaches a user until it is boring.</strong>
          </p>
          <p style={{ margin: '14px 0 0', fontSize: 14, color: '#9aa7b8' }}>
            I am not an agency, so there is no account manager and no discovery phase to bill. You are paying for
            the ten thousand hours of pattern-matching that tells me where to look in the first twenty minutes.
          </p>
        </div>
      </Section>

      <div className="divide" />

      <Section
        id="pricing"
        kicker="Pricing"
        title="One price. One date. Both in writing."
        sub="Agencies quote $15,000–$50,000 and take two months. A rescue specialist charges $7,500 for the production pass. I am building a track record, so the price reflects that — not the work."
      >
        <div className="tiers">
          {TIERS.map((t) => (
            <div className={`tier ${t.best ? 'best' : ''}`} key={t.id}>
              {t.best && <div className="ribbon">Most founders pick this</div>}
              <h3>{t.name}</h3>
              <p className="tag">{t.tagline}</p>
              <div className="price-row">
                <span className="price">${t.price.toLocaleString()}</span>
                {t.compare && <span className="compare">${t.compare.toLocaleString()}</span>}
              </div>
              <div className="turn">{t.turnaround}</div>
              <div className="seats">{t.seats}</div>
              <ul>
                {t.includes.map((i) => (
                  <li key={i}>
                    <Check /> <span>{i}</span>
                  </li>
                ))}
              </ul>
              <a href="#order" className={`btn ${t.best ? 'btn-primary' : 'btn-ghost'} btn-block`}>
                {t.cta}
              </a>
            </div>
          ))}
        </div>
        <div
          style={{
            display: 'flex',
            gap: 14,
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            marginTop: 18,
          }}
        >
          <p style={{ color: '#6d7b8d', fontSize: 13, margin: 0 }}>
            50% to start, 50% when it is live. If I cannot get your app launch-safe, you do not pay the second
            half and I tell you plainly why.
          </p>
          <a
            href="/sample-report.html"
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost"
            style={{ fontSize: 13.5, padding: '10px 14px' }}
          >
            See a real audit report →
          </a>
        </div>
      </Section>

      <div className="divide" />

      <Section
        id="order"
        kicker="Start"
        title="Tell me about your app"
        sub="Two minutes. You get a fixed-scope quote in 12 hours, and nothing starts until you approve it."
        narrow
      >
        <OrderForm />
      </Section>

      <div className="divide" />

      <Section id="faq" kicker="Before you ask" title="The questions that decide it" narrow>
        <div className="faq">
          {FAQ.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </Section>

      <div className="wrap" style={{ paddingBottom: 80 }}>
        <div className="band">
          <h2>{scanned ? 'Your scan found something. Good — that is cheaper than finding it in production.' : 'It works on your machine. It has to work on your customer\u2019s.'}</h2>
          <p>
            {scanned
              ? 'The findings are already listed above with the exact fix. The Launch Pass clears all of them and puts the app live in five days.'
              : 'One free scan tells you whether the app is a fix, a rewrite, or already fine. You lose 30 seconds either way.'}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#free-scan" className="btn btn-primary btn-lg">
              Scan my app free
            </a>
            <a href="#order" className="btn btn-ghost btn-lg">
              Book the $1,000 launch pass
            </a>
          </div>
          <p style={{ marginTop: 18, fontSize: 13, color: '#6d7b8d' }}>
            {OWNER.turnaroundPromise}
          </p>
        </div>
      </div>

      <footer>
        <div className="wrap foot-in">
          <div>
            <strong style={{ color: '#e8edf4' }}>ShipCheck</strong> · {OWNER.location}
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            <a href="#pricing">Pricing</a>
            <a href="#free-scan">Free scan</a>
          </div>
        </div>
      </footer>
    </>
  )
}
