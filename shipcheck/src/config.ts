// ─── ShipCheck configuration ──────────────────────────────────────────────
// Fill CHECKOUT_URL to flip this site from "request a quote" to instant card
// checkout. Any hosted link that sells a fixed price works.
//
// Fastest for a Pakistani sole trader (10 minutes, no company needed):
//   1. gumroad.com → sign up with the Gmail you already have
//   2. New product → "Digital product" → name it "ShipCheck Launch Pass"
//   3. Price 1000 USD → publish → copy the product URL
//   4. Paste it below as rescue. Repeat for "Pre-Launch Audit" at 249.
// Gumroad pays out to a Pakistani bank account and handles the card + tax side.
//
// Alternatives: Lemon Squeezy (merchant of record, also pays PK), Paddle,
// or a Stripe Payment Link if you already have a supported Stripe country.
//
// The order form appends ?ref=shipcheck and the buyer's email as prefill, so
// every sale is attributable to the source you sent them from.
//
// Until it is set, the flow collects the brief and hands the buyer a
// pre-written email. That still converts — just slower, and it loses the
// impulse buyers who will not wait for an invoice.

export const CHECKOUT_URL: Record<string, string> = {
  // audit:  'https://yourname.gumroad.com/l/shipcheck-audit',
  // rescue: 'https://yourname.gumroad.com/l/shipcheck-rescue',
}

export const CONTACT_EMAIL = 'shayan44wrgs@gmail.com'

/** Where orders are delivered. The form POSTs JSON here when configured. */
export const ORDER_ENDPOINT = '' // e.g. a Vercel serverless route or a Supabase edge function

export const OWNER = {
  name: 'Alex Frands',
  brand: 'ShipCheck',
  location: 'Karachi, PK — working across time zones',
  turnaroundPromise: 'I reply to every order within 12 hours, including weekends.',
}

export const hasCheckout = (id: string) => Boolean(CHECKOUT_URL[id])
