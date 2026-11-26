# Gumroad setup — exact steps

Verified against Gumroad's own documentation on 21 Nov 2026. Not from memory,
not from a blog post.

---

## First: Lemon Squeezy is dead. Do not use it.

- **New signups closed 16 November 2026** — five days ago.
- **Stops processing transactions 31 March 2027**, subscriptions included.
- It is migrating everyone to Stripe Managed Payments, which supports **37
  countries and Pakistan is not one of them.**
- It also **prohibits services**, so our offer was never sellable there anyway.

If you already made a store, abandon it.

---

## Second: Gumroad works, but not for what we originally planned

Gumroad's prohibited list bans:

- **Consulting firms** (item 16)
- **Services** (item 47)
- **AI services fulfilled outside Gumroad** (item 02)
- **Billing for services to be performed in the future** (item 08)

A launch audit is an AI-assisted service delivered by email. That is at least
three of those four. **Do not list the $249 audit or the $1,000 Launch Pass on
Gumroad.** You will get flagged and the account will get reviewed.

What Gumroad is for: **the checklist as a document.** That is live and ready at

```
https://cvprinxmfqguqezaylhk.supabase.co/functions/v1/shipcheck/ship-ready
```

---

## The steps

**1. Open the product, hit "Save as PDF"**
Print to PDF. It is already styled for it. You get a ~10 page PDF.

**2. In Gumroad: Products → New product**
- Name: `Ship-Ready — The AI-App Launch Checklist`
- Type: **Digital product**
- Price: `$19`

**3. Upload the PDF**
Content → add the PDF. This is what the buyer downloads.

**4. Paste this description**

```
18 checks that separate a demo from an app that can take money.

Built for apps made with Lovable, Bolt, Cursor, Replit, v0 or an AI agent that
wrote most of the code before you read it.

Every item here is a failure that does not show up in testing, because testing
does not involve a real card, a hard refresh, a second user, or a stranger
reading your JavaScript. They show up in week one of real traffic, when they
are expensive.

What's inside:
- The 4 blockers that lose you money or data
- The 8 silent failures that never throw an error
- The 6 that cost you trust
- For each one: what it is, how to test for it, the fix, and how long it takes
- A "fix it in this order" page for when you're overwhelmed

10 pages. Read it once, fix what you fail. No call, no subscription, no upsell.
```

**5. Settings → Payments → set up payout**
This is the step that actually decides whether you can get the money.
- Country: **Pakistan**
- Currency: **PKR** — Gumroad pays Pakistan in rupees to a local bank account
- Have ready: **government photo ID** (colour photo, front and back, JPEG or
  PNG — *not* PDF) and **proof of residence** with your name and address on it
- Payout day is **Tuesday**
- Minimum balance to trigger a payout is **$100 USD**

**6. Publish, copy the link**

**7. Send me the link.** I will wire it into the site, the sample report, the
checklist, and every email, so all traffic points at it.

---

## The four things that will bite you

**Do not buy your own product to test it.** Gumroad's own documentation says
this is viewed as fraudulent by payment processors and can get you **permanently
banned**. Use their test-purchase feature instead.

**Your first payout is not instant.** After your first 3–4 sales clear $100,
Gumroad runs an account review that takes **1 to 3 weeks**. That is normal, not
an error. Plan for it.

**Fees are 10% + $0.50** on direct sales. If a buyer finds you through Gumroad's
Discover marketplace it is **30%**, so drive your own traffic.

**Pakistan is a bank payout, not PayPal.** PayPal does not operate in Pakistan
and Gumroad does not support Payoneer or Wise. Local bank account only.

---

## What this means for the money

| Sale | You receive (approx) |
|---|---|
| $19 × 20 | ~$332 |
| $19 × 60 | ~$996 |

**Selling 60 checklists at $19 gets you to the $1,000 target.** That is 1,000
daily visitors at a 6% conversion rate — which is why the link has to be in
front of the right people, not just on the site.

The $1,000 Launch Pass is still the faster path and it is still real. It just
gets sold by reply, not by checkout. One audit client = the entire target.

---

## What I do the moment you paste the link

1. Wire it into every CTA on the live site, the sample report and the checklist.
2. Rewrite the two outreach emails to lead with the $19 product, because a $19
   yes is worth infinitely more than a free-checklist reply that goes nowhere.
3. Send the next round of outreach — 18 more, aimed at founders with a live app
   and no way to take money yet.

Revenue target: **$1,000. Collected: $0.**
