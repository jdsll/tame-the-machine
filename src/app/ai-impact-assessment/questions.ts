export type QuestionOption = { id: string; text: string }

export type Question = {
  kind: 'single' | 'multi-rank'
  qKey: string
  text: string
  options: QuestionOption[]
}

export const QUESTIONS: Question[] = [
  {
    kind: 'single',
    qKey: 'q1',
    text: 'How often are you using AI tools today?',
    options: [
      { id: 'A', text: 'Not at all' },
      { id: 'B', text: 'Experimented a little' },
      { id: 'C', text: 'ChatGPT/Claude weekly' },
      { id: 'D', text: 'AI daily in real workflows' },
    ],
  },
  {
    kind: 'multi-rank',
    qKey: 'q2',
    text: 'Where are you losing the most time?',
    options: [
      { id: 'A', text: 'Email and admin' },
      { id: 'B', text: 'Sales follow-up' },
      { id: 'C', text: 'Marketing / content' },
      { id: 'D', text: 'Client delivery / fulfillment' },
      { id: 'E', text: 'Reporting / analysis' },
    ],
  },
  {
    kind: 'single',
    qKey: 'q3',
    text: 'How repeatable are your main workflows?',
    options: [
      { id: 'A', text: 'Mostly in my head' },
      { id: 'B', text: 'Some steps documented' },
      { id: 'C', text: 'Most key workflows documented' },
      { id: 'D', text: 'Clear SOPs / checklists' },
    ],
  },
  {
    kind: 'single',
    qKey: 'q4',
    text: 'What happens when a new lead or request comes in?',
    options: [
      { id: 'A', text: 'Manual when we can' },
      { id: 'B', text: 'Usually same day' },
      { id: 'C', text: 'Templates / checklists' },
      { id: 'D', text: 'Automated routing or follow-up' },
    ],
  },
  {
    kind: 'single',
    qKey: 'q5',
    text: 'What tools / data do you already have?',
    options: [
      { id: 'A', text: 'Email / docs / spreadsheets' },
      { id: 'B', text: 'CRM or PM tool' },
      { id: 'C', text: 'Several tools but not connected' },
      { id: 'D', text: 'Integrated systems with clean data' },
    ],
  },
  {
    kind: 'multi-rank',
    qKey: 'q6',
    text: 'What outcome matters most right now?',
    options: [
      { id: 'A', text: 'Save owner / operator time' },
      { id: 'B', text: 'Respond faster to leads / customers' },
      { id: 'C', text: 'Increase revenue' },
      { id: 'D', text: 'Improve quality / consistency' },
      { id: 'E', text: 'Reduce admin costs' },
    ],
  },
  {
    kind: 'single',
    qKey: 'q7',
    text: 'If the ROI were clear, when would you implement?',
    options: [
      { id: 'A', text: 'Just researching' },
      { id: 'B', text: 'This quarter' },
      { id: 'C', text: 'This month' },
      { id: 'D', text: 'This week' },
    ],
  },
  {
    kind: 'single',
    qKey: 'q8',
    text: 'How big is your team?',
    options: [
      { id: 'A', text: 'Solopreneur' },
      { id: 'B', text: '2–5 employees' },
      { id: 'C', text: '6–10 employees' },
      { id: 'D', text: '11–20 employees' },
      { id: 'E', text: '20+ employees' },
    ],
  },
]
