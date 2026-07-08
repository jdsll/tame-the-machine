// SMS sending — single swap point.
// Today it only logs (pre-Telnyx). When Telnyx (or Twilio) is wired up, replace
// the body of sendSms() with the real API call; nothing else in the app changes.

export type SmsResult = { ok: boolean; provider: string; id?: string }

export async function sendSms(to: string, body: string): Promise<SmsResult> {
  // TODO(Telnyx): POST https://api.telnyx.com/v2/messages with
  //   { from: process.env.TELNYX_FROM_NUMBER, to, text: body }
  //   Authorization: Bearer process.env.TELNYX_API_KEY
  if (!to) {
    console.warn('[frontdesk/sms] no destination number — skipped')
    return { ok: false, provider: 'stub' }
  }
  console.log('[frontdesk/sms] STUB — would send SMS', { to, body })
  return { ok: true, provider: 'stub' }
}
