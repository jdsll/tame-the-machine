import { google, type sheets_v4 } from 'googleapis'
import { BUDGET_LABELS, type AssessmentAnswers, type AssessmentResult } from './scoring-data'

// Sheet1 column map (A:Q)
// A submittedAt | B email | C firstName | D segment | E heat | F leadValueTier
// G top3Gaps | H hrsPerEmployee | I hrsTeamTotal | J revenueCallouts | K q6TopOutcome
// L emailVariant | M answersJson | N nurture1SentAt | O nurture2SentAt
// P nurture3SentAt | Q unsubscribedAt | R budget

export type SheetSubmission = {
  answers: AssessmentAnswers
  result: AssessmentResult
  email: string
  firstName: string
  submittedAt: string
}

export type LeadRow = {
  rowNumber: number // 1-based sheet row number
  submittedAt: string
  email: string
  firstName: string
  segment: string
  heat: string
  top3Gaps: string[]
  emailVariant: string
  nurture1SentAt: string
  nurture2SentAt: string
  nurture3SentAt: string
  unsubscribedAt: string
}

function getCredentials(): { client_email: string; private_key: string } {
  const saJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  if (saJson) {
    let parsed: { client_email?: string; private_key?: string } = {}
    try {
      parsed = JSON.parse(saJson)
    } catch (err) {
      console.error('[assessment] GOOGLE_SERVICE_ACCOUNT_JSON parse failed — falling back to discrete keys', err)
    }
    return {
      client_email: parsed.client_email ?? process.env.GOOGLE_SHEETS_CLIENT_EMAIL ?? '',
      private_key: parsed.private_key ?? normalizeKey(process.env.GOOGLE_SHEETS_PRIVATE_KEY ?? ''),
    }
  }
  return {
    client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL ?? '',
    private_key: normalizeKey(process.env.GOOGLE_SHEETS_PRIVATE_KEY ?? ''),
  }
}

export function getSheetsClient(): { sheets: sheets_v4.Sheets; sheetId: string } {
  const credentials = getCredentials()
  const sheetId = (process.env.GOOGLE_SHEETS_ID ?? '').trim()
  if (!credentials.client_email || !credentials.private_key || !sheetId) {
    throw new Error(
      `[assessment] missing sheets credentials: email=${!!credentials.client_email} key=${!!credentials.private_key} sheetId=${!!sheetId}`,
    )
  }
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
  return { sheets: google.sheets({ version: 'v4', auth }), sheetId }
}

export async function appendRow(sub: SheetSubmission): Promise<void> {
  const { sheets, sheetId } = getSheetsClient()
  const top3Gaps = sub.result.tags.gaps.slice(0, 3).join(', ')
  const q6TopOutcome = sub.answers.q6.length > 0 ? sub.answers.q6[0].id : ''

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Sheet1!A:R',
      valueInputOption: 'RAW',
      requestBody: {
        values: [[
          sub.submittedAt,
          sub.email,
          sub.firstName,
          sub.result.segment,
          sub.result.heat,
          sub.result.leadValueTier,
          top3Gaps,
          sub.result.hours.perEmployee,
          sub.result.hours.teamTotal,
          sub.result.revenueCallouts.join(', '),
          q6TopOutcome,
          sub.result.emailVariant,
          JSON.stringify(sub.answers),
          '', // N nurture1SentAt
          '', // O nurture2SentAt
          '', // P nurture3SentAt
          '', // Q unsubscribedAt
          BUDGET_LABELS[sub.result.budgetBand], // R budget
        ]],
      },
    })
    console.log('[assessment] sheets append ok — sheetId:', sheetId, 'email:', sub.email)
  } catch (err: unknown) {
    const e = err as { code?: number; errors?: unknown[]; response?: { data: unknown } }
    console.error('[assessment] sheets.append failed', {
      code: e.code,
      errors: e.errors,
      data: e.response?.data,
    })
    throw err
  }
}

// Read all lead rows (skips the header if present — detected by non-ISO first cell)
export async function readLeads(): Promise<LeadRow[]> {
  const { sheets, sheetId } = getSheetsClient()
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Sheet1!A:Q',
  })
  const rows = res.data.values ?? []
  const leads: LeadRow[] = []
  rows.forEach((row, i) => {
    const submittedAt = String(row[0] ?? '')
    const email = String(row[1] ?? '')
    // Skip header row / malformed rows: submittedAt must parse as a date and email must look like one
    if (!email.includes('@') || Number.isNaN(Date.parse(submittedAt))) return
    leads.push({
      rowNumber: i + 1,
      submittedAt,
      email,
      firstName: String(row[2] ?? ''),
      segment: String(row[3] ?? ''),
      heat: String(row[4] ?? ''),
      top3Gaps: String(row[6] ?? '').split(',').map(s => s.trim()).filter(Boolean),
      emailVariant: String(row[11] ?? ''),
      nurture1SentAt: String(row[13] ?? ''),
      nurture2SentAt: String(row[14] ?? ''),
      nurture3SentAt: String(row[15] ?? ''),
      unsubscribedAt: String(row[16] ?? ''),
    })
  })
  return leads
}

// Write a single cell, e.g. setCell(5, 'N', new Date().toISOString())
export async function setCell(rowNumber: number, column: string, value: string): Promise<void> {
  const { sheets, sheetId } = getSheetsClient()
  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: `Sheet1!${column}${rowNumber}`,
    valueInputOption: 'RAW',
    requestBody: { values: [[value]] },
  })
}

function normalizeKey(raw: string): string {
  let key = raw.trim()
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1)
  }
  return key.replace(/\\n/g, '\n').replace(/\r/g, '')
}
