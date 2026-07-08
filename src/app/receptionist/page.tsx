import type { Metadata } from 'next'
import Hero from '@/components/receptionist/hero'
import PainCalculator from '@/components/receptionist/pain-calculator'
import HowItWorks from '@/components/receptionist/how-it-works'
import DemoCallout from '@/components/receptionist/demo-callout'
import Pricing from '@/components/receptionist/pricing'
import Trust from '@/components/receptionist/trust'
import Faq from '@/components/receptionist/faq'
import FooterCta from '@/components/receptionist/footer-cta'

const title = 'AI Receptionist for Plumbers & HVAC — Never Miss Another Call'
const description =
  'Front Desk AI by Tame the Machine is a 24/7 AI receptionist for plumbing & HVAC companies. It answers missed calls in English and Spanish, books jobs, texts callers back, and emails you a summary of every call. Live in 48 hours.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/receptionist' },
  keywords: [
    'AI receptionist for plumbers',
    'AI receptionist for HVAC',
    'answering service for plumbers',
    'HVAC call answering',
    'missed call text back',
    'bilingual AI receptionist',
    '24/7 answering service HVAC',
  ],
  openGraph: {
    type: 'website',
    url: '/receptionist',
    title,
    description,
    siteName: 'Tame the Machine',
    images: [{ url: '/assets/og-default.svg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
}

export default function ReceptionistPage() {
  return (
    <>
      <Hero />
      <PainCalculator />
      <HowItWorks />
      <DemoCallout />
      <Pricing />
      <Trust />
      <Faq />
      <FooterCta />
    </>
  )
}
