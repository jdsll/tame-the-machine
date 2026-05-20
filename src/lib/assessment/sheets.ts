import { google } from 'googleapis'
import type { AssessmentAnswers, AssessmentResult } from './scoring-data'

export type SheetSubmission = {
  answers: AssessmentAnswers
  result: AssessmentResult
  email: string
  firstName: string
  submittedAt: string
}

export async function appendRow(sub: SheetSubmission): Promise<void> {
  // Parse service account credentials — prefer the JSON blob, fall back to discrete vars
  let credentials: { client_email: string; private_key: string }
  const saJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  if (saJson) {
    let parsed: { client_email?: string; private_key?: string } = {}
    try {
      parsed = JSON.parse(saJson)
    } catch (err) {
      console.error('[assessment] GOOGLE_SERVICE_ACCOUNT_JSON parse failed — falling back to discrete keys', err)
    }
    credentials = {
      client_email: parsed.client_email ?? process.env.GOOGLE_SHEETS_CLIENT_EMAIL ?? '',
      private_key: parsed.private_key ?? normalizeKey(process.env.GOOGLE_SHEETS_PRIVATE_KEY ?? ''),
    }
  } else {
    credentials = {
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL ?? '',
      private_key: normalizeKey(process.env.GOOGLE_SHEETS_PRIVATE_KEY ?? ''),
    }
  }

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
  const sheets = google.sheets({ version: 'v4', auth })
  const top3Gaps = sub.result.tags.gaps.slice(0, 3).join(', ')
  const q6TopOutcome = sub.answers.q6.length > 0 ? sub.answers.q6[0].id : ''

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Sheet1!A:O',
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
          '',
          '',
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

function normalizeKey(raw: string): string {
  let key = raw.trim()
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1)
  }
  return key.replace(/\\n/g, '\n').replace(/\r/g, '')
}
