# Live target list — real threads, real buyers

These are actual, currently-open conversations where founders are asking for
exactly what ShipCheck sells. Nothing here is invented. Work top to bottom.

**Rule before you touch anything:** read the thread, answer the person's
question *in your own words first*, and only then mention the scanner. A pitch
with no answer gets removed and burns the account.

---

## What the market told us (read this before you send anything)

Three findings from live research, all of which change the pitch:

**1. Demand is confirmed and loud.**
> "sharing this with bit of tears in my eyes — i've fixed about 500 vibecoded
> apps from last two months and it really sucks" — r/SaaS

> "Vibe fixing for vibe coding is the most 2026 business model I have ever seen."

**2. This is not a blue ocean. There are real competitors.**
- **AppStuck** — 300+ AI app rescues across Lovable, Bolt, Replit, Cursor, Windsurf
- **futuristasoft**, **selfmadenewbie**, **testmylaunch**, **itpathsolutions** — all
  publishing rescue content and taking work

**3. So "cheap" is the wrong pitch. This is the right one:**

> "I've had multiple bad experiences in the past hiring devs... Spent $20k on one
> a little over a year ago who did basically nothing. Plus I hired him off of
> Toptal with a great resume." — r/webdev

That is the whole market in one sentence. These founders have **already been
burned**. They are not comparing prices. They are trying to avoid being fooled
again. Which means:

| Weak pitch | What actually converts |
|---|---|
| "Affordable MVP development" | "See every finding before you pay a cent" |
| "I can fix your app" | "Here is the exact list, ranked, with the fix" |
| "Cheap alternative to an agency" | "You keep the code, the accounts and the keys" |
| "Book a call" | "Run the scan. Decide after." |

**The differentiation is proof-first.** Competitors hide behind a discovery call.
You hand over a real report in 30 seconds and let it sell. That is a genuine
structural advantage of the scanner you already have — use it in every message.

---

## Tier 1 — Warm and specific (do these first, today)

| # | Where | What they are asking | Angle |
|---|---|---|---|
| 1 | r/webdev — *"I vibe-coded a production platform for my 7-figure business. At what point should I bring in a real engineer?"* | Explicitly asking whether to hire | Highest-value buyer on this list. Answer the question honestly, then offer the audit |
| 2 | r/SaaS — *"fixed about 500 vibecoded apps... it really sucks"* | A practitioner, not a buyer | Do NOT pitch. Comment as a peer, agree about the failure patterns, mention the scanner as a tool they could use. This thread is full of *other people's* clients |
| 3 | r/vibecoding — *"vibe coded for 6 months. my codebase is a disaster."* | Panicking, has customers | "Functional mess with customers is the best position to be in" → audit |
| 4 | r/vibecoding — *"Vibed a fairly complex app, not sure if it's production ready"* | Literally the audit use case | Point them at the free scan first |

## Tier 2 — Repeatable search (do 20/day)

Run these, filter to **last 48 hours**, sort by new. Reply to the ones with no
good answer yet.

**Reddit** — r/lovable, r/boltnewbuilders, r/vibecoding, r/nocode, r/SaaS,
r/webdev, r/SideProject, r/indiehackers

```
lovable stuck
bolt app broken
deploy 404 refresh
supabase RLS
stripe webhook
"production ready"
vibe coded disaster
```

**X / Twitter**
```
lovable stuck
bolt.new error
"vibe coded" deploy
lovable supabase RLS
```

**Discord** — Lovable, Bolt, Supabase, Indie Hackers: `#help`, `#showcase`,
`#deployments`. Answer in `#help`; never pitch there, just link the scanner when
it is directly relevant.

---

## The message, adapted for each tier

### Reply in a public thread (Tier 1, #1 and #3)

> Honest answer: at the point where a bug costs you customers, not before. A 7-figure
> business with a working app is in a much better spot than most people asking this.
>
> What I'd actually check first — in this order, because the others do not matter if
> one of these is wrong:
>
> 1. Is a `service_role` or Stripe secret key sitting in the client bundle? (one DevTools tab)
> 2. Do your tables have Row Level Security on, and does an anonymous request return rows?
> 3. Does the payment webhook verify the signature, or would a forged POST grant access?
> 4. Does `/dashboard` 404 on a hard refresh?
>
> If all four are clean you probably do not need anyone yet. If any are not, that is the
> real answer to your question.
>
> I put those checks (and ~14 more) into a free scanner that runs in the browser — nothing
> is uploaded, so you can paste a file with keys in it: <link>. It prints the fix next to
> each finding. If you'd rather hand the whole thing off after that, that's the other thing
> I do.

### Cold DM (Tier 2)

> Saw your post about <their exact symptom>. That's the <cause> — it bites nearly every
> Lovable/Bolt app at launch, and it's not your fault.
>
> Free scanner, runs in your browser, nothing uploaded: <link>
> Lists every blocker with the fix. No email needed.
>
> If you'd rather it just got fixed: 5 days, $1,000 fixed, you keep the code. If the scan
> finds nothing, you owe nothing.

### Peer reply, do NOT pitch (Tier 1, #2 and the 500-apps thread)

> The pattern I keep seeing in these: it is almost never the code quality. It's four
> mechanical things — a key in the bundle, RLS off, an unverified webhook, and deep links
> that 404 on refresh. Everything else is survivable.
>
> I turned those into a scanner that runs client-side: <link> — use it on the next one you
> pick up, saves you the first hour.

---

## The objection you will hear, and the answer

**"Why would I pay $1,000 when someone quoted me $200?"**

> Because the $200 quote is for one thing, and you will discover the other four after
> you have paid. The $249 audit lists all of them first, and the $1,000 covers all of
> them plus the deploy and a tested payment path — and the $249 comes off it.
>
> You have already been burned once by someone with a good resume. This is the version
> where you see the work before you pay for it.

**"Can you guarantee it will be fixed in 5 days?"**

> No, and be suspicious of anyone who does before reading your code. What I guarantee is
> a written scope in 12 hours and 50% only at the start. If it needs longer than five days,
> you hear that before I take a deposit, not after.

---

## Not worth your time

- Anyone who wants free work "to test you"
- Anyone whose app has no users and no revenue — the audit is still sellable, the
  launch pass is not yet
- Recruiters and agencies offering subcontracts (they pay late and own the client)
- "Equity only" offers, every time, with no exceptions

---

## Daily number to hit

**20 personalised touches. Every day. Until $1,000 lands.**

Not 5. Not "when I have time". The entire difference between this being a business
and being another abandoned repo is twenty messages a day for a week.
