import crypto from 'node:crypto'

// Verify a Stripe webhook signature without the stripe SDK.
// Mirrors Stripe's scheme: header `t=<unix>,v1=<hex>`, signed payload `<t>.<rawBody>`,
// HMAC-SHA256 keyed with the endpoint's whsec_ secret.
export function verifyStripeSignature(
  rawBody: string,
  sigHeader: string | null,
  secret: string,
  toleranceSeconds = 300,
): boolean {
  if (!sigHeader || !secret) return false

  const parts = sigHeader.split(',').map((p) => p.trim())
  let timestamp = ''
  const v1: string[] = []
  for (const part of parts) {
    const [k, v] = part.split('=')
    if (k === 't') timestamp = v
    else if (k === 'v1') v1.push(v)
  }
  if (!timestamp || v1.length === 0) return false

  // Reject stale timestamps (replay protection).
  const ts = Number(timestamp)
  if (!Number.isFinite(ts)) return false
  if (toleranceSeconds > 0 && Math.abs(Date.now() / 1000 - ts) > toleranceSeconds) {
    return false
  }

  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}.${rawBody}`, 'utf8')
    .digest('hex')
  const expectedBuf = Buffer.from(expected, 'utf8')

  return v1.some((sig) => {
    const sigBuf = Buffer.from(sig, 'utf8')
    return sigBuf.length === expectedBuf.length && crypto.timingSafeEqual(sigBuf, expectedBuf)
  })
}
