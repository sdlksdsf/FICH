# ShipCheck — Go-To-Market Playbook
**Owner:** Alex Frands · **Goal:** first $1,000 · **Time to first cash:** 72 hours

---

## The one-sentence business

> Founders who built an app with Lovable, Bolt, Cursor or v0 cannot get it to production.
> I find what is broken for free, then fix it and make it take money in 5 days for $1,000.

Everything below serves that sentence. Do not add a second product until this one has paid.

---

## Why this wins (the economics)

| | Agency | Freelancer | AI builder | **ShipCheck** |
|---|---|---|---|---|
| Price | $50k–$250k | $10k–$50k | $20–$199 | **$249 / $1,000** |
| Time | 3–6 months | 2–3 months | 1 hour | **48h / 5 days** |
| Gets you live | yes | yes | no | **yes** |
| Understands AI output | no | rarely | — | **yes** |

The market gap is *not* "cheap app building" — AI already won that. The gap is
**"the last 20% that makes it real"**, which AI cannot do for two reasons:

1. It cannot see its own output's mistakes (it does not run your deploy).
2. It has no memory across sessions, so every fix breaks something else.

That last 20% is where every dollar in this business lives.

**The niche in numbers (2026):**
- ~10,000 startups built production apps with AI tools by end of 2025
- 8,000+ of them needed rescue work by mid-2026
- Rescue pricing: **$2,000** for one integration fix → **$7,500–$15,000** full production pass
- Pre-launch review: **$200–$1,000** — *this is our $249 audit, priced at market*
- 45% of AI-generated code fails security tests (Veracode)

We are not entering a crowded market. We are entering a market where the
customers are already in pain, already spending, and already looking.

---

## Offer architecture (why these two prices)

**$249 Pre-Launch Audit — the wedge**
- Impulse-buyable. No procurement, no committee, no invoice approval.
- Buys *certainty*: the founder finally knows if the app is fixable.
- Deliberately priced at the top of the market band ($200–$1,000) so it reads
  as expert, not as a $49 Fiverr gig.
- **Job:** convert anxiety into a paid relationship at the smallest possible ask.

**$1,000 5-Day Launch Pass — the money**
- Exactly the customer's stated goal. Not "$5,000 of development" — *launched*.
- Undercuts the $7,500 rescue specialists by 87% while promising half the time.
- **Job:** one sale = the whole target. Two sales = 2× target.
- Scarcity is real: one app in flight at a time, so "1 slot" is honest.

**The ladder:** free scan → $249 audit → $1,000 launch → retainers.
The free scan is not marketing. It is the product demo, the qualification, and
the sales call, compressed into 30 seconds.

---

## Funnel math (what has to be true)

```
100 qualified founders see the page
 → 25 run the free scan          (the scan is the hook: instant, private, useful)
 →  8 reply to a follow-up       (the scan gives a reason to reply)
 →  3 buy the $249 audit
 →  1 buys the $1,000 Launch Pass
```

**One sale needs ~100 qualified views.** Not 100,000. Not a viral launch.
100 people who built an AI app in the last six months and are stuck.

That is a solvable number this week. It is not a marketing problem —
it is a *list-building* problem, and lists are buildable today.

---

## Channel 1 — Direct outreach (highest intent, start here)

Where stuck AI-builders actually post, in order of signal:

| Source | What to search | Why it converts |
|---|---|---|
| **Reddit** r/lovable, r/boltnewbuilders, r/nocode, r/SideProject, r/indiehackers | `stuck`, `not working`, `deploy`, `supabase RLS`, `stripe`, `production` | Raw, specific pain, posted minutes ago |
| **X / Twitter** | `lovable` + `stuck`, `bolt` + `error`, `vibe coded` + `launch` | Public build-in-progress, easy to DM |
| **Discord** | Lovable, Bolt, Supabase, Indie Hackers servers, `#help`, `#showcase` | People actively mid-build |
| **Indie Hackers** | "Show IH" posts asking for feedback on a launch | Pre-launch = the exact moment |
| **Hacker News** | "Show HN" threads with few upvotes = struggling | Lower volume, high credibility |

### The message that works (send as-is, change one line)

