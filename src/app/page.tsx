import Hero from '@/components/home/hero'
import StatsBar from '@/components/home/stats-bar'
import Problem from '@/components/home/problem'
import HowItWorks from '@/components/home/how-it-works'
import WhoItsFor from '@/components/home/who-its-for'
import AuditCta from '@/components/home/audit-cta'
import About from '@/components/home/about'

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <Problem />
      <HowItWorks />
      <WhoItsFor />
      <AuditCta />
      <About />
    </>
  )
}
