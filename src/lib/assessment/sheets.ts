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
  const privateKey = (process.env.GOOGLE_SHEETS_PRIVATE_KEY ?? '').replace(/\\n/g, '\n')
  const auth = new google.auth.JWT(
    process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
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
