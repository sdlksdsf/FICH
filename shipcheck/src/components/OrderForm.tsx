import { useMemo, useState } from 'react'
import { CHECKOUT_URL, CONTACT_EMAIL, ORDER_ENDPOINT, hasCheckout } from '../config'
import { TIERS } from '../offer'

type Status = 'idle' | 'sending' | 'sent' | 'manual'

const STACKS = [
  'Lovable export',
  'Bolt export',
  'v0 / Cursor / Claude Code',
  'Replit / Base44 / Bubble',
  'Hand-written React / Next.js',
  'Other (describe below)',
]

const BACKENDS = ['Supabase', 'Firebase', 'Neon / Postgres', 'MongoDB', 'None yet', 'Not sure']

interface Form {
  name: string
  email: string
  appUrl: string
  repo: string
  tier: string
  stack: string
  backend: string
  payments: string
  deadline: string
  problem: string
}

const empty: Form = {
  name: '',
  email: '',
  appUrl: '',
  repo: '',
  tier: 'rescue',
  stack: STACKS[0],
  backend: BACKENDS[0],
  payments: 'Not yet — I want to take payments at launch',
  deadline: '',
  problem: '',
}

export default function OrderForm() {
  const [f, setF] = useState<Form>(empty)
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  const tier = useMemo(() => TIERS.find((t) => t.id === f.tier) ?? TIERS[1], [f.tier])
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((p) => ({ ...p, [k]: v }))

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email)
  const valid = f.name.trim().length > 1 && emailOk && (f.appUrl.trim() || f.repo.trim())

  function payload() {
    return {
      tier: tier.id,
      tierName: tier.name,
      priceUsd: tier.price,
      name: f.name,
      email: f.email,
      appUrl: f.appUrl,
      repo: f.repo,
      stack: f.stack,
      backend: f.backend,
      payments: f.payments,
      deadline: f.deadline,
      problem: f.problem,
      submittedAt: new Date().toISOString(),
      source: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    }
  }

  async function submit() {
    setError('')
    if (!valid) {
      setError('I need your name, a working email, and either the live URL or the repo — otherwise I cannot quote the job.')
      return
    }

    // 1. Card checkout, when a processor is wired up. Fastest path to money.
    if (hasCheckout(tier.id)) {
      const data = payload()
      try {
        sessionStorage.setItem('shipcheck:order', JSON.stringify(data))
      } catch {
        /* private mode — the email fallback still works */
      }
      const url = new URL(CHECKOUT_URL[tier.id])
      url.searchParams.set('prefill[email]', f.email)
      url.searchParams.set('wanted', 'true')
      url.searchParams.set('ref', 'shipcheck')
      window.location.href = url.toString()
      return
    }

    // 2. POST to an endpoint if one is configured (a real database of orders).
    setStatus('sending')
    if (ORDER_ENDPOINT) {
      try {
        const res = await fetch(ORDER_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload()),
        })
        if (!res.ok) throw new Error(`Order endpoint returned ${res.status}`)
        setStatus('sent')
        return
      } catch (e) {
        // fall through to the manual path, but never lose the brief
        console.error(e)
      }
    }

    // 3. Manual path: hand the buyer a ready-to-send email. Nothing is lost.
    setStatus('manual')
  }

  function mailtoHref() {
    const d = payload()
    const subject = `[${tier.name}] ${d.name} — ${d.appUrl || d.repo}`
    const body = [
      `Package: ${d.tierName} ($${d.priceUsd})`,
      `Name: ${d.name}`,
      `Email: ${d.email}`,
      `Live app: ${d.appUrl || '—'}`,
      `Repo: ${d.repo || '—'}`,
      `Built with: ${d.stack}`,
      `Backend: ${d.backend}`,
      `Payments: ${d.payments}`,
      `Target launch: ${d.deadline || 'flexible'}`,
      '',
      'What is broken / what I need:',
      d.problem || '(not described)',
      '',
      `Submitted: ${d.submittedAt}`,
    ].join('\n')
    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  if (status === 'sent' || status === 'manual') {
    return (
      <div className="form-card">
        <div className="okbox">
          <b>{status === 'sent' ? 'Order received.' : 'Your brief is ready to send.'}</b>
          <p style={{ margin: '10px 0 0', color: '#cdd7e3' }}>
            {status === 'sent'
              ? `Thanks ${f.name.split(' ')[0]} — you are in the queue for the ${tier.name}. I reply within 12 hours with the next step and a fixed-scope agreement before anything starts.`
              : `One click left. The button below opens your mail app with the whole brief already written — you just press send. If your mail app is not set up, copy the address and paste it into Gmail.`}
          </p>
        </div>

        {status === 'manual' && (
          <div style={{ marginTop: 18, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a className="btn btn-primary" href={mailtoHref()}>
              Send the brief →
            </a>
            <a className="btn btn-ghost" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
          </div>
        )}

        <div className="summary-box" style={{ marginTop: 22 }}>
          <div className="line">
            <span>Package</span>
            <span>{tier.name}</span>
          </div>
          <div className="line">
            <span>Price</span>
            <span>${tier.price.toLocaleString()}</span>
          </div>
          <div className="line">
            <span>App</span>
            <span style={{ wordBreak: 'break-all', maxWidth: 300, textAlign: 'right' }}>
              {f.appUrl || f.repo}
            </span>
          </div>
          <div className="line total">
            <span>Due at start</span>
            <span>${Math.round(tier.price / 2).toLocaleString()} (50%), rest on launch</span>
          </div>
        </div>

        <p className="note">
          You are not charged by this page. A fixed-scope agreement goes out first, you approve it, and only
          then do I take the deposit. If the app is not fixable in the timeframe I will tell you before taking
          a cent.
        </p>

        <button className="btn btn-ghost" style={{ marginTop: 16 }} onClick={() => { setStatus('idle'); setF(empty) }}>
          Submit another app
        </button>
      </div>
    )
  }

  return (
    <div className="form-card">
      <h3 style={{ margin: '0 0 4px', fontSize: 20, letterSpacing: '-.02em' }}>Get a fixed-scope quote</h3>
      <p style={{ margin: '0 0 22px', color: '#9aa7b8', fontSize: 14 }}>
        Five minutes now saves you a discovery call. Everything below goes into the quote, and I answer within
        12 hours.
      </p>

      <div className="field">
        <label>Package</label>
        <select value={f.tier} onChange={(e) => set('tier', e.target.value)}>
          {TIERS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name} — ${t.price.toLocaleString()} · {t.turnaround.replace('Delivered in ', '').replace('Live in production in ', '')}
            </option>
          ))}
        </select>
      </div>

      <div className="row2">
        <div className="field">
          <label>Your name</label>
          <input type="text" value={f.name} onChange={(e) => set('name', e.target.value)} placeholder="Shayan Khan" autoComplete="name" />
        </div>
        <div className="field">
          <label>Email</label>
          <input type="email" value={f.email} onChange={(e) => set('email', e.target.value)} placeholder="you@company.com" autoComplete="email" />
        </div>
      </div>

      <div className="row2">
        <div className="field">
          <label>
            Live app URL <span className="sub">if it is deployed</span>
          </label>
          <input type="url" value={f.appUrl} onChange={(e) => set('appUrl', e.target.value)} placeholder="https://myapp.vercel.app" />
        </div>
        <div className="field">
          <label>
            Repo or export link <span className="sub">GitHub, zip, or the builder's share link</span>
          </label>
          <input type="text" value={f.repo} onChange={(e) => set('repo', e.target.value)} placeholder="github.com/me/myapp" />
        </div>
      </div>

      <div className="row2">
        <div className="field">
          <label>How was it built?</label>
          <select value={f.stack} onChange={(e) => set('stack', e.target.value)}>
            {STACKS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Backend / database</label>
          <select value={f.backend} onChange={(e) => set('backend', e.target.value)}>
            {BACKENDS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="row2">
        <div className="field">
          <label>Payments</label>
          <select value={f.payments} onChange={(e) => set('payments', e.target.value)}>
            <option>Not yet — I want to take payments at launch</option>
            <option>Stripe is wired, something is off</option>
            <option>Stripe works, but I am not sure it is safe</option>
            <option>Other processor</option>
            <option>Not taking payments yet, just need to launch</option>
          </select>
        </div>
        <div className="field">
          <label>
            Target launch <span className="sub">optional</span>
          </label>
          <input type="text" value={f.deadline} onChange={(e) => set('deadline', e.target.value)} placeholder="Within 7 days" />
        </div>
      </div>

      <div className="field">
        <label>
          What breaks, or what worries you? <span className="sub">the more specific, the sharper the quote</span>
        </label>
        <textarea
          style={{ minHeight: 110 }}
          value={f.problem}
          onChange={(e) => set('problem', e.target.value)}
          placeholder="Works in the preview, but the deployed app 404s on refresh. Checkout redirects but the account never upgrades. Users can see each other's data."
        />
      </div>

      <div className="summary-box">
        <div className="line">
          <span>{tier.name}</span>
          <span>${tier.price.toLocaleString()}</span>
        </div>
        <div className="line" style={{ color: '#6d7b8d', fontSize: 13 }}>
          <span>Fixed scope · no hourly billing</span>
          <span>{tier.turnaround}</span>
        </div>
        <div className="line total">
          <span>To start</span>
          <span>${Math.round(tier.price / 2).toLocaleString()} deposit</span>
        </div>
      </div>

      {error && <div className="err">{error}</div>}

      <button className="btn btn-primary btn-block btn-lg" onClick={submit} disabled={status === 'sending'}>
        {status === 'sending'
          ? 'Sending…'
          : hasCheckout(tier.id)
            ? `Pay $${tier.price.toLocaleString()} — start now`
            : `Request the ${tier.name} — $${tier.price.toLocaleString()}`}
      </button>

      <p className="note" style={{ marginTop: 14 }}>
        {hasCheckout(tier.id)
          ? 'Secure card checkout. You get the receipt instantly and I start the same working day.'
          : 'No card needed to request. You get a written fixed-scope agreement first, and pay half when we start, half when your app is live.'}{' '}
        Either way, {CONTACT_EMAIL} reaches me directly.
      </p>
    </div>
  )
}
