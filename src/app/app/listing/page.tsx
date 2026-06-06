"use client";

import { LISTING } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";
import Link from "next/link";

export default function ListingPage() {
  const l = useAppStore((s) => s.listing) ?? LISTING;
  return (
    <div>
      <div className="grid min-h-[64vh] grid-cols-2">
        {/* Fields */}
        <div className="border-r hairline px-6 py-5">
          <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.2em] text-ink-faint mb-3.5">
            Shopee Listing Fields
          </p>
          {l.fields.map((f) => (
            <div
              key={f.key}
              className="flex items-baseline gap-3 border-b hairline py-1.5"
            >
              <span className="font-mono text-[9px] text-ink-faint w-24 shrink-0">
                {f.key}
              </span>
              <span className="flex-1 text-[11px] leading-snug text-ink">
                {f.value}
              </span>
              <span className="flex gap-2">
                {f.editable && (
                  <span className="cursor-pointer font-mono text-[8px] text-orange">
                    edit
                  </span>
                )}
                <span className="cursor-pointer font-mono text-[8px] text-orange">
                  copy
                </span>
              </span>
            </div>
          ))}
        </div>

        {/* Preview */}
        <div className="bg-ivory px-5 py-5">
          <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.2em] text-ink-faint mb-3">
            Shopee Preview
          </p>
          <div className="mb-2.5 flex h-28 items-center justify-center rounded-md bg-ivory-deep">
            <span className="font-mono text-[8px] text-ink-faint">Main image</span>
          </div>
          <h2 className="font-display text-[15px] font-semibold leading-snug text-ink mb-1">
            {l.preview.title}
          </h2>
          <p className="font-mono text-lg font-semibold text-orange mb-2">
            {l.preview.price}
          </p>
          <div className="flex flex-col gap-1">
            {l.preview.bullets.map((b) => (
              <span key={b} className="flex gap-1.5 items-baseline text-[9px] text-ink-soft">
                <span className="text-orange">·</span>
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex items-center gap-3 border-t hairline bg-ivory px-6 py-3">
        <button className="bg-ink px-3.5 py-1.5 font-display text-[10px] font-black text-white">
          Download Launch Pack
        </button>
        <button className="border-b-[1.5px] border-orange pb-px font-display text-[10px] font-black text-orange">
          Copy JSON
        </button>
        <button className="border-b-[1.5px] border-orange pb-px font-display text-[10px] font-black text-orange">
          Export CSV
        </button>
        <button className="font-mono text-[9px] text-ink-faint">_ Mark as Approved</button>
        <Link href="/app/dashboard" className="ml-auto font-mono text-[9px] text-orange">
          View ROI Dashboard →
        </Link>
      </div>
    </div>
  );
}
