# Setup Guide — AI Impact Assessment

Steps to configure before the `/ai-impact-assessment` form can deliver emails and log submissions.

---

## 1. Resend — result email delivery

1. Sign in (or sign up) at [resend.com](https://resend.com)
2. Go to **Domains** → **Add Domain** → enter `tamethemachine.com`
3. Add the DNS records shown (typically a DKIM TXT record + DMARC TXT record) to your domain registrar. Allow up to 24h for propagation.
4. Once the domain shows **Verified**, go to **API Keys** → **Create API Key**
   - Name: `assessment-prod` (or similar)
   - Permission: **Sending access** only
   - Copy the key — it won't be shown again
5. Add env var: `RESEND_API_KEY=re_...` (see env vars section below)
6. Optionally set the from address: `RESEND_FROM_EMAIL=assessment@tamethemachine.com`
   - This address must be on the verified domain

---

## 2. Google Sheets — lead logging

### 2a. Create the sheet

1. Go to [sheets.google.com](https://sheets.google.com) → **Create new spreadsheet**
2. Title: `AI Impact Assessment — Leads`
3. In row 1, add these exact headers in columns A–O:

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Timestamp | Email | First Name | Segment | Heat | Lead Value Tier | Top Gaps | Per-Employee Hrs | Team Total Hrs | Revenue Callouts | Q6 Top Outcome | Email Variant | Raw Answers JSON | Follow-up Status | Notes |

4. Copy the Sheet ID from the URL: `https://docs.google.com/spreadsheets/d/**SHEET_ID_HERE**/edit`

### 2b. Create a GCP service account

1. Go to [console.cloud.google.com](https://console.cloud.google.com) → project `aios-488915`
2. **IAM & Admin** → **Service Accounts** → **Create Service Account**
   - Name: `assessment-leads`
   - Role: none needed at project level (sheet sharing handles access)
3. Click the new SA → **Keys** tab → **Add Key** → **JSON** → download
4. Open the JSON file and extract:
   - `client_email` (looks like `assessment-leads@aios-488915.iam.gserviceaccount.com`)
   - `private_key` (the long `-----BEGIN PRIVATE KEY-----...` block)

### 2c. Share the sheet

1. Open the Leads sheet in Google Sheets
2. Click **Share** → paste the service account email → set **Editor** → click **Send**

---

## 3. Calendly URL

Drop the Calendly booking URL into `src/lib/assessment/content.ts` — replace `url: '#'` in all five `ctaBlocks` entries (or use variant-specific URLs if desired):

```ts
// Example — replace '#' in each ctaBlocks entry:
time:       { ..., url: 'https://calendly.com/yourname/ai-time-audit' },
response:   { ..., url: 'https://calendly.com/yourname/ai-response-audit' },
revenue:    { ..., url: 'https://calendly.com/yourname/ai-revenue-audit' },
quality:    { ..., url: 'https://calendly.com/yourname/ai-quality-audit' },
efficiency: { ..., url: 'https://calendly.com/yourname/ai-efficiency-audit' },
```

All five can point to the same Calendly URL for v1 — the button text already varies per CTA variant.

---

## 4. Environment variables

### Local development

Copy `.env.local.example` to `.env.local` and fill in all values:

```
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=assessment@tamethemachine.com
GOOGLE_SHEETS_CLIENT_EMAIL=assessment-leads@aios-488915.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_ID=1AbCdEfGhIjKlMnOpQrStUvWxYz
```

**Note on the private key:** The JSON file from GCP contains literal `\n` in the key. Paste the value including the surrounding quotes and `\n` characters — the app replaces `\n` → real newlines at runtime.

### Vercel (Preview + Production)

In your Vercel project settings → **Environment Variables**, add all five keys above. Set them for both **Preview** and **Production** environments.

**The `GOOGLE_SHEETS_PRIVATE_KEY` on Vercel:** Paste the raw private key value *without* outer quotes. Vercel's UI handles quoting. Include the `-----BEGIN PRIVATE KEY-----` header and `-----END PRIVATE KEY-----` footer, and keep the literal `\n` sequences — the app handles the newline replacement.

---

## 5. Verification after setup

Once all env vars are configured locally:

1. Run `npm run dev`
2. Complete the assessment using test profile 1 (all-A answers, any email):
   - Email should arrive within ~30s
   - Leads sheet should gain a new row
3. Complete using test profile 3 (all-D answers):
   - Result email arrives
   - HOT lead alert arrives at `jeff@tamethemachine.com`
   - Sheet row Heat column = HOT

See the verification checklist in `.claude/plans/my-computer-crashed-while-polymorphic-avalanche.md` for the full list.
