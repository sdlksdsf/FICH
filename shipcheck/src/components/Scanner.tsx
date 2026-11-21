import { useMemo, useState } from 'react'
import { scan, VERDICT_COPY, type Report } from '../scan'
import { FindingCard, Gauge } from './ui'

const SAMPLE = `// app/page.tsx — typical AI-built checkout page
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const supabase = createClient(
  'https://abcdefgh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIn0.7Xo2yQz0dKk9dT1n8gW3p',
)
const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY)

export default function Page() {
  const [pro, setPro] = useState(localStorage.getItem('isPro') === 'true')

  async function upgrade() {
    const res = await fetch('http://localhost:3000/api/checkout', {
      method: 'POST',
      body: JSON.stringify({ plan: 'pro' }),
    })
    console.log('stripe key', import.meta.env.VITE_STRIPE_SECRET_KEY)
    if (window.location.search.includes('success')) setPro(true)
    localStorage.setItem('token', 'demo')
  }

  useEffect(() => {
    fetch('/api/user').then((r) => r.json()).then(setUser)
    fetch('/api/usage').then((r) => r.json()).then(setUsage)
    fetch('/api/invoices').then((r) => r.json()).then(setInvoices)
  }, [])

  return pro ? <Pro /> : <div dangerouslySetInnerHTML={{ __html: marketingHtml }} />
}

-- supabase/schema.sql
create table profiles (id uuid primary key, email text, plan text);
create table invoices (id uuid primary key, user_id uuid, amount int);

// api/stripe/webhook.ts
export async function POST(req: Request) {
  const event = await req.json()
  if (event.type === 'checkout.session.completed') await grantAccess(event.data)
  return Response.json({ ok: true })
}`

export default function Scanner({ onFound }: { onFound?: (r: Report) => void }) {
  const [text, setText] = useState('')
  const [report, setReport] = useState<Report | null>(null)
  const [busy, setBusy] = useState(false)

  const canScan = text.trim().length >= 40

  const stats = useMemo(() => {
    if (!report) return null
    const by = (s: string) => report.findings.filter((f) => f.severity === s).length
    return { blocker: by('blocker'), high: by('high'), medium: by('medium') }
  }, [report])

  function run(input?: string) {
    const src = input ?? text
    if (src.trim().length < 40) return
    setBusy(true)
    // Defer so the button state paints; the scan itself is synchronous and local.
    setTimeout(() => {
      const r = scan(src)
      setReport(r)
      setBusy(false)
      onFound?.(r)
      const el = document.getElementById('scan-results')
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 60)
  }

  return (
    <div>
      <div className="scan-grid">
        <div>
          <label htmlFor="code" className="sr">
            Paste your code
          </label>
          <textarea
            id="code"
            spellCheck={false}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Paste the files you are unsure about — page.tsx, the checkout route, your schema.sql, the webhook handler, .env keys. 30 lines is enough to find the expensive problems.`}
          />
          <div className="scan-actions">
            <button className="btn btn-primary" onClick={() => run()} disabled={!canScan || busy}>
              {busy ? 'Scanning…' : 'Scan for free'}
            </button>
            <button className="btn btn-ghost" onClick={() => { setText(SAMPLE); setReport(null) }}>
              Load an example
            </button>
            {text.trim().length > 0 && (
              <button className="btn btn-ghost" onClick={() => { setText(''); setReport(null) }}>
                Clear
              </button>
            )}
          </div>
          <div className="privacy">
            <span aria-hidden="true">🔒</span>
            <span>
              This scanner runs entirely in your browser. Nothing you paste is uploaded, stored or logged —
              you can verify it in the page source. Your keys never leave this tab, which is how it should be.
            </span>
          </div>
        </div>

        <div className="card report">
          <div className="report-head">
            <Gauge score={report ? report.score : 34} />
            <div>
              <div className="report-title">
                {report ? 'Your launch readiness' : 'What a typical AI build scores'}
              </div>
              <div className="report-sub">
                {report
                  ? `${report.findings.length} findings · ${report.blockers} blocker(s)`
                  : '8 findings · 3 blockers'}
              </div>
            </div>
          </div>
          {(report
            ? report.findings.slice(0, 4).map((f) => ({ t: f.title, s: f.severity }))
            : [
                { t: 'Supabase service_role key is in client code', s: 'blocker' },
                { t: 'Payment webhook accepts unverified requests', s: 'blocker' },
                { t: 'Database tables are readable without RLS', s: 'blocker' },
                { t: 'Hard-coded backend URL (localhost)', s: 'high' },
              ]
          ).map((f, i) => (
            <div className="find" key={i}>
              <span className={`pill ${f.s}`}>{f.s === 'blocker' ? 'BLOCK' : 'HIGH'}</span>
              <div className="find-body">
                <div className="find-t">{f.t}</div>
                <div className="find-d">{report ? 'found in your code' : 'found in 1 of 4 exports'}</div>
              </div>
            </div>
          ))}
          {report && report.findings.length > 4 && (
            <div className="find-d" style={{ paddingTop: 10 }}>
              + {report.findings.length - 4} more below
            </div>
          )}
        </div>
      </div>

      {report && (
        <div className="results" id="scan-results">
          <div
            className={`verdict ${
              report.verdict === 'not-shippable' || report.verdict === 'risky'
                ? 'bad'
                : report.verdict === 'close'
                  ? 'warn'
                  : 'ok'
            }`}
          >
            <Gauge score={report.score} />
            <div>
              <h3>
                {VERDICT_COPY[report.verdict].label}
                {stats && (
                  <span style={{ color: '#6d7b8d', fontWeight: 500, fontSize: 14 }}>
                    {'  '}
                    {stats.blocker} blocker{stats.blocker === 1 ? '' : 's'} · {stats.high} high · {stats.medium} medium
                  </span>
                )}
              </h3>
              <p>{VERDICT_COPY[report.verdict].line}</p>
            </div>
            <a className="btn btn-primary" href="#pricing" style={{ marginLeft: 'auto' }}>
              Get these fixed →
            </a>
          </div>

          <div style={{ marginTop: 18 }}>
            {report.findings.length === 0 && (
              <div className="finding">
                <h4>Nothing critical matched in this snippet</h4>
                <p>
                  That is a good sign, not a clean bill of health — this scan only sees what you pasted. The
                  things that cost founders the most (a webhook that silently drops 15% of payments, a policy
                  that lets user A read user B) need the whole app and a real attacker's eye.
                </p>
                <div className="fix">A 48-hour audit covers the rest, with the full codebase.</div>
              </div>
            )}
            {report.findings.map((f, i) => (
              <FindingCard key={f.id} f={f} index={i} />
            ))}
          </div>

          <div className="card" style={{ padding: 22, marginTop: 20 }}>
            <h4 style={{ margin: '0 0 8px', fontSize: 16 }}>How much of this is actually urgent?</h4>
            <p style={{ margin: 0, color: '#9aa7b8', fontSize: 14 }}>
              A blocker means: if a stranger found this before you fixed it, you lose money or data today. The
              Launch Pass clears every blocker and every high, wires the deploy and the payment path, and puts
              the app on a URL you can send to a customer — in five working days.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
              <a className="btn btn-primary" href="#order">Start the Launch Pass — $1,000</a>
              <a className="btn btn-ghost" href="#pricing">See what else is included</a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
