import type { ReactNode } from 'react'
import type { Finding, Severity } from '../scan'

export function Check({ color = '#2fd47f' }: { color?: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8.5l3.2 3.2L13 5" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Gauge({ score }: { score: number }) {
  const r = 30
  const c = 2 * Math.PI * r
  const pct = Math.max(0, Math.min(100, score)) / 100
  const color = score < 45 ? '#ff4d5e' : score < 70 ? '#ffb020' : score < 90 ? '#4c8dff' : '#2fd47f'
  return (
    <div className="gauge" aria-hidden="true">
      <svg width="74" height="74" viewBox="0 0 74 74">
        <circle cx="37" cy="37" r={r} stroke="#232a33" strokeWidth="7" fill="none" />
        <circle
          cx="37"
          cy="37"
          r={r}
          stroke={color}
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${c * pct} ${c}`}
          style={{ transition: 'stroke-dasharray .7s cubic-bezier(.2,.8,.2,1)' }}
        />
      </svg>
      <div className="num" style={{ color }}>
        {score}
      </div>
    </div>
  )
}

export function FindingCard({ f, index }: { f: Finding; index: number }) {
  const sevLabel: Record<Severity, string> = {
    blocker: 'Blocker',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  }
  return (
    <div className="finding">
      <div className="finding-top">
        <span className={`pill ${f.severity}`}>{sevLabel[f.severity]}</span>
        <h4>{f.title}</h4>
        <span className="cat">{f.category}</span>
      </div>
      <p>{f.why}</p>
      {f.evidence && <pre className="evidence">{f.evidence}</pre>}
      <div className="fix">
        <strong style={{ fontWeight: 700 }}>Fix:</strong> {f.fix}
      </div>
      {index === 0 && f.severity === 'blocker' && (
        <p style={{ fontSize: 13, color: '#ffc861', marginTop: 12 }}>
          ↑ This one is why the Launch Pass exists. It is a 20-minute fix once somebody who has seen it
          before is looking at it — and a database breach if nobody does.
        </p>
      )}
    </div>
  )
}

export function Section({
  id,
  kicker,
  title,
  sub,
  children,
  narrow,
}: {
  id?: string
  kicker?: string
  title: ReactNode
  sub?: ReactNode
  children: ReactNode
  narrow?: boolean
}) {
  return (
    <section id={id}>
      <div className={narrow ? 'wrap-narrow' : 'wrap'}>
        <div className="sec-head">
          {kicker && <div className="sec-kicker">{kicker}</div>}
          <h2>{title}</h2>
          {sub && <p className="sec-sub">{sub}</p>}
        </div>
        {children}
      </div>
    </section>
  )
}
