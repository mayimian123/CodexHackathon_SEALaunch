"use client";

import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { DEMO_BRIEF } from "@/lib/mock-data";

function Segmented({
  options,
  active,
}: {
  options: string[];
  active: string;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((o) => (
        <span
          key={o}
          className={`cursor-pointer border-b-2 px-2.5 py-1 text-[10px] ${
            o === active
              ? "border-ink font-semibold text-ink"
              : "border-transparent text-ink-soft"
          }`}
        >
          {o}
        </span>
      ))}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-ink-faint">
        {label}
      </span>
      {children}
    </div>
  );
}

export default function BriefPage() {
  const router = useRouter();
  const { loadDemoBrief, startRun } = useAppStore();

  function start() {
    startRun();
    router.push("/app/org-room");
  }
  function demo() {
    loadDemoBrief();
    start();
  }

  return (
    <div>
      <div className="px-14 pt-8 pb-6">
        <h1 className="font-display text-[42px] font-black tracking-tight text-ink mb-1">
          Tell your AI company what to find.
        </h1>
        <p className="font-display text-lg font-light italic text-ink-soft">
          1–2 minutes. Your team starts immediately.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-x-10 gap-y-7 px-14 pb-8">
        <Field label="Target Market">
          <Segmented options={["Singapore", "Malaysia", "Thailand"]} active="Singapore" />
        </Field>
        <Field label="Platform">
          <span className="border-b-2 border-orange py-2 font-mono text-[11px] font-semibold text-orange">
            Shopee ·
          </span>
        </Field>
        <Field label="Product Direction">
          <input
            defaultValue={DEMO_BRIEF.keywords}
            className="border-b-2 hairline bg-transparent py-2 text-sm text-ink outline-none focus:border-orange"
          />
        </Field>
        <Field label="Budget Range">
          <input
            defaultValue={DEMO_BRIEF.budgetRange}
            className="border-b-2 hairline bg-transparent py-2 text-sm text-ink outline-none focus:border-orange"
          />
        </Field>
        <Field label="Margin Target">
          <Segmented options={["20%", "30%", "50%+"]} active="30%" />
        </Field>
        <Field label="Risk Preference">
          <Segmented options={["Conservative", "Balanced", "High-risk"]} active="Balanced" />
        </Field>
      </div>

      <div className="flex items-center justify-between border-t hairline px-14 py-5">
        <button
          onClick={start}
          className="bg-ink px-6 py-2.5 font-display text-sm font-black text-white"
        >
          Start AI Company Run →
        </button>
        <button onClick={demo} className="font-mono text-[10px] text-ink-faint">
          _ Use demo: <span className="text-orange">Mini desk vacuum in Singapore</span>
        </button>
      </div>
    </div>
  );
}
