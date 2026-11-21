export interface Tier {
  id: string
  name: string
  price: number
  compare?: number
  turnaround: string
  tagline: string
  best?: boolean
  seats: string
  includes: string[]
  cta: string
}

export const TIERS: Tier[] = [
  {
    id: 'audit',
    name: 'Pre-Launch Audit',
    price: 249,
    compare: 1000,
    turnaround: 'Delivered in 48 hours',
    tagline: 'Find out exactly what will break before you launch, charge or scale.',
    seats: 'Fixed scope · fixed price',
    includes: [
      'Full read of your codebase (Lovable, Bolt, Cursor, v0 export, or a repo)',
      'Every blocker, ranked by what it will cost you',
      'Secrets, auth and payment flow tested by hand',
      'Database rules checked with a real anonymous request',
      'One-page verdict: ship, fix these three, or stop',
      '30-minute call to walk the findings',
    ],
    cta: 'Book the 48-hour audit — $249',
  },
  {
    id: 'rescue',
    name: 'The 5-Day Launch Pass',
    price: 1000,
    compare: 7500,
    turnaround: 'Live in production in 5 working days',
    tagline: 'I take your AI-built app from "works on my machine" to a real URL that takes real money.',
    best: true,
    seats: 'One build at a time — 1 slot open',
    includes: [
      'Everything in the audit',
      'Deploy pipeline that survives a hard refresh on every route',
      'Every secret moved server-side, keys rotated',
      'Authentication made real — verified sessions, not local checks',
      'Stripe (or your processor) wired end to end: checkout, webhook, entitlement',
      'Row Level Security on every table, tested with anon-key requests',
      'Error boundaries, retries, and monitoring so failures are visible',
      'Handover doc + 14 days of bug fixes after launch',
    ],
    cta: 'Claim the launch slot — $1,000',
  },
]

export const FAILURES = [
  {
    k: 'The deploy wall',
    v: 'Everything works in preview. The production URL throws, or the first shared link 404s because deep routes were never rewritten.',
  },
  {
    k: 'Secrets in the bundle',
    v: 'A service_role, Stripe secret or model key is compiled into the JavaScript that every visitor downloads. It takes one DevTools tab to steal.',
  },
  {
    k: 'Authentication that is only a screen',
    v: 'Login is local state. The API still answers anyone. Paid features unlock by editing localStorage.',
  },
  {
    k: 'Payments that do not pay you',
    v: 'No webhook verification, entitlement granted by a redirect, and 15% of successful payments never recorded. Customers charged, access never given.',
  },
  {
    k: 'A database anyone can read',
    v: 'Tables created without Row Level Security. The anon key is public by design, so one request returns every row you have.',
  },
]

export const PROOF = [
  {
    n: '47,000+',
    l: 'ad and tracker domains blocked in production by Kimmino, a Chromium browser shipped to real users on Vercel and GitHub Releases',
  },
  {
    n: '1,000s',
    l: 'of edge requests served by apps running on the same stack your app uses: Vercel edge, Supabase Postgres, Upstash Redis',
  },
  {
    n: '0',
    l: 'secrets in a shipped client bundle. Every key you have ever handed a browser is a key you have already leaked.',
  },
]

export const FAQ = [
  {
    q: 'I built it with Lovable / Bolt / v0. Can you actually work with that?',
    a: 'Yes — that is the entire job. Export the code or give me the repo link. These exports are normal React plus a Supabase or Firebase backend. The problems are in the wiring, not the framework.',
  },
  {
    q: 'What if my app is not on Supabase?',
    a: 'Firebase, Neon, plain Postgres, Airtable, no backend at all — all fine. The audit covers the actual failure modes of whatever you built on.',
  },
  {
    q: 'Do I have to give you my Stripe keys?',
    a: 'No. You create a restricted key, or you run the two commands I give you yourself. I never need your live secret key, and I will tell you to rotate anything that has ever touched a client bundle.',
  },
  {
    q: 'Is $1,000 for five days real, or a teaser for a $20,000 project?',
    a: 'It is real. One app, one launch, fixed scope in writing before we start. If the scope needs to grow, that is a new conversation and you approve it first. No surprise invoices.',
  },
  {
    q: 'What is not included?',
    a: 'New product features, redesigns, and marketing. This is the pass that makes what you already built safe, deployable and able to take money. If you need a feature built, ask — I will quote it separately.',
  },
  {
    q: 'Why is it so much cheaper than an agency?',
    a: 'Because there is no account manager, no discovery phase, and no team — and because most of the work is diagnosis and wiring, not months of new code. You are paying for the ten years of pattern-matching that tells me where to look.',
  },
]
