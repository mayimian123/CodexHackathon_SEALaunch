"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { PACKAGING_TABS, PACKAGING_OUTPUT } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";

function Typewriter({ text }: { text: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(0);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= text.length) clearInterval(id);
    }, 20);
    return () => clearInterval(id);
  }, [text]);
  return <>{text.slice(0, count)}</>;
}

function dot(status: string) {
  if (status === "complete") return "bg-go";
  if (status === "running") return "bg-orange";
  return "bg-ink-faint/40";
}

export default function StudioPage() {
  const router = useRouter();
  const [active, setActive] = useState("title");
  const p = useAppStore((s) => s.packaging) ?? PACKAGING_OUTPUT;

  return (
    <div className="grid min-h-[70vh] grid-cols-[200px_1fr]">
      {/* Sidebar tabs */}
      <div className="border-r hairline bg-ivory-deep py-4">
        <p className="px-4 font-mono text-[8px] font-semibold uppercase tracking-[0.2em] text-ink-faint mb-3">
          Mini Desk Vacuum
        </p>
        {PACKAGING_TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`flex w-full items-center gap-2 px-4 py-2 text-[10px] ${
              active === t.id
                ? "border-l-2 border-orange bg-surface font-semibold text-ink"
                : "text-ink-soft"
            }`}
          >
            <span className={`h-[5px] w-[5px] shrink-0 rounded-full ${dot(t.status)}`} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Canvas */}
      <div className="bg-surface px-8 py-7">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-4"
          >
            <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.2em] text-orange">
              Shopee Title · Generated
            </p>
            <h2 className="font-display text-xl font-semibold leading-tight text-ink">
              <Typewriter text={p.localizedShopeeTitle} />
            </h2>
            <p className="font-mono text-[9px] text-ink-faint">
              {p.titleCharCount} chars · SEO optimized · Shopee SG compliant
            </p>

            <div className="border-t hairline pt-3.5">
              <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.2em] text-orange mb-2.5">
                Selling Points
              </p>
              {p.sellingPoints.map((pt, i) => (
                <div key={i} className="flex gap-2.5 items-baseline mb-1.5">
                  <span className="font-mono text-[9px] text-ink-faint">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[11px] text-ink-soft leading-snug">{pt}</span>
                </div>
              ))}
            </div>

            <div className="border-t hairline pt-3.5">
              <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.2em] text-orange mb-2">
                Image Direction
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  ["Main Image", p.heroImageDirection],
                  ["Lifestyle", p.lifestyleImageDirection],
                  ["Feature", p.featureImageDirection],
                ].map(([label, dir], i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.08, duration: 0.3 }}
                    className="flex aspect-square items-center justify-center rounded-md bg-ivory-deep p-2 text-center"
                  >
                    <span className="font-mono text-[8px] text-ink-faint">
                      {label}
                      <br />
                      {dir}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            <button
              onClick={() => router.push("/app/listing")}
              className="mt-2 self-start bg-ink px-5 py-2.5 font-display text-xs font-black text-white"
            >
              Generate Shopee Listing →
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
