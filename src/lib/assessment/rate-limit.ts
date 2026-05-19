const map = new Map<string, { count: number; windowStart: number }>()
const LIMIT = 5
const WINDOW_MS = 60 * 60 * 1000

export function checkRateLimit(ip: string): { ok: boolean; retryAfter?: number } {
  const now = Date.now()
  const entry = map.get(ip)

  if (!entry || now - entry.windowStart >= WINDOW_MS) {
    map.set(ip, { count: 1, windowStart: now })
    return { ok: true }
  }

  if (entry.count >= LIMIT) {
    const retryAfter = Math.ceil((WINDOW_MS - (now - entry.windowStart)) / 1000)
    return { ok: false, retryAfter }
  }

  entry.count++
  return { ok: true }
}
