// Front Desk AI landing page config.
// NEXT_PUBLIC_* vars are inlined at build time; referencing them literally here
// lets Next.js statically replace them for both server and client components.

// Calendly booking link — falls back to the audit link used elsewhere on the site.
export const CALENDLY_URL =
  process.env.NEXT_PUBLIC_CALENDLY_URL ||
  'https://calendly.com/jeff-tamethemachine/audit'

// Demo line phone number, e.g. "+15551234567". Empty until launch.
export const DEMO_LINE_NUMBER = process.env.NEXT_PUBLIC_DEMO_LINE_NUMBER || ''

// Stripe Payment Link for the Starter plan. Empty → waitlist via Calendly.
export const STRIPE_LINK_STARTER = process.env.NEXT_PUBLIC_STRIPE_LINK_STARTER || ''

// Format a raw phone string for display: "+15551234567" → "+1 (555) 123-4567".
export function formatPhone(raw: string): string {
  const digits = raw.replace(/[^\d]/g, '')
  if (digits.length === 11 && digits.startsWith('1')) {
    const d = digits.slice(1)
    return `+1 (${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }
  return raw
}
