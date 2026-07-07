# Website Roadmap — tamethemachine.com

_Drafted 2026-07-06. Priorities agreed with Jeff after the agency-site research.
Guiding rule: finish the funnel before widening the site. Single conversion path:
homepage → AI Impact Assessment → audit call → build._

## Done

- AI Impact Assessment funnel (scoring, results page, email, Sheets, HOT-lead alerts)
- Assessment bug fixes + readiness score display + tap-order rank UX (shipped `ecfcf28`)
- Three homepage redesign candidates at `/preview/v1..v3` (uncommitted, awaiting Jeff's pick)
  - ICP: $1M–$5M owner-led service businesses; revenue-first messaging; "Upgrade Plan" framing

## Phase 1 — Analytics (now)

Vercel Web Analytics + custom funnel events, so the redesign and everything after
it is judged on data, not taste.

- [ ] `@vercel/analytics` in root layout
- [ ] Funnel events: `assessment_started`, `assessment_completed` (segment + heat as
      props — never email/PII)
- [ ] Jeff: enable Web Analytics on the project in the Vercel dashboard
- Later, after homepage cutover: CTA click events to compare hero vs final-CTA conversion

## Phase 2 — Email nurture sequence (this week)

The biggest gap: scored, segmented leads currently get exactly one email.

- 4-email sequence, personalized by segment/gaps/heat from the assessment:
  1. Day 0 — results recap (exists)
  2. Day 2–3 — the one quick win for their top gap
  3. Day 6–7 — relevant case study / own-work proof
  4. Day 10–12 — soft audit invite (HOT/WARM leads get a more direct version)
- Infra: Vercel Cron route (daily) reads the leads Sheet, sends due emails via Resend,
  marks sent-state back to the Sheet. No new database needed.
- Needs from Jeff: copy approval per email; unsubscribe link decision (do it here —
  replaces "reply to opt out")

## Phase 3 — Homepage cutover

- Jeff picks V1/V2/V3 (or a mix); promote to `/`, rewire nav + footer CTAs to the
  assessment, delete the Google Form dependency, drop preview routes
- Replace placeholder proof/case/pricing/capacity numbers with real ones first

## Phase 4 — /audit page

- On-site page replacing the external Calendly link: what happens on the call,
  what you leave with, Three Engines framing, embedded Calendly, FAQ snippet

## Phase 5 — ROI / cost-of-waiting calculator

- "What does a 4-hour lead response cost you per month?" — sliders for lead volume,
  close rate, job value. Second interactive demo; none of the surveyed competitors
  have one. Feeds the same email capture.

## Phase 6 — Real case studies + testimonial engine

- One page per shipped client build, one hard number each
- Post-build automation that asks the client for a quote/result while it's fresh

## Explicitly not doing (for now)

- On-site AI chatbot (trust risk if mediocre; assessment already demos the craft)
- Client portal, gated content, community features (wrong stage; dilutes the funnel)
