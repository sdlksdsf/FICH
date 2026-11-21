// ─── ShipCheck configuration ──────────────────────────────────────────────
// Fill CHECKOUT_URL to flip the site from "request an invoice" to instant card
// checkout. Any hosted checkout that accepts a fixed price works:
//   Gumroad / Lemon Squeezy / Stripe Payment Link / Paddle / Ko-fi
// Format per tier: TIER id → URL. The order form appends ?ref= / ?prefill.
//
// Until it is set, the order flow collects the brief and emails a real invoice,
// which still converts — just slower, and with no processor fees.

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