> Saw your post about ______. I do launch-readiness for AI-built apps — the
> deploy/secret/Stripe failures that only show up in production.
>
> I built a scanner that runs entirely in your browser and lists what will break,
> with the fix: **[link]**. No signup, nothing uploaded. If it finds something you
> want handled, the 5-day launch pass is $1,000 fixed. If it finds nothing, you
> owe nothing and you got a free audit.

**Why this message converts**
1. It references *their* specific problem — proof you read, not blasted.
2. It gives before it asks (free scan).
3. It names a price immediately. Hiding the price wastes both sides' time and
   reads as "expensive".
4. It offers the *no-sale* outcome out loud ("if it finds nothing, you owe nothing"),
   which is what makes the ask safe to act on.

**Rules**
- Never send the same text twice to the same person.
- Max 20 cold messages/hour per platform. Rate limits are real and bans are fatal.
- Reply within 15 minutes during their day. Speed is the whole advantage of a one-person shop.
- Track every send. A follow-up on day 3 outperforms any new first-touch.

---

## Channel 2 — Content that ranks (compounding, start day 1)

The highest-intent search on earth for this business is a founder typing their
own error. Each post below targets one.

1. "Why your Lovable app 404s on refresh (and the 2-minute fix)"
2. "Your Supabase service_role key is in your frontend. Here is how to check and rotate it."
3. "Bolt.new apps break at Stripe because the webhook was never verified"
4. "The Row Level Security check every AI-built app skips"
5. "I scanned 20 Lovable exports. Here are the 7 failures they all share."

Format that works: **the real error, the real cause, the exact fix, then one line
about the paid pass.** Give away the fix for free — the people who cannot
implement it are the buyers, and the ones who can will hire you next time anyway.

Publish on: dev.to (free, strong SEO, developer audience) → mirror to Hashnode →
link from the site. One post per day for 5 days beats one perfect post.

---

## Channel 3 — The free scanner as a distribution asset

The scanner is the only part of this business that can spread by itself.
A founder who scans and finds 3 blockers has a screenshot worth posting.

Add later (in order of leverage):
1. **Shareable report link** — encode findings in the URL hash, no server needed.
2. **"Scanned by ShipCheck" badge** for founders who fix everything (social proof loop).
3. **GitHub Action** — run the same rules on every push. Free for open source,
   paid for private repos. This is the version that scales without you.

---

## Pricing integrity (do not break these)

- **Never discount the $1,000.** Discounting teaches the market the price was fake.
  If a founder cannot pay, sell the $249 audit and earn the rest later.
- **Always take 50% up front.** A founder who will not pay a deposit will not
  answer your messages in week two.
- **Refuse bad-fit work.** Broken business model, no users, wants free work first:
  say no fast. The cost of a bad client is not the money, it is the week.
- **Raise the price after the first three.** $1,000 is an introductory price for
  building a track record, not a permanent one. $2,500 is the market rate for a
  proven 5-day launch. Tell the next buyer that plainly — it creates urgency honestly.

---

## What "done" looks like this week

| Day | Action | Pass condition |
|---|---|---|
| 1 | Site live, scanner tested, 20 pieces of outreach sent | 20 sent, 3 replies |
| 2 | 40 more outreach + first dev.to post | 1 scan run by a stranger |
| 3 | Follow up every non-reply, 2nd post | 1 audit request |
| 4 | 40 more, 3rd post | **$249 collected** |
| 5 | Pitch the audit buyer the launch pass | **$1,000 booked** |

If day 5 arrives with zero replies, the message is wrong, not the market —
rewrite the first two lines and send 40 more the same day.

---

## Honest constraints (so nobody is surprised later)

1. **This cannot be automated into money.** No tool in this workspace can post
   to Reddit, DM on X, or file a bounty claim. Those are the money strokes.
   What is built here removes every excuse not to do them.
2. **Payment collection needs one human step:** a Stripe/Gumroad/Lemon Squeezy
   account under the owner's name. That is a 10-minute setup, and it is the
   single highest-value 10 minutes in this entire plan.
3. **The first sale is earned, not generated.** Expect 60–100 cold touches for
   the first $1,000. After three case studies that drops to ~20. This is the
   normal curve, not a sign the business is failing.
