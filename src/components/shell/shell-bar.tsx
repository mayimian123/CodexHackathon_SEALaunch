"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FLOW_STEPS, flowKeyForPath } from "@/lib/flow";

export function ShellBar() {
  const pathname = usePathname();
  const activeKey = flowKeyForPath(pathname);
  const activeIndex = FLOW_STEPS.findIndex((s) => s.key === activeKey);

  return (
    <div className="flex items-center justify-between border-b hairline bg-surface px-14 py-3">
      <Link href="/" className="font-display text-lg font-semibold text-ink">
        Sea<span className="italic text-orange">Launch</span> AI
      </Link>
      <div className="flex items-center">
        {FLOW_STEPS.map((step, i) => {
          const state =
            i < activeIndex ? "done" : i === activeIndex ? "active" : "todo";
          const cls =
            state === "done"
              ? "text-go"
              : state === "active"
                ? "text-ink"
                : "text-ink-faint";
          const glyph = state === "done" ? "✓" : state === "active" ? "●" : "○";
          return (
            <span
              key={step.key}
              className={`border-r hairline px-3 font-mono text-[10px] font-semibold tracking-wide last:border-r-0 ${cls}`}
            >
              {glyph} {step.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
