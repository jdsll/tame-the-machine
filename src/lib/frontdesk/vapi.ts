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

// Extract the Vapi phone-number id from any server message, read defensively
// (phoneNumber.id | call.phoneNumberId | message.phoneNumberId).
export function getPhoneNumberId(message: AnyRecord): string {
  const call = asRecord(message.call)
  const phoneNumber = asRecord(message.phoneNumber)
  return firstString(phoneNumber.id, call.phoneNumberId, message.phoneNumberId)
}

export type ToolInvocation = { id: string; name: string; args: AnyRecord }

// Parse the tool calls out of a "tool-calls" server message. Vapi has shipped
// several shapes (toolCallList, toolCalls, toolWithToolCallList); handle all.
export function parseToolCalls(message: AnyRecord): ToolInvocation[] {
  const candidates: unknown[] = []
  if (Array.isArray(message.toolCallList)) candidates.push(...message.toolCallList)
  else if (Array.isArray(message.toolCalls)) candidates.push(...message.toolCalls)
  else if (Array.isArray(message.toolWithToolCallList)) {
    for (const entry of message.toolWithToolCallList) {
      const tc = asRecord(entry).toolCall
      if (tc) candidates.push(tc)
    }
  }

  const out: ToolInvocation[] = []
  for (const raw of candidates) {
    const item = asRecord(raw)
    const fn = asRecord(item.function)
    const id = firstString(item.id, item.toolCallId, fn.id)
    const name = firstString(item.name, fn.name)
    if (!id || !name) continue
    out.push({ id, name, args: parseArgs(item.arguments ?? fn.arguments ?? item.parameters) })
  }
  return out
}

function parseArgs(raw: unknown): AnyRecord {
  if (raw && typeof raw === 'object') return raw as AnyRecord
  if (typeof raw === 'string' && raw.trim()) {
    try {
      const parsed = JSON.parse(raw)
      return parsed && typeof parsed === 'object' ? (parsed as AnyRecord) : {}
    } catch {
      return {}
    }
  }
  return {}
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
  const customer = asRecord(message.customer)
  const callCustomer = asRecord(call.customer)
  const analysis = asRecord(message.analysis)
  const structured = asRecord(analysis.structuredData)
  const artifact = asRecord(message.artifact)

  const phoneNumberId = getPhoneNumberId(message)

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
