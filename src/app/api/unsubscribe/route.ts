import { NextRequest, NextResponse } from 'next/server'
import { readLeads, setCell } from '@/lib/assessment/sheets'
import { verifyUnsubscribeToken } from '@/lib/assessment/nurture'

// POST /api/unsubscribe?e=<email>&t=<token>  (also accepts JSON body {email, token})
// Used by the /unsubscribe confirm page and by mail clients' one-click
// List-Unsubscribe-Post. POST-only so link-prefetching scanners can't trigger it.

export async function POST(req: NextRequest) {
  let email = req.nextUrl.searchParams.get('e') ?? ''
  let token = req.nextUrl.searchParams.get('t') ?? ''

  if (!email || !token) {
    try {
      const body = (await req.json()) as { email?: string; token?: string }
      email = body.email ?? email
      token = body.token ?? token
    } catch {
      // no body — query-only is fine
    }
  }

  email = email.trim().toLowerCase()
  if (!email || !token || !verifyUnsubscribeToken(email, token)) {
    return NextResponse.json({ ok: false, error: 'invalid_link' }, { status: 400 })
  }

  try {
    const leads = await readLeads()
    const matches = leads.filter(l => l.email.trim().toLowerCase() === email)
    const stamp = new Date().toISOString()
    for (const lead of matches) {
      if (!lead.unsubscribedAt) {
        await setCell(lead.rowNumber, 'Q', stamp)
      }
    }
    console.log('[unsubscribe] ok', email, 'rows:', matches.length)
    // ok even when no rows matched — the address is not subscribed either way
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[unsubscribe] failed', err)
    return NextResponse.json({ ok: false, error: 'unsubscribe_failed' }, { status: 500 })
  }
}
