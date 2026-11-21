// ShipCheck detection engine.
// Rule-based pre-launch audit for AI-built apps. No data leaves the browser:
// the paste-scan runs entirely client-side. That is a selling point, not a limit.

export type Severity = 'blocker' | 'high' | 'medium' | 'low'
export type Category =
  | 'secrets'
  | 'auth'
  | 'payments'
  | 'database'
  | 'deploy'
  | 'errors'
  | 'data'

export interface Finding {
  id: string
  title: string
  severity: Severity
  category: Category
  what: string        // what was found
  why: string         // the concrete consequence
  fix: string         // what we do about it
  evidence?: string   // matched snippet, redacted
  lines?: number[]
}

export interface Report {
  findings: Finding[]
  score: number
  blockers: number
  high: number
  scannedChars: number
  generatedAt: string
  verdict: 'not-shippable' | 'risky' | 'close' | 'ship-ready'
}

const SEV_WEIGHT: Record<Severity, number> = {
  blocker: 26,
  high: 14,
  medium: 7,
  low: 3,
}

/** Redact the middle of anything that looks like a credential, keep the shape. */
export function redact(s: string): string {
  return s.replace(
    /\b([A-Za-z0-9_\-]{6})([A-Za-z0-9_\-]{8,})([A-Za-z0-9_\-]{4})\b/g,
    (_m, a, b, c) => `${a}${'•'.repeat(Math.min(b.length, 12))}${c}`,
  )
}

interface Rule {
  id: string
  title: string
  severity: Severity
  category: Category
  what: string
  why: string
  fix: string
  /** Return matched line numbers (1-based) when the rule fires, else null. */
  match: (lines: string[], raw: string) => number[] | null
}

function linesMatching(lines: string[], re: RegExp): number[] {
  const out: number[] = []
  lines.forEach((l, i) => {
    if (re.test(l)) out.push(i + 1)
  })
  return out
}

/** Strip obvious placeholder / example values so we don't cry wolf. */
const PLACEHOLDER =
  /(your[_\-]?|example|placeholder|xxxx|changeme|dummy|\*\*\*|<[a-z_ ]+>|\.\.\.)/i

/** VITE_ / NEXT_PUBLIC_ / REACT_APP_ vars are inlined into the client bundle. */
const PUBLIC_ENV = /(VITE_|NEXT_PUBLIC_|REACT_APP_|EXPO_PUBLIC_|PUBLIC_)/

/**
 * A secret referenced through a *server-only* env var is the correct pattern,
 * not a finding. A secret referenced through a public-prefixed one is the bug.
 */
