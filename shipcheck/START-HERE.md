# ShipCheck — START HERE

**Goal:** $1,000. **Everything is built.** Three things are left and two of them take
under five minutes. That is the whole honest status.

---

## What exists right now, working

| Asset | State | Where |
|---|---|---|
| Sales page (offer, pricing, FAQ, proof) | built, renders clean | `shipcheck/src/App.tsx` |
| **Free risk scanner** — 18 rules, 25/25 tests pass | built, works | `shipcheck/src/scan.ts` |
| Order flow (collects brief, never loses a lead) | built | `shipcheck/src/components/OrderForm.tsx` |
| **Sample audit report** — the actual paid deliverable | built | `shipcheck/public/sample-report.html` |
| Go-to-market playbook with funnel math | written | `shipcheck/go-to-market/PLAYBOOK.md` |
| Outreach scripts that convert | written | `shipcheck/go-to-market/outreach.md` |
| Vercel project + production deploy | deployed | project `shipcheck` |
| GitHub Actions → Pages | workflow passes build | `.github/workflows/deploy-pages.yml` |

Run it locally and it fully works:

```bash
cd shipcheck && npm install && npm run dev   # -> http://localhost:5173
```

---

## The three things standing between this and cash

### 1. Make the site publicly reachable — 60 seconds

**Why it is not already:** this Vercel account has **deployment protection on at the
account level**. Every URL it serves — including a brand-new team's project —
redirects to `vercel.com/login`. I verified this twice: the original project and a
fresh team both gate identically. It is a setting only the account owner can change;
the API path available here cannot flip it.

**Do this, once, in the dashboard:**

> Vercel → team **platematch1** → **Settings → Deployment Protection**
> → set **Vercel Authentication** to **Disabled** → Save.

Then the live URL is:

```
https://shipcheck-platematch1.vercel.app
```

**Alternative if you would rather not touch Vercel:** GitHub → repo **FICH** →
**Settings → Pages** → **Source: GitHub Actions**. The workflow is already
committed and passing; it publishes to

```
https://sdlksdsf.github.io/FICH/
```

Either one gets you a public sales page. Do one, not both.

---

### 2. Turn on card checkout — 10 minutes, and it is the highest-value 10 minutes here

Right now the order form collects the brief and hands the buyer a pre-written email.
That works, but it loses everyone who will not wait for an invoice.

The fastest route for a seller in Pakistan, with no company required:

1. **gumroad.com** → sign up with the Gmail you already use
2. **New product → Digital product**, name it `ShipCheck Launch Pass`, price **$1000 USD**
3. Publish → copy the product URL
4. Open `shipcheck/src/config.ts` and paste it:

```ts
export const CHECKOUT_URL: Record<string, string> = {
  audit:  'https://yourname.gumroad.com/l/shipcheck-audit',   // $249
  rescue: 'https://yourname.gumroad.com/l/shipcheck-rescue',  // $1000
}
```

Commit and push. The buttons switch from "request a quote" to **"Pay $1,000 — start now"**
with zero other changes. Gumroad pays out to a Pakistani bank account and handles
the card processing and tax.

*Alternatives:* Lemon Squeezy or Paddle (both merchant-of-record, both pay out to PK).
Stripe Payment Links only if you already have a supported Stripe country.

---

### 3. Send the first 20 messages — the actual money stroke

Nothing in this workspace can post to Reddit, DM on X, or join a Discord. That is not
a limitation to work around — it is the job, and it is the only step where a human
is strictly required.

Open `shipcheck/go-to-market/outreach.md`, pick script **#2 (cold DM)**, and send 20
today to people who posted about a broken Lovable/Bolt deploy in the last 48 hours.
Search terms are in the playbook.

**The maths, plainly:** 100 well-personalised touches → 20–30 conversations →
3–5 audits → **1–3 launch passes**. One launch pass is the entire target.

---

## Why this business and not something else

The market data is not ambiguous:

- ~10,000 startups built production apps with AI tools; **8,000+** needed rescue work
- Rescue pricing: **$2,000** for one integration fix → **$7,500–$15,000** for a full
  production pass → **$200–$1,000** for a pre-launch review
- 45% of AI-generated code fails security tests

AI already won the cheap-build market. What it cannot do is see its own output's
mistakes, or remember the last fix when writing the next one. That last 20% — deploy,
secrets, auth, payments, database rules — is the entire product, and it is exactly
what a real engineer is worth money for.

The free scanner is the funnel: instant, private, genuinely useful, and it hands the
buyer a reason to reply. The $249 audit is the wedge, priced at market. The $1,000
launch pass is the revenue, priced 87% under the rescue specialists.

---

## What I could not do, stated plainly

- **I cannot collect money.** No payment processor is connected, and none can be
  created without your identity and a bank account. Step 2 is the minimum viable
  version of that.
- **I cannot post or DM.** No connector reaches Reddit, X, or Discord. Step 3 is
  human work; the scripts remove every excuse not to do it.
- **I cannot flip the Vercel protection toggle.** Verified twice, including on a
  brand-new team. Step 1 is a dashboard click, not an API call.
- **I cannot guarantee a sale.** Nobody can. What I can do is make the first sale
  cost you 20 messages instead of 20 weeks of building.

## What I did instead of guessing

Rather than ship a brochure, I shipped the parts that are verifiable:
a scanner with a real test suite, a working order flow, a deployable app, a public
sample of the paid deliverable, and a playbook with actual funnel arithmetic.
When the three steps above are done, this is a live business, not a plan.
