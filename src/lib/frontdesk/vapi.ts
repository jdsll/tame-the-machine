// Defensive parsing of Vapi "end-of-call-report" server messages.
// Vapi's payload shape has drifted across versions, so every field is read
// from several possible locations and never assumed present.

type AnyRecord = Record<string, unknown>

function asRecord(v: unknown): AnyRecord {
  return v && typeof v === 'object' ? (v as AnyRecord) : {}
}

function firstString(...vals: unknown[]): string {
  for (const v of vals) {
    if (typeof v === 'string' && v.trim()) return v.trim()
    if (typeof v === 'number' && Number.isFinite(v)) return String(v)
  }
  return ''
}

function firstNumber(...vals: unknown[]): number {
  for (const v of vals) {
    if (typeof v === 'number' && Number.isFinite(v)) return v
    if (typeof v === 'string' && v.trim() && !Number.isNaN(Number(v))) return Number(v)
  }
  return 0
}

function truthyFlag(v: unknown): boolean {
  if (v === true) return true
  const s = String(v ?? '').trim().toLowerCase()
  return s === 'true' || s === 'yes' || s === '1'
}

export type ParsedCall = {
  phoneNumberId: string
  callerNumber: string
  durationSeconds: number
  endedReason: string
  urgency: string
  isEmergency: boolean
  appointmentBooked: boolean
  oneLineNeed: string
  summary: string
  cost: number
  startedAt: string
}

// message is the `message` object from the Vapi webhook body.
export function parseEndOfCallReport(message: AnyRecord): ParsedCall {
  const call = asRecord(message.call)
  const phoneNumber = asRecord(message.phoneNumber)
  const customer = asRecord(message.customer)
  const callCustomer = asRecord(call.customer)
  const analysis = asRecord(message.analysis)
  const structured = asRecord(analysis.structuredData)
  const artifact = asRecord(message.artifact)

  const phoneNumberId = firstString(phoneNumber.id, call.phoneNumberId, message.phoneNumberId)

  const callerNumber =
    firstString(customer.number, callCustomer.number, message.customerNumber) || 'Unknown'

  // Duration: prefer explicit seconds, then ms, then endedAt - startedAt.
  let durationSeconds = firstNumber(message.durationSeconds, call.durationSeconds)
  if (!durationSeconds) {
    const ms = firstNumber(message.durationMs, call.durationMs)
    if (ms) durationSeconds = Math.round(ms / 1000)
  }
  if (!durationSeconds) {
    const startedAt = firstString(message.startedAt, call.startedAt)
    const endedAt = firstString(message.endedAt, call.endedAt)
    if (startedAt && endedAt) {
      const diff = (Date.parse(endedAt) - Date.parse(startedAt)) / 1000
      if (Number.isFinite(diff) && diff > 0) durationSeconds = Math.round(diff)
    }
  }

  const endedReason = firstString(message.endedReason, call.endedReason) || 'unknown'

  const urgency = firstString(
    structured.urgency,
    structured.priority,
    structured.severity,
  )

  const isEmergency =
    truthyFlag(structured.isEmergency) ||
    truthyFlag(structured.is_emergency) ||
    truthyFlag(structured.emergency) ||
    urgency.toLowerCase() === 'emergency' ||
    urgency.toLowerCase() === 'urgent'

  const appointmentBooked =
    truthyFlag(structured.appointmentBooked) ||
    truthyFlag(structured.appointment_booked) ||
    truthyFlag(structured.booked) ||
    truthyFlag(structured.jobBooked)

  const oneLineNeed =
    firstString(
      structured.oneLineNeed,
      structured.need,
      structured.reason,
      structured.issue,
      structured.summary,
    ) || truncate(firstString(analysis.summary), 60) || 'New call'

  const summary =
    firstString(analysis.summary, message.summary, artifact.transcript) || ''

  const cost = firstNumber(message.cost, call.cost)

  const startedAt = firstString(message.startedAt, call.startedAt) || new Date().toISOString()

  return {
    phoneNumberId,
    callerNumber,
    durationSeconds,
    endedReason,
    urgency: isEmergency && !urgency ? 'emergency' : urgency,
    isEmergency,
    appointmentBooked,
    oneLineNeed,
    summary,
    cost,
    startedAt,
  }
}

function truncate(s: string, n: number): string {
  if (!s) return ''
  return s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s
}