const isSafeServerEnv = (line: string) =>
  /(process\.env\.|import\.meta\.env\.|Deno\.env\.get\(|os\.environ)/.test(line) &&
  !PUBLIC_ENV.test(line)

const RULES: Rule[] = [
  {
    id: 'service-role-key',
    title: 'Supabase service_role key is in client code',
    severity: 'blocker',
    category: 'secrets',
    what: 'Found a Supabase service_role JWT in code that the browser downloads.',
    why:
      'service_role bypasses every Row Level Security policy. Anyone who opens DevTools reads and writes your entire database: every user, every row, every table. This is the single most common catastrophic leak in AI-built apps.',
    fix: 'Move every privileged call to a server function and rotate the key. The browser may only ever hold the anon/publishable key.',
    match: (lines) => {
      const hits = linesMatching(
        lines,
        /(service_role|serviceRole|SERVICE_ROLE)/,
      ).filter((n) => !PLACEHOLDER.test(lines[n - 1]) && !isSafeServerEnv(lines[n - 1]))
      const jwt = linesMatching(
        lines,
        /eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\./,
      ).filter((n) => /service_role/.test(atobSafe(lines[n - 1]) ?? ''))
      const all = [...new Set([...hits, ...jwt])]
      return all.length ? all.slice(0, 8) : null
    },
  },
  {
    id: 'secret-in-public-env',
    title: 'A secret is exposed through a public environment variable',
    severity: 'blocker',
    category: 'secrets',
    what: 'A variable prefixed VITE_ / NEXT_PUBLIC_ / REACT_APP_ / EXPO_PUBLIC_ holds something that looks like a private key.',
    why:
      'Those prefixes do not mean "config". They mean "compile this string into the JavaScript bundle and ship it to every visitor". Stripe secret keys, OpenAI keys and DB passwords leak this way constantly.',
    fix: 'Rename to a server-only variable (no public prefix), read it in a server route, and rotate the exposed key.',
    match: (lines) =>
      pick(
        linesMatching(
          lines,
          /(VITE_|NEXT_PUBLIC_|REACT_APP_|EXPO_PUBLIC_|PUBLIC_)[A-Z0-9_]*(SECRET|PRIVATE|PASSWORD|SERVICE|ADMIN|TOKEN|KEY)[A-Z0-9_]*(?![A-Z0-9_])/,
        ).filter((n) => !PLACEHOLDER.test(lines[n - 1])),
      ),
  },
  {
    id: 'stripe-secret',
    title: 'Stripe secret key in the client bundle',
    severity: 'blocker',
    category: 'payments',
    what: 'A Stripe secret key (sk_live / sk_test) is reachable from frontend code.',
    why:
      'A live secret key lets anyone issue refunds, read every customer and charge cards. Stripe will also close the account after the leak is abused.',
    fix: 'Server-side only. Rotate immediately in the Stripe dashboard, then move PaymentIntents behind a server route.',
    match: (lines) => {
      const literal = linesMatching(lines, /sk_(live|test)_[A-Za-z0-9]{10,}/)
        .filter((n) => !PLACEHOLDER.test(lines[n - 1]))
      // A secret key read through a public-prefixed env var is equally exposed.
      const leakedEnv = linesMatching(lines, /(VITE_|NEXT_PUBLIC_|REACT_APP_|EXPO_PUBLIC_)[A-Z0-9_]*STRIPE[A-Z0-9_]*SECRET/i)
      return pick([...new Set([...literal, ...leakedEnv])])
    },
  },
  {
    id: 'llm-key-client',
    title: 'AI provider key called directly from the browser',
    severity: 'high',
    category: 'secrets',
    what: 'Code calls OpenAI / Anthropic / Groq / Gemini from client-side code with a key in the bundle.',
    why:
      'Every visitor can extract the key and spend your quota. Bills in the thousands of dollars from a leaked key are routine, and the key is also a data-exfiltration path.',
    fix: 'Proxy through one server route that holds the key, rate-limits per session and strips the key from the client.',
    match: (lines) => {
      const key = linesMatching(lines, /(sk-[A-Za-z0-9]{20,}|gsk_[A-Za-z0-9]{20,}|AIza[A-Za-z0-9_-]{20,}|sk-ant-[A-Za-z0-9_-]{10,})/)
        .filter((n) => !PLACEHOLDER.test(lines[n - 1]) && !isSafeServerEnv(lines[n - 1]))
      const direct = linesMatching(lines, /(api\.openai\.com|api\.anthropic\.com|generativelanguage\.googleapis\.com)/)
        .filter((n) => !/\/api\/|proxy|fetch\(\s*['"]\/|server|edge/i.test(lines[n - 1]))
      return pick([...new Set([...key, ...direct])])
    },
  },
  {
    id: 'rls',
    title: 'Database tables are readable without Row Level Security',
    severity: 'blocker',
    category: 'database',
    what: 'Supabase schema is created without ENABLE ROW LEVEL SECURITY on user tables.',
    why:
      'With RLS off, the anon key — which is public by design — returns every row to anyone who asks. One curl request dumps all users and their data. AI builders create tables and skip RLS constantly.',
    fix: 'Enable RLS on every table and write explicit per-user policies. Verify with an anon-key request that returns zero rows it should not.',
    match: (lines) => {
      const creates = linesMatching(lines, /create\s+table/i)
      if (!creates.length) return null
      const rls = linesMatching(lines, /enable\s+row\s+level\s+security/i)
      const policies = linesMatching(lines, /create\s+policy/i)
      if (policies.length) return null
      if (rls.length >= creates.length) return null
      // flag the table definitions that have no nearby RLS statement
      return creates.slice(0, 6)
    },
  },
  {
    id: 'client-auth-gate',
    title: 'Access is gated in the browser only',
    severity: 'high',
    category: 'auth',
    what: 'A route or paywall is hidden with client-side checks (isPro, role === "admin", localStorage).',
    why:
      'Hiding a screen is not protecting data. The API behind it still answers, and the data still loads. Everyone who opens DevTools or edits localStorage gets paid features for free.',
    fix: 'Enforce every rule in the database (RLS) or a server route, using a verified session — not a value the client sends.',
    match: (lines) =>
      pick(
        linesMatching(
          lines,
          /(localStorage\.getItem\(\s*['"](is_?pro|is_?admin|role|plan|subscription)|if\s*\(\s*(user\.)?(isPro|isAdmin|role\s*===)|isPremium\s*&&)/i,
        ).filter((n) => !/server|api\/|middleware|use server/i.test(lines[n - 1])),
      ),
  },
  {
    id: 'no-webhook-verify',
    title: 'Payment webhook accepts unverified requests',
    severity: 'blocker',
    category: 'payments',
    what: 'A Stripe (or similar) webhook handler does not verify the signature.',
    why:
      'Without signature verification, anyone who finds the endpoint POSTs a fake "payment succeeded" event and gets your product for free — or marks their own invoice paid.',
    fix: 'Verify with stripe.webhooks.constructEvent and the raw body, reject on mismatch, then make the handler idempotent.',
    match: (lines) => {
      const hooks = linesMatching(
        lines,
        /(webhook|checkout\.session\.completed|customer\.subscription\.(created|updated|deleted)|invoice\.paid|payment_intent\.succeeded)/i,
      )
      if (!hooks.length) return null
      const verifies = linesMatching(
        lines,
        /(constructEvent|verify.*signature|signature.*verify|stripe-signature|svix|whsec_)/i,
      )
      return verifies.length ? null : hooks.slice(0, 5)
    },
  },
  {
    id: 'paid-client-side',
    title: 'Entitlement is granted from the browser after checkout',
    severity: 'high',
    category: 'payments',
    what: 'The app upgrades the user based on a client redirect or query param (success=true) instead of the webhook.',
    why:
      'Anyone can visit /success?session_id=fake and be a paying customer. It also loses real customers whenever the redirect fails, which it does on mobile.',
    fix: 'Grant entitlement in the verified webhook, and treat the success page as display-only while it polls for the real state.',
    match: (lines) =>
      pick(
        linesMatching(
          lines,
          /(get\(\s*['"](success|paid|upgraded|purchased)['"]\)|searchParams.*['"](success|paid)['"]|success\s*===?\s*['"]?true|checkout[_-]?success|payment[_-]?status\s*==)/i,
        ),
      ),
  },
  {
    id: 'hardcoded-api-base',
    title: 'Hard-coded backend URL (localhost or a personal tunnel)',
    severity: 'high',
    category: 'deploy',
    what: 'Frontend calls http://localhost or a temporary tunnel host.',
    why:
      'Works on your machine, dead for every user. Also breaks the moment you deploy to a different domain, and leaks that a dev machine is the real backend.',
    fix: 'One environment-configured base URL, relative paths where possible, and a CI check that fails the build on localhost in production code.',
    match: (lines) =>
      pick(linesMatching(lines, /(https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0):\d+|ngrok(-free)?\.(io|app)|trycloudflare\.com)/i)),
  },
  {
    id: 'spa-fallback',
    title: 'Deep links will 404 after deploy',
    severity: 'medium',
    category: 'deploy',
    what: 'A client-side router with no rewrite/fallback configured (no vercel.json rewrites, no _redirects, no hash router).',
    why:
      'The app works until someone refreshes on /dashboard, or clicks a shared link. Then the host returns 404 and it looks broken — a classic "it worked in preview" failure.',
    fix: 'Add the host rewrite to index.html (or move to a hash router) and test every route with a hard refresh.',
    match: (lines, raw) => {
      const router = /(react-router|BrowserRouter|createBrowserRouter|vue-router|@reach\/router)/.test(raw)
      if (!router) return null
      const handled = /(rewrites|_redirects|"routes"|HashRouter|createHashRouter|try_files)/.test(raw)
      return handled ? null : pick(linesMatching(lines, /createBrowserRouter|BrowserRouter|createRouter\(/))
    },
  },
  {
    id: 'cors-open',
    title: 'API allows any origin',
    severity: 'high',
    category: 'deploy',
    what: 'CORS is set to * on a route that handles authenticated or paid requests.',
    why:
      'Any website can call your API as the logged-in user. Combined with a weak auth check, this is account takeover by CSRF from a page the user merely visits.',
    fix: 'Allowlist the real origins, send credentials only to them, and reject preflight from everything else.',
    match: (lines) =>
      pick(linesMatching(lines, /(Access-Control-Allow-Origin['"]?\s*[:,]\s*['"]\*|cors\(\s*\{\s*origin:\s*['"]\*)/i)),
  },
  {
    id: 'no-error-handling',
    title: 'Fetches with no error handling — blank screen on failure',
    severity: 'medium',
    category: 'errors',
    what: 'Multiple async calls without try/catch or error state, and no error boundary.',
    why:
      'One failed request and the user gets a white screen with no message, no retry and no way to tell you. This is the top cause of "it just stopped working" support tickets.',
    fix: 'Wrap async paths, add an error boundary, and show a real message with a retry button. Log the failure somewhere you can see it.',
    match: (lines, raw) => {
      const fetches = linesMatching(lines, /\b(fetch|axios\.(get|post|put|delete)|supabase\.from\()/)
      if (fetches.length < 3) return null
      const guarded = /(try\s*\{|catch\s*\(|ErrorBoundary|onError)/.test(raw)
      return guarded ? null : fetches.slice(0, 6)
    },
  },
  {
    id: 'token-localstorage',
    title: 'Session token stored where any XSS can read it',
    severity: 'medium',
    category: 'auth',
    what: 'Auth token or JWT is written to localStorage.',
    why:
      'Any injected script — including one from a dependency — reads the token and takes over the account. It also never expires on its own.',
    fix: 'Use httpOnly, Secure, SameSite cookies for the session, and keep the token out of JavaScript reach.',
    match: (lines) =>
      pick(linesMatching(lines, /localStorage\.setItem\(\s*['"][^'"]*(token|jwt|session|auth)/i).filter((n) => !PLACEHOLDER.test(lines[n - 1]))),
  },
  {
    id: 'xss-html',
    title: 'Unsanitised HTML injection point',
    severity: 'high',
    category: 'data',
    what: 'dangerouslySetInnerHTML / v-html / innerHTML is fed user or model output.',
    why:
      'With an AI app the model output is often rendered as HTML. That is remote code execution in the browser, and it is trivially found once discovered.',
    fix: 'Sanitise with DOMPurify (or render as text), allowlist tags, and never trust model or user output.',
    match: (lines) => pick(linesMatching(lines, /(dangerouslySetInnerHTML|v-html=|\.innerHTML\s*=)/)),
  },
  {
    id: 'no-input-validation',
    title: 'User input reaches the database without validation',
    severity: 'medium',
    category: 'data',
    what: 'Insert/update calls pass raw form values with no schema validation.',
    why:
      'Bad input corrupts rows, breaks your own UI later, and in tables without constraints can be used to store payloads that hit every other user.',
    fix: 'Validate at the boundary with zod (or equivalent) on the server, and add DB constraints as the second line.',
    match: (lines) => {
      const inserts = linesMatching(lines, /\.(insert|update|upsert)\(\s*\{?/)
      if (inserts.length < 2) return null
      const validated = /(zod|z\.object|yup|valibot|joi|parse\(|safeParse)/i.test(lines.join('\n'))
      return validated ? null : inserts.slice(0, 4)
    },
  },
  {
    id: 'console-secrets',
    title: 'Secrets written to logs',
    severity: 'medium',
    category: 'secrets',
    what: 'console.log of an env var, key or full request object.',
    why:
      'Logs are shipped to third-party services, screenshotted into support tickets and visible in shared browser consoles. This is how keys escape without any attacker effort.',
    fix: 'Strip the log, or log a redacted shape. Never log whole env or request objects.',
    match: (lines) =>
      pick(
        linesMatching(lines, /console\.(log|info|debug)\([^)]*(process\.env|import\.meta\.env|apiKey|secret|password|token|authorization)/i),
      ),
  },
  {
    id: 'no-migrations',
    title: 'Schema lives only in the AI chat, not in migrations',
    severity: 'medium',
    category: 'database',
    what: 'SQL or table definitions appear nowhere as versioned migrations.',
    why:
      'The next environment — staging, a new Supabase project, a teammate — cannot be built. Restores lose tables. Nobody, including you in a month, knows the real schema.',
    fix: 'One migrations directory, applied in CI, with the schema in version control from now on.',
    match: (lines, raw) => {
      const sql = /create\s+table/i.test(raw)
      if (!sql) return null
      return /(migrations?\/|migration|supabase\/migrations)/i.test(raw) ? null : pick(linesMatching(lines, /create\s+table/i))
    },
  },
  {
    id: 'fake-auth',
    title: 'Authentication accepts any credentials',
    severity: 'blocker',
    category: 'auth',
    what: 'A login/signup path returns success without verifying anything (always true, no password check, or a hardcoded user).',
    why:
      '"Fake auth" is a standard AI shortcut to make the demo flow work. Everything behind it is public. If you are taking money, this is also a fraud and refund magnet.',
    fix: 'Wire a real password or OAuth check, verify the session server-side on every protected request, and add rate limiting on login.',
    match: (lines) => {
      const out: number[] = []

      // Hardcoded comparison against a literal password.
      out.push(...linesMatching(lines, /if\s*\(\s*password\s*===?\s*['"][^'"]+['"]\s*\)/))

      // A canned session/user object used as if it were authenticated.
      out.push(
        ...linesMatching(
          lines,
          /const\s+(user|session)\s*=\s*\{\s*(id|userId)\s*:\s*['"](1|0|test|demo|user|admin)['"]/i,
        ),
      )

      // A login-ish function that returns success without ever checking a secret.
      const starts = linesMatching(
        lines,
        /((function|const|async function)\s+(login|signin|signIn|authenticate|verifyPassword|checkPassword)\b|def\s+(login|authenticate)\b)/i,
      )
      for (const start of starts) {
        const body = lines.slice(start - 1, start + 12).join('\n')
        const compares = /(bcrypt|argon2|scrypt|compare\(|verify\(|hash|===?\s*password|password\s*===?|await\s+\w+\.signIn|signInWithPassword|supabase\.auth|auth\(\))/i.test(
          body,
        )
        const returnsTrue = /return\s+(true|Response\.json\(\{\s*(ok|success):\s*true)/i.test(body)
        if (returnsTrue && !compares) out.push(start)
      }

      return pick(out)
    },
  },
]

function atobSafe(s: string): string | null {
  try {
    const m = s.match(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\./)
    if (!m) return null
    const payload = m[0].split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return atob(payload + '='.repeat((4 - (payload.length % 4)) % 4))
  } catch {
    return null
  }
}

function pick(n: number[]): number[] | null {
  const u = [...new Set(n)]
  return u.length ? u.slice(0, 8) : null
}

export function scan(input: string): Report {
  const raw = input ?? ''
  const lines = raw.split(/\r?\n/)
  const findings: Finding[] = []

  for (const rule of RULES) {
    let hit: number[] | null = null
    try {
      hit = rule.match(lines, raw)
    } catch {
      hit = null
    }
    if (!hit) continue
    const evidence = hit
      .map((n) => (lines[n - 1] ?? '').trim())
      .filter(Boolean)
      .slice(0, 3)
      .map((l) => redact(l).slice(0, 180))
      .join('\n')
    findings.push({
      id: rule.id,
      title: rule.title,
      severity: rule.severity,
      category: rule.category,
      what: rule.what,
      why: rule.why,
      fix: rule.fix,
      evidence: evidence || undefined,
      lines: hit.slice(0, 5),
    })
  }

  const order: Severity[] = ['blocker', 'high', 'medium', 'low']
  findings.sort((a, b) => order.indexOf(a.severity) - order.indexOf(b.severity))

  let score = 100
  for (const f of findings) score -= SEV_WEIGHT[f.severity]
  // A clean scan of a tiny snippet should not read as a full clean bill of health.
  if (raw.length < 400) score = Math.min(score, 88)
  score = Math.max(0, Math.min(100, Math.round(score)))

  const blockers = findings.filter((f) => f.severity === 'blocker').length
  const high = findings.filter((f) => f.severity === 'high').length

  return {
    findings,
    score,
    blockers,
    high,
    scannedChars: raw.length,
    generatedAt: new Date().toISOString(),
    verdict:
      score < 45 ? 'not-shippable' : score < 70 ? 'risky' : score < 90 ? 'close' : 'ship-ready',
  }
}

export const VERDICT_COPY: Record<Report['verdict'], { label: string; line: string }> = {
  'not-shippable': {
    label: 'Do not take payments yet',
    line: 'There is at least one issue here that loses data, money, or the whole database the moment a real user touches it.',
  },
  risky: {
    label: 'Not ready for real users',
    line: 'It will demo fine. Under real traffic it will break, leak, or charge someone twice.',
  },
  close: {
    label: 'Close, but not launch-safe',
    line: 'The remaining items are the ones that generate support tickets and refund requests on launch day.',
  },
  'ship-ready': {
    label: 'No critical issues found',
    line: 'This scan found nothing critical. A manual pass still checks logic, load and money paths the scanner cannot see.',
  },
}
