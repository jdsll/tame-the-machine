# Website Roadmap — tamethemachine.com

_Drafted 2026-07-06. Priorities agreed with Jeff after the agency-site research.
Guiding rule: finish the funnel before widening the site. Single conversion path:
homepage → AI Impact Assessment → audit call → build._

## Done

- AI Impact Assessment funnel (scoring, results page, email, Sheets, HOT-lead alerts)
- Assessment bug fixes + readiness score display + tap-order rank UX (shipped `ecfcf28`)
- Three homepage redesign candidates at `/preview/v1..v3` (uncommitted, awaiting Jeff's pick)
  - ICP: $1M–$5M owner-led service businesses; revenue-first messaging; "Upgrade Plan" framing

## Phase 1 — Analytics ✅ (shipped 4bb0499, 2026-07-07)

- [x] `@vercel/analytics` in root layout
- [x] Funnel events: `assessment_started`, `assessment_completed` (segment + heat, no PII)
- [x] Jeff enabled Web Analytics in the Vercel dashboard
- Later, after homepage cutover: CTA click events to compare hero vs final-CTA conversion

## Phase 2 — Email nurture sequence ✅ shipped (2026-10-02)

- [x] Sequence: day 0 results (existed) → day 2 quick win by top gap → day 6 own-work
      proof → day 10 invite (direct for HOT/WARM, soft close for COLD)
- [x] Infra: daily Vercel Cron (16:00 UTC) → `/api/nurture-cron` (CRON_SECRET auth,
      `?dryRun=1` mode) reads the Sheet, sends via Resend, stamps columns N/O/P.
      Leads >21 days old never-nurtured are marked `skipped:stale`; mid-sequence leads
      stop after 30 days. Max 50 sends/run.
- [x] Unsubscribe: HMAC-tokenized `/unsubscribe` confirm page + POST-only API (column Q),
      List-Unsubscribe one-click headers, link added to results email too
- [x] Sends from `Jeff Restel <jeff@send.tamethemachine.com>` (verified Resend domain),
      replies to jeff@tamethemachine.com
- [x] Unit tests on due-logic + tokens; verified live end-to-end locally
- [x] Jeff approved copy 2026-10-02 after a de-AI pass (no em-dashes, no invented stats)
- [x] `CRON_SECRET` + `UNSUBSCRIBE_SECRET` set in Vercel env

## Phase 3 — Homepage cutover ✅ shipped (2026-10-02)

- [x] Jeff picked the letter layout (V4) on 2026-09-15; promoted to `/`, copy seam in
      `src/lib/home-content.ts`
- [x] Nav + footer CTAs point to the assessment; Google Form link removed; preview
      routes deleted
- [ ] "What a build looks like" section parked in `home-content.ts` until real case
      studies ship
- [x] $500 audit anchor confirmed by Jeff 2026-10-02 (`auditValueLine` in content.ts)

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

## Audit monetization (decided 2026-07-08)

- **Model:** paid audit, **100% credited toward the build** if the lead proceeds.
  Target price ~$500 (PLACEHOLDER — Jeff confirms; `auditValueLine` in
  `src/lib/assessment/content.ts` is the single copy seam).
- **Now:** audit stays free but is value-anchored everywhere — "Normally $500 — free
  while I take on founding clients" (results page, results email, stage-3 HOT nurture).
- **Flip trigger:** 2–3 real case studies / testimonials from completed builds.
- **At flip time:** change `auditValueLine` to the paid line ("$500, credited in full
  toward your build"), add a Stripe Payment Link on the /audit page (Phase 4), update
  stage-3 nurture, and add the same anchor to whichever homepage variant shipped
  (offer cards in `src/components/preview/shared.ts` if pre-cutover).
- **Rationale:** free assessment gives the prioritized "first three moves" plan (the
  20-minute version); the audit is positioned as the 90-minute Three Engines version —
  free value earns the authority, the anchor sets the price expectation before the flip.

## Explicitly not doing (for now)

- On-site AI chatbot (trust risk if mediocre; assessment already demos the craft)
- Client portal, gated content, community features (wrong stage; dilutes the funnel)
