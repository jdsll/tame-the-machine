// Nurture sequence copy. Same single-seam pattern as content.ts.
// Voice: personal, plain, signed by Jeff. These render as near-plain-text emails
// on purpose; the designed email is the day-0 results email.
// Style rules: no em-dashes, no invented stats or hour counts, no capacity
// framing, no "it's not X, it's Y" lines. Write it the way Jeff would type it.
// DRAFT: Jeff reviews before the cron goes live.

import { gapShortLabels } from './content'

// ── Stage 1 (day 2): the quick win for their #1 gap ──────────────────────────

export const stage1Subjects: Record<string, string> = {
  admin_overload:      'The email you keep rewriting',
  lead_response_gap:   'The lead you lost while you were working',
  followup_gap:        'The follow-up that never got sent',
  content_bottleneck:  'One idea, a week of content',
  delivery_bottleneck: 'The busywork around the real work',
  data_fragmented:     'Copying between tools',
  reporting_overhead:  'The report you build every week',
  tool_sprawl:         'You shouldn’t be the glue',
  no_sops:             'Get it out of your head',
  low_ai_confidence:   'Start with one small task',
}
export const stage1SubjectFallback = 'The first thing I’d automate for you'

// Short quick wins, one per gap tag. Concrete first step, no pitch.
export const stage1QuickWins: Record<string, string> = {
  admin_overload:
    'Pick the one email you rewrite most often. Maybe it’s the quote reply, the scheduling back-and-forth, or the “here’s what happens next” note. Turn it into a template that AI fills in with each customer’s details. It takes an afternoon to set up, and you’ll notice the difference the first week.',
  lead_response_gap:
    'Set up a missed-call text-back. When you can’t pick up, the caller gets a text right away that answers the basic question and gives them a link to book. The faster a lead hears back, the more likely they book with you instead of the next name on their list.',
  followup_gap:
    'Write your follow-up messages once: the second, third, and fourth touch. Then let automation send them until the lead replies. Manual follow-up usually stops after one or two tries, and plenty of deals close after that. Those people already raised their hand. Someone just has to keep the conversation going.',
  content_bottleneck:
    'Stop starting from a blank page. Record yourself talking through one client problem for five minutes, then have AI turn the transcript into a post, a few short clips, and an email. You’ll still edit it, but editing goes a lot faster than writing.',
  delivery_bottleneck:
    'Leave the actual work alone and automate the stuff around it. Status updates, “we’re on schedule” notes, and project recaps can be drafted straight from your project tool. Clients hear from you more often, and you spend less time writing those notes.',
  data_fragmented:
    'Pick the two tools you copy between the most and connect only those two. One connection, one direction, nothing fancy. Once a record shows up where it belongs without you touching it, you’ll start to see how much time the copying was eating.',
  reporting_overhead:
    'Automate one report. The weekly numbers you pull together by hand can be gathered automatically and sent to you as a short written summary. Once that one is working and you trust it, the next report follows the same pattern.',
  tool_sprawl:
    'Write down the copy-and-paste jobs you do between tools every week, then automate the most annoying one. You keep the tools you already use. You just stop being the thing that connects them.',
  no_sops:
    'Next time you do a recurring task, record your screen and talk through what you’re doing. AI can turn that recording into a step-by-step SOP in a few minutes. Do one a week, and after a month a lot of what lives in your head will be written down. That also makes it much easier to automate later.',
  low_ai_confidence:
    'Pick one task you do every week and let AI take the first pass. Treat what it gives you as a rough draft. You review it, fix it, and send it. A few weeks of that will tell you more about what AI is good at, and where it falls short, than any course will.',
}

export function stage1Subject(topGap: string): string {
  return stage1Subjects[topGap] ?? stage1SubjectFallback
}

export function gapLabel(tag: string): string {
  return gapShortLabels[tag] ?? tag.replace(/_/g, ' ')
}

// ── Stage 2 (day 6): proof. I automated my own businesses first ──────────────

export const stage2Subject = 'I was my own first client'

export const stage2Paragraphs = [
  'Before I built automations for anyone else, I built them for myself. I was running a solar consulting business and a winemaking operation at the same time, and the admin was burying me. Quotes, follow-ups, scheduling, reports, and the same emails over and over.',
  'So I started automating my own work. Follow-ups that used to slip started going out on their own. My weekly numbers showed up as a short written summary instead of a spreadsheet I had to build by hand. I got my evenings back before I ever offered this to a client.',
  'The assessment you took works the same way. It scored your answers, wrote your report, emailed it to you, and logged everything on my end. If your timeline was short, it flagged you for me too. Nobody did any of that by hand.',
  'If you’re wondering what that would look like in your business, hit reply and tell me the one task you’re most sick of doing. I read every reply myself.',
]

// ── Stage 3 (day 10): the invite. Direct for HOT/WARM, soft for COLD ─────────

export const stage3SubjectHot = 'Want to go through it together?'
export const stage3SubjectCold = 'No rush on this'

export const stage3HotParagraphs = [
  'Your assessment answers suggested the timing might be right. The gaps are real, and it didn’t sound like a someday project. So I’ll just ask.',
  'The next step is an audit. It’s a 60 to 90 minute call where we go through how your business runs: how you get customers, how you deliver the work, and how you support people afterward. Within 48 hours you get a one-page report with your 3 to 5 biggest automation opportunities and what each one could be worth. If AI isn’t a good fit for your business, the report will say so.',
  'I normally charge $500 for the audit. Right now it’s free while I take on founding clients.', // PLACEHOLDER price, matches auditValueLine in content.ts
]

export const stage3ColdParagraphs = [
  'This is my last email in this series. I said I wouldn’t fill up your inbox, and I meant it.',
  'From your answers, it sounds like you’re still looking around, and that’s fine. The automation projects I’ve seen go badly were usually rushed. The ones that went well started with an owner who knew their own workflows first.',
  'If things change, say a hire falls through or leads start piling up, the free audit is still there. We’d go through your business together, and you’d get a one-page report on what’s worth automating and what it would save you.',
  'In the meantime, I write about automation on the blog. Either way, thanks for taking the assessment.',
]
