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
  const saCreds = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
    ? JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON)
    : null
  const clientEmail = saCreds?.client_email ?? process.env.GOOGLE_SHEETS_CLIENT_EMAIL ?? ''
  const privateKey = saCreds?.private_key ??
    (process.env.GOOGLE_SHEETS_PRIVATE_KEY ?? '').trim().replace(/\\n/g, '\n').replace(/\r/g, '')
  const auth = new google.auth.JWT(
    clientEmail,
    undefined,
    privateKey,
    ['https://www.googleapis.com/auth/spreadsheets'],
  )
  const sheets = google.sheets({ version: 'v4', auth })
  const top3Gaps = sub.result.tags.gaps.slice(0, 3).join(', ')
  const q6TopOutcome = sub.answers.q6.length > 0 ? sub.answers.q6[0].id : ''

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEETS_ID,
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
}
