import { NextRequest, NextResponse } from 'next/server'
import { ensureTabs } from '@/lib/frontdesk/sheets'

export const runtime = 'nodejs'

// One-time (idempotent) setup: creates the FrontDeskClients and FrontDeskCalls
// tabs with header rows if they don't exist. Guard with CRON_SECRET.
//   curl -H "Authorization: Bearer $CRON_SECRET" https://.../api/frontdesk/setup
// or POST with ?secret=$CRON_SECRET
function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  if (req.headers.get('authorization') === `Bearer ${secret}`) return true
  return req.nextUrl.searchParams.get('secret') === secret
}

async function handle(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }
  try {
    const result = await ensureTabs()
    return NextResponse.json({ ok: true, ...result })
  } catch (err) {
    console.error('[frontdesk/setup] ensureTabs failed', err)
    return NextResponse.json({ ok: false, error: 'setup_failed' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  return handle(req)
}

export async function GET(req: NextRequest) {
  return handle(req)
}
