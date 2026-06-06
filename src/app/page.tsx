"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SiteNav } from "@/components/marketing/site-nav";
import { CountUp } from "@/components/primitives/count-up";
import { staggerContainer, staggerItem } from "@/components/primitives/motion";
import { DEPARTMENTS, HOMEPAGE_STATS } from "@/lib/mock-data";
import { FLOW_STEPS } from "@/lib/flow";

export default function Home() {
  return (
    <main className="min-h-screen bg-ivory">
      <SiteNav />

      {/* Hero */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="px-14 pt-20 pb-16"
      >
        <motion.p
          variants={staggerItem}
          className="font-mono text-xs font-medium uppercase tracking-[0.3em] text-orange mb-8"
        >
          Shopee Singapore · Built for one seller
        </motion.p>
        <motion.h1
          variants={staggerItem}
          className="font-display text-[96px] leading-[0.9] font-black tracking-[-0.03em] text-ink mb-10"
        >
          Zero-person
          <br />
          company.
          <br />
          <span className="font-light italic text-orange">Endless</span> profit.
        </motion.h1>
        <motion.div
          variants={staggerItem}
          className="flex items-end justify-between gap-10"
        >
          <p className="font-display text-[22px] font-light italic leading-relaxed text-ink-soft max-w-xl">
            An entire AI commerce company — market, sourcing, margin, risk and
            listing — working a{" "}
            <span className="not-italic font-semibold text-ink">
              single seller&apos;s
            </span>{" "}
            Shopee store. No team. No agency. No payroll.
          </p>
          <div className="flex flex-col items-end gap-3.5 shrink-0">
            <Link
              href="/app/brief"
              className="flex items-center gap-3 rounded-full bg-orange px-8 py-[18px] text-base font-bold text-white"
            >
              Build my AI commerce team →
            </Link>
            <span className="font-mono text-[12px] text-ink-faint">
              _ or watch a 90-second launch
            </span>
          </div>
        </motion.div>
      </motion.section>

      {/* Money band */}
      <section className="grid grid-cols-4 bg-ink px-14 py-12">
        {HOMEPAGE_STATS.map((s, i) => (
          <div
            key={i}
            className="border-r border-white/10 pr-9 last:border-r-0 last:pr-0"
          >
            <div className="font-display text-[56px] font-black leading-none tracking-tight text-white mb-3">
              <CountUp
                value={s.value}
                prefix={s.prefix}
                suffix={s.suffix}
                decimals={s.decimals ?? 0}
              />
            </div>
            <div className="font-mono text-[12px] leading-relaxed text-white/50">
              {s.label}
              <br />
              <span className="text-orange">{s.sub}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Departments */}
      <section className="px-14 py-16">
        <div className="flex items-baseline justify-between mb-10">
          <h2 className="font-display text-[42px] font-black tracking-tight text-ink">
            Six departments. <span className="font-light italic text-orange">One run.</span>
          </h2>
          <span className="font-mono text-[12px] uppercase tracking-widest text-ink-faint">
            AI Commerce Company
          </span>
        </div>
        <div>
          {DEPARTMENTS.filter((d) => d.id !== "committee").map((d, i) => (
            <div
              key={d.id}
              className="group flex items-center gap-8 border-t hairline py-6 last:border-b"
            >
              <span className="font-mono text-sm text-ink-faint w-9">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-[30px] font-semibold tracking-tight text-ink w-60 transition-colors group-hover:text-orange">
                {d.shortName}
              </span>
              <span className="font-display text-[19px] font-light italic text-ink-soft flex-1">
                {d.question}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Flow strip */}
      <section className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t hairline px-14 py-10">
        {["Seller Brief", "AI Commerce Co.", "Opportunity Board", "Packaging Studio", "Shopee-ready Launch Pack"].map(
          (label, i, arr) => (
            <span key={label} className="flex items-center gap-4">
              <span
                className={`font-mono text-[12px] font-medium tracking-wide ${
                  i === 1 || i === arr.length - 1 ? "text-orange" : "text-ink"
                }`}
              >
                {label}
              </span>
              {i < arr.length - 1 && <span className="text-ink-faint">→</span>}
            </span>
          ),
        )}
      </section>

      {/* Footer CTA */}
      <section className="border-t hairline px-14 py-20 text-center">
        <h2 className="font-display text-[52px] font-black tracking-tight text-ink mb-6">
          Your team is <span className="font-light italic text-orange">ready</span>.
        </h2>
        <Link
          href="/app/brief"
          className="inline-flex rounded-full bg-orange px-8 py-[18px] text-base font-bold text-white"
        >
          Build my AI commerce team →
        </Link>
        <p className="font-mono text-[11px] text-ink-faint mt-6">
          {FLOW_STEPS.length} steps · Shopee Singapore · English
        </p>
      </section>
    </main>
  );
}
