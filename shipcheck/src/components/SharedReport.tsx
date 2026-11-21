import { useState } from 'react'
import { VERDICT_COPY, type Report } from '../scan'
import { FindingCard, Gauge } from './ui'

/**
 * A report opened from a shared link. The link carries rule ids and severities
 * only, so this page can render the full findings and fixes without ever
 * holding the code (or the secrets) of the person who shared it.
 */
export default function SharedReport({ report }: { report: Report }) {
  const [copied, setCopied] = useState(false)
  const v = VERDICT_COPY[report.verdict]
  const tone =
    report.verdict === 'not-shippable' || report.verdict === 'risky'
      ? 'bad'
      : report.verdict === 'close'
        ? 'warn'
        : 'ok'

  return (
    <>
      <nav className="nav">
        <div className="wrap nav-in">
          <a href="#top" className="brand" style={{ textDecoration: 'none' }}>
            <span className="mark" aria-hidden="true">🛡️</span> ShipCheck
          </a>
          <div className="nav-links">
            <a href="#pricing">Pricing</a>
            <a href="#order" className="btn btn-primary" style={{ padding: '9px 15px', fontSize: 14 }}>
              Get it fixed
            </a>
          </div>
        </div>
      </nav>

      <header className="hero" id="top" style={{ paddingBottom: 24 }}>
        <div className="wrap">
          <div className="eyebrow">
            <span className="dot" aria-hidden="true" /> Shared launch-readiness report
          </div>
          <h1 style={{ fontSize: 'clamp(28px,4vw,44px)' }}>
            An AI-built app was scanned. <span className="grad">Here is what came back.</span>
          </h1>
          <p className="lede" style={{ marginBottom: 0 }}>
            Someone ran ShipCheck on their app and shared the result. The link carries the findings only — their
            code never left their browser. You can run the same scan on your own app, free, in about thirty seconds.
          </p>
        </div>
      </header>

      <div className="wrap" style={{ paddingBottom: 40 }}>
        <div className={`verdict ${tone}`} style={{ marginBottom: 6 }}>
          <Gauge score={report.score} />
          <div>
            <h3>{v.label}</h3>
            <p>{v.line}</p>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ fontSize: 12, color: '#9aa7b8', fontFamily: 'var(--mono)' }}>
              {report.blockers} blocker{report.blockers === 1 ? '' : 's'}
            </div>
            <div style={{ fontSize: 12, color: '#9aa7b8', fontFamily: 'var(--mono)' }}>
              {report.high} high · {report.findings.length} total
            </div>
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          {report.findings.length === 0 ? (
            <div className="finding">
              <h4>No critical issues found in the shared scan</h4>
              <p>
                That is a good result — and a reminder that it only covers what was pasted. The expensive failures
                (a webhook that drops payments silently, a policy that lets one user read another) need the whole
                app and a real attacker's eye.
              </p>
              <div className="fix">Run your own scan free, or book the 48-hour audit for the full codebase.</div>
            </div>
          ) : (
            report.findings.map((f, i) => <FindingCard key={f.id} f={f} index={i} />)
          )}
        </div>

        <div className="band" style={{ marginTop: 30 }}>
          <h2>Is your app in this list?</h2>
          <p>
            A blocker means a stranger who finds it before you do costs you money or data today. Find out in thirty
            seconds, free — then decide whether you want it fixed or want it left alone.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/" className="btn btn-primary btn-lg">
              Scan my app free
            </a>
            <a href="/#pricing" className="btn btn-ghost btn-lg">
              See the $1,000 launch pass
            </a>
          </div>
        </div>

        <div style={{ marginTop: 20, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            className="btn btn-ghost"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(window.location.href)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
              } catch {
                setCopied(false)
              }
            }}
          >
            {copied ? 'Link copied' : 'Copy this report link'}
          </button>
          <span className="hint">Safe to share publicly — it contains no code and no keys.</span>
        </div>
      </div>
    </>
  )
}
