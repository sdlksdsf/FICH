# Outreach scripts — copy, do not rewrite

Every script follows the same four-beat shape:
**their problem → what I do in one line → free artifact → price + no-sale exit.**

Short beats clever. The reader is mid-panic about a broken deploy; they are
scanning for "can this person help me", not for personality.

---

## 1. Reddit / Discord reply (public, high intent)

Best when someone posted a specific error. Reply in the thread, publicly, because
the next ten people with the same error will read it too.

```
This is almost always <cause>. Specifically:

<one-sentence explanation of the actual mechanism>

Quickest check — run one request with the anon key:
<the command>

If it returns rows it should not, that is your bug, not your UI.

I run launch-readiness passes on AI-built apps — this exact class of failure. I
built a scanner that lists every blocker with the fix, runs entirely in your
browser, nothing uploaded: <link>

Free to run. If it turns up something you would rather hand off, the 5-day
launch pass is $1,000 fixed and you keep the source.
```

**Do not** open with "I can help you!" — it reads as a vendor and gets removed.
Fix the problem in the comment first. The offer goes last and stays one line.

---

## 2. Cold DM (X / Discord DM) — under 500 characters

```
Saw your post about <specific symptom>. That is the <cause> — it bites almost
every Lovable/Bolt app at launch.

Free scanner, runs in your browser, nothing uploaded: <link>
Lists every blocker with the fix.

If you would rather it just get fixed: 5 days, $1,000 fixed, source stays yours.
If the scan finds nothing, you owe nothing.
```

Why it works: names their exact symptom in the first six words (proves it is not
a blast), gives before asking, states price so nobody wastes a call.

---

## 3. Email (when you have an address from a launch post)

**Subject:** `the <their symptom>` — 30-second check

```
Hi <name>,

Saw <app name> on <where you found it>. <One concrete, specific observation
about their app — this sentence is the whole email. If you cannot write it,
you have not looked hard enough and should not send.>

The reason apps at this stage stall is almost never the design. It is four
mechanical things: the deploy does not rewrite deep routes, a key ends up in the
client bundle, auth is enforced only in the UI, or the Stripe webhook is not
verified. Any one of those means the app cannot safely take real users.

I built a scanner that checks for exactly those, in your browser, nothing
uploaded: <link>. It takes 30 seconds and prints the fix next to each finding.

If it finds something you would rather not handle yourself, I do a 5-day
launch pass — deploy, secrets, auth, payments, database rules — $1,000 fixed,
source stays yours. If the scan comes back clean, you owe nothing.

<Your name>
ShipCheck
```

---

## 4. Follow-up (day 3, no reply) — this is the highest-ROI message in the file

```
Hi <name> — following up once, then I will leave you alone.

Ran your app through the scanner this morning; it flags <the most specific thing
you can verify from outside - e.g. "the app returns 404 on /dashboard refresh",
"the login page ships a key-shaped string in the bundle">.

That is a real launch blocker, and it is cheap to fix now and expensive to
discover after you have customers.

Offer stands: <link>. Either way, wanted you to know about that one.

<name>
```

**Never send more than two follow-ups.** Third messages convert at a rate that
does not pay for the reputation damage.

---

## 5. The audit → launch-pass upsell (the real money message)

Send within 24 hours of delivering the $249 audit, while the findings are still
the most annoying thing in their inbox.

```
Hi <name> — audit is attached. Three blockers, two highs, and the full fix list
in priority order.

The honest read: none of this is hard, and all of it is the kind of thing that is
hard to do *from the inside* — you are too close to the code, and the AI will
happily "fix" it into a worse state.

I can take all of it off your hands and have you live in five working days:
$1,000 fixed, and the $249 you just paid comes off it. You keep the source and
the deploy.

Want me to send the fixed-scope agreement?

<name>
```

The credit-back is the strongest lever in the whole funnel: it makes the audit
feel free to anyone who continues, and it costs nothing if they do not.

---

## 6. Show HN style post (one shot, use it well)

**Title:** `I built a free scanner for the failures that stop AI-built apps from shipping`

```
Every week somebody posts a Lovable/Bolt app that works locally and dies in
production. The causes repeat: deep links 404 because nothing rewrites to
index.html; a service_role key compiled into the client bundle; auth enforced
only in the UI; a Stripe webhook that never verifies a signature; tables created
with Row Level Security off.

So I wrote the checks down as rules. Paste the files you are unsure about and it
lists what will break, ranked, with the fix next to each one. It runs entirely in
the browser — there is no backend, so nothing you paste can leave the tab. That
was a hard requirement: the last thing anyone should do is paste their secrets
into a stranger's server.

It is a lead magnet for the service I actually sell — a 5-day launch pass that
fixes all of it for $1,000 fixed. Being upfront about that because the scanner is
genuinely free and genuinely useful either way, and if you fix everything
yourself I would rather you had the list than not.

<the rules, if you want to read them before running it: link>

Happy to answer anything about the failure modes or the rules.
```

---

## Sending discipline

| Rule | Why |
|---|---|
| Max 20 cold touches/hour per platform | Bans are permanent, accounts are the asset |
| Personalise the first sentence every time | It is the only measurable driver of reply rate |
| Send during their working hours, not yours | A reply in 15 min closes; a reply tomorrow does not |
| Log every touch (platform, name, date, status) | Follow-ups are 3× the value of first touches |
| Never send the same text to the same person twice | It is the fastest way to be remembered badly |

## Reply-rate expectations (do not panic)

- Cold DM, well personalised: **15–30%**
- Public helpful reply with a fix: **5–10%** click, but the thread keeps working for months
- Email with a genuine specific observation: **20–40%**
- Follow-up on day 3: adds **8–12 points** to total reply rate

100 well-personalised touches → 20–30 conversations → 3–5 audits → 1–3 launch passes.
The numbers are ordinary. The execution is what is rare.
