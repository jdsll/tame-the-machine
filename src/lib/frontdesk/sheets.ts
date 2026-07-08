// Google Sheets access for Front Desk AI (call delivery + onboarding).
// Reuses the assessment module's service-account client (same GOOGLE_SHEETS_* env).
import { getSheetsClient } from '@/lib/assessment/sheets'

export const CLIENTS_TAB = 'FrontDeskClients'
export const CALLS_TAB = 'FrontDeskCalls'
export const BOOKINGS_TAB = 'FrontDeskBookings'

// FrontDeskBookings columns A:H
export const BOOKINGS_HEADER = [
  'timestamp',
  'business_name',
  'phone_number_id',
  'caller_name',
  'caller_phone',
  'address',
  'issue',
  'preferred_window',
]

// FrontDeskClients columns A:J
export const CLIENTS_HEADER = [
  'phone_number_id',
  'business_name',
  'owner_email',
  'owner_cell',
  'oncall_phone',
  'plan',
  'active',
  'status',
  'created_at',
  'stripe_customer_id',
]

// FrontDeskCalls columns A:J
export const CALLS_HEADER = [
  'timestamp',
  'business_name',
  'phone_number_id',
  'caller_number',
  'duration_seconds',
  'ended_reason',
  'urgency',
  'appointment_booked',
  'summary',
  'cost',
]

export type FrontDeskClient = {
  rowNumber: number // 1-based sheet row
  phoneNumberId: string
  businessName: string
  ownerEmail: string
  ownerCell: string
  onCallPhone: string
  plan: string
  active: boolean
  status: string
}

export type CallRecord = {
  timestamp: string
  businessName: string
  phoneNumberId: string
  callerNumber: string
  durationSeconds: number
  endedReason: string
  urgency: string
  appointmentBooked: boolean
  summary: string
  cost: number
}

export type BookingRecord = {
  timestamp: string
  businessName: string
  phoneNumberId: string
  callerName: string
  callerPhone: string
  address: string
  issue: string
  preferredWindow: string
}

export type NewClient = {
  phoneNumberId?: string
  businessName?: string
  ownerEmail: string
  ownerCell?: string
  onCallPhone?: string
  plan?: string
  active?: boolean
  status?: string
  stripeCustomerId?: string
}

function truthy(v: unknown): boolean {
  const s = String(v ?? '').trim().toLowerCase()
  return s === 'true' || s === 'yes' || s === '1' || s === 'y'
}

// Read all client rows, skipping the header (detected by the literal header value).
export async function readClients(): Promise<FrontDeskClient[]> {
  const { sheets, sheetId } = getSheetsClient()
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${CLIENTS_TAB}!A:J`,
  })
  const rows = res.data.values ?? []
  const clients: FrontDeskClient[] = []
  rows.forEach((row, i) => {
    const phoneNumberId = String(row[0] ?? '').trim()
    // Skip header / blank rows
    if (!phoneNumberId || phoneNumberId === 'phone_number_id') return
    clients.push({
      rowNumber: i + 1,
      phoneNumberId,
      businessName: String(row[1] ?? ''),
      ownerEmail: String(row[2] ?? ''),
      ownerCell: String(row[3] ?? ''),
      onCallPhone: String(row[4] ?? ''),
      plan: String(row[5] ?? ''),
      active: truthy(row[6]),
      status: String(row[7] ?? ''),
    })
  })
  return clients
}

export async function getClientByPhoneNumberId(
  id: string,
): Promise<FrontDeskClient | null> {
  if (!id) return null
  const clients = await readClients()
  return clients.find((c) => c.phoneNumberId === id) ?? null
}

export async function appendClient(client: NewClient): Promise<void> {
  const { sheets, sheetId } = getSheetsClient()
  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: `${CLIENTS_TAB}!A:J`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [[
        client.phoneNumberId ?? '',
        client.businessName ?? '',
        client.ownerEmail,
        client.ownerCell ?? '',
        client.onCallPhone ?? '',
        client.plan ?? '',
        client.active === true ? 'TRUE' : 'FALSE',
        client.status ?? '',
        new Date().toISOString(),
        client.stripeCustomerId ?? '',
      ]],
    },
  })
}

export async function appendCall(call: CallRecord): Promise<void> {
  const { sheets, sheetId } = getSheetsClient()
  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: `${CALLS_TAB}!A:J`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [[
        call.timestamp,
        call.businessName,
        call.phoneNumberId,
        call.callerNumber,
        call.durationSeconds,
        call.endedReason,
        call.urgency,
        call.appointmentBooked ? 'TRUE' : 'FALSE',
        call.summary,
        call.cost,
      ]],
    },
  })
}

export async function appendBooking(booking: BookingRecord): Promise<void> {
  const { sheets, sheetId } = getSheetsClient()
  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: `${BOOKINGS_TAB}!A:H`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [[
        booking.timestamp,
        booking.businessName,
        booking.phoneNumberId,
        booking.callerName,
        booking.callerPhone,
        booking.address,
        booking.issue,
        booking.preferredWindow,
      ]],
    },
  })
}

// Read all call rows, skipping the header.
export async function readCalls(): Promise<CallRecord[]> {
  const { sheets, sheetId } = getSheetsClient()
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${CALLS_TAB}!A:J`,
  })
  const rows = res.data.values ?? []
  const calls: CallRecord[] = []
  rows.forEach((row) => {
    const timestamp = String(row[0] ?? '').trim()
    if (!timestamp || timestamp === 'timestamp' || Number.isNaN(Date.parse(timestamp))) return
    calls.push({
      timestamp,
      businessName: String(row[1] ?? ''),
      phoneNumberId: String(row[2] ?? ''),
      callerNumber: String(row[3] ?? ''),
      durationSeconds: Number(row[4] ?? 0) || 0,
      endedReason: String(row[5] ?? ''),
      urgency: String(row[6] ?? ''),
      appointmentBooked: truthy(row[7]),
      summary: String(row[8] ?? ''),
      cost: Number(row[9] ?? 0) || 0,
    })
  })
  return calls
}

// Create the two tabs with header rows if they don't already exist.
// Returns which tabs were created. Safe to run repeatedly (idempotent).
export async function ensureTabs(): Promise<{ created: string[]; existing: string[] }> {
  const { sheets, sheetId } = getSheetsClient()
  const meta = await sheets.spreadsheets.get({ spreadsheetId: sheetId })
  const existingTitles = new Set(
    (meta.data.sheets ?? []).map((s) => s.properties?.title).filter(Boolean) as string[],
  )

  const wanted: { title: string; header: string[] }[] = [
    { title: CLIENTS_TAB, header: CLIENTS_HEADER },
    { title: CALLS_TAB, header: CALLS_HEADER },
    { title: BOOKINGS_TAB, header: BOOKINGS_HEADER },
  ]

  const created: string[] = []
  const existing: string[] = []

  const toCreate = wanted.filter((w) => !existingTitles.has(w.title))
  for (const w of wanted) {
    if (existingTitles.has(w.title)) existing.push(w.title)
  }

  if (toCreate.length > 0) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: sheetId,
      requestBody: {
        requests: toCreate.map((w) => ({ addSheet: { properties: { title: w.title } } })),
      },
    })
    // Write header rows
    for (const w of toCreate) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: `${w.title}!A1`,
        valueInputOption: 'RAW',
        requestBody: { values: [w.header] },
      })
      created.push(w.title)
    }
  }

  return { created, existing }
}
