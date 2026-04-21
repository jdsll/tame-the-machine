'use client'

import { motion } from 'framer-motion'

export default function About() {
  return (
    <section id="about" className="py-[100px] bg-surface max-sm:py-[72px]">
      <div className="max-w-[1080px] mx-auto px-6">
        <div className="grid grid-cols-[1fr_1.4fr] gap-20 items-center max-sm:grid-cols-1 max-sm:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7 }}
            className="border border-[var(--border)] p-11 bg-card"
          >
            <div className="font-display text-[20px] font-bold mb-2">Jeffrey H. Restel</div>
            <div className="text-[14px] text-accent mb-6 leading-[1.7]">
              Energy Consultant · Winemaker · AI Builder
              <br />
              Healdsburg, CA
            </div>
            <p className="text-[15px] text-muted leading-[1.8]">
              I didn&apos;t come from tech. I came from running businesses — solar consulting and
              winemaking — where I had to solve my own automation problems. That means I understand
              your workflow at a business level before I ever write a line of code.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <div className="font-display text-[11px] tracking-[4px] uppercase text-accent mb-5">
              The Difference
            </div>
            <h2 className="font-display text-[clamp(24px,3.5vw,40px)] font-bold leading-[1.25] mb-5">
              Business fluency meets technical depth
            </h2>
            <p className="text-[17px] text-muted max-w-[600px] leading-[1.8] mb-8">
              Most AI consultants are either developers who don&apos;t understand your business, or
              business coaches who can&apos;t build anything. I do both — I can walk into your
              office, understand the problem, then go home and build the solution.
            </p>
            <blockquote className="border-l-[3px] border-accent pl-7">
              <p className="text-[18px] italic text-content leading-[1.7]">
                &ldquo;I help small service businesses identify where AI can save them 5–10 hours
                per week — then I build it for them.&rdquo;
              </p>
            </blockquote>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
